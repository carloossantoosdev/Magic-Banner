import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;

  if (accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (user && !error) {
      return res;
    }

    if (refreshToken) {
      const { data, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (data.session && !refreshError) {
        res.cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        res.cookies.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        return res;
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};

