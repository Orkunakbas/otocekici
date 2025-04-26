import React, { useState } from 'react'
import { Tabs, Tab, Card, CardBody } from "@heroui/react"
import { FiActivity, FiRefreshCw } from "react-icons/fi"
import GirisKayitlari from './GirisKayitlari'
import EnvanterGuncelleme from './EnvanterGuncelleme'
import { useTranslations } from 'next-intl'

const PerformansPage = () => {
  const [selectedTab, setSelectedTab] = useState("giris-kayitlari")
  const t = useTranslations('app.performans.performansPage')

  return (
    <div className='py-6  px-4 pb-10 w-full'>
      <div className="w-full">
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={setSelectedTab}
          aria-label={t('tabsLabel')} 
          variant="bordered"
          classNames={{
            base: "w-full",
            panel: "w-full pt-3",
            tabList: "gap-6 w-auto"
          }}
        >
          <Tab 
            key="giris-kayitlari" 
            title={
              <div className="flex items-center gap-2">
                <span>{t('tabs.girisKayitlari')}</span>
                <FiActivity className="text-primary" />
              </div>
            }
          >
            <GirisKayitlari />
          </Tab>
          <Tab 
            key="envanter-guncelleme" 
            title={
              <div className="flex items-center gap-2">
                <span>{t('tabs.envanterGuncelleme')}</span>
                <FiRefreshCw className="text-primary" />
              </div>
            }
          >
            <EnvanterGuncelleme />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default PerformansPage