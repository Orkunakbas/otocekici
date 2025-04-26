import React, { useState, useEffect } from 'react'
import { Input, Select, SelectItem } from '@heroui/react'
import FormLabel from '@/components/app/global/FormLabel'
import { useTranslations, useLocale } from 'next-intl'

const UpdateEtkiAnalizi = ({ formData, handleChange }) => {
  const t = useTranslations('app.veriIslemeKartlari')
  const locale = useLocale();
  
  // İşleme amaçları için state
  const [islemeAmaclari, setIslemeAmaclari] = useState([]);
  const [selectedAmaclari, setSelectedAmaclari] = useState(new Set([]));
  const [loading, setLoading] = useState(true);
  
  // Değerler null veya undefined ise boş string olarak göster
  const gerceklestirmeAmaciValue = formData?.gerceklestirme_amaci || '';
  // Değeri islenme_amaci olarak al
  const islenmeAmaciValue = formData?.islenme_amaci || '';
  
  // Veri işleme amaçlarını yükle
  useEffect(() => {
    const loadIslemeAmaclari = async () => {
      try {
        setLoading(true);
        const data = await import(`@/languages/${locale}/app/dataIslemeAmaci.json`);
        setIslemeAmaclari(data.default);
        setLoading(false);
      } catch (error) {
        console.error("İşleme amaçları yüklenemedi:", error);
        setIslemeAmaclari([]);
        setLoading(false);
      }
    };
    
    loadIslemeAmaclari();
  }, [locale]);
  
  // Mevcut işlenme amacı değeri varsa, select'i güncelle
  useEffect(() => {
    if (islenmeAmaciValue && islemeAmaclari.length > 0) {
      try {
        // Virgülle ayrılmış değerleri diziye dönüştür ve temizle
        const selectedValues = islenmeAmaciValue.split(',').map(val => val.trim()).filter(Boolean);
        console.log("İşlenme amaçları:", selectedValues);
        
        // Değerleri Set'e dönüştür
        setSelectedAmaclari(new Set(selectedValues));
      } catch (error) {
        console.error("İşlenme amaçları parse hatası:", error);
      }
    }
  }, [islenmeAmaciValue, islemeAmaclari]);
  
  console.log("Form data:", formData);
  console.log("Seçili amaçlar:", Array.from(selectedAmaclari));
  
  return (
    <div className="mt-8 space-y-10 pb-12">
      <div>
        <FormLabel 
          number="1"
          title={t('formEtkiAnalizi.gerceklestirme_amaci')}
          description={t('formEtkiAnalizi.gerceklestirme_amaci_desc')}
        />
        <div className="ml-12">
          <Input
            name="gerceklestirme_amaci"
            value={gerceklestirmeAmaciValue}
            onChange={handleChange}
            placeholder={t('formEtkiAnalizi.gerceklestirme_amaci')}
            variant="flat"
            color="secondary"
            maxLength={250}
            className="text-base w-full rounded-md"
          />
        </div>
      </div>
      
      <div>
        <FormLabel 
          number="2"
          title={t('formEtkiAnalizi.veri_sorumlusu')}
          description={t('formEtkiAnalizi.veri_sorumlusu_desc')}
        />
        <div className="ml-12">
          <Select
            placeholder={t('formEtkiAnalizi.veri_sorumlusu_placeholder')}
            selectionMode="multiple"
            variant="flat"
            color="secondary"
            className="text-base w-full"
            isLoading={loading}
            selectedKeys={selectedAmaclari}
            onSelectionChange={keys => {
              console.log("İşleme amaçları seçimi değişti:", keys);
              
              // Set nesnesini diziye çevir
              const selectedKeys = Array.from(keys);
              
              // Seçili amaçları güncelleyelim
              setSelectedAmaclari(keys);
              
              // Seçili amaçları virgülle ayrılmış bir string'e dönüştür
              handleChange({
                target: {
                  name: 'islenme_amaci', // veri_sorumlusu yerine islenme_amaci olarak gönder
                  value: selectedKeys.join(', ')
                }
              });
            }}
            popoverProps={{
              classNames: { 
                content: "max-h-[300px]"
              }
            }}
          >
            {islemeAmaclari.map((amac) => (
              <SelectItem key={amac} textValue={amac}>
                {amac}
              </SelectItem>
            ))}
          </Select>
          
          {/* Seçili amaçları göster */}
          {selectedAmaclari.size > 0 && (
            <div className="mt-4 p-3 bg-secondary-50 border border-secondary-200 rounded-md">
              <div className="text-sm font-medium text-gray-700 mb-2">{t('formEtkiAnalizi.secili_amaclar')}:</div>
              <ul className="list-disc pl-5 mt-1">
                {Array.from(selectedAmaclari).map((amac, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 text-sm">{amac}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdateEtkiAnalizi