import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '../auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>,
  requiredRole?: string[]
) {
  return async (req: AuthenticatedRequest, ...args: any[]) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
      }

      const token = authHeader.substring(7);
      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }

      if (requiredRole && !requiredRole.includes(user.role)) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }

      req.user = user;
      return handler(req, ...args);
    } catch (error) {
      console.error('Erro de autenticação:', error);
      return NextResponse.json({ error: 'Erro de autenticação' }, { status: 401 });
    }
  };
}