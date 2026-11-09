import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSettings } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const settings = await getSettings();

    const expectedUser = settings.adminUser || 'admin';
    const expectedPass = settings.adminPass || 'shankar2026!';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return NextResponse.json({ authenticated: session?.value === 'authenticated' });
}
