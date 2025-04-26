import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Spinner,
  Checkbox
} from "@heroui/react";
import { FiUpload, FiX, FiFileText } from "react-icons/fi";
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleDokuman, updateDokuman, clearUpdateStatus, clearCurrentDokuman } from '@/store/slices/dokumanlarSlice';
import toast from 'react-hot-toast';

const DokumanGuncelleModal = ({ isOpen, onClose, dokumanId }) => {
  const t = useTranslations('app.dokumanlar');
  const dispatch = useDispatch();
  
  const { 
    currentDokuman, 
    currentDokumanLoading, 
    currentDokumanError,
    updateLoading, 
    updateSuccess, 
    updateError 
  } = useSelector((state) => state.dokumanlar);
  
  const userInfo = useSelector((state) => state.userInfo.data);
  
  // Form state
  const [formData, setFormData] = useState({
    dokuman_ismi: '',
    dokuman_tur: '',
    lastUpdated: '',
    file: null
  });
  
  // Yeni dosya seçildiğinde
  const [selectedFileName, setSelectedFileName] = useState('');
  const [useExistingFile, setUseExistingFile] = useState(true);
  
  // Dökümanı yükle
  useEffect(() => {
    if (isOpen && dokumanId) {
      dispatch(fetchSingleDokuman(dokumanId));
    }
    
    return () => {
      // Modal kapandığında temizle
      if (!isOpen) {
        dispatch(clearCurrentDokuman());
      }
    };
  }, [isOpen, dokumanId, dispatch]);
  
  // Mevcut döküman verilerini forma doldur
  useEffect(() => {
    if (currentDokuman) {
      // Tarih formata uygun şekilde ayarlanıyor
      let formattedDate = currentDokuman.lastupdated || '';
      
      // Tarihi YYYY-MM-DD formatında saklayacağız
      if (formattedDate && typeof formattedDate === 'string') {
        // Mevcuda formatı bozulmadan olduğu gibi kullan
        formattedDate = formattedDate.split('T')[0]; // "2025-03-01T00:00:00" formatından T kısmını temizle
      }
      
      setFormData({
        dokuman_ismi: currentDokuman.dokuman_ismi || '',
        dokuman_tur: currentDokuman.dokuman_tur || '',
        lastUpdated: formattedDate,
        file: null
      });
      
      console.log("Tarih ayarlandı:", formattedDate);
    }
  }, [currentDokuman]);
  
  // Güncelleme işlemi sonrası
  useEffect(() => {
    if (updateSuccess) {
      onClose();
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, dispatch, onClose]);
  
  // Dosya seçildiğinde
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setSelectedFileName(file.name);
      setUseExistingFile(false);
    }
  };
  
  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Mevcut dosyayı kullan/kullanma
  const toggleUseExistingFile = () => {
    setUseExistingFile(!useExistingFile);
    if (useExistingFile) {
      // Eğer mevcut dosyayı kullanmıyorsak, seçilen dosyayı temizle
      setFormData({ ...formData, file: null });
      setSelectedFileName('');
    }
  };
  
  // Döküman türleri
  const dokumanTurleri = [
    "Aydınlatma Metni",
    "Açık Rıza Metni",
    "Taahhütname",
    "Politika",
    "Prosedür",
    "Form",
    "Diğer"
  ];

  // Tarih değişikliğini işle
  const handleDateChange = (date) => {
    if (date) {
      // String olarak tarihi alıyoruz, HeroUI DatePicker ISO formatında döndürüyor olabilir
      let dateValue = null;
      
      if (typeof date === 'string') {
        // String ise direkt kullan veya format
        dateValue = date.split('T')[0]; // "2025-03-01T00:00:00" formatından T kısmını temizle
      } else if (date instanceof Date) {
        // Date objesi ise YYYY-MM-DD formatına dönüştür
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateValue = `${year}-${month}-${day}`;
      }
      
      console.log("Seçilen tarih:", dateValue);
      setFormData({ ...formData, lastUpdated: dateValue });
    }
  };
  
  // Formu gönder
  const handleSubmit = () => {
    // Form doğrulama
    if (!formData.dokuman_ismi || !formData.dokuman_tur) {
      toast.error(t('updateModal.validation.requiredFields'));
      return;
    }
    
    // Debug için form verilerini konsola yazdır
    console.log("Güncellenecek form verileri:", {
      dokuman_ismi: formData.dokuman_ismi,
      dokuman_tur: formData.dokuman_tur,
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0],
      file: formData.file ? formData.file.name : 'Mevcut dosya kullanılacak'
    });
    
    // Bugünün tarihini kullan eğer seçilmediyse
    const submissionData = { 
      ...formData,
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0]
    };
    
    // Eğer dosya değiştirilmediyse, file alanını null olarak ayarla
    if (useExistingFile) {
      submissionData.file = null;
    }
    
    // Doküman güncelleme isteği gönder
    toast.promise(
      dispatch(updateDokuman({ id: dokumanId, formData: submissionData })).unwrap(),
      {
        loading: t('toast.updating', { name: formData.dokuman_ismi }),
        success: (data) => {
          return t('toast.updateSuccess', { name: formData.dokuman_ismi });
        },
        error: (err) => t('toast.updateError', { name: formData.dokuman_ismi, error: err })
      }
    );
  };
  
  // Kullanıcı danışman değilse modalı gösterme
  const isDanışman = userInfo?.role === 'danışman';
  
  // Mevcut dosya adını göster
  const currentFileName = currentDokuman?.dokuman_linki ? 
    currentDokuman.dokuman_linki.split('/').pop() : 
    t('updateModal.noFileSelected');
  
  if (currentDokumanError) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        placement="center"
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-gray-800">{t('updateModal.title')}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="p-4 text-center text-red-500">
              <p>{t('updateModal.error')}</p>
              <p className="text-sm text-gray-500 mt-2">{currentDokumanError}</p>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end items-center gap-4">
            <Button 
              color="primary" 
              size="md"
              radius="lg"
              onPress={onClose}
            >
              {t('updateModal.cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-gray-800">{t('updateModal.title')}</h3>
        </ModalHeader>
        <ModalBody>
          {currentDokumanLoading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner size="lg" color="primary" />
              <p className="ml-4">{t('updateModal.loading')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Döküman İsmi */}
              <div>
                <Input
                  name="dokuman_ismi"
                  value={formData.dokuman_ismi}
                  onChange={handleChange}
                  label={t('updateModal.documentName')}
                  placeholder={t('updateModal.documentNamePlaceholder')}
                  variant="flat"
                  size="sm"
                  radius="lg"
                  fullWidth
                  required
                />
              </div>
              
              {/* Döküman Türü */}
              <div>
                <Select
                  label={t('updateModal.documentType')}
                  placeholder={t('updateModal.documentTypePlaceholder')}
                  selectedKeys={formData.dokuman_tur ? [formData.dokuman_tur] : []}
                  variant="flat"
                  size="sm"
                  radius="lg"
                  className="w-full"
                  onChange={(e) => {
                    console.log("Select change:", e.target.value);
                    setFormData({ ...formData, dokuman_tur: e.target.value });
                  }}
                >
                  {dokumanTurleri.map((tur) => (
                    <SelectItem key={tur} value={tur}>
                      {tur}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              {/* Son Güncelleme Tarihi */}
              <div>
                <Input
                  type="date"
                  name="lastUpdated"
                  label={t('updateModal.lastUpdateDate')}
                  placeholder={t('updateModal.lastUpdatePlaceholder')}
                  variant="flat"
                  size="sm"
                  radius="lg"
                  fullWidth
                  value={formData.lastUpdated || ''}
                  onChange={handleDateChange}
                  description={t('updateModal.lastUpdateDescription')}
                />
              </div>
              
              {/* Mevcut Dosya Bilgisi */}
              <div className="border p-3 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('updateModal.currentFile')}
                </label>
                <div className="flex items-center">
                  <FiFileText className="mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentFileName}</span>
                </div>
                <div className="mt-2">
                  <Checkbox
                    isSelected={useExistingFile}
                    onValueChange={toggleUseExistingFile}
                    color="primary"
                    size="sm"
                  >
                    <span className="text-sm text-gray-700">{t('updateModal.keepCurrentFile')}</span>
                  </Checkbox>
                </div>
              </div>
              
              {/* Yeni Dosya Seçme */}
              {!useExistingFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('updateModal.selectNewFile')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      variant="flat"
                      size="sm"
                      startContent={<FiUpload />}
                      className="cursor-pointer"
                    >
                      {t('updateModal.selectNewFile')}
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {selectedFileName && (
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                        <span className="text-sm truncate max-w-[200px]">{selectedFileName}</span>
                        <button 
                          onClick={() => {
                            setSelectedFileName('');
                            setFormData({...formData, file: null});
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('updateModal.supportedFileTypes')}
                  </p>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end items-center gap-4">
          <span 
            className="text-danger cursor-pointer font-medium hover:underline" 
            onClick={onClose}
          >
            {t('updateModal.cancel')}
          </span>
          <Button 
            color="primary" 
            size="md"
            radius="lg"
            onPress={handleSubmit}
            isLoading={updateLoading}
            className="text-white"
            isDisabled={currentDokumanLoading}
          >
            {t('updateModal.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DokumanGuncelleModal;