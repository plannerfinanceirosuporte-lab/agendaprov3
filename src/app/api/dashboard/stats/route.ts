import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { withAuth } from '@/lib/middleware/auth';
import { startOfMonth, endOfMonth, format } from 'date-fns';

async function GET(req: NextRequest) {
  try {
    const { user } = req as any;
    const estabelecimentoId = user.estabelecimentoId;
    
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    // Estatísticas de agendamentos
    const { data: agendamentosHoje } = await supabaseAdmin
      .from('agendamentos')
      .select('id, status')
      .eq('estabelecimento_id', estabelecimentoId)
      .gte('data_hora', format(hoje, 'yyyy-MM-dd'))
      .lt('data_hora', format(new Date(hoje.getTime() + 86400000), 'yyyy-MM-dd'));

    const { data: agendamentosMes } = await supabaseAdmin
      .from('agendamentos')
      .select('id, valor_total, status')
      .eq('estabelecimento_id', estabelecimentoId)
      .gte('data_hora', inicioMes.toISOString())
      .lte('data_hora', fimMes.toISOString());

    // Clientes totais
    const { data: clientes } = await supabaseAdmin
      .from('clientes')
      .select('id')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true);

    // Profissionais ativos
    const { data: profissionais } = await supabaseAdmin
      .from('profissionais')
      .select('id')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true);

    // Receita do mês
    const receitaMes = agendamentosMes
      ?.filter(a => a.status === 'concluido')
      ?.reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0;

    const stats = {
      agendamentosHoje: agendamentosHoje?.length || 0,
      agendamentosMes: agendamentosMes?.length || 0,
      clientesTotal: clientes?.length || 0,
      profissionaisAtivos: profissionais?.length || 0,
      receitaMes,
      agendamentosPendentes: agendamentosHoje?.filter(a => a.status === 'agendado').length || 0,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET };