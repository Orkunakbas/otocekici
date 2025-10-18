import React from 'react'
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button
} from "@heroui/react"
import { Truck, Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const menuItems = [
    { name: "Ana Sayfa", href: "#" },
    { name: "Hizmetlerimiz", href: "#hizmetler" },
    { name: "Bölgeler", href: "#bolgeler" },
    { name: "İletişim", href: "#iletisim" }
  ]

  return (
    <>
      {/* Main Navbar - Ultra Clean */}
      <HeroNavbar 
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
        maxWidth="xl"
        height="80px"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden text-brand-primary"
          />
          <NavbarBrand>
            <Link href="#" className="flex items-center gap-3 group">
              {/* Premium Tow Truck SVG Logo */}
              <svg width="56" height="56" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform">
                <defs>
                  <linearGradient id="truckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                  <linearGradient id="cabinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
                
                {/* Ground Shadow */}
                <ellipse cx="40" cy="68" rx="32" ry="4" fill="#000000" opacity="0.1" />
                
                {/* Main Truck Bed - Lower */}
                <rect x="8" y="42" width="36" height="4" fill="#1e3a8a" />
                <rect x="8" y="32" width="36" height="10" rx="1.5" fill="url(#truckGradient)" />
                
                {/* Side Panel Details */}
                <rect x="12" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.3" />
                <rect x="21" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.3" />
                <rect x="30" y="35" width="6" height="4" rx="0.5" fill="#3b82f6" opacity="0.3" />
                
                {/* Cabin Structure */}
                <path d="M44 32 L44 46 L64 46 L64 36 L54 32 Z" fill="url(#cabinGradient)" />
                <path d="M44 32 L54 32 L64 36 L64 34 L54 30 L44 30 Z" fill="#1e40af" />
                
                {/* Cabin Window - Realistic */}
                <path d="M47 34 L47 42 L61 42 L61 36 L54 34 Z" fill="#bfdbfe" opacity="0.9" />
                <path d="M47 34 L54 34 L61 36 L61 35 L54 33 L47 33 Z" fill="#93c5fd" opacity="0.7" />
                <line x1="54" y1="34" x2="54" y2="42" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.3" />
                
                {/* Tow Crane Boom - Heavy Duty */}
                <rect x="42" y="16" width="3" height="16" rx="1" fill="#1e3a8a" transform="rotate(-25 44 24)" />
                <rect x="42" y="15" width="4" height="2" rx="1" fill="#1e40af" />
                
                {/* Crane Pulley System */}
                <circle cx="56" cy="16" r="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                <circle cx="56" cy="16" r="1.5" fill="#fbbf24" />
                
                {/* Hook and Cable */}
                <line x1="56" y1="19" x2="66" y2="32" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,1" />
                <path d="M66 32 L68 35 L66 38 L64 35 Z" fill="#6b7280" />
                <ellipse cx="66" cy="35" rx="2" ry="3" fill="#4b5563" />
                
                {/* Warning Light Bar */}
                <rect x="46" y="30" width="16" height="1.5" rx="0.75" fill="#1f2937" />
                <circle cx="50" cy="30.75" r="0.8" fill="#ef4444" className="animate-pulse" />
                <circle cx="54" cy="30.75" r="0.8" fill="#f59e0b" className="animate-pulse" />
                <circle cx="58" cy="30.75" r="0.8" fill="#ef4444" className="animate-pulse" />
                
                {/* Front Grille */}
                <rect x="62" y="40" width="2" height="6" rx="0.5" fill="#1f2937" />
                <line x1="62.5" y1="41" x2="62.5" y2="45" stroke="#374151" strokeWidth="0.3" />
                <line x1="63.5" y1="41" x2="63.5" y2="45" stroke="#374151" strokeWidth="0.3" />
                
                {/* Headlights */}
                <circle cx="63" cy="43" r="1.2" fill="#fef3c7" />
                <circle cx="63" cy="43" r="0.8" fill="#fde047" />
                
                {/* Wheels - Detailed */}
                <g>
                  {/* Rear Wheel */}
                  <circle cx="18" cy="46" r="8" fill="#1f2937" />
                  <circle cx="18" cy="46" r="6" fill="#374151" />
                  <circle cx="18" cy="46" r="4" fill="#4b5563" />
                  <circle cx="18" cy="46" r="2" fill="#6b7280" />
                  <circle cx="18" cy="46" r="1" fill="#9ca3af" />
                  {/* Wheel Spokes */}
                  <line x1="18" y1="42" x2="18" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                  <line x1="14" y1="46" x2="22" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                </g>
                
                <g>
                  {/* Middle Wheel */}
                  <circle cx="34" cy="46" r="8" fill="#1f2937" />
                  <circle cx="34" cy="46" r="6" fill="#374151" />
                  <circle cx="34" cy="46" r="4" fill="#4b5563" />
                  <circle cx="34" cy="46" r="2" fill="#6b7280" />
                  <circle cx="34" cy="46" r="1" fill="#9ca3af" />
                  <line x1="34" y1="42" x2="34" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                  <line x1="30" y1="46" x2="38" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                </g>
                
                <g>
                  {/* Front Wheel */}
                  <circle cx="56" cy="46" r="8" fill="#1f2937" />
                  <circle cx="56" cy="46" r="6" fill="#374151" />
                  <circle cx="56" cy="46" r="4" fill="#4b5563" />
                  <circle cx="56" cy="46" r="2" fill="#6b7280" />
                  <circle cx="56" cy="46" r="1" fill="#9ca3af" />
                  <line x1="56" y1="42" x2="56" y2="50" stroke="#6b7280" strokeWidth="0.5" />
                  <line x1="52" y1="46" x2="60" y2="46" stroke="#6b7280" strokeWidth="0.5" />
                </g>
                
                {/* Mud Flaps */}
                <rect x="16" y="52" width="4" height="6" rx="0.5" fill="#1f2937" opacity="0.6" />
                <rect x="32" y="52" width="4" height="6" rx="0.5" fill="#1f2937" opacity="0.6" />
                
                {/* Front Bumper */}
                <rect x="64" y="42" width="4" height="4" rx="1" fill="#1e40af" />
                <rect x="66" y="43" width="1.5" height="2" rx="0.5" fill="#fbbf24" />
              </svg>
              
              <div>
                <p className="font-bold text-xl text-brand-primary leading-tight tracking-tight">Arnavutköy</p>
                <p className="text-xs text-gray-600 font-semibold tracking-wide">OTO ÇEKİCİ</p>
              </div>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-2" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={index}>
              <Link 
                href={item.href}
                className="text-gray-700 hover:text-brand-primary font-medium px-5 py-2 rounded-lg hover:bg-blue-50 transition-all relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-primary group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="hidden sm:flex gap-3">
          <NavbarItem>
            <Button 
              as={Link} 
              href="tel:+905551234567"
              size="lg"
              className="bg-brand-primary hover:bg-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              startContent={<Phone className="w-5 h-5" strokeWidth={2} />}
            >
              Hemen Ara
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button 
              as={Link} 
              href="https://wa.me/905551234567"
              size="lg"
              variant="bordered"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold transition-all"
              startContent={<FaWhatsapp className="w-5 h-5" />}
            >
              WhatsApp
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="pt-8 pb-8 bg-white/98 backdrop-blur-md">
          {/* Menu Items */}
          <div className="space-y-1 mb-8">
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={index}>
                <Link
                  className="w-full flex items-center text-gray-700 hover:text-brand-primary font-semibold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all group"
                  href={item.href}
                  size="lg"
                >
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
          
          {/* Contact Section - Mobile */}
          <div className="px-4 space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">7/24 İletişim</p>
            </div>
            
            {/* Call Button */}
            <Button 
              as={Link} 
              href="tel:+905551234567"
              size="lg"
              className="w-full bg-brand-primary hover:bg-blue-800 text-white font-semibold py-7 shadow-lg"
              startContent={<Phone className="w-5 h-5" strokeWidth={2} />}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-90">Hemen Ara</span>
                <span className="text-base font-bold">0555 123 4567</span>
              </div>
            </Button>
            
            {/* WhatsApp Button */}
            <Button 
              as={Link} 
              href="https://wa.me/905551234567"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-7 shadow-lg"
              startContent={<FaWhatsapp className="w-5 h-5" />}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-90">Mesaj Gönder</span>
                <span className="text-base font-bold">WhatsApp</span>
              </div>
            </Button>
          </div>
        </NavbarMenu>
      </HeroNavbar>
    </>
  )
}

export default Navbar