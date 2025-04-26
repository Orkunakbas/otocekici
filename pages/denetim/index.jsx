import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from "@heroui/react"
import Breadcrumbs from '@/components/app/global/Breadcrumbs'
import DashboardStats from '@/components/app/denetim/DashboardStats'
import { fetchDashboardStats, updateFilteredStats } from '@/store/slices/dashboardStatsSlice'
import { fetchDashboardCharts, updateChartData } from '@/store/slices/dashboardChartsSlice'
import AksiyonDurumTablosu from '@/components/app/denetim/AksiyonDurumTablosu'

const Denetim = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltered, setIsFiltered] = useState(false)
  
  // Redux store'dan verileri al
  const { data: userInfo } = useSelector((state) => state.userInfo)
  const { filteredAksiyonlar } = useSelector((state) => state.dashboardStats)
  const { chartData } = useSelector((state) => state.dashboardCharts)
  
  // JSON dosyasından çevirileri kullan
  const t = useTranslations('app.breadcrumbs')
  
  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Her iki veriyi de paralel olarak çek
        await Promise.all([
          dispatch(fetchDashboardStats()).unwrap(),
          dispatch(fetchDashboardCharts()).unwrap()
        ])
        // Veri çekme tamamlandı, şimdi filtreleme yapılacak
        setIsLoading(false)
      } catch (error) {
        console.error('Veri çekme hatası:', error)
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [dispatch])
  
  // Veriler yüklendikten sonra filtreleme yap
  useEffect(() => {
    if (!isLoading && userInfo && !isFiltered) {
      // Her iki slice için de filtreleme yap
      dispatch(updateFilteredStats({ user: userInfo }))
      dispatch(updateChartData({ user: userInfo }))
      setIsFiltered(true)
    }
  }, [dispatch, userInfo, isLoading, isFiltered])
  
  // Filtreleme işlemi tamamlandığında kontrol et
  useEffect(() => {
    if (isFiltered && filteredAksiyonlar && chartData) {
      // Filtreleme işlemi tamamlandı
      console.log('Filtreleme tamamlandı, toplam aksiyonlar:', filteredAksiyonlar.length)
      console.log('Grafik verileri hazır, toplam departman:', chartData.length)
    }
  }, [filteredAksiyonlar, chartData, isFiltered])

  // Başlık ve açıklama - useMemo ile gereksiz yeniden render'ları önle
  const { title, description } = useMemo(() => {
    return {
      title: t('pages.denetim.title.danışman'),
      description: t('pages.denetim.description.danışman')
    }
  }, [t])

  // Yükleniyor veya filtreleme yapılıyor durumunda spinner göster
  if (isLoading || !isFiltered) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner size="lg" color="secondary" />
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs 
        title={title} 
        description={description}
      />
      <DashboardStats />
      <AksiyonDurumTablosu />
    </div>
  )
}

export default Denetim