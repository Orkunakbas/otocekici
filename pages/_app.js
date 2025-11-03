import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/menu/Navbar'
import MobileFixedButtons from '@/components/MobileFixedButtons'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17684011350"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'AW-17684011350');
          `}
        </Script>
        <Navbar />
        <Component {...pageProps} />
        <MobileFixedButtons />
        <Toaster position="bottom-right" />
      </HeroUIProvider>
    </Provider>
  )
}