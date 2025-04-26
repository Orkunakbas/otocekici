import React from 'react'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import VeriIslemePage from '@/components/app/veriIslemeKartları/VeriIslemePage'

const VeriIsleme = () => {
  const breadcrumbsT = useTranslations('app.breadcrumbs')
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü belirle
  const userRole = userInfo?.role || session?.user?.role || 'danışman'
  
  return (
    <>
      <Breadcrumbs 
        title={breadcrumbsT(`pages.veri-isleme.title.${userRole}`)} 
        description={breadcrumbsT(`pages.veri-isleme.description.${userRole}`)}
      />
      <VeriIslemePage />
    </>
  )
}

export default VeriIsleme