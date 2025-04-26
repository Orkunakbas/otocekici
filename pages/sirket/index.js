import React from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'

export default function Sirket() {
  const router = useRouter()
  const t = useTranslations('app.sirket')
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'

  // Yönlendirme fonksiyonları
  const navigateToOrganization = () => {
    router.push('organizasyon')
  }

  const navigateToAssetList = () => {
    router.push('/varlik-listesi')
  }

  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.sirket.title.${userRole}`)} 
        description={breadcrumbsT(`pages.sirket.description.${userRole}`)}
      />
      
      <div className="w-full py-6">
        <div className="px-4 ">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Organizasyon Yapısı Kartı */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#3a2659] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToOrganization}
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
                  <div className="text-3xl ">
                    {t('cards.organization.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.organization.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.organization.description')}
                </p>
              </div>
            </div>
            
            {/* Varlık Listesi Kartı */}
            <div 
              className="relative overflow-hidden rounded-lg bg-[#4f387d] shadow-sm cursor-pointer h-[420px] md:col-span-1"
              onClick={navigateToAssetList}
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
                    {t('cards.assetList.number')}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {t('cards.assetList.title')}
                </h3>
                <p className="text-white/80 text-base mt-2">
                  {t('cards.assetList.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 