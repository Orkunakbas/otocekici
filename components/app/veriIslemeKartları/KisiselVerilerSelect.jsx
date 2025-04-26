import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Select, SelectItem, Button, Input, Checkbox } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocale, useTranslations } from 'next-intl';
import { fetchKisiselVeriler } from '@/store/slices/kisiselVerilerListSlice';
import { FiX, FiSearch, FiUser, FiUsers, FiChevronDown } from 'react-icons/fi';

// Optimize edilmiş Checkbox Item bileşeni
const KisiselVeriItem = React.memo(({ veri, isSelected, onToggle, selectedIlgiliKisi }) => {
  const handleClick = useCallback(() => {
    onToggle(veri.id);
  }, [veri.id, onToggle]);

  return (
    <div 
      key={`veri-${veri.id}`} 
      className="flex items-center p-2 border border-gray-200 rounded-md"
      onClick={handleClick}
    >
      <Checkbox
        id={`checkbox-${selectedIlgiliKisi.value}-${veri.id}`}
        color="primary"
        isSelected={isSelected}
        onValueChange={handleClick}
        className="cursor-pointer"
        aria-checked={isSelected}
        aria-label={`${veri.islenen_kisisel_veriler} seç`}
      />
      <span className="ml-2 text-sm">
        {veri.islenen_kisisel_veriler}
      </span>
    </div>
  );
});

KisiselVeriItem.displayName = 'KisiselVeriItem';

// Seçili etiket bileşeni
const SelectedVeriTag = React.memo(({ veri, onToggle }) => {
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onToggle(veri.id);
  }, [veri.id, onToggle]);

  return (
    <div 
      key={`selected-${veri.id}`} 
      className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center mb-1 mr-1"
    >
      <span>{veri.islenen_kisisel_veriler}</span>
      <button
        onClick={handleClick}
        className="ml-1 text-white hover:text-gray-200"
        aria-label={`${veri.islenen_kisisel_veriler} seçimini kaldır`}
      >
        <FiX size={14} />
      </button>
    </div>
  );
});

SelectedVeriTag.displayName = 'SelectedVeriTag';

