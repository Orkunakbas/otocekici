import React from 'react'
import { FaPhone, FaWhatsapp } from 'react-icons/fa'

const MobileFixedButtons = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="grid grid-cols-2 gap-0">
        {/* Call Button */}
        <a
          href="tel:+905551234567"
          className="flex items-center justify-center gap-3 bg-brand-primary hover:bg-blue-800 text-white font-bold py-5 transition-all active:scale-95"
        >
          <FaPhone className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90">Hemen Ara</span>
            <span className="text-sm font-extrabold">0555 123 4567</span>
          </div>
        </a>
        
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/905551234567"
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-5 transition-all active:scale-95"
        >
          <FaWhatsapp className="w-6 h-6" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90">Mesaj Gönder</span>
            <span className="text-sm font-extrabold">WhatsApp</span>
          </div>
        </a>
      </div>
    </div>
  )
}

export default MobileFixedButtons

