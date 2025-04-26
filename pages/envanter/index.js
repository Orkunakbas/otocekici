import React from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'

export default function Envanter() {
  const router = useRouter()
  const t = useTranslations('app.envanter')
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'

  // Yönlendirme fonksiyonları
  const navigateToPersonalData = () => {
    router.push('/veri-isleme')
  }

  const navigateToSuppliers = () => {
    router.push('/tedarikciler')
  }

  const navigateToPublicTransfers = () => {
    router.push('/kamu-aktarimlari')
  }

  const navigateToOtherTransfers = () => {
    router.push('/diger-aktarimlar')
  }

  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.envanter.title.${userRole}`)} 
        description={breadcrumbsT(`pages.envanter.description.${userRole}`)}
      />
      
      <div className="w-full py-6">
        <div className="px-4 ">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 01 - Kişisel Veri İşleme Kartları */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#3a2659] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToPersonalData}
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-10 h-full flex flex-col justify-center text-white">
                <div className="mb-2">
                  <div className="text-3xl">
                    {t('cards.personalData.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.personalData.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.personalData.description')}
                </p>
              </div>
            </div>
            
            {/* 02 - Tedarikçi Kartları */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#4f387d] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToSuppliers}
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-10 h-full flex flex-col justify-center text-white">
                <div className="mb-2">
                  <div className="text-3xl">
                    {t('cards.suppliers.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.suppliers.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.suppliers.description')}
                </p>
              </div>
            </div>

            {/* 03 - Kamu Aktarımları */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#5c27b2] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToPublicTransfers}
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-10 h-full flex flex-col justify-center text-white">
                <div className="mb-2">
                  <div className="text-3xl">
                    {t('cards.publicTransfers.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.publicTransfers.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.publicTransfers.description')}
                </p>
              </div>
            </div>

            {/* 04 - Diğer Aktarımlar */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#827ff4] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToOtherTransfers}
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-10 h-full flex flex-col justify-center text-white">
                <div className="mb-2">
                  <div className="text-3xl">
                    {t('cards.otherTransfers.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.otherTransfers.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.otherTransfers.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 