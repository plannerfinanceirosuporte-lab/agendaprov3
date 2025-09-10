import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { usuarioSchema } from '@/lib/validations/schemas';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = usuarioSchema.parse(body);
    
    // Verificar se email já existe
    const { data: usuarioExistente } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', validatedData.email)
      .single();

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha
    const passwordHash = await hashPassword(validatedData.password);

    // Criar usuário
    const { data: novoUsuario, error } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          ...validatedData,
          password_hash: passwordHash,
        }
      ])
      .select(`
        *,
        estabelecimentos (
          id,
          nome,
          tipo_servico
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      );
    }

    // Gerar token JWT
    const token = generateToken({
      userId: novoUsuario.id,
      estabelecimentoId: novoUsuario.estabelecimento_id,
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      role: novoUsuario.role,
    });

    // Atualizar metadata do usuário no Supabase Auth
    await supabaseAdmin.auth.admin.updateUserById(novoUsuario.id, {
      user_metadata: {
        nome: novoUsuario.nome,
        role: novoUsuario.role,
        estabelecimento_id: novoUsuario.estabelecimento_id
      }
    });

    // Retornar dados do usuário (sem senha)
    const { password_hash, ...usuarioSemSenha } = novoUsuario;

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: usuarioSemSenha,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}