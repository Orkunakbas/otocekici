import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import enFlag from '@/images/en.png'
import trFlag from '@/images/tr.png'
import darkLogo from '@/images/dark-logo.png'

const Navbar = () => {
  const t = useTranslations('frontend.navbar')
  const router = useRouter()
  const { locale } = router
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Dil değişikliği işlemi - basit versiyon
  const handleLanguageChange = (newLocale) => {
    router.push(router.asPath, router.asPath, { 
      locale: newLocale,
      scroll: false 
    });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 pt-2 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="light"
                isIconOnly
                className="text-[#230060]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {!isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </Button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Link href="/" locale={locale}>
                <Image
                  src={darkLogo}
                  alt="DPOX Logo"
                  width={90}
                  height={30}
                  priority
                  className="w-[90px] h-auto"
                />
              </Link>
            </div>

            {/* Mobile Language Dropdown */}
            <div className="flex md:hidden">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="light"
                    isIconOnly
                    className="min-w-unit-12 h-unit-8"
                    startContent={
                      <Image
                        src={locale === 'en' ? enFlag : trFlag}
                        alt={locale === 'en' ? 'English' : 'Türkçe'}
                        width={24}
                        height={24}
                      />
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Language selection" 
                  onAction={handleLanguageChange}
                >
                  <DropdownItem
                    key="en"
                    startContent={
                      <Image
                        src={enFlag}
                        alt="English"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    English
                  </DropdownItem>
                  <DropdownItem
                    key="tr"
                    startContent={
                      <Image
                        src={trFlag}
                        alt="Türkçe"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    Türkçe
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/community"
                locale={locale}
                className="text-gray-700 hover:text-[#716CF6] font-medium"
              >
                {t('community')}
              </Link>
              <Link 
                href="/pricing"
                locale={locale}
                className="text-gray-700 hover:text-[#716CF6] font-medium"
              >
                {t('pricing')}
              </Link>
              <Button
                as={Link}
                href="/contact"
                locale={locale}
                variant="bordered"
                className="border-[#230060] text-[#230060]"
              >
                {t('contactSales')}
              </Button>
              <Button
                as={Link}
                href="/try-for-free"
                locale={locale}
                color="primary"
                className="bg-[#716CF6]"
              >
                {t('tryForFree')}
              </Button>
              <Button
                as={Link}
                href="/login"
                locale={locale}
                color="primary"
                className="bg-[#230060]"
              >
                {t('login')}
              </Button>

              {/* Dil seçimi */}
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="light"
                    className="min-w-unit-24 h-unit-8 text-[#230060]"
                    startContent={
                      <Image
                        src={locale === 'en' ? enFlag : trFlag}
                        alt={locale === 'en' ? 'English' : 'Türkçe'}
                        width={24}
                        height={24}
                      />
                    }
                  >
                    {locale?.toUpperCase()}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Language selection" 
                  onAction={handleLanguageChange}
                >
                  <DropdownItem
                    key="en"
                    startContent={
                      <Image
                        src={enFlag}
                        alt="English"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    English
                  </DropdownItem>
                  <DropdownItem
                    key="tr"
                    startContent={
                      <Image
                        src={trFlag}
                        alt="Türkçe"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    Türkçe
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link 
                href="/community"
                locale={locale}
                className="block text-gray-700 hover:text-[#716CF6] px-4 py-2 font-medium"
              >
                {t('community')}
              </Link>
              <Link 
                href="/pricing"
                locale={locale}
                className="block text-gray-700 hover:text-[#716CF6] px-4 py-2 font-medium"
              >
                {t('pricing')}
              </Link>
              <Button
                as={Link}
                href="/contact"
                locale={locale}
                variant="bordered"
                fullWidth
                className="border-[#230060] text-[#230060]"
              >
                {t('contactSales')}
              </Button>
              <Button
                as={Link}
                href="/try"
                locale={locale}
                color="primary"
                fullWidth
                className="bg-[#716CF6]"
              >
                {t('tryForFree')}
              </Button>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer div to prevent content from going under navbar */}
      <div className="h-20"></div>
    </>
  )
}

export default Navbar