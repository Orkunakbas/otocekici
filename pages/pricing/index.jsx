import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Navbar from '@/components/menu/Navbar'
import Footer from '@/components/frontend/Footer'
import { Button } from "@heroui/react"
import Link from 'next/link'
import { useRouter } from 'next/router'
import CallYouBack from '@/components/frontend/CallYouBack'

// İkonları import ediyoruz
import pricing1 from '@/images/pricing/pricing-1.png'
import pricing2 from '@/images/pricing/pricing-2.png'
import pricing3 from '@/images/pricing/pricing-3.png'
import pricing4 from '@/images/pricing/pricing-4.png'
import pricing5 from '@/images/pricing/pricing-5.png'
import pricing6 from '@/images/pricing/pricing-6.png'
import pricing7 from '@/images/pricing/pricing-7.png'

const Pricing = () => {
  const t = useTranslations('frontend.pricing')
  const router = useRouter()
  const { locale } = router

  const features = [
    {
      icon: pricing1,
      title: 'Integration Support'
    },
    {
      icon: pricing2,
      title: 'Document Drafting'
    },
    {
      icon: pricing3,
      title: 'Records of Processing'
    },
    {
      icon: pricing4,
      title: 'Real Time Monitoring'
    },
    {
      icon: pricing5,
      title: 'Assessment Tools'
    },
    {
      icon: pricing6,
      title: 'Technical Support'
    },
    {
      icon: pricing7,
      title: 'Vendor Screening'
    }
  ]

  const plans = [
    {
      type: 'monthly',
      price: 'US$30',
      period: '/user/month',
      billingPeriod: 'Annual, paid monthly',
      taxInfo: 'Tax excluded',
      billingInfo: 'Billed monthly'
    },
    {
      type: 'yearly',
      price: 'US$300',
      period: '/user/year',
      billingPeriod: 'Annual, prepaid',
      taxInfo: 'Tax excluded',
      billingInfo: 'Billed annually'
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-[#22015E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-[1.5fr,1fr] gap-12">
            {/* Sol Taraf - Genişletilmiş */}
            <div>
              {/* Header Section - Başlık boyutları düzeltildi */}
              <div className="mb-12">
                <h1 className="text-5xl font-bold mb-2">
                  {t('title')}
                </h1>
                <h2 className="text-4xl font-normal mb-6">
                  {t('subtitle')}
                </h2>
                <p className="text-gray-200 text-lg max-w-2xl">
                  {t('description')}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 relative bg-[#2D1168] rounded-xl p-2.5">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="text-sm font-medium">{t(`features.${feature.title}`)}</span>
                  </div>
                ))}
              </div>

              {/* Integration Note */}
              <p className="text-gray-200 mt-12 text-sm leading-relaxed max-w-2xl">
                {t('integrationNote')}
              </p>
            </div>

            {/* Sağ Taraf - Daraltılmış */}
            <div className="space-y-4 max-w-sm">
              {plans.map((plan, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-[#22015E]">
                  <p className="text-sm text-gray-600 mb-1">
                    {t(`plans.${plan.type}.billingPeriod`)}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t(`plans.${plan.type}.taxInfo`)}</p>
                  <p className="text-sm text-gray-500 mb-4">{t(`plans.${plan.type}.billingInfo`)}</p>
                  <Button
                    as={Link}
                    href="/try-for-free"
                    locale={locale}
                    variant="shadow"
                    className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                    endContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    }
                  >
                    {t('tryForFree')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CallYouBack />
      <Footer />
    </>
  )
}

export default Pricing