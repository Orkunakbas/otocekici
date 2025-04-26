import React from 'react'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import AksiyonlarPage from '@/components/app/aksiyonlarPage/AksiyonlarPage'

const Aksiyonlar = () => {
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'
  
  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.aksiyonlar.title.${userRole}`)} 
        description={breadcrumbsT(`pages.aksiyonlar.description.${userRole}`)}
      />
      <AksiyonlarPage />
    </>
  )
}

export default Aksiyonlar