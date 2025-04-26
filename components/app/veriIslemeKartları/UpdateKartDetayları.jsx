import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Select, SelectItem } from '@heroui/react';
import FormLabel from '@/components/app/global/FormLabel';
import { useLocale, useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '@/store/slices/departmentsSlice';
import { fetchVarlikListesi, filterByCompanyId } from '@/store/slices/varlikSlice';
import { fetchTedarikciListesi, filterByCompanyId as filterTedarikciByCompanyId } from '@/store/slices/tedarikciSlice';
import { getCompanyIds } from '@/store/slices/userInfoSlice';
import KisiselVerilerSelect from './KisiselVerilerSelect';

const UpdateKartDetayları = ({ formData, handleChange }) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const t = useTranslations('app.veriIslemeKartlari');
  const veriIslemeT = useTranslations('app.veriIsleme');
  
  const [isDataReady, setIsDataReady] = useState(false);
  const [faaliyetAmaciOptions, setFaaliyetAmaciOptions] = useState([]);
  const [ilgiliKisiOptions, setIlgiliKisiOptions] = useState([]);
  const [veriTeminiOptions, setVeriTeminiOptions] = useState({kimden: [], yöntem: []});
  const [otherSelected, setOtherSelected] = useState(formData?.faaliyet_amaci === "Diğer");
  const [otherKisiSelected, setOtherKisiSelected] = useState(false);
  const [otherKimdenSelected, setOtherKimdenSelected] = useState(false);
  const [otherYontemSelected, setOtherYontemSelected] = useState(false);
  const { departments, loading: departmentsLoading } = useSelector(state => state.departments);
  const { varliklar, filteredVarliklar, loading: varlikLoading } = useSelector(state => state.varlikList);
  const { tedarikciler, filteredTedarikciler, loading: tedarikciLoading } = useSelector(state => state.tedarikciList);
  const userInfo = useSelector(state => state.userInfo.data);
  const userRole = userInfo?.role || '';
  const userDepartmentId = userInfo?.companies?.[0]?.department_id;
  const isConsultantOrManager = userRole === 'danışman' || userRole === 'yönetici';
  const isRepresentative = userRole === 'temsilci';
  
  // Departman seçimi için state
  const [selectedDepartment, setSelectedDepartment] = useState(new Set([]));
  
  // Varlık seçimi için state
  const [selectedVarliklar, setSelectedVarliklar] = useState(new Set([]));
  // Tedarikçi seçimi için state
  const [selectedTedarikciler, setSelectedTedarikciler] = useState(new Set([]));
  
  // Departmanı pre-select etmek için
  useEffect(() => {
    if (formData && formData.department_id && departments.length > 0) {
      setSelectedDepartment(new Set([formData.department_id.toString()]));
    }
  }, [formData, departments]);

  // Varlıkları pre-select etmek için
  useEffect(() => {
    if (formData && formData.saklandigi_alan && varliklar.length > 0) {
      console.log("Varliklar eşleştirme başlıyor:", formData.saklandigi_alan);
      const selectedValues = formData.saklandigi_alan.split(',');
      
      const selectedIds = new Set();
      
      selectedValues.forEach(val => {
        const trimmedVal = val.trim();
        
        // Numarik değer kontrolü (doğrudan ID olabilir)
        if (/^\d+$/.test(trimmedVal)) {
          console.log("Numeric ID bulundu:", trimmedVal);
          selectedIds.add(trimmedVal);
          return;
        }
        
        // İsim ile eşleştirme
        const matchedItem = varliklar.find(v => 
          v.varlik_ismi.toLowerCase().trim() === trimmedVal.toLowerCase() || 
          v.varlik_ismi.toLowerCase().includes(trimmedVal.toLowerCase())
        );
        
        if (matchedItem) {
          console.log("Varlik eşleşti:", trimmedVal, "->", matchedItem.id);
          selectedIds.add(matchedItem.id.toString());
        } else {
          console.log("Eşleşmeyen varlik:", trimmedVal);
        }
      });
      
      console.log("Seçilen varlik ID'leri:", Array.from(selectedIds));
      setSelectedVarliklar(new Set(Array.from(selectedIds)));
    }
  }, [formData, varliklar]);

  // Tedarikçileri pre-select etmek için
  useEffect(() => {
    if (formData && formData.dahil_oluyormu && tedarikciler.length > 0) {
      console.log("Tedarikciler eşleştirme başlıyor:", formData.dahil_oluyormu);
      const selectedValues = formData.dahil_oluyormu.split(',');
      
      const selectedIds = new Set();
      
      selectedValues.forEach(val => {
        const trimmedVal = val.trim();
        
        // Numarik değer kontrolü (doğrudan ID olabilir)
        if (/^\d+$/.test(trimmedVal)) {
          console.log("Numeric ID bulundu:", trimmedVal);
          selectedIds.add(trimmedVal);
          return;
        }
        
        // İsim ile eşleştirme
        const matchedItem = tedarikciler.find(t => 
          t.tedarikci_ismi.toLowerCase().trim() === trimmedVal.toLowerCase() || 
          t.tedarikci_ismi.toLowerCase().includes(trimmedVal.toLowerCase())
        );
        
        if (matchedItem) {
          console.log("Tedarikci eşleşti:", trimmedVal, "->", matchedItem.id);
          selectedIds.add(matchedItem.id.toString());
        } else {
          console.log("Eşleşmeyen tedarikci:", trimmedVal);
        }
      });
      
      console.log("Seçilen tedarikci ID'leri:", Array.from(selectedIds));
      setSelectedTedarikciler(new Set(Array.from(selectedIds)));
    }
  }, [formData, tedarikciler]);
  
  useEffect(() => {
    // Departmanları yükle
    dispatch(fetchDepartments());
    
    // Varlık listesini yükle
    if (varliklar.length === 0 && !varlikLoading) {
      dispatch(fetchVarlikListesi());
    }
    
    // Tedarikçi listesini yükle
    if (tedarikciler.length === 0 && !tedarikciLoading) {
      dispatch(fetchTedarikciListesi());
    }
  }, [dispatch, varliklar.length, varlikLoading, tedarikciler.length, tedarikciLoading]);
  
  useEffect(() => {
    if (userInfo && formData) {
      const companyIds = getCompanyIds(userInfo);
      if (companyIds.length > 0) {
        // Varlık ve tedarikçileri filtrele
        if (varliklar.length > 0) {
          dispatch(filterByCompanyId(formData.company_id || companyIds[0]));
        }
        if (tedarikciler.length > 0) {
          dispatch(filterTedarikciByCompanyId(formData.company_id || companyIds[0]));
        }
      }
    }
  }, [dispatch, userInfo, varliklar, tedarikciler, formData]);
  
  useEffect(() => {
    // Dil dosyasını dinamik olarak yükle - Faaliyet Amacı
    const loadFaaliyetAmaci = async () => {
      try {
        const data = await import(`@/languages/${locale}/app/dataFaaliyetAmaci.json`);
        setFaaliyetAmaciOptions(data.default);
      } catch (error) {
        console.error("Faaliyet amacı seçenekleri yüklenemedi:", error);
        setFaaliyetAmaciOptions([]);
      }
    };
    
    // İlgili Kişi seçeneklerini yükle
    const loadIlgiliKisi = async () => {
      try {
        const data = await import(`@/languages/${locale}/app/dataIlgiliKisi.json`);
        setIlgiliKisiOptions(data.default);
      } catch (error) {
        console.error("İlgili kişi seçenekleri yüklenemedi:", error);
        setIlgiliKisiOptions([]);
      }
    };
    
    // Veri Temini seçeneklerini yükle
    const loadVeriTemini = async () => {
      try {
        const data = await import(`@/languages/${locale}/app/dataVeriTemini.json`);
        setVeriTeminiOptions(data.default);
      } catch (error) {
        console.error("Veri temini seçenekleri yüklenemedi:", error);
        setVeriTeminiOptions({kimden: [], yöntem: []});
      }
    };
    
    loadFaaliyetAmaci();
    loadIlgiliKisi();
    loadVeriTemini();
  }, [locale]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - faaliyet amacı
    const isOtherSelected = formData?.faaliyet_amaci === "Diğer";
    setOtherSelected(isOtherSelected);
  }, [formData?.faaliyet_amaci]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - veri kimden
    if (formData?.kvk_kimden_nasil) {
      const isOtherKimdenSelected = formData.kvk_kimden_nasil.includes('Diğer');
      setOtherKimdenSelected(isOtherKimdenSelected);
    }
  }, [formData?.kvk_kimden_nasil]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - veri yöntemi
    if (formData?.kimden_nasil_temin) {
      const isOtherYontemSelected = formData.kimden_nasil_temin.includes('Diğer');
      setOtherYontemSelected(isOtherYontemSelected);
    }
  }, [formData?.kimden_nasil_temin]);
  
  useEffect(() => {
    // Veri hazır durumunu kontrol et
    if (
      formData && 
      Object.keys(formData).length > 0 &&
      departments.length > 0 && !departmentsLoading &&
      varliklar.length > 0 && !varlikLoading &&
      tedarikciler.length > 0 && !tedarikciLoading &&
      faaliyetAmaciOptions.length > 0 &&
      ilgiliKisiOptions.length > 0 &&
      veriTeminiOptions.kimden.length > 0
    ) {
      console.log("Tüm veriler yüklendi, form hazır");
      // Verilerin yüklenmesi için biraz daha bekle
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsDataReady(false);
    }
  }, [
    formData, 
    departments, departmentsLoading, 
    varliklar, varlikLoading, 
    tedarikciler, tedarikciLoading,
    faaliyetAmaciOptions,
    ilgiliKisiOptions,
    veriTeminiOptions
  ]);
  
  const handleButtonOptionClick = (name, value) => {
    handleChange && handleChange({ target: { name, value } });
  };
  
  const handleMultiSelectButtonClick = (name, value) => {
    if (!formData || !handleChange) return;
    
    const currentValues = formData[name] || [];
    let newValues;
    
    if (currentValues.includes(value)) {
      // Eğer zaten seçiliyse, kaldır
      newValues = currentValues.filter(item => item !== value);
    } else {
      // Seçili değilse, ekle
      newValues = [...currentValues, value];
    }
    
    handleChange({
      target: {
        name: name,
        value: newValues
      }
    });
  };

  // Departman değişikliğini handle et
  const handleDepartmentChange = (keys) => {
    const selectedKey = Array.from(keys)[0];
    setSelectedDepartment(keys);
    
    if (selectedKey) {
      handleChange({
        target: {
          name: 'department_id',
          value: parseInt(selectedKey, 10)
        }
      });
    }
  };

  // Diğer seçeneğini bulalım - faaliyet amacı
  const otherOption = faaliyetAmaciOptions.find(option => option.value === "Diğer");

  // Normal seçenekleri grupla - faaliyet amacı
  const normalOptions = faaliyetAmaciOptions.filter(option => option.value !== "Diğer");
  
  // Diğer kişi seçeneğini bulalım
  const otherKisiOption = ilgiliKisiOptions.find(option => option.value === "Diğer");
  
  // Normal kişi seçeneklerini grupla
  const normalKisiOptions = ilgiliKisiOptions.filter(option => option.value !== "Diğer");
  
  // Select için kullanılacak varlık listesi
  const varlikOptions = filteredVarliklar.length > 0 ? filteredVarliklar : varliklar;
  
  // Select için kullanılacak tedarikçi listesi
  const tedarikciOptions = filteredTedarikciler.length > 0 ? filteredTedarikciler : tedarikciler;

  // KisiselVerilerSelect'ten gelen değeri dönüştür
  const handleSelectionChange = (e) => {
    // Doğrudan değişikliği yap, ek işleme yapmadan
    handleChange && handleChange(e);
  };

  // Varlık seçimini handle et
  const handleVarlikChange = (keys) => {
    setSelectedVarliklar(keys);
    const selectedKeys = Array.from(keys);
    
    // İsim listesini hazırla
    const selectedNames = selectedKeys.map(key => {
      const item = varlikOptions.find(v => v.id.toString() === key);
      return item ? item.varlik_ismi : key;
    });
    
    // İsimleri virgülle ayırarak kaydet
    handleChange && handleChange({
      target: {
        name: 'saklandigi_alan',
        value: selectedNames.join(', ')
      }
    });
    
    console.log("saklandigi_alan değeri güncellendi:", selectedNames.join(', '));
  };
  
  // Tedarikçi seçimini handle et
  const handleTedarikciChange = (keys) => {
    setSelectedTedarikciler(keys);
    const selectedKeys = Array.from(keys);
    
    // İsim listesini hazırla
    const selectedNames = selectedKeys.map(key => {
      const item = tedarikciOptions.find(t => t.id.toString() === key);
      return item ? item.tedarikci_ismi : key;
    });
    
    // İsimleri virgülle ayırarak kaydet
    handleChange && handleChange({
      target: {
        name: 'dahil_oluyormu',
        value: selectedNames.join(', ')
      }
    });
    
    console.log("dahil_oluyormu değeri güncellendi:", selectedNames.join(', '));
  };

  // Form verisi yoksa veya veriler tamamen yüklenmemişse loading göster
  if (!formData || !isDataReady) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p>{veriIslemeT('loadingDetails')}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10 pb-12">
      {/* Hidden input for guncelleyen field */}
      <input
        type="hidden"
        name="guncelleyen"
        value={formData.guncelleyen || ''}
      />
      
      <div>
        <FormLabel 
          number="1"
          title={t('form.surec_ismi')}
          description={t('form.surec_ismi_desc')}
        />
        <div className="ml-12">
          <Input
            name="surec_ismi"
            value={formData.surec_ismi || ''}
            onChange={handleChange}
            placeholder={t('form.surec_ismi')}
            variant="flat"
            color="secondary"
            maxLength={25}
            className="text-base"
          />
        </div>
      </div>

      <div>
        <FormLabel 
          number="2"
          title={t('form.faaliyet_amaci')}
          description={t('form.faaliyet_amaci_desc')}
        />
        <div className="ml-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {normalOptions.map((option) => (
              <Button
                key={option.value}
                color="primary"
                radius='sm'
                variant={formData.faaliyet_amaci === option.value ? "shadow" : "light"}
                data-value={option.value}
                onClick={() => handleButtonOptionClick('faaliyet_amaci', option.value)}
                className={`py-3 w-full border border-gray-700 ${formData.faaliyet_amaci === option.value ? 'text-white' : 'text-black'}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {otherOption && (
              <Button
                color="primary"
                radius='sm'
                variant={formData.faaliyet_amaci === "Diğer" ? "shadow" : "light"}
                data-value="Diğer"
                onClick={() => handleButtonOptionClick('faaliyet_amaci', "Diğer")}
                className={`py-3 w-full border border-gray-700 ${formData.faaliyet_amaci === "Diğer" ? 'text-white' : 'text-black'}`}
              >
                {otherOption.label}
              </Button>
            )}
            
            <div className="col-span-1 md:col-span-3">
              <Input
                name="faaliyet_amaci_yaziniz"
                value={formData.faaliyet_amaci_yaziniz || ''}
                onChange={handleChange}
                radius='sm'
                placeholder={t('form.yaziniz')}
                variant="flat"
                color="secondary"
                className={`text-base w-full border border-gray-700 rounded-md ${!otherSelected ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
                disabled={!otherSelected}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <FormLabel 
          number="3"
          title={t('form.faaliyet_aciklamasi')}
          description={t('form.faaliyet_aciklamasi_desc')}
        />
        <div className="ml-12">
          <Textarea
            name="faaliyet_aciklamasi"
            value={formData.faaliyet_aciklamasi || ''}
            onChange={handleChange}
            placeholder={t('form.faaliyet_aciklamasi_placeholder')}
            variant="flat"
            color="secondary"
            className="text-base w-full rounded-md "
          />
        </div>
      </div>

      {isConsultantOrManager && (
        <div>
          <FormLabel 
            number="4"
            title={t('form.ilgili_departman')}
            description={t('form.ilgili_departman_desc')}
          />
          <div className="ml-12">
            <Select
              name="department_id"
              selectedKeys={selectedDepartment}
              onSelectionChange={handleDepartmentChange}
              placeholder={t('form.departman_seciniz')}
              variant="flat"
              color="secondary"
              className="text-base w-full"
              isLoading={departmentsLoading}
              aria-label={t('form.ilgili_departman')}
              selectionMode="single"
            >
              {departments.map((department) => (
                <SelectItem key={department.department_id.toString()}>
                  {department.department_name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}

      {isRepresentative && (
        <input 
          type="hidden" 
          name="department_id" 
          value={formData.department_id || ''} 
        />
      )}
      
      <div>
        <FormLabel 
          number="5"
          title={t('form.kisisel_veriler')}
          description={t('form.kisisel_veriler_desc')}
        />
        <div className="ml-12">
          <KisiselVerilerSelect
            value={formData.islenen_kisisel_veriler || ''}
            onChange={handleSelectionChange}
          />
        </div>
      </div>
      
      <div>
        <FormLabel 
          number="6"
          title={t('form.veri_kimden')}
          description={t('form.veri_kimden_desc')}
        />
        <div className="ml-12">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-2">
            {veriTeminiOptions.kimden?.map((option) => (
              <Button
                key={option.value}
                color="primary"
                radius='sm'
                variant={(formData.kvk_kimden_nasil || '').includes(option.value) ? "shadow" : "light"}
                onClick={() => {
                  const currentValue = formData.kvk_kimden_nasil || '';
                  const currentValues = currentValue.split(',').map(v => v.trim()).filter(v => v);
                  let newValues = [];
                  
                  if (currentValues.includes(option.value)) {
                    // Eğer zaten seçiliyse kaldır
                    newValues = currentValues.filter(val => val !== option.value);
                  } else {
                    // Eğer seçili değilse ekle
                    newValues = [...currentValues, option.value];
                  }
                  
                  // Temiz bir virgülle ayrılmış liste haline getir
                  const newValue = newValues.join(', ');
                  
                  handleChange({
                    target: {
                      name: 'kvk_kimden_nasil',
                      value: newValue
                    }
                  });
                }}
                className={`py-3 w-full border border-gray-700 ${(formData.kvk_kimden_nasil || '').includes(option.value) ? 'text-white' : 'text-black'}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          {otherKimdenSelected && (
            <div className="mt-3">
              <Input
                name="kvk_kimden_nasil_yaziniz"
                value={formData.kvk_kimden_nasil_yaziniz || ''}
                onChange={handleChange}
                radius='sm'
                placeholder={t('form.yaziniz')}
                variant="flat"
                color="secondary"
                className="text-base w-full border border-gray-700 rounded-md"
              />
            </div>
          )}
          
          <p className="mt-6 text-sm text-gray-700">{t('form.veri_yontem_desc')}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {veriTeminiOptions.yöntem?.filter(option => option.value !== "Diğer").map((option) => (
              <Button
                key={option.value}
                color="primary"
                radius='sm'
                variant={(formData.kimden_nasil_temin || '').includes(option.value) ? "shadow" : "light"}
                onClick={() => {
                  const currentValue = formData.kimden_nasil_temin || '';
                  const currentValues = currentValue.split(',').map(v => v.trim()).filter(v => v);
                  let newValues = [];
                  
                  if (currentValues.includes(option.value)) {
                    // Eğer zaten seçiliyse kaldır
                    newValues = currentValues.filter(val => val !== option.value);
                  } else {
                    // Eğer seçili değilse ekle
                    newValues = [...currentValues, option.value];
                  }
                  
                  // Temiz bir virgülle ayrılmış liste haline getir
                  const newValue = newValues.join(', ');
                  
                  handleChange({
                    target: {
                      name: 'kimden_nasil_temin',
                      value: newValue
                    }
                  });
                }}
                className={`py-3 w-full border border-gray-700 ${(formData.kimden_nasil_temin || '').includes(option.value) ? 'text-white' : 'text-black'}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {veriTeminiOptions.yöntem?.find(option => option.value === "Diğer") && (
              <Button
                key="Diğer"
                color="primary"
                radius='sm'
                variant={(formData.kimden_nasil_temin || '').includes("Diğer") ? "shadow" : "light"}
                onClick={() => {
                  const currentValue = formData.kimden_nasil_temin || '';
                  const currentValues = currentValue.split(',').map(v => v.trim()).filter(v => v);
                  let newValues = [];
                  
                  if (currentValues.includes("Diğer")) {
                    // Eğer zaten seçiliyse kaldır
                    newValues = currentValues.filter(val => val !== "Diğer");
                  } else {
                    // Eğer seçili değilse ekle
                    newValues = [...currentValues, "Diğer"];
                  }
                  
                  // Temiz bir virgülle ayrılmış liste haline getir
                  const newValue = newValues.join(', ');
                  
                  handleChange({
                    target: {
                      name: 'kimden_nasil_temin',
                      value: newValue
                    }
                  });
                }}
                className={`py-3 w-full border border-gray-700 ${(formData.kimden_nasil_temin || '').includes("Diğer") ? 'text-white' : 'text-black'}`}
              >
                {veriTeminiOptions.yöntem.find(option => option.value === "Diğer")?.label || "Diğer"}
              </Button>
            )}
            
            <div className="col-span-1 md:col-span-3">
              <Input
                name="kimden_nasil_temin_yaziniz"
                value={formData.kimden_nasil_temin_yaziniz || ''}
                onChange={handleChange}
                radius='sm'
                placeholder={t('form.yaziniz')}
                variant="flat"
                color="secondary"
                className={`text-base w-full border border-gray-700 rounded-md ${!otherYontemSelected ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
                disabled={!otherYontemSelected}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <FormLabel 
          number="7"
          title={t('form.otomatik_veri_isleme')}
          description={t('form.otomatik_veri_isleme_desc')}
        />
        <div className="ml-12">
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button
              color="primary"
              radius='sm'
              variant={formData.otomatik_veri_isleme_faaliyeti === "Evet" ? "shadow" : "light"}
              onClick={() => handleButtonOptionClick('otomatik_veri_isleme_faaliyeti', "Evet")}
              className={`py-3 w-full border border-gray-700 ${formData.otomatik_veri_isleme_faaliyeti === "Evet" ? 'text-white' : 'text-black'}`}
            >
              {t('form.evet')}
            </Button>
            <Button
              color="primary"
              radius='sm'
              variant={formData.otomatik_veri_isleme_faaliyeti === "Hayır" ? "shadow" : "light"} 
              onClick={() => handleButtonOptionClick('otomatik_veri_isleme_faaliyeti', "Hayır")}
              className={`py-3 w-full border border-gray-700 ${formData.otomatik_veri_isleme_faaliyeti === "Hayır" ? 'text-white' : 'text-black'}`}
            >
              {t('form.hayir')}
            </Button>
          </div>
          
          {formData.otomatik_veri_isleme_faaliyeti === "Evet" && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">{t('form.evet_ise_aciklayiniz')}</p>
              <Input
                name="otomatik_veri_isleme_faaliyeti_yaziniz"
                value={formData.otomatik_veri_isleme_faaliyeti_yaziniz || ''}
                onChange={handleChange}
                placeholder={t('form.yaziniz')}
                variant="flat"
                color="secondary"
                className="text-base w-full border border-gray-700 rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <FormLabel 
          number="8"
          title={t('form.dokuman_ismi')}
          description={t('form.dokuman_ismi_desc')}
        />
        <div className="ml-12">
          <Textarea
            name="dosya_ismi"
            value={formData.dosya_ismi || ''}
            onChange={handleChange}
            placeholder={t('form.yaziniz')}
            variant="flat"
            color="secondary"
            className="text-base w-full rounded-md"
          />
        </div>
      </div>
      
      <div>
        <FormLabel 
          number="9"
          title={t('form.depolama_ortami')}
          description={t('form.depolama_ortami_desc')}
        />
        <div className="ml-12">
          <Select
            placeholder="Depolama ortamlarını seçiniz"
            selectionMode="multiple"
            variant="flat"
            color="secondary"
            className="text-base w-full"
            isLoading={varlikLoading}
            defaultSelectedKeys={formData.saklandigi_alan ? new Set(formData.saklandigi_alan.split(',').map(name => {
              // Önce trimle
              name = name.trim();
              if (!name) return null; // Boş değerleri atla
              
              // Eğer sayısal bir değerse, doğrudan ID olarak kullan
              if (/^\d+$/.test(name)) {
                return name;
              }
              
              // İsime göre ara
              const item = varlikOptions.find(v => 
                v.varlik_ismi.toLowerCase().trim() === name.toLowerCase() || 
                v.varlik_ismi.toLowerCase().includes(name.toLowerCase())
              );
              return item ? item.id.toString() : name;
            }).filter(Boolean)) : new Set()}
            onSelectionChange={keys => {
              console.log("Varlık seçimi değişti:", keys);
              
              // Set nesnesini diziye çevir
              const selectedKeys = Array.from(keys);
              
              // Eğer hiç seçili öğe yoksa, boş string döndür
              if (selectedKeys.length === 0) {
                handleChange({
                  target: {
                    name: 'saklandigi_alan',
                    value: ''
                  }
                });
                return;
              }
              
              // İsim listesini hazırla
              const selectedNames = selectedKeys.map(key => {
                const item = varlikOptions.find(v => v.id.toString() === key);
                // Eğer item bulunamazsa key'in kendisini kullan (muhtemelen bir isimdir)
                return item ? item.varlik_ismi : key;
              }).filter(name => name && name.trim() !== ''); // Boş değerleri filtrele
              
              // İsimleri virgülle ayırarak kaydet
              if (selectedNames.length > 0) {
                handleChange({
                  target: {
                    name: 'saklandigi_alan',
                    value: selectedNames.join(', ')
                  }
                });
                
                console.log("saklandigi_alan değeri güncellendi:", selectedNames.join(', '));
              }
            }}
            popoverProps={{
              classNames: { 
                content: "max-h-[300px]"
              }
            }}
          >
            {varlikOptions.map((varlik) => (
              <SelectItem key={varlik.id.toString()}>
                {varlik.varlik_ismi}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      
      <div>
        <FormLabel 
          number="10"
          title={t('form.tedarikci_dahil')}
          description={t('form.tedarikci_dahil_desc')}
        />
        <div className="ml-12">
          <Select
            placeholder="Tedarikçi seçiniz"
            selectionMode="multiple"
            variant="flat"
            color="secondary"
            className="text-base w-full"
            isLoading={tedarikciLoading}
            defaultSelectedKeys={formData.dahil_oluyormu ? new Set(formData.dahil_oluyormu.split(',').map(name => {
              // Önce trimle
              name = name.trim();
              if (!name) return null; // Boş değerleri atla
              
              // Eğer sayısal bir değerse, doğrudan ID olarak kullan
              if (/^\d+$/.test(name)) {
                return name;
              }
              
              // İsime göre ara
              const item = tedarikciOptions.find(t => 
                t.tedarikci_ismi.toLowerCase().trim() === name.toLowerCase() || 
                t.tedarikci_ismi.toLowerCase().includes(name.toLowerCase())
              );
              return item ? item.id.toString() : name;
            }).filter(Boolean)) : new Set()}
            onSelectionChange={keys => {
              console.log("Tedarikçi seçimi değişti:", keys);
              
              // Set nesnesini diziye çevir
              const selectedKeys = Array.from(keys);
              
              // Eğer hiç seçili öğe yoksa, boş string döndür
              if (selectedKeys.length === 0) {
                handleChange({
                  target: {
                    name: 'dahil_oluyormu',
                    value: ''
                  }
                });
                return;
              }
              
              // İsim listesini hazırla
              const selectedNames = selectedKeys.map(key => {
                const item = tedarikciOptions.find(t => t.id.toString() === key);
                // Eğer item bulunamazsa key'in kendisini kullan (muhtemelen bir isimdir)
                return item ? item.tedarikci_ismi : key;
              }).filter(name => name && name.trim() !== ''); // Boş değerleri filtrele
              
              // İsimleri virgülle ayırarak kaydet
              if (selectedNames.length > 0) {
                handleChange({
                  target: {
                    name: 'dahil_oluyormu',
                    value: selectedNames.join(', ')
                  }
                });
                
                console.log("dahil_oluyormu değeri güncellendi:", selectedNames.join(', '));
              }
            }}
            popoverProps={{
              classNames: { 
                content: "max-h-[300px]"
              }
            }}
          >
            {tedarikciOptions.map((tedarikci) => (
              <SelectItem key={tedarikci.id.toString()}>
                {tedarikci.tedarikci_ismi}
              </SelectItem>
            ))}
          </Select>
          
          <div className="mt-4">
            <Textarea
              name="tedarikci_dahil_oluyormu_yaziniz"
              value={formData.tedarikci_dahil_oluyormu_yaziniz || ''}
              onChange={handleChange}
              placeholder="Tedarikçinin rolünü açıklayınız"
              variant="flat"
              color="secondary"
              className="text-base w-full rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateKartDetayları;