import React from 'react'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import OrganizasyonPage from '@/components/app/organizasyonPage/OrganizasyonPage'

const Organizasyon = () => {
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'
  
  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.organizasyon.title.${userRole}`)} 
        description={breadcrumbsT(`pages.organizasyon.description.${userRole}`)}
      />
      <OrganizasyonPage />
    </>
  )
}

export default Organizasyon