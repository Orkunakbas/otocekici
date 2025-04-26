import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'

export default function useRoleAccess() {
  const { data: session } = useSession()
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolü - önce userInfo'dan, yoksa session'dan al
  const userRole = userInfo?.role || session?.user?.role
  
  // Rol bazlı erişim kontrolü
  const roleBasedAccess = {
    'danışman': ['/denetim', '/sirket', '/envanter', '/aksiyonlar', '/dokumanlar', '/performans', '/tablolar'],
    'yönetici': ['/denetim', '/envanter', '/aksiyonlar', '/dokumanlar', '/performans', '/tablolar'],
    'temsilci': ['/denetim', '/envanter', '/aksiyonlar', '/dokumanlar']
  }
  
  // Kullanıcının rolüne göre erişim izinleri
  const allowedPaths = roleBasedAccess[userRole] || []
  
  // Belirli bir yola erişim izni olup olmadığını kontrol eden fonksiyon
  const hasAccess = (path) => {
    return allowedPaths.some(allowedPath => path.startsWith(allowedPath))
  }
  
  return {
    userRole,
    allowedPaths,
    hasAccess
  }
} 