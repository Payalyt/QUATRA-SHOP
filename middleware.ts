import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Skip static assets, API calls, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // for favicon.ico, images, robots.txt, etc.
  ) {
    return NextResponse.next();
  }

  // Extract hostname without port (e.g. "admin.example.com", "seller.localhost")
  const hostname = host.split(':')[0].toLowerCase();

  // 1. Admin Subdomain: admin.yourdomain.com -> rewrites to /admin
  if (hostname.startsWith('admin.') || hostname === 'admin') {
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2. Seller Subdomain: seller.yourdomain.com -> rewrites to /seller
  if (hostname.startsWith('seller.') || hostname === 'seller') {
    if (!pathname.startsWith('/seller')) {
      url.pathname = `/seller${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 3. Affiliate Subdomain: affiliate.yourdomain.com -> rewrites to /affiliate
  if (hostname.startsWith('affiliate.') || hostname === 'affiliate') {
    if (!pathname.startsWith('/affiliate')) {
      url.pathname = `/affiliate${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
