import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validations/schemas';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = loginSchema.parse(body);
    
    // Buscar usuário no banco
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select(`
        *,
        estabelecimentos (
          id,
          nome,
          tipo_servico
        )
      `)
      .eq('email', validatedData.email)
      .eq('ativo', true)
      .single();

    if (error || !usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha
    const senhaValida = await verifyPassword(validatedData.password, usuario.password_hash);
    
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = generateToken({
      userId: usuario.id,
      estabelecimentoId: usuario.estabelecimento_id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    });

    // Atualizar metadata do usuário no Supabase Auth
    await supabaseAdmin.auth.admin.updateUserById(usuario.id, {
      user_metadata: {
        nome: usuario.nome,
        role: usuario.role,
        estabelecimento_id: usuario.estabelecimento_id
      }
    });

    // Retornar dados do usuário (sem senha)
    const { password_hash, ...usuarioSemSenha } = usuario;

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: usuarioSemSenha,
      token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}