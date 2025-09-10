import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { agendamentoSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

async function GET(req: NextRequest) {
  try {
    const { user } = req as any;
    const url = new URL(req.url);
    const estabelecimentoId = url.searchParams.get('estabelecimento_id') || user.estabelecimentoId;
    const dataInicio = url.searchParams.get('data_inicio');
    const dataFim = url.searchParams.get('data_fim');
    const status = url.searchParams.get('status');

    let query = supabaseAdmin
      .from('agendamentos')
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
      .eq('estabelecimento_id', estabelecimentoId)
      .order('data_hora', { ascending: true });

    if (dataInicio) {
      query = query.gte('data_hora', dataInicio);
    }

    if (dataFim) {
      query = query.lte('data_hora', dataFim);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: agendamentos, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agendamentos });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const { user } = req as any;
    const body = await req.json();
    
    const validatedData = agendamentoSchema.parse({
      ...body,
      estabelecimento_id: body.estabelecimento_id || user.estabelecimentoId,
    });

    // Verificar conflitos de horário
    const dataHora = parseISO(validatedData.data_hora);
    const { data: conflitos } = await supabaseAdmin
      .from('agendamentos')
      .select('id')
      .eq('profissional_id', validatedData.profissional_id)
      .eq('data_hora', validatedData.data_hora)
      .neq('status', 'cancelado');

    if (conflitos && conflitos.length > 0) {
      return NextResponse.json({ 
        error: 'Horário já ocupado para este profissional' 
      }, { status: 400 });
    }

    const { data: agendamento, error } = await supabaseAdmin
      .from('agendamentos')
      .insert([validatedData])
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

    return NextResponse.json({ 
      message: 'Agendamento criado com sucesso',
      agendamento 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET, withAuth(POST) as POST };