import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'

// SVG ikonlarını import et
import aksiyonlarIcon from '@/images/stats/aksiyonlar-icon.svg'
import veriIslemeIcon from '@/images/stats/veri-isleme-icon.svg'
import tedarikcilerIcon from '@/images/stats/tedarikciler-icon.svg'
import kamuAktarimIcon from '@/images/stats/kamu-aktarim-icon.svg'
import digerAktarimIcon from '@/images/stats/diger-aktarim-icon.svg'
import varliklarIcon from '@/images/stats/varliklar-icon.svg'

const DashboardStats = () => {
  const t = useTranslations('app.denetim')
  
  // Redux store'dan verileri al
  const { filteredStats, filteredAksiyonlar, error } = useSelector((state) => state.dashboardStats)
  const { data: userInfo } = useSelector((state) => state.userInfo)
  
  // Kullanıcı rolünü kontrol et
  const isTemsilci = userInfo?.role === 'temsilci'

  // Statik kart yapısı - temsilci rolü için varlıklar kartını hariç tut
  const baseStats = [
    { 
      icon: aksiyonlarIcon, 
      title: t('stats.cards.aksiyonlar'), 
      count: filteredStats.aksiyonlarSayisi !== null ? filteredStats.aksiyonlarSayisi : 0, 
      borderColor: 'border-[#0A1128]',
      textColor: 'text-gray-800'
    },
    { 
      icon: veriIslemeIcon, 
      title: t('stats.cards.veriIsleme'), 
      count: filteredStats.veriHaritaSayisi !== null ? filteredStats.veriHaritaSayisi : 0, 
      borderColor: 'border-[#1C3879]',
      textColor: 'text-gray-800'
    },
    { 
      icon: tedarikcilerIcon, 
      title: t('stats.cards.tedarikciler'), 
      count: filteredStats.tedarikcilerSayisi !== null ? filteredStats.tedarikcilerSayisi : 0, 
      borderColor: 'border-[#4056A1]',
      textColor: 'text-gray-800'
    },
    { 
      icon: kamuAktarimIcon, 
      title: t('stats.cards.kamuAktarim'), 
      count: filteredStats.kamuAktarimSayisi !== null ? filteredStats.kamuAktarimSayisi : 0, 
      borderColor: 'border-[#5E7CE2]',
      textColor: 'text-gray-800'
    },
    { 
      icon: digerAktarimIcon, 
      title: t('stats.cards.digerAktarim'), 
      count: filteredStats.digerAktarimSayisi !== null ? filteredStats.digerAktarimSayisi : 0, 
      borderColor: 'border-[#7CB9E8]',
      textColor: 'text-gray-800'
    }
  ]
  
  // Varlıklar kartını sadece temsilci olmayan roller için ekle
  const stats = isTemsilci 
    ? baseStats 
    : [
        ...baseStats,
        { 
          icon: varliklarIcon, 
          title: t('stats.cards.varliklar'), 
          count: filteredStats.varlikListesiSayisi !== null ? filteredStats.varlikListesiSayisi : 0, 
          borderColor: 'border-[#B9D9EB]',
          textColor: 'text-gray-800'
        }
      ]

  // Grid sütun sayısını belirle - temsilci için 5, diğer roller için 6
  const gridColsClass = isTemsilci 
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" 
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"

  return (
    <div className="w-full py-6">
      <div className={`grid ${gridColsClass} gap-5 px-3 mx-auto`}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center"
          >
            <div className="w-full h-28 rounded-xl border border-[#230060]/10 flex items-center p-4 bg-white shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="flex items-center w-full relative z-10">
                <div className="w-14 h-14 rounded-xl mr-4 flex items-center justify-center">
                  <Image 
                    src={stat.icon} 
                    alt={stat.title}
                    width={32}
                    height={32}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-[#230060]/70 text-xs uppercase tracking-wider">{stat.title}</h3>
                  <p className="font-bold text-[#230060] text-3xl mt-1">{stat.count}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        .bg-radial-gradient:before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(63.44% 63.44% at 50% 50%, #d9dbff 0, #fff 100%), #fff;
          opacity: 1;
          z-index: -1;
        }
      `}</style>
    </div>
  )
}

export default DashboardStats