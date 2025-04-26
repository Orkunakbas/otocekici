import React, { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import darkLogo from '@/images/dark-logo.png'
import trFlag from '@/images/tr.png'
import enFlag from '@/images/en.png'
import Image from 'next/image'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Select, SelectItem } from "@heroui/react"
import { fetchUserInfo, clearUserInfo } from '@/store/slices/userInfoSlice'
import { updateActiveCompany } from '@/store/slices/companyUpdateSlice'

// Dropdown animasyonu için CSS
const dropdownAnimationStyle = {
  enter: {
    opacity: 0,
    transform: 'translateY(-10px)',
    transition: 'opacity 200ms ease, transform 200ms ease',
  },
  enterActive: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  exit: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'opacity 200ms ease, transform 200ms ease',
  },
  exitActive: {
    opacity: 0,
    transform: 'translateY(-10px)',
  },
};

const Navbar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const { data: userInfo, loading } = useSelector((state) => state.userInfo)
  const t = useTranslations('app.navbar')
  const [showEnvanterDropdown, setShowEnvanterDropdown] = useState(false)
  const [showSirketDropdown, setShowSirketDropdown] = useState(false)
  const dropdownTimeoutRef = useRef(null)
  const sirketDropdownTimeoutRef = useRef(null)
  const dropdownRef = useRef(null)
  const sirketDropdownRef = useRef(null)

  // Envanter alt menü öğeleri
  const envanterSubMenuItems = [
    { href: '/veri-isleme', label: t('dropdown.inventory.items.dataProcessing') },
    { href: '/tedarikciler', label: t('dropdown.inventory.items.suppliers') },
    { href: '/kamu-aktarimlari', label: t('dropdown.inventory.items.publicTransfers') },
    { href: '/diger-aktarimlar', label: t('dropdown.inventory.items.otherTransfers') },
  ];

  // Şirket alt menü öğeleri
  const sirketSubMenuItems = [
    { href: '/organizasyon', label: t('dropdown.company.items.organization') },
    { href: '/varlik-listesi', label: t('dropdown.company.items.assetList') },
  ];

  // Tüm menü öğelerini tanımla - rollere göre filtreleme kaldırıldı
  const menuItems = useMemo(() => [
    { href: '/denetim', label: t('menu.audit') },
    // Envanter menüsü özel olarak işlenecek, 2. sıraya alındı
    { href: '/sirket', label: t('menu.company') }, // Şirket menüsü özel olarak işlenecek
    { href: '/aksiyonlar', label: t('menu.actions') },
    { href: '/dokumanlar', label: t('menu.documents') },
    { href: '/performans', label: t('menu.performance') },
    { href: '/tablolar', label: t('menu.tables') }
  ], [t]);

  // Şirket seçimi için memoize edilmiş değer - sadece danışman rolü için
  const selectedCompanyKey = useMemo(() => {
    if (!userInfo?.companies || userInfo.companies.length === 0) return null;
    
    // Danışman rolü için aktif şirketi bul
    if (userInfo.role === 'danışman') {
      const activeCompany = userInfo.companies.find(c => c.company_active === true);
      return activeCompany ? String(activeCompany.company_id) : String(userInfo.companies[0].company_id);
    }
    
    // Diğer roller için null döndür
    return null;
  }, [userInfo?.companies, userInfo?.role]);

  const handleLogout = async () => {
    try {
      // Önce Redux state'i temizle
      dispatch(clearUserInfo())
      
      // Sonra NextAuth ile çıkış yap
      await signOut({ 
        redirect: false // Yönlendirmeyi manuel yapalım
      })
      
      // Manuel yönlendirme
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Hata olsa bile login sayfasına yönlendir
      window.location.href = '/login'
    }
  }

  const handleLanguageChange = (locale) => {
    router.push(router.pathname, router.asPath, { locale })
  }

  // Envanter veya alt sayfalarından birinde olup olmadığımızı kontrol et
  const isEnvanterActive = router.pathname.startsWith('/envanter');
  // Şirket veya alt sayfalarından birinde olup olmadığımızı kontrol et
  const isSirketActive = router.pathname.startsWith('/sirket');

  // Dropdown dışına tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEnvanterDropdown(false);
      }
      if (sirketDropdownRef.current && !sirketDropdownRef.current.contains(event.target)) {
        setShowSirketDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mouse enter/leave olaylarını gecikme ile işle - Envanter
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    // Şirket dropdown'ı açıksa kapat
    if (showSirketDropdown) {
      setShowSirketDropdown(false);
    }
    setShowEnvanterDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowEnvanterDropdown(false);
    }, 500); // 300ms'den 500ms'ye çıkarıldı
  };

  // Mouse enter/leave olaylarını gecikme ile işle - Şirket
  const handleSirketMouseEnter = () => {
    if (sirketDropdownTimeoutRef.current) {
      clearTimeout(sirketDropdownTimeoutRef.current);
    }
    // Envanter dropdown'ı açıksa kapat
    if (showEnvanterDropdown) {
      setShowEnvanterDropdown(false);
    }
    setShowSirketDropdown(true);
  };

  const handleSirketMouseLeave = () => {
    sirketDropdownTimeoutRef.current = setTimeout(() => {
      setShowSirketDropdown(false);
    }, 500); // 300ms'den 500ms'ye çıkarıldı
  };

  return (
    <>
      <style jsx global>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes menuItemFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto pt-2 pb-2">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation Items */}
            <div className="flex items-center flex-1">
              <Link 
                href="/denetim" 
                className="flex-shrink-0"
              >
                <Image
                  src={darkLogo}
                  alt="DpoX Logo"
                  width={100}
                  height={32}
                  priority
                  className="h-8 w-auto"
                />
              </Link>

              <div className="ml-10 flex items-center space-x-4">
                {/* Denetim menüsü - ilk sırada */}
                <Link
                  href="/denetim"
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    router.pathname.startsWith('/denetim')
                      ? 'text-white bg-[#230060] shadow-md shadow-[#230060]/20 scale-105'
                      : 'text-gray-600 hover:text-[#230060] hover:bg-[#230060]/5'
                  }`}
                >
                  {t('menu.audit')}
                </Link>
                
                {/* Envanter Dropdown - 2. sırada */}
                <div 
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/envanter"
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center ${
                      isEnvanterActive
                        ? 'text-white bg-[#230060] shadow-md shadow-[#230060]/20 scale-105'
                        : 'text-gray-600 hover:text-[#230060] hover:bg-[#230060]/5'
                    }`}
                  >
                    <span>{t('menu.inventory')}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu - Geliştirilmiş tasarım */}
                  {showEnvanterDropdown && (
                    <div 
                      className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                      style={{
                        animation: 'dropdownFade 0.25s ease-out forwards',
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-gradient-to-r from-[#230060] to-[#5c27b2] py-3 px-4">
                        <h3 className="text-white text-sm font-medium">{t('dropdown.inventory.title')}</h3>
                        <p className="text-white/70 text-xs mt-1">{t('dropdown.inventory.description')}</p>
                      </div>
                      <div className="py-2" role="menu" aria-orientation="vertical">
                        {envanterSubMenuItems.map((subItem, index) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center px-4 py-3 text-sm transition-colors duration-150 ${
                              router.pathname === subItem.href
                                ? 'bg-[#230060]/5 text-[#230060] font-medium'
                                : 'text-gray-700 hover:bg-[#230060]/5 hover:text-[#230060]'
                            }`}
                            style={{
                              animation: `menuItemFade 0.3s ease-out forwards ${index * 0.05}s`,
                              opacity: 0,
                              transform: 'translateY(8px)'
                            }}
                            role="menuitem"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(subItem.href);
                            }}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#230060] mr-3 opacity-70"></span>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Şirket Dropdown - 3. sırada */}
                <div 
                  className="relative"
                  ref={sirketDropdownRef}
                  onMouseEnter={handleSirketMouseEnter}
                  onMouseLeave={handleSirketMouseLeave}
                >
                  <Link
                    href="/sirket"
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center ${
                      isSirketActive
                        ? 'text-white bg-[#230060] shadow-md shadow-[#230060]/20 scale-105'
                        : 'text-gray-600 hover:text-[#230060] hover:bg-[#230060]/5'
                    }`}
                  >
                    <span>{t('menu.company')}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Şirket Dropdown Menu */}
                  {showSirketDropdown && (
                    <div 
                      className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                      style={{
                        animation: 'dropdownFade 0.25s ease-out forwards',
                      }}
                      onMouseEnter={handleSirketMouseEnter}
                      onMouseLeave={handleSirketMouseLeave}
                    >
                      <div className="bg-gradient-to-r from-[#230060] to-[#5c27b2] py-3 px-4">
                        <h3 className="text-white text-sm font-medium">{t('dropdown.company.title')}</h3>
                        <p className="text-white/70 text-xs mt-1">{t('dropdown.company.description')}</p>
                      </div>
                      <div className="py-2" role="menu" aria-orientation="vertical">
                        {sirketSubMenuItems.map((subItem, index) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center px-4 py-3 text-sm transition-colors duration-150 ${
                              router.pathname === subItem.href
                                ? 'bg-[#230060]/5 text-[#230060] font-medium'
                                : 'text-gray-700 hover:bg-[#230060]/5 hover:text-[#230060]'
                            }`}
                            style={{
                              animation: `menuItemFade 0.3s ease-out forwards ${index * 0.05}s`,
                              opacity: 0,
                              transform: 'translateY(8px)'
                            }}
                            role="menuitem"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(subItem.href);
                            }}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#230060] mr-3 opacity-70"></span>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Diğer menü öğeleri - Envanter, Şirket ve Denetim hariç */}
                {menuItems.slice(2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      router.pathname.startsWith(item.href)
                        ? 'text-white bg-[#230060] shadow-md shadow-[#230060]/20 scale-105'
                        : 'text-gray-600 hover:text-[#230060] hover:bg-[#230060]/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Select, Language Switcher and User Menu */}
            <div className="flex items-center space-x-6">
              {/* Şirket Seçimi - Sadece danışman rolü için göster */}
              {userInfo?.role === 'danışman' && userInfo?.companies && userInfo.companies.length > 0 && selectedCompanyKey && (
                <Select
                  defaultSelectedKeys={[selectedCompanyKey]}
                  className="w-64"
                  placeholder={t('menu.selectCompany')}
                  aria-label={t('menu.selectCompany')}
                  disabledKeys={["placeholder"]}
                  onSelectionChange={async (keys) => {
                    const selectedCompanyId = Array.from(keys)[0];
                    const currentActiveCompany = userInfo.companies.find(c => c.company_active === true);
                    
                    if (currentActiveCompany && String(currentActiveCompany.company_id) === selectedCompanyId) {
                      return;
                    }

                    if (!selectedCompanyId) {
                      return;
                    }

                    await dispatch(updateActiveCompany({
                      user_id: userInfo.user_id.toString(),
                      company_id: selectedCompanyId
                    }))
                    
                    // Şirket değişikliğinden sonra sayfayı yenile
                    window.location.reload();
                  }}
                >
                  {userInfo.companies.map((company) => (
                    <SelectItem 
                      key={String(company.company_id)}
                      value={String(company.company_id)}
                    >
                      {company.company_name}
                    </SelectItem>
                  ))}
                </Select>
              )}
              
              {/* Yönetici ve Temsilci için şirket adını göster */}
              {(userInfo?.role === 'yönetici' || userInfo?.role === 'temsilci') && userInfo?.companies && userInfo.companies.length > 0 && (
                <div className="text-sm font-medium text-gray-700">
                  {userInfo.companies[0].company_name}
                </div>
              )}

              {/* Language Switcher */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                    <Image
                      src={router.locale === 'tr' ? trFlag : enFlag}
                      alt="Language"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-600">
                      {router.locale === 'tr' ? 'TR' : 'EN'}
                    </span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label={t('language.title')}>
                  <DropdownItem key="tr" onClick={() => handleLanguageChange('tr')}>
                    <div className="flex items-center space-x-2">
                      <Image src={trFlag} alt="Turkish" width={20} height={20} />
                      <span>{t('language.tr')}</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="en" onClick={() => handleLanguageChange('en')}>
                    <div className="flex items-center space-x-2">
                      <Image src={enFlag} alt="English" width={20} height={20} />
                      <span>{t('language.en')}</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* User Menu */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      name: userInfo?.fullname?.[0] || session?.user?.name?.[0] || 'U',
                      showFallback: true,
                      style: { backgroundColor: '#230060', color: 'white' }
                    }}
                    className="transition-transform"
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label={t('menu.profile')}
                  variant="flat"
                  className="w-[280px]"
                >
                  <DropdownItem key="header" className="h-20 gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-[#230060]">{userInfo?.fullname || session?.user?.name || 'Kullanıcı'}</p>
                      <p className="text-sm text-gray-500">{userInfo?.email || session?.user?.email || ''}</p>
                      <p className="text-xs text-gray-500 capitalize">{userInfo?.role || session?.user?.role || ''}</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="profile" onClick={() => router.push('/profil')}>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {t('menu.profile')}
                    </div>
                  </DropdownItem>
                  <DropdownItem key="settings" onClick={() => router.push('/ayarlar')}>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      {t('menu.settings')}
                    </div>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      {t('menu.logout')}
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar