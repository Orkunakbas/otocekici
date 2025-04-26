import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Footer = () => {
    const t = useTranslations('frontend.footer')

  return (
    <footer className="bg-[#230060] text-white py-8">
      <div className="container max-w-7xl mx-auto ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright and Address */}
          <div className="text-center md:text-left">
            <p className="mb-2">{t('copyright')}</p>
            <p className="mb-2">{t('address')}</p>
            <p>{t('email')}</p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-gray-300 transition-colors">
              {t('terms')}
            </Link>
            <Link href="/legal" className="hover:text-gray-300 transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer