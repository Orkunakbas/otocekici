import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail, setShowOTPModal } from '@/store/slices/authSlice'
import { signIn } from 'next-auth/react'
import darkLogo from '@/images/dark-logo.png'
import trFlag from '@/images/tr.png'
import enFlag from '@/images/en.png'
import toast from 'react-hot-toast'

const Login = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const t = useTranslations('app.login')
  const { loading, isEmailVerified, showOTPModal } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(verifyEmail(email))
  }

  const handleLogin = async () => {
    try {
      // Önce doğrudan API'ye istek at
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log("Direct API response:", data) // Debug için

      if (!response.ok) {
        toast.error(data.error || 'Giriş başarısız')
        return
      }

      // API yanıtı başarılıysa NextAuth ile giriş yap
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      console.log("NextAuth signIn result:", result) // Debug için

      if (result.error) {
        toast.error('NextAuth giriş hatası: ' + result.error)
        return
      }

      if (result.ok) {
        window.location.href = '/denetim'
      }
    } catch (error) {
      console.error("Login error:", error) // Debug için
      toast.error('Giriş yapılırken bir hata oluştu')
    }
  }

  const handleGetPassword = async () => {
    await dispatch(getOTP(email))
  }

  const handleCloseModal = () => {
    dispatch(setShowOTPModal(false))
  }

  const handleLanguageChange = (locale) => {
    router.push(router.pathname, router.asPath, { locale })
  }

  // Login sayfasında URL parametrelerini kontrol et
  useEffect(() => {
    // URL'den error parametresini al
    const errorParam = new URLSearchParams(window.location.search).get('error');
    
    // Token geçersiz hatası varsa göster
    if (errorParam === 'invalid_token') {
      toast.error('Oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.', {
        duration: 5000,
        position: 'bottom-right'
      });
      
      // URL'den error parametresini temizle
      router.replace('/login', undefined, { shallow: true });
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09063f] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#09063f]/50"></div>

      <div className="absolute top-6 right-6 z-50">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <Image
                src={router.locale === 'tr' ? trFlag : enFlag}
                alt="Language"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-sm">
                {router.locale === 'tr' ? 'TR' : 'EN'}
              </span>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label={t('language.title')}>
            <DropdownItem key="tr" onClick={() => handleLanguageChange('tr')}>
              <div className="flex items-center space-x-2">
                <Image src={trFlag} alt="Turkish" width={20} height={20} />
                <span>Türkçe</span>
              </div>
            </DropdownItem>
            <DropdownItem key="en" onClick={() => handleLanguageChange('en')}>
              <div className="flex items-center space-x-2">
                <Image src={enFlag} alt="English" width={20} height={20} />
                <span>English</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-10">
                <Image
                  src={darkLogo}
                  alt="DpoX Logo"
                  width={120}
                  height={40}
                  className="mx-auto h-10 w-auto"
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('title')}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {t('description')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('form.email')}
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('form.emailPlaceholder')}
                    variant="flat"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#09063f] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('form.loading')}
                    </div>
                  ) : (
                    t('form.continue')
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  {t.rich('privacyNotice', {
                    link: (chunks) => (
                      <Link href="/legal" className="text-[#09063f] hover:text-[#3B0286]">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showOTPModal} 
        onClose={handleCloseModal}
        backdrop="opaque"
        placement="center"
        className="bg-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t('otpModal.title')}
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600">
                  {t('otpModal.description')}
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('otpModal.passwordLabel')}
                  </label>
                  <Input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="flat"
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="flex gap-3">
                <Button
                  onClick={handleGetPassword}
                  className="flex-1 bg-[#1F0057] hover:bg-[#1F0057]/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('form.loading')}
                    </div>
                  ) : (
                    t('otpModal.getPassword')
                  )}
                </Button>
                <Button
                  onClick={handleLogin}
                  className="flex-1 bg-[#185551] hover:bg-[#185551]/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('form.loading')}
                    </div>
                  ) : (
                    t('otpModal.login')
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Login

export async function getStaticProps({ locale }) {
  return {
    props: {
      locale
    }
  }
}

// Tailwind CSS animations - styles/globals.css'e eklenecek
/*
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.animate-float {
  animation: float 15s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 20s ease-in-out infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
*/ 