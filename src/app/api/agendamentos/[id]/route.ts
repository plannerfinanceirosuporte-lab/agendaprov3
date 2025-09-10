import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { updateAgendamentoSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';

async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = req as any;
    const body = await req.json();
    const { id } = params;
    
    const validatedData = updateAgendamentoSchema.parse(body);

    // Verificar se o agendamento existe e pertence ao estabelecimento
    const { data: agendamentoExistente } = await supabaseAdmin
      .from('agendamentos')
      .select('id, estabelecimento_id, status')
      .eq('id', id)
      .eq('estabelecimento_id', user.estabelecimentoId)
      .single();

    if (!agendamentoExistente) {
      return NextResponse.json({ 
        error: 'Agendamento não encontrado' 
      }, { status: 404 });
    }

    const { data: agendamento, error } = await supabaseAdmin
      .from('agendamentos')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        clientes (
          id,
          nome,
          telefone,
          email
        ),
        profissionais (
          id,
          nome
        ),
        servicos (
          id,
          nome,
          preco,
          duracao_minutos
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Se o agendamento foi concluído, adicionar pontos de fidelidade
    if (validatedData.status === 'concluido' && agendamentoExistente.status !== 'concluido') {
      const pontosGanhos = Math.floor(Number(agendamento.valor_total) / 10); // 1 ponto a cada R$ 10
      
      await supabaseAdmin
        .from('fidelidade')
        .update({
          pontos_totais: supabaseAdmin.raw('pontos_totais + ?', [pontosGanhos]),
          pontos_disponiveis: supabaseAdmin.raw('pontos_disponiveis + ?', [pontosGanhos]),
        })
        .eq('cliente_id', agendamento.cliente_id);
    }

    return NextResponse.json({ 
      message: 'Agendamento atualizado com sucesso',
      agendamento 
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = req as any;
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('agendamentos')
      .update({ status: 'cancelado' })
      .eq('id', id)
      .eq('estabelecimento_id', user.estabelecimentoId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Agendamento cancelado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { 
  withAuth(PUT) as PUT, 
  withAuth(DELETE, ['admin', 'gerente']) as DELETE 
};