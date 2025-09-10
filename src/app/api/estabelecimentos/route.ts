import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { estabelecimentoSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';

async function GET(req: NextRequest) {
  try {
    const { data: estabelecimentos, error } = await supabaseAdmin
      .from('estabelecimentos')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ estabelecimentos });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = estabelecimentoSchema.parse(body);

    const { data: estabelecimento, error } = await supabaseAdmin
      .from('estabelecimentos')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Estabelecimento criado com sucesso',
      estabelecimento 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar estabelecimento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET, withAuth(POST, ['admin']) as POST };