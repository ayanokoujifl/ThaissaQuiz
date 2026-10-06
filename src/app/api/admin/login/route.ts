import { NextResponse } from 'next/server';
import { validateAdminPassword, getExpectedToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Senha incorreta. Acesso não autorizado.' },
        { status: 401 }
      );
    }

    const token = getExpectedToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao autenticar.' },
      { status: 500 }
    );
  }
}
