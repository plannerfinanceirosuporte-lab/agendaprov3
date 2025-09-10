import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { clienteSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';

async function GET(req: NextRequest) {
  try {
    const { user } = req as any;
    const url = new URL(req.url);
    const estabelecimentoId = url.searchParams.get('estabelecimento_id') || user.estabelecimentoId;

    const { data: clientes, error } = await supabaseAdmin
      .from('clientes')
      .select(`
        *,
        fidelidade (
          pontos_totais,
          pontos_disponiveis,
          nivel
        )
      `)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ clientes });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const { user } = req as any;
    const body = await req.json();
    
    const validatedData = clienteSchema.parse({
      ...body,
      estabelecimento_id: body.estabelecimento_id || user.estabelecimentoId,
    });

    // Criar cliente
    const { data: cliente, error } = await supabaseAdmin
      .from('clientes')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Criar registro de fidelidade
    await supabaseAdmin
      .from('fidelidade')
      .insert([{ cliente_id: cliente.id }]);

    return NextResponse.json({ 
      message: 'Cliente criado com sucesso',
      cliente 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET, withAuth(POST) as POST };