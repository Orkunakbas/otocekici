import React from 'react'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'

const Tablolar = () => {
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'
  
  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.tablolar.title.${userRole}`)} 
        description={breadcrumbsT(`pages.tablolar.description.${userRole}`)}
      />
    </>
  )
}

export default Tablolar