// İlgili kişi öğesi bileşeni
const IlgiliKisiItem = React.memo(({ kisi, isSelected, verilerCount, onSelect, onRemove }) => {
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    onRemove(kisi.value, e);
  }, [kisi.value, onRemove]);

  const handleSelect = useCallback(() => {
    onSelect(kisi);
  }, [kisi, onSelect]);

  return (
    <div 
      key={kisi.value}
      onClick={handleSelect}
      className={`p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-100 flex items-center ${
        isSelected 
          ? 'border-l-4 border-l-primary bg-gray-100' 
          : ''
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-sm">{kisi.label}</span>
        <div className="flex items-center">
          {verilerCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full mr-1">
              {verilerCount}
            </span>
          )}
          <button 
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-500 p-1"
            aria-label={`${kisi.label} kişisini kaldır`}
          >
            <FiX size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

IlgiliKisiItem.displayName = 'IlgiliKisiItem';

const KisiselVerilerSelect = ({ 
  value, 
  onChange, 
  className = "",
}) => {
  const locale = useLocale();
  const t = useTranslations('app.kisiselVerilerSelect');
  const dispatch = useDispatch();
  const { kisiselVeriler, loading } = useSelector(state => state.kisiselVerilerList);
  const [ilgiliKisiOptions, setIlgiliKisiOptions] = useState([]);
  const [selectedIlgiliKisi, setSelectedIlgiliKisi] = useState(null);
  const [selectedIlgiliKisiList, setSelectedIlgiliKisiList] = useState([]);
  const [selectedKisiselVerilerByGroup, setSelectedKisiselVerilerByGroup] = useState({});
  const [searchText, setSearchText] = useState('');
  
  // Kişisel verileri ve ilgili kişileri yükle
  useEffect(() => {
    dispatch(fetchKisiselVeriler(locale));
    
    const loadIlgiliKisi = async () => {
      try {
        const data = await import(`@/languages/${locale}/app/dataIlgiliKisi.json`);
        setIlgiliKisiOptions(data.default);
      } catch (error) {
        console.error("İlgili kişi seçenekleri yüklenemedi:", error);
        setIlgiliKisiOptions([]);
      }
    };
    
    loadIlgiliKisi();
  }, [dispatch, locale]);

  // Form değerlerini yükle
  useEffect(() => {
    if (!value || kisiselVeriler.length === 0 || ilgiliKisiOptions.length === 0) return;
    
    try {
      // Eğer değer varsa ve daha önce bu bileşenle ayarlanmışsa bir şey yapma
      // Seçimler zaten state'te
      if (Object.keys(selectedKisiselVerilerByGroup).length > 0) return;
      
      // Gelen değerin string olduğundan emin ol
      const stringValue = typeof value === 'string' ? value : '';
      
      // Gelen değeri satırlara böl
      const lines = stringValue.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        // Boş değer geldi, seçimleri temizle
        setSelectedKisiselVerilerByGroup({});
        setSelectedIlgiliKisiList([]);
        setSelectedIlgiliKisi(null);
        return;
      }
      
      // Seçimleri saklamak için obje
      const selections = {};
      // Seçilen ilgili kişileri saklamak için dizi
      const ilgiliKisiList = [];
      
      // Her satır için işlem yap
      lines.forEach(line => {
        // İlgili kişi ve verilerini ayır: "İlgili Kişi: Veri1, Veri2, Veri3"
        const parts = line.split(':');
        
        if (parts.length < 2) return; // Geçersiz format
        
        const kisiTipi = parts[0].trim();
        const veriler = parts[1].split(',').map(v => v.trim()).filter(v => v);
        
        // İlgili kişi tipini option listesinden bul
        const kisiOption = ilgiliKisiOptions.find(opt => opt.label === kisiTipi || opt.value === kisiTipi);
        
        if (!kisiOption) return; // İlgili kişi tipi bulunamadı
        
        // İlgili kişiyi listeye ekle
        ilgiliKisiList.push(kisiOption);
        
        // Bu ilgili kişi için seçilen verilerin ID'lerini bul
        const selectedVerilerIds = [];
        
        veriler.forEach(veriAdi => {
          // Veri adına göre kişisel veri listesinden ID'yi bul
          const veri = kisiselVeriler.find(v => v.islenen_kisisel_veriler === veriAdi);
          if (veri) {
            selectedVerilerIds.push(veri.id);
          }
        });
        
        // Seçimleri kaydet
        selections[kisiOption.value] = selectedVerilerIds;
      });
      
      // State'leri güncelle
      setSelectedKisiselVerilerByGroup(selections);
      setSelectedIlgiliKisiList(ilgiliKisiList);
      
      // İlk ilgili kişiyi aktif seç
      if (ilgiliKisiList.length > 0) {
        setSelectedIlgiliKisi(ilgiliKisiList[0]);
      }
      
    } catch (e) {
      console.error("Değer işlenirken hata:", e);
      // Hata durumunda boş değerlerle başlat
      setSelectedKisiselVerilerByGroup({});
      setSelectedIlgiliKisiList([]);
      setSelectedIlgiliKisi(null);
    }
  }, [value, ilgiliKisiOptions, kisiselVeriler]);

  // Dropdown'dan yeni ilgili kişi seçildiğinde
  const handleDropdownSelect = useCallback((e) => {
    const selectedValue = e.target.value;
    const selected = ilgiliKisiOptions.find(option => option.value === selectedValue);
    
    if (selected && !selectedIlgiliKisiList.some(item => item.value === selected.value)) {
      // Listeye ekle
      const updatedList = [...selectedIlgiliKisiList, selected];
      setSelectedIlgiliKisiList(updatedList);
      
      // Aktif seçili kişi olarak ayarla
      setSelectedIlgiliKisi(selected);
      
      // Kişisel veriler listesini güncelle
      const updatedSelections = {
        ...selectedKisiselVerilerByGroup,
        [selected.value]: []
      };
      setSelectedKisiselVerilerByGroup(updatedSelections);
      
      // Form değerini güncelle
      updateFormValue(updatedSelections);
    }
  }, [ilgiliKisiOptions, selectedIlgiliKisiList, selectedKisiselVerilerByGroup]);

  // Sol menüden ilgili kişi seçildiğinde
  const handleIlgiliKisiSelect = useCallback((kisi) => {
    if (selectedIlgiliKisi?.value === kisi.value) return; // Zaten seçiliyse hiçbir şey yapma
    
    // Farklı bir kişi tipi seçildiğinde, o kişiye ait seçimleri göster
    setSelectedIlgiliKisi(kisi);
    
    // Bu kişi için henüz seçim yapılmamışsa, boş bir dizi oluştur
    if (!selectedKisiselVerilerByGroup[kisi.value]) {
      const updatedSelections = {
        ...selectedKisiselVerilerByGroup,
        [kisi.value]: []
      };
      
      setSelectedKisiselVerilerByGroup(updatedSelections);
      updateFormValue(updatedSelections);
    }
  }, [selectedIlgiliKisi, selectedKisiselVerilerByGroup]);

  // Checkbox tıklandığında kişisel veri seçimini değiştir
  const handleKisiselVeriToggle = useCallback((veriId) => {
    if (!selectedIlgiliKisi) return;
    
    const kisiKey = selectedIlgiliKisi.value;
    
    // Mevcut seçimleri al
    const currentSelections = Array.isArray(selectedKisiselVerilerByGroup[kisiKey]) 
      ? [...selectedKisiselVerilerByGroup[kisiKey]] 
      : [];
    
    // Seçim durumunu tersine çevir
    let newSelections;
    if (currentSelections.includes(veriId)) {
      // Seçili ise kaldır
      newSelections = currentSelections.filter(id => id !== veriId);
    } else {
      // Seçili değilse ekle
      newSelections = [...currentSelections, veriId];
    }
    
    // State'i ve form değerini güncelle
    const updatedSelections = {
      ...selectedKisiselVerilerByGroup,
      [kisiKey]: newSelections
    };
    
    setSelectedKisiselVerilerByGroup(updatedSelections);
    updateFormValue(updatedSelections);
  }, [selectedIlgiliKisi, selectedKisiselVerilerByGroup]);

  // Form değerini güncelle
  const updateFormValue = useCallback((selections) => {
    if (onChange) {
      // Düz metin formatına çevir
      let formattedString = '';
      
      // Her ilgili kişi tipi için
      Object.entries(selections).forEach(([category, idArray], categoryIndex) => {
        if (idArray.length === 0) return; // Boş olanları atla
        
        // Kategori adını ekle
        formattedString += `${categoryIndex > 0 ? '\n' : ''}${category}: `;
        
        // Seçili kişisel verilerin metinlerini bul
        const verilerText = idArray.map(id => {
          const veri = kisiselVeriler.find(v => v.id === id);
          return veri ? veri.islenen_kisisel_veriler : id.toString();
        });
        
        // Virgülle ayırarak ekle
        formattedString += verilerText.join(', ');
      });
      
      // İşlenen kişisel veriler için değeri gönder
      onChange({
        target: {
          name: 'islenen_kisisel_veriler',
          value: formattedString
        }
      });
      
      // Aynı zamanda ilgili_kisi alanına da veri gönder
      if (selectedIlgiliKisiList.length > 0) {
        const selectedKisiLabels = selectedIlgiliKisiList.map(kisi => kisi.label);
        
        // kime_ait_veri_temini alanına da aynı veriyi gönder (mevcut yapıyı korumak için)
        onChange({
          target: {
            name: 'kime_ait_veri_temini',
            value: selectedKisiLabels.join(', ')
          }
        });
        
        // ilgili_kisi alanına da aynı veriyi gönder
        onChange({
          target: {
            name: 'ilgili_kisi',
            value: selectedKisiLabels.join(', ')
          }
        });
      } else {
        // kime_ait_veri_temini alanını boşalt
        onChange({
          target: {
            name: 'kime_ait_veri_temini',
            value: ''
          }
        });
        
        // ilgili_kisi alanını boşalt
        onChange({
          target: {
            name: 'ilgili_kisi',
            value: ''
          }
        });
      }
    }
  }, [onChange, kisiselVeriler, selectedIlgiliKisiList]);

  // Temizle butonuna tıklandığında
  const handleClearAllClick = useCallback(() => {
    if (!selectedIlgiliKisi) return;
    
    const kisiKey = selectedIlgiliKisi.value;
    
    // Mevcut ilgili kişi için tüm seçimleri temizle
    const updatedSelections = {
      ...selectedKisiselVerilerByGroup,
      [kisiKey]: []
    };
    
    setSelectedKisiselVerilerByGroup(updatedSelections);
    updateFormValue(updatedSelections);
  }, [selectedIlgiliKisi, selectedKisiselVerilerByGroup, updateFormValue]);

  // İlgili kişiyi listeden kaldır
  const handleRemoveIlgiliKisi = useCallback((kisiValue, e) => {
    if (e) e.stopPropagation(); // Event'in propagate olmasını engelle
    
    // Listeden kaldır
    const updatedList = selectedIlgiliKisiList.filter(kisi => kisi.value !== kisiValue);
    setSelectedIlgiliKisiList(updatedList);
    
    // Seçili kişiyi güncelle - kaldırılan kişi aktif seçili kişiyse, başka birine geç
    if (selectedIlgiliKisi?.value === kisiValue) {
      setSelectedIlgiliKisi(updatedList.length > 0 ? updatedList[0] : null);
    }
    
    // Seçilen kişisel verileri kaldır
    const { [kisiValue]: removed, ...rest } = selectedKisiselVerilerByGroup;
    setSelectedKisiselVerilerByGroup(rest);
    
    // Form değerini güncelle
    updateFormValue(rest);
  }, [selectedIlgiliKisi, selectedIlgiliKisiList, selectedKisiselVerilerByGroup, updateFormValue]);

  // Kişisel verileri filtrele (arama işlemi için)
  const filteredKisiselVeriler = useMemo(() => 
    searchText 
      ? kisiselVeriler.filter(item => 
          item.islenen_kisisel_veriler.toLowerCase().includes(searchText.toLowerCase()))
      : kisiselVeriler
  , [kisiselVeriler, searchText]);

  // Belirli bir veri ID'si seçili mi?
  const isKisiselVeriSelected = useCallback((veriId) => {
    if (!selectedIlgiliKisi) return false;
    
    // Şu anki seçili ilgili kişinin verileri
    const currentSelections = selectedKisiselVerilerByGroup[selectedIlgiliKisi.value];
    
    // Seçimler dizisi mi kontrolü ve seçili mi kontrolü
    return Array.isArray(currentSelections) && currentSelections.includes(veriId);
  }, [selectedIlgiliKisi, selectedKisiselVerilerByGroup]);

  // İlgili kişi için seçilen veri sayısını hesapla
  const getKisiVerilerCount = useCallback((kisiValue) => {
    const selections = selectedKisiselVerilerByGroup[kisiValue];
    return Array.isArray(selections) ? selections.length : 0;
  }, [selectedKisiselVerilerByGroup]);

  // Şu anda seçili olan kişisel verileri al
  const selectedVeriler = useMemo(() => {
    if (!selectedIlgiliKisi) return [];
    
    const selectedIds = selectedKisiselVerilerByGroup[selectedIlgiliKisi.value] || [];
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) return [];
    
    return kisiselVeriler.filter(veri => selectedIds.includes(veri.id));
  }, [kisiselVeriler, selectedIlgiliKisi, selectedKisiselVerilerByGroup]);

  // Dropdown için kullanılabilir kişi seçenekleri
  const availableIlgiliKisiOptions = useMemo(() => 
    ilgiliKisiOptions.filter(
      option => !selectedIlgiliKisiList.some(selected => selected.value === option.value)
    )
  , [ilgiliKisiOptions, selectedIlgiliKisiList]);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        {/* Sol panel - İlgili Kişi Listesi */}
        <div className="w-1/4 border-r border-gray-300 bg-gray-50">
          <div className="p-4 border-b border-gray-300">
            <h3 className="font-medium text-lg">{t('ilgiliKisi')}</h3>
            <div className="relative mt-2">
              <Select 
                placeholder={
                  <div className="flex items-center">
                    <FiUser className="mr-2" size={16} />
                    <span>{t('ilgiliKisiSecin')}</span>
                  </div>
                }
                onChange={handleDropdownSelect}
                variant="flat"
                color="secondary"
                className="w-full"
                aria-label={t('ilgiliKisiSecin')}
              >
                {availableIlgiliKisiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                <FiChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto">
            {selectedIlgiliKisiList.length > 0 ? (
              selectedIlgiliKisiList.map((kisi) => (
                <IlgiliKisiItem 
                  key={kisi.value}
                  kisi={kisi}
                  isSelected={selectedIlgiliKisi?.value === kisi.value}
                  verilerCount={getKisiVerilerCount(kisi.value)}
                  onSelect={handleIlgiliKisiSelect}
                  onRemove={handleRemoveIlgiliKisi}
                />
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center mt-4">
                  <FiUsers size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm">{t('kisiEklenmedi')}</p>
                  <p className="text-xs mt-1">{t('yukaridanEkleyin')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sağ panel - Kişisel Veriler Listesi */}
        <div className="w-3/4">
          <div className="p-4 border-b border-gray-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">
                {selectedIlgiliKisi 
                  ? t('kisiIcinVeriler', { kisi: selectedIlgiliKisi.label }) 
                  : t('kisiselVeriler')}
              </h3>
              
              <div className="flex items-center space-x-2">
                <div className="relative w-80 mr-2">
                  <Input
                    placeholder={t('veriAra')}
                    value={searchText}
                    onChange={handleSearchChange}
                    variant="flat"
                    size="sm"
                    className="pr-8"
                    aria-label={t('veriAra')}
                  />
                  <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <Button 
                  size="sm"
                  variant="solid"
                  color="primary"
                  onClick={handleClearAllClick}
                  disabled={!selectedIlgiliKisi}
                  aria-label={t('temizle')}
                >
                  {t('temizle')}
                </Button>
              </div>
            </div>
            
            {/* Seçili kişisel veriler */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {t('seciliVeriler', { sayi: selectedVeriler.length })}
              </div>
              <div className="flex flex-wrap gap-1 max-h-32 min-h-[40px] overflow-y-auto border border-gray-200 rounded-md p-2">
                {selectedIlgiliKisi && selectedVeriler.map(veri => (
                  <SelectedVeriTag
                    key={`selected-${veri.id}`}
                    veri={veri}
                    onToggle={handleKisiselVeriToggle}
                  />
                ))}
                {(!selectedIlgiliKisi || selectedVeriler.length === 0) && (
                  <div className="text-xs text-gray-500 italic flex items-center justify-center w-full h-full">
                    {t('veriSecilmedi')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="h-80 overflow-y-auto p-2">
            {!selectedIlgiliKisi ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                <span>{t('ilgiliKisiSeciniz')}</span>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-full">
                <span>{t('yukleniyor')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredKisiselVeriler.map((veri) => (
                  <KisiselVeriItem
                    key={`veri-${veri.id}`}
                    veri={veri}
                    isSelected={isKisiselVeriSelected(veri.id)}
                    onToggle={handleKisiselVeriToggle}
                    selectedIlgiliKisi={selectedIlgiliKisi}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KisiselVerilerSelect);