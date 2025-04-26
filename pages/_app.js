"use client";

import "@/styles/globals.css";
import {  HeroUIProvider } from "@heroui/react";
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import AppLayout from '@/components/layouts/AppLayout'
import { useRouter } from 'next/router'
import { SessionProvider, signOut } from "next-auth/react"
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserInfo } from '@/store/slices/userInfoSlice'
import { useSession } from "next-auth/react"

// AppContent'i düzeltelim
function AppContent({ Component, pageProps }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const { error: userInfoError } = useSelector((state) => state.userInfo)
  const redirectingRef = useRef(false)
  
  // Session değiştiğinde userInfo'yu yükle
  useEffect(() => {
    if (session?.accessToken) {
      console.log('AppContent: session değişti, userInfo yükleniyor', session.accessToken)
      console.log('Session içeriği:', JSON.stringify(session, null, 2))
      dispatch(fetchUserInfo(session.accessToken))
    } else {
      console.log('AppContent: session yok veya accessToken yok', session)
    }
  }, [dispatch, session])
  
  // Token geçersiz olduğunda login sayfasına yönlendir
  useEffect(() => {
    // Eğer zaten yönlendirme yapılıyorsa, tekrar yapma
    if (redirectingRef.current) return;
    
    // Eğer login sayfasındaysak, kontrol etmeye gerek yok
    if (router.pathname === '/login') return;
    
    if (userInfoError) {
      console.error('Token geçersiz veya kullanıcı bilgileri alınamadı:', userInfoError)
      
      // Eğer hata "Kullanıcı bulunamadı" veya "Token geçersiz" ise
      if (userInfoError.includes('Kullanıcı bulunamadı') || 
          userInfoError.includes('Token geçersiz') || 
          userInfoError.includes('Unauthorized') ||
          userInfoError.includes('Yetkisiz')) {
        
        console.log('Geçersiz token tespit edildi, oturum sonlandırılıyor...')
        
        // Yönlendirme yapılıyor olarak işaretle
        redirectingRef.current = true;
        
        // Oturumu sonlandır ve login sayfasına yönlendir
        signOut({ redirect: false }).then(() => {
          router.push('/login?error=invalid_token')
        })
      }
    }
  }, [userInfoError, router.pathname])

  // Public sayfalar için kontrol
  const publicPages = ['/login', '/', '/pricing', '/contact', '/legal', '/community', '/try-for-free']
  const isPublicPage = publicPages.some(page => router.pathname === page || router.pathname.startsWith(page) && page !== '/')

  // Korumalı sayfalar için kontrol
  const protectedPages = ['/denetim', '/sirket', '/envanter', '/aksiyonlar', '/dokumanlar', '/performans', '/tablolar' , 
    '/veri-isleme' , '/tedarikciler' , '/kamu-aktarimlari', '/diger-aktarimlar' , '/varlik-listesi' , '/organizasyon' 
    , '/dokuman-arsiv' , '/aksiyon-arsiv' ,]
  const isProtectedPage = protectedPages.some(page => router.pathname === page || router.pathname.startsWith(page))

  // Geçersiz sayfa kontrolü
  if (!isPublicPage && !isProtectedPage) {
    // Geçersiz sayfa, denetim sayfasına yönlendir
    router.push('/denetim')
    return null
  }

  // Public sayfalar için direkt component'i render et
  if (isPublicPage) {
    return <Component {...pageProps} />
  }

  // Diğer tüm sayfalar için AppLayout kullan
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  )
}

App.getInitialProps = async ({ ctx }) => {
  const { locale = 'tr' } = ctx;
  
  const messages = {
    frontend: {
      navbar: (await import(`../languages/${locale}/frontend/navbar.json`)).default,
      home: (await import(`../languages/${locale}/frontend/home.json`)).default,
      footer: (await import(`../languages/${locale}/frontend/footer.json`)).default,
      contact: (await import(`../languages/${locale}/frontend/contact.json`)).default,
      legal: (await import(`../languages/${locale}/frontend/legal.json`)).default,
      community: (await import(`../languages/${locale}/frontend/community.json`)).default,
      pricing: (await import(`../languages/${locale}/frontend/pricing.json`)).default,
      'try-for-free': (await import(`../languages/${locale}/frontend/try-for-free.json`)).default,
    },
    app: {
      login: (await import(`../languages/${locale}/app/login.json`)).default,
      navbar: (await import(`../languages/${locale}/app/navbar.json`)).default,
      breadcrumbs: (await import(`../languages/${locale}/app/breadcrumbs.json`)).default,
      denetim: (await import(`../languages/${locale}/app/denetim.json`)).default,
      sirket: (await import(`../languages/${locale}/app/sirket.json`)).default,
      envanter: (await import(`../languages/${locale}/app/envanter.json`)).default,
      performans: (await import(`../languages/${locale}/app/performans.json`)).default,
      dokumanlar: (await import(`../languages/${locale}/app/dokumanlar.json`)).default,
      aksiyonlar: (await import(`../languages/${locale}/app/aksiyonlar.json`)).default,
      organizasyon: (await import(`../languages/${locale}/app/organizasyon.json`)).default,
      veriIsleme: (await import(`../languages/${locale}/app/veriIsleme.json`)).default,
      veriIslemeKartlari: (await import(`../languages/${locale}/app/veriIslemeKartlari.json`)).default,
      dataFaaliyetAmaci: (await import(`../languages/${locale}/app/dataFaaliyetAmaci.json`)).default,
      dataVeriTemini: (await import(`../languages/${locale}/app/dataVeriTemini.json`)).default,
      kisiselVerilerSelect: (await import(`../languages/${locale}/app/kisiselVerilerSelect.json`)).default,
    }
  };

  return {
    pageProps: {
      messages,
      locale
    }
  };
};

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <HeroUIProvider>
          <NextIntlClientProvider messages={pageProps.messages} locale={router.locale || 'tr'}>
            <AppContent Component={Component} pageProps={pageProps} />
            <Toaster position="bottom-right" />
          </NextIntlClientProvider>
        </HeroUIProvider>
      </Provider>
    </SessionProvider>
  )
}