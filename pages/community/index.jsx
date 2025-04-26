import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Navbar from '@/components/menu/Navbar'
import Footer from '@/components/frontend/Footer'
import { Button } from "@heroui/react"
import Link from 'next/link'
import { useRouter } from 'next/router'
import CallYouBack from '@/components/frontend/CallYouBack'

// Resimleri import ediyoruz
import community1 from '@/images/community/community-1.png'
import community2 from '@/images/community/community-2.png'
import community3 from '@/images/community/community-3.png'
import community4 from '@/images/community/community-4.png'
import community5 from '@/images/community/community-5.png'
import community6 from '@/images/community/community-6.png'
import community7 from '@/images/community/community-7.png'

const Community = () => {
  const t = useTranslations('frontend.community')
  const router = useRouter()
  const { locale } = router

  const members = [
    {
      image: community1,
      name: 'Beren Dabaşoğlu',
      title: 'CIPP/E',
      country: 'countries.turkiye'
    },
    {
      image: community2,
      name: 'Ali Gül',
      title: 'SAYE LAW',
      country: 'countries.turkiye'
    },
    {
      image: community3,
      name: 'Muge Yirci Spooner',
      title: 'CIPP/E',
      country: 'countries.germany'
    },
    {
      image: community4,
      name: 'Olsan Sözen',
      title: 'CIPP/E',
      country: 'countries.uk'
    },
    {
      image: community5,
      name: 'Deniz Çelikkaya',
      title: 'Atka Legal',
      country: 'countries.uk'
    },
    {
      image: community6,
      name: 'İlkin Reçber',
      title: 'SAYE LAW',
      country: 'countries.turkiye'
    },
    {
      image: community7,
      name: 'Cemre Aydemir',
      title: 'Ozkaya Law',
      country: 'countries.turkiye'
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="max-w-7xl mb-12">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden bg-[#F4F3FF] mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#230060]">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
                <p className="text-gray-500">{t(member.country)}</p>
              </div>
            ))}
          </div>

          {/* Collaborate Section */}
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-[#230060] mb-2">
              {t('collaborate.title')}
            </h2>
            <p className="text-xl text-[#230060] mb-8">
              {t('collaborate.subtitle')}
            </p>
            <Button
              as={Link}
              href="/contact"
              locale={locale}
              variant="shadow"
              color="primary"
              className="bg-[#716CF6] mx-auto"
              endContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              }
            >
              {t('collaborate.button')}
            </Button>
          </div>
        </div>
      </div>
      <CallYouBack/>
      <Footer />
    </>
  )
}

export default Community