import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

const CallYouBack = () => {
  const t = useTranslations('frontend.home')
  const router = useRouter()

  const contactPath = router.locale === 'tr' ? '/contact' : '/contact'

  return (
    <div className="bg-[#817fec] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <div className="w-96 h-96 rounded-full bg-white transform translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="absolute left-0 bottom-0 w-1/2 h-full">
              <div className="w-72 h-72 rounded-full bg-white transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {t('callYouBackTitle')}<br />
              <span className="text-white/90">{t('callYouBackSubtitle')}</span>
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/80">
              {t('callYouBackDescription')}
            </p>
            <Link href={contactPath}>
              <button className="bg-white text-[#817fec] px-10 py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t('callYouBackButton')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallYouBack