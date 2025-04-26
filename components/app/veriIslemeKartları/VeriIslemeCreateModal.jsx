import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Tabs, Tab } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { FiX } from 'react-icons/fi';
import { FaSave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addVeriIslemeFaaliyeti, clearAddStatus } from '@/store/slices/veriIslemeSlice';
import { getCompanyIds } from '@/store/slices/userInfoSlice';
import CreateKartDetaylari from './CreateKartDetaylari';
import toast from 'react-hot-toast';

const VeriIslemeCreateModal = ({ isOpen, onClose }) => {
  const t = useTranslations('app.veriIsleme');
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('kart-detaylari');
  
  // Form için başlangıç değerlerini tanımlayalım
  const initialFormState = {
    company_id: '',
    surec_ismi: '',
    faaliyet_amaci: '',
    faaliyet_amaci_yaziniz: '',
    faaliyet_aciklamasi: '',
    department_id: '',
    islenen_kisisel_veriler: {},
    kime_ait_veri_temini: '',
    kime_ait_veri_temini_yaziniz: '',
    ilgili_kisi: '',
    kvk_kimden_nasil: '',
    kvk_kimden_nasil_yaziniz: '',
    kimden_nasil_temin: '',
    kimden_nasil_temin_yaziniz: '',
    otomatik_veri_isleme_faaliyeti: '',
    otomatik_veri_isleme_faaliyeti_yaziniz: '',
    dosya_ismi: '',
    saklandigi_alan: '',
    dahil_oluyormu: '',
    tedarikci_dahil_oluyormu_yaziniz: '',
    guncelleyen: ''
  };
  
  // Form alanları CreateKartDetaylari.jsx'deki alanlara göre düzenlendi
  const [formData, setFormData] = useState(initialFormState);

  const { saving, saveSuccess, saveError } = useSelector(state => state.tedarikciList);
  const { loading } = useSelector(state => state.veriIsleme);
  const userInfo = useSelector(state => state.userInfo.data);
  const { varliklar, filteredVarliklar } = useSelector(state => state.varlikList);
  const { tedarikciler, filteredTedarikciler } = useSelector(state => state.tedarikciList);
  
  // Varlık ve tedarikçi listelerini alıyoruz
  const varlikOptions = filteredVarliklar.length > 0 ? filteredVarliklar : varliklar;
  const tedarikciOptions = filteredTedarikciler.length > 0 ? filteredTedarikciler : tedarikciler;
  
  // Kullanıcının şirketini otomatik ayarla
  useEffect(() => {
    if (userInfo) {
      const companyIds = getCompanyIds(userInfo);
      if (companyIds.length > 0) {
        setFormData(prev => ({
          ...prev,
          company_id: companyIds[0],
          guncelleyen: userInfo.fullname || userInfo.name || userInfo.email || ''
        }));
      }
    }
  }, [userInfo]);

  // Component unmount olduğunda state'i temizle
  useEffect(() => {
    return () => {
      dispatch(clearAddStatus());
    };
  }, [dispatch]);
  
  // Modal açıldığında formu sıfırla
  useEffect(() => {
    if (isOpen) {
      // Modal açıldığında formu başlangıç değerlerine döndür
      // Ancak company_id'yi korumak için önce başlangıç değerini ayarla
      const resetForm = {...initialFormState};
      
      // Eğer kullanıcı bilgisi varsa, company_id'yi koruyalım
      if (userInfo) {
        const companyIds = getCompanyIds(userInfo);
        if (companyIds.length > 0) {
          resetForm.company_id = companyIds[0];
          resetForm.guncelleyen = userInfo.fullname || userInfo.name || userInfo.email || '';
        }
      }
      
      setFormData(resetForm);
      setSelected('kart-detaylari');
    }
  }, [isOpen, userInfo]);
  
  // Modal kapatıldığında formu temizle
  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Form doğrulaması
    if (!formData.surec_ismi || !formData.faaliyet_amaci || !formData.faaliyet_aciklamasi) {
      toast.error(t('form.requiredFields', { default: 'Lütfen zorunlu alanları doldurunuz.' }));
      return;
    }
    
    // Eğer faaliyet amacı "Diğer" seçildi ve yazı girilmediyse uyarı ver
    if (formData.faaliyet_amaci === "Diğer" && !formData.faaliyet_amaci_yaziniz) {
      toast.error(t('form.otherPurposeRequired', { default: 'Lütfen faaliyet amacını yazınız.' }));
      return;
    }
    
    // Tam olarak istenen formatta veriyi gönder
    const formPayload = {
      company_id: formData.company_id,
      surec_ismi: formData.surec_ismi,
      faaliyet_amaci: formData.faaliyet_amaci,
      faaliyet_amaci_yaziniz: formData.faaliyet_amaci_yaziniz,
      faaliyet_aciklamasi: formData.faaliyet_aciklamasi,
      department_id: formData.department_id,
      // Kişisel veriler için doğrudan string değeri kullan (zaten formatlanmış string)
      islenen_kisisel_veriler: formData.islenen_kisisel_veriler,
      kime_ait_veri_temini: formData.kime_ait_veri_temini,
      kime_ait_veri_temini_yaziniz: formData.kime_ait_veri_temini_yaziniz,
      ilgili_kisi: formData.ilgili_kisi,
      kvk_kimden_nasil: formData.kvk_kimden_nasil,
      kvk_kimden_nasil_yaziniz: formData.kvk_kimden_nasil_yaziniz,
      kimden_nasil_temin: formData.kimden_nasil_temin,
      kimden_nasil_temin_yaziniz: formData.kimden_nasil_temin_yaziniz,
      otomatik_veri_isleme_faaliyeti: formData.otomatik_veri_isleme_faaliyeti,
      otomatik_veri_isleme_faaliyeti_yaziniz: formData.otomatik_veri_isleme_faaliyeti_yaziniz,
      dosya_ismi: formData.dosya_ismi,
      saklandigi_alan: formData.saklandigi_alan,
      dahil_oluyormu: formData.dahil_oluyormu,
      tedarikci_dahil_oluyormu_yaziniz: formData.tedarikci_dahil_oluyormu_yaziniz,
      guncelleyen: formData.guncelleyen
    };
    
    // FormData nesnesini konsola yazdır
    console.log('Form verisi:', formPayload);
    
    // Toast promise ile veri ekleme işlemini göster
    toast.promise(
      dispatch(addVeriIslemeFaaliyeti(formPayload)).unwrap()
        .then(() => {
          // Başarılı olduğunda formu temizle ve modalı kapat
          setFormData(initialFormState);
          handleClose();
        }),
      {
        loading: t('toast.adding'),
        success: t('toast.addSuccess'),
        error: () => t('toast.addError')
      }
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="full"
      hideCloseButton
      scrollBehavior="inside"
      classNames={{
        wrapper: "z-50",
        base: "bg-white rounded-lg shadow-lg max-w-7xl mx-auto",
        body: "overflow-y-auto"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center pb-4 sticky top-0 bg-white z-10">
          <Button 
            isIconOnly 
            variant="light" 
            radius="full" 
            className="min-w-9 w-9 h-9"
            onClick={handleClose}
          >
            <FiX size={20} />
          </Button>
          <Button 
            isIconOnly 
            color="primary" 
            radius="full" 
            className="min-w-10 w-10 h-10"
            onClick={handleSubmit}
            isLoading={loading}
          >
            <FaSave size={16} />
          </Button>
        </ModalHeader>
        <ModalBody className="py-6 px-8 pb-12">
          <Tabs 
            selectedKey={selected} 
            onSelectionChange={setSelected}
            variant="underlined"
            color="primary"
            classNames={{
              tabList: "gap-8 w-full relative rounded-none p-0 sticky top-0 bg-white z-10",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "text-base font-medium group-data-[selected=true]:text-primary"
            }}
          >
            <Tab key="kart-detaylari" title={<span className="text-lg">Kart Detayları</span>}>
              <CreateKartDetaylari 
                formData={formData}
                handleChange={handleChange}
              />
            </Tab>
           
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VeriIslemeCreateModal;