import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from "@heroui/react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import enFlag from '@/images/en.png'
import trFlag from '@/images/tr.png'
import srFlag from '@/images/sr.png'
import darkLogo from '@/images/dark-logo.png'

const Navbar = () => {
  const t = useTranslations('frontend.navbar')
  const router = useRouter()
  const { locale } = router
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  // Dil değişikliği işlemi
  const handleLanguageChange = (newLocale) => {
    router.push(router.asPath, router.asPath, { 
      locale: newLocale,
      scroll: false 
    });
  }

  // Bayrak görüntüsünü seç
  const getFlag = (lang) => {
    switch(lang) {
      case 'en': return enFlag;
      case 'sr': return srFlag;
      default: return trFlag;
    }
  }

  // Alt menü açma/kapama işlevi
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  }

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  }, [router.asPath]);

  // Body scroll kilidi
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] w-full mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Hamburger Menu Button (sadece mobilde) */}
            <button 
              className="md:hidden text-[#230060] focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo (solda) */}
            <div className="flex justify-start items-center">
              <Link href="/" locale={locale}>
                <Image
                  src={darkLogo}
                  alt="Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-auto"
                />
              </Link>
            </div>

            {/* Desktop Menüler (ortada) */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
              {/* Balkan Turları */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-amber-800 font-medium flex items-center space-x-1">
                  <span>{t('balkanTours')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 origin-top-left transform scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out bg-white shadow-lg rounded-md p-2 z-50">
                  <Link
                    href="/balkan-tours/daily-tours"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('oneDayTours')}
                  </Link>
                  <Link
                    href="/balkan-tours/multi-day-tours"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('multiDayTours')}
                  </Link>
                </div>
              </div>
              
              {/* Sırbistan Turları */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-amber-800 font-medium flex items-center space-x-1">
                  <span>{t('serbiaTours')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 origin-top-left transform scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out bg-white shadow-lg rounded-md p-2 z-50">
                  <Link
                    href="/serbia-tours/daily-tours"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('oneDayTours')}
                  </Link>
                  <Link
                    href="/serbia-tours/multi-day-tours"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('multiDayTours')}
                  </Link>
                </div>
              </div>
              
              {/* Yat Turları */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-amber-800 font-medium flex items-center space-x-1">
                  <span>{t('yachtTours')}</span>
                  <Chip className="ml-1 bg-amber-100 text-amber-800 text-xs font-semibold py-0.5 px-1.5" size="sm">{t('new')}</Chip>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 origin-top-left transform scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out bg-white shadow-lg rounded-md p-2 z-50">
                  <Link
                    href="/yacht-tours/turkey"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('turkeyYachtTours')}
                  </Link>
                  <Link
                    href="/yacht-tours/croatia"
                    locale={locale}
                    className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-md"
                  >
                    {t('croatiaYachtTours')}
                  </Link>
                </div>
              </div>
              
              {/* SriLanka */}
              <Link
                href="/sri-lanka"
                locale={locale}
                className="text-gray-700 hover:text-amber-800 font-medium flex items-center"
              >
                <span>{t('sriLanka')}</span>
                <Chip className="ml-1 bg-amber-100 text-amber-800 text-xs font-semibold py-0.5 px-1.5" size="sm">{t('new')}</Chip>
              </Link>
              
              {/* Blog */}
              <Link
                href="/blog"
                locale={locale}
                className="text-gray-700 hover:text-amber-800 font-medium"
              >
                {t('blog')}
              </Link>
              
              {/* Contact */}
              <Link
                href="/contact"
                locale={locale}
                className="text-gray-700 hover:text-amber-800 font-medium"
              >
                {t('contact')}
              </Link>
            </div>

            {/* Dil Seçimi (sağda) */}
            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center space-x-1 focus:outline-none">
                  <Image
                    src={getFlag(locale)}
                    alt={locale === 'en' ? 'English' : locale === 'sr' ? 'Srpski' : 'Türkçe'}
                    width={24}
                    height={24}
                  />
                  <span className="text-gray-700 font-medium">{locale?.toUpperCase()}</span>
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Language selection" 
                onAction={handleLanguageChange}
                className="animate-fadeIn"
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
                <DropdownItem
                  key="sr"
                  startContent={
                    <Image
                      src={srFlag}
                      alt="Srpski"
                      width={24}
                      height={24}
                    />
                  }
                >
                  Srpski
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Mobil Soldan Açılan Menü */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Karartılmış overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Menü paneli - daha geniş */}
        <div className={`absolute top-0 left-0 h-full w-4/5 sm:w-3/4 bg-white shadow-xl overflow-y-auto transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            {/* Menü Başlık ve Kapatma */}
            <div className="flex justify-between items-center mb-8">
              <Image
                src={darkLogo}
                alt="Logo"
                width={100}
                height={32}
                className="h-auto"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobil Menü Öğeleri */}
            <nav className="space-y-6">
              {/* Balkan Turları */}
              <div>
                <button
                  onClick={() => toggleSubmenu('balkan')}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
                >
                  <span>{t('balkanTours')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'balkan' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 transform origin-top transition-all duration-300 ease-in-out ${activeSubmenu === 'balkan' ? 'scale-y-100 opacity-100 max-h-40' : 'scale-y-0 opacity-0 max-h-0'}`}>
                  <Link
                    href="/balkan-tours/one-day"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('oneDayTours')}
                  </Link>
                  <Link
                    href="/balkan-tours/multi-day"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('multiDayTours')}
                  </Link>
                </div>
              </div>

              {/* Sırbistan Turları */}
              <div>
                <button
                  onClick={() => toggleSubmenu('serbia')}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
                >
                  <span>{t('serbiaTours')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'serbia' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 transform origin-top transition-all duration-300 ease-in-out ${activeSubmenu === 'serbia' ? 'scale-y-100 opacity-100 max-h-40' : 'scale-y-0 opacity-0 max-h-0'}`}>
                  <Link
                    href="/serbia-tours/one-day"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('oneDayTours')}
                  </Link>
                  <Link
                    href="/serbia-tours/multi-day"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('multiDayTours')}
                  </Link>
                </div>
              </div>
              
              {/* Yat Turları */}
              <div>
                <button
                  onClick={() => toggleSubmenu('yacht')}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
                >
                  <div className="flex items-center">
                    <span>{t('yachtTours')}</span>
                    <Chip className="ml-1 bg-amber-100 text-amber-800 text-xs font-semibold py-0.5 px-1.5" size="sm">{t('new')}</Chip>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'yacht' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 transform origin-top transition-all duration-300 ease-in-out ${activeSubmenu === 'yacht' ? 'scale-y-100 opacity-100 max-h-40' : 'scale-y-0 opacity-0 max-h-0'}`}>
                  <Link
                    href="/yacht-tours/turkey"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('turkeyYachtTours')}
                  </Link>
                  <Link
                    href="/yacht-tours/croatia"
                    locale={locale}
                    className="block text-gray-600 hover:text-amber-800"
                  >
                    {t('croatiaYachtTours')}
                  </Link>
                </div>
              </div>

              {/* SriLanka */}
              <div className="flex items-center">
                <Link
                  href="/sri-lanka"
                  locale={locale}
                  className="block text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
                >
                  {t('sriLanka')}
                </Link>
                <Chip className="ml-1 bg-amber-100 text-amber-800 text-xs font-semibold py-0.5 px-1.5" size="sm">{t('new')}</Chip>
              </div>

              {/* Blog */}
              <Link
                href="/blog"
                locale={locale}
                className="block text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
              >
                {t('blog')}
              </Link>
              
              {/* Contact */}
              <Link
                href="/contact"
                locale={locale}
                className="block text-lg font-medium text-gray-800 hover:text-amber-800 transition-colors"
              >
                {t('contact')}
              </Link>
            </nav>

            {/* Mobil Dil Seçimi */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">{locale === 'en' ? 'Language' : locale === 'sr' ? 'Jezik' : 'Dil'}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLanguageChange('tr')}
                  className={`flex items-center space-x-2 ${locale === 'tr' ? 'font-medium' : 'text-gray-600'}`}
                >
                  <Image src={trFlag} alt="Türkçe" width={20} height={20} />
                  <span>TR</span>
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex items-center space-x-2 ${locale === 'en' ? 'font-medium' : 'text-gray-600'}`}
                >
                  <Image src={enFlag} alt="English" width={20} height={20} />
                  <span>EN</span>
                </button>
                <button
                  onClick={() => handleLanguageChange('sr')}
                  className={`flex items-center space-x-2 ${locale === 'sr' ? 'font-medium' : 'text-gray-600'}`}
                >
                  <Image src={srFlag} alt="Srpski" width={20} height={20} />
                  <span>SR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer div to prevent content from going under navbar */}
      <div className="h-20"></div>
    </>
  )
}

export default Navbar