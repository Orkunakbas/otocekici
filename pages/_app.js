"use client";

import "@/styles/globals.css";
import {  HeroUIProvider } from "@heroui/react";
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react'

// AppContent'i düzeltelim
function AppContent({ Component, pageProps }) {
  const router = useRouter()
  
  // Direkt component'i render et
  return <Component {...pageProps} />
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