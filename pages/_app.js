"use client";

import "@/styles/globals.css";
import {  HeroUIProvider } from "@heroui/react";
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Navbar from '@/components/menu/Navbar'
import Topbar from "@/components/menu/Topbar";

// AppContent'i düzeltelim
function AppContent({ Component, pageProps }) {
  const router = useRouter()
  
  // Navbar ve component'i render et
  return (
    <>
      <Topbar/>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

App.getInitialProps = async ({ ctx }) => {
  const { locale = 'tr' } = ctx;
  
  const messages = {
    frontend: {
      navbar: (await import(`../languages/${locale}/navbar.json`)).default,
  
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
    <Provider store={store}>
      <HeroUIProvider>
        <NextIntlClientProvider messages={pageProps.messages} locale={router.locale || 'tr'}>
          <AppContent Component={Component} pageProps={pageProps} />
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </HeroUIProvider>
    </Provider>
  )
}