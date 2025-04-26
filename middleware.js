import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Korumalı rotalar
const protectedRoutes = [
  '/denetim', 
  '/sirket', 
  '/envanter', 
  '/aksiyonlar', 
  '/dokumanlar', 
  '/performans', 
  '/tablolar',
  '/veri-isleme', 
  '/tedarikciler', 
  '/kamu-aktarimlari', 
  '/diger-aktarimlar', 
  '/varlik-listesi', 
  '/organizasyon',
  '/dokuman-arsiv',
  '/aksiyon-arsiv',
  '/veri-isleme',
]

// Public rotalar
const publicRoutes = [
  '/login', 
  '/', 
  '/pricing', 
  '/contact', 
  '/legal', 
  '/community', 
  '/try-for-free'
]

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Public rotaları kontrol et
  if (publicRoutes.some(route => pathname === route || (pathname.startsWith(route) && route !== '/'))) {
    return NextResponse.next()
  }
  
  // Korumalı rotaları kontrol et
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    // Token'ı kontrol et
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    
    // Token yoksa login sayfasına yönlendir
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('error', 'invalid_token')
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
    
    // Token varsa devam et
    return NextResponse.next()
  }
  
  // Geçersiz rotaları denetim sayfasına yönlendir
  const url = new URL('/denetim', request.url)
  return NextResponse.redirect(url)
}

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 