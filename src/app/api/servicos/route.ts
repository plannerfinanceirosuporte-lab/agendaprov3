import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { servicoSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';

async function GET(req: NextRequest) {
  try {
    const { user } = req as any;
    const url = new URL(req.url);
    const estabelecimentoId = url.searchParams.get('estabelecimento_id') || user.estabelecimentoId;

    const { data: servicos, error } = await supabaseAdmin
      .from('servicos')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ servicos });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const { user } = req as any;
    const body = await req.json();
    
    const validatedData = servicoSchema.parse({
      ...body,
      estabelecimento_id: body.estabelecimento_id || user.estabelecimentoId,
    });

    const { data: servico, error } = await supabaseAdmin
      .from('servicos')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Serviço criado com sucesso',
      servico 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET, withAuth(POST, ['admin', 'gerente']) as POST };