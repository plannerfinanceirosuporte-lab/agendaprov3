import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { profissionalSchema } from '@/lib/validations/schemas';
import { withAuth } from '@/lib/middleware/auth';

async function GET(req: NextRequest) {
  try {
    const { user } = req as any;
    const url = new URL(req.url);
    const estabelecimentoId = url.searchParams.get('estabelecimento_id') || user.estabelecimentoId;

    const { data: profissionais, error } = await supabaseAdmin
      .from('profissionais')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profissionais });
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const { user } = req as any;
    const body = await req.json();
    
    const validatedData = profissionalSchema.parse({
      ...body,
      estabelecimento_id: body.estabelecimento_id || user.estabelecimentoId,
    });

    const { data: profissional, error } = await supabaseAdmin
      .from('profissionais')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Profissional criado com sucesso',
      profissional 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export { withAuth(GET) as GET, withAuth(POST, ['admin', 'gerente']) as POST };