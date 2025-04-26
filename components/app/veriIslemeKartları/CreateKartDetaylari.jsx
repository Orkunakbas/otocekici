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

const CreateKartDetaylari = ({ formData, handleChange }) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const t = useTranslations('app.veriIslemeKartlari');
  
  const [faaliyetAmaciOptions, setFaaliyetAmaciOptions] = useState([]);
  const [ilgiliKisiOptions, setIlgiliKisiOptions] = useState([]);
  const [veriTeminiOptions, setVeriTeminiOptions] = useState({kimden: [], yöntem: []});
  const [otherSelected, setOtherSelected] = useState(false);
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
    
    // Eğer kullanıcı temsilci ise otomatik departman id'yi ayarla
    if (isRepresentative && userDepartmentId && !formData.department_id) {
      handleChange({
        target: {
          name: 'department_id',
          value: userDepartmentId
        }
      });
    }
  }, [dispatch, isRepresentative, userDepartmentId, formData.department_id, varliklar.length, varlikLoading, tedarikciler.length, tedarikciLoading]);
  
  useEffect(() => {
    if (userInfo) {
      const companyIds = getCompanyIds(userInfo);
      if (companyIds.length > 0) {
        // Form'da boş değer varsa şirketi ata
        if (!formData.company_id) {
          handleChange({
            target: {
              name: 'company_id',
              value: companyIds[0]
            }
          });
        }
        
        // Varlık ve tedarikçileri filtrele
        if (varliklar.length > 0) {
          dispatch(filterByCompanyId(companyIds[0]));
        }
        if (tedarikciler.length > 0) {
          dispatch(filterTedarikciByCompanyId(companyIds[0]));
        }
      }
    }
  }, [dispatch, userInfo, varliklar, tedarikciler, formData.company_id]);
  
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
    const isOtherSelected = formData.faaliyet_amaci === "Diğer";
    setOtherSelected(isOtherSelected);
    
    // Eğer "Diğer" seçili değilse yazınız alanını sıfırla
    if (!isOtherSelected && formData.faaliyet_amaci_yaziniz) {
      handleChange({ 
        target: { 
          name: 'faaliyet_amaci_yaziniz', 
          value: '' 
        } 
      });
    }
  }, [formData.faaliyet_amaci]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - ilgili kişi
    const selectedKisiArray = formData.ilgili_kisi || [];
    const isOtherKisiSelected = selectedKisiArray.includes("Diğer");
    setOtherKisiSelected(isOtherKisiSelected);
    
    // Eğer "Diğer" seçili değilse yazınız alanını sıfırla
    if (!isOtherKisiSelected && formData.ilgili_kisi_yaziniz) {
      handleChange({ 
        target: { 
          name: 'ilgili_kisi_yaziniz', 
          value: '' 
        } 
      });
    }
  }, [formData.ilgili_kisi]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - veri kimden
    const selectedKimdenArray = formData.veri_kimden || [];
    const isOtherKimdenSelected = selectedKimdenArray.includes("Diğer");
    setOtherKimdenSelected(isOtherKimdenSelected);
    
    // Eğer "Diğer" seçili değilse yazınız alanını sıfırla
    if (!isOtherKimdenSelected && formData.veri_kimden_yaziniz) {
      handleChange({ 
        target: { 
          name: 'veri_kimden_yaziniz', 
          value: '' 
        } 
      });
    }
  }, [formData.veri_kimden]);
  
  useEffect(() => {
    // "Diğer" seçilip seçilmediğini kontrol et - veri yöntemi
    const selectedYontemArray = formData.veri_yontem || [];
    const isOtherYontemSelected = selectedYontemArray.includes("Diğer");
    setOtherYontemSelected(isOtherYontemSelected);
    
    // Eğer "Diğer" seçili değilse yazınız alanını sıfırla
    if (!isOtherYontemSelected && formData.veri_yontem_yaziniz) {
      handleChange({ 
        target: { 
          name: 'veri_yontem_yaziniz', 
          value: '' 
        } 
      });
    }
  }, [formData.veri_yontem]);
  
  const handleButtonOptionClick = (name, value) => {
    handleChange({ target: { name, value } });
  };
  
  const handleMultiSelectButtonClick = (name, value) => {
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
    handleChange(e);
  };

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
              value={formData.department_id || ''}
              onChange={handleChange}
              placeholder={t('form.departman_seciniz')}
              variant="flat"
              color="secondary"
              className="text-base w-full"
              isLoading={departmentsLoading}
              aria-label={t('form.ilgili_departman')}
            >
              {departments.map((department) => (
                <SelectItem key={department.department_id} value={department.department_id}>
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
      
      <div style={{ display: "none" }}>
        <FormLabel 
          number="6"
          title={t('form.ilgili_kisi')}
          description={t('form.ilgili_kisi_desc')}
        />
        <div className="ml-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {normalKisiOptions.map((option) => (
              <Button
                key={`ilgili-kisi-${option.value}`}
                color="primary"
                radius='sm'
                variant={(formData.ilgili_kisi || []).includes(option.value) ? "shadow" : "light"}
                onClick={() => handleMultiSelectButtonClick('ilgili_kisi', option.value)}
                className={`py-3 w-full border border-gray-700 ${(formData.ilgili_kisi || []).includes(option.value) ? 'text-white' : 'text-black'}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {otherKisiOption && (
              <Button
                color="primary"
                radius='sm'
                variant={(formData.ilgili_kisi || []).includes("Diğer") ? "shadow" : "light"}
                onClick={() => handleMultiSelectButtonClick('ilgili_kisi', "Diğer")}
                className={`py-3 w-full border border-gray-700 ${(formData.ilgili_kisi || []).includes("Diğer") ? 'text-white' : 'text-black'}`}
              >
                {otherKisiOption.label}
              </Button>
            )}
            
            <div className="col-span-1 md:col-span-3">
              <Input
                name="ilgili_kisi_yaziniz"
                value={formData.ilgili_kisi_yaziniz || ''}
                onChange={handleChange}
                radius='sm'
                placeholder={t('form.yaziniz')}
                variant="flat"
                color="secondary"
                className={`text-base w-full border border-gray-700 rounded-md ${!otherKisiSelected ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
                disabled={!otherKisiSelected}
              />
            </div>
          </div>
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
          
          {(formData.kvk_kimden_nasil || '').includes('Diğer') && (
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
                {veriTeminiOptions.yöntem.find(option => option.value === "Diğer").label}
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
                className={`text-base w-full border border-gray-700 rounded-md ${!(formData.kimden_nasil_temin || '').includes("Diğer") ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
                disabled={!(formData.kimden_nasil_temin || '').includes("Diğer")}
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
              const item = varlikOptions.find(v => v.varlik_ismi === name);
              return item ? item.id.toString() : name;
            })) : new Set()}
            onSelectionChange={keys => {
              // Set nesnesini diziye çevir
              const selectedKeys = Array.from(keys);
              
              // İsim listesini hazırla
              const selectedNames = selectedKeys.map(key => {
                const item = varlikOptions.find(v => v.id.toString() === key);
                return item ? item.varlik_ismi : key;
              });
              
              // İsimleri virgülle ayırarak kaydet
              handleChange({
                target: {
                  name: 'saklandigi_alan',
                  value: selectedNames.join(', ')
                }
              });
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
              const item = tedarikciOptions.find(t => t.tedarikci_ismi === name);
              return item ? item.id.toString() : name;
            })) : new Set()}
            onSelectionChange={keys => {
              // Set nesnesini diziye çevir
              const selectedKeys = Array.from(keys);
              
              // İsim listesini hazırla
              const selectedNames = selectedKeys.map(key => {
                const item = tedarikciOptions.find(t => t.id.toString() === key);
                return item ? item.tedarikci_ismi : key;
              });
              
              // İsimleri virgülle ayırarak kaydet
              handleChange({
                target: {
                  name: 'dahil_oluyormu',
                  value: selectedNames.join(', ')
                }
              });
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

export default CreateKartDetaylari;