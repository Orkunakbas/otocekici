import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/menu/Navbar'
import MobileFixedButtons from '@/components/MobileFixedButtons'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <Navbar />
        <Component {...pageProps} />
        <MobileFixedButtons />
        <Toaster position="bottom-right" />
      </HeroUIProvider>
    </Provider>
  )
}