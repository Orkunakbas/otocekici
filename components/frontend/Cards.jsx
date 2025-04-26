import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

// Import images
import mainImage1 from '@/images/cards/card-1.png'
import mainImage2 from '@/images/cards/card-2.png'
import mainImage3 from '@/images/cards/card-3.png'
import mainImage4 from '@/images/cards/card-4.png'
import icon1 from '@/images/cards/1.png'
import icon2 from '@/images/cards/2.png'
import icon3 from '@/images/cards/3.png'
import icon4 from '@/images/cards/4.png'

const Cards = () => {
  const t = useTranslations('frontend.home')

  return (
    <div className="bg-white py-16 mt-60">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Card 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          <div className="w-full lg:w-1/2">
            <Image
              src={mainImage1}
              alt="Integration Process"
              className="w-full max-w-xl mx-auto"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-4 mb-6">
              <Image
                src={icon1}
                alt="Integration Icon"
                width={55}
                height={55}
              />
              <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#230060]">
                {t('card1.title')}
              </h2>
            </div>
            <p className="text-gray-600 text-md whitespace-pre-line">
              {t('card1.description')}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 mb-16">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-4 mb-6">
              <Image
                src={icon2}
                alt="Inventory Icon"
                width={55}
                height={55}
              />
              <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#230060]">
                {t('card2.title')}
              </h2>
            </div>
            <p className="text-gray-600 text-md whitespace-pre-line">
              {t('card2.description')}
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <Image
              src={mainImage2}
              alt="Inventory Management"
              className="w-full max-w-xl mx-auto"
              priority
            />
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          <div className="w-full lg:w-1/2">
            <Image
              src={mainImage3}
              alt="Advanced Analysis Tools"
              className="w-full max-w-xl mx-auto"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-4 mb-6">
              <Image
                src={icon3}
                alt="Analysis Icon"
                width={55}
                height={55}
              />
              <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#230060]">
                {t('card3.title')}
              </h2>
            </div>
            <p className="text-gray-600 text-md whitespace-pre-line">
              {t('card3.description')}
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-4 mb-6">
              <Image
                src={icon4}
                alt="Monitoring Icon"
                width={55}
                height={55}
              />
              <h2 className="text-2xl md:text-3xl lg:text-2xl font-bold text-[#230060]">
                {t('card4.title')}
              </h2>
            </div>
            <p className="text-gray-600 text-md whitespace-pre-line">
              {t('card4.description')}
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <Image
              src={mainImage4}
              alt="Real-Time Monitoring"
              className="w-full max-w-xl mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards