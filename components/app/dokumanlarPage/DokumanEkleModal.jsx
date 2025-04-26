import React, { useState } from 'react';
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
} from "@heroui/react";
import { FiUpload, FiX } from "react-icons/fi";
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { addDokuman } from '@/store/slices/dokumanlarSlice';
import toast from 'react-hot-toast';

const DokumanEkleModal = ({ isOpen, onClose }) => {
  const t = useTranslations('app.dokumanlar');
  const dispatch = useDispatch();
  
  const { addLoading, addSuccess, addError } = useSelector((state) => state.dokumanlar);
  const userInfo = useSelector((state) => state.userInfo.data);
  
  // Form state
  const [formData, setFormData] = useState({
    dokuman_ismi: '',
    dokuman_tur: '',
    lastUpdated: '',
    file: null
  });
  
  // Dosya seçildiğinde
  const [selectedFileName, setSelectedFileName] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setSelectedFileName(file.name);
    }
  };
  
  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      // YYYY-MM-DD formatına dönüştür
      const formattedDate = new Date(date).toISOString().split('T')[0];
      setFormData({ ...formData, lastUpdated: formattedDate });
    }
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      dokuman_ismi: '',
      dokuman_tur: '',
      lastUpdated: '',
      file: null
    });
    setSelectedFileName('');
  };
  
  // Formu gönder
  const handleSubmit = () => {
    // Form doğrulama
    if (!formData.dokuman_ismi || !formData.dokuman_tur) {
      toast.error(t('addModal.validation.requiredFields'));
      return;
    }

    if (!formData.file) {
      toast.error(t('addModal.validation.requiredFile'));
      return;
    }
    
    // Debug için form verilerini konsola yazdır
    console.log("Gönderilecek form verileri:", {
      dokuman_ismi: formData.dokuman_ismi,
      dokuman_tur: formData.dokuman_tur,
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0],
      file: formData.file ? formData.file.name : null
    });
    
    // Bugünün tarihini kullan eğer seçilmediyse
    const submissionData = { 
      ...formData,
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0]
    };
    
    // Doküman ekleme isteği gönder
    toast.promise(
      dispatch(addDokuman(submissionData)).unwrap(),
      {
        loading: t('toast.addLoading'),
        success: (data) => {
          resetForm();
          onClose();
          return t('toast.addSuccess');
        },
        error: (err) => t('toast.addError', { error: err })
      }
    );
  };
  
  // Kullanıcı danışman değilse modalı gösterme
  const isDanışman = userInfo?.role === 'danışman';
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-gray-800">{t('addModal.title')}</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Döküman İsmi */}
            <div>
              <Input
                name="dokuman_ismi"
                value={formData.dokuman_ismi}
                onChange={handleChange}
                label={t('addModal.documentName')}
                placeholder={t('addModal.documentNamePlaceholder')}
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
                label={t('addModal.documentType')}
                placeholder={t('addModal.documentTypePlaceholder')}
                defaultSelectedKeys={[]}
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
              <DatePicker
                label={t('addModal.lastUpdateDate')}
                placeholder={t('addModal.lastUpdatePlaceholder')}
                variant="flat"
                size="sm"
                radius="lg"
                className="w-full"
                description={t('addModal.lastUpdateDescription')}
                onChange={handleDateChange}
                defaultValue={formData.lastUpdated || undefined}
              />
            </div>
            
            {/* Dosya Seçme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('addModal.addDocumentLabel')}
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
                  {t('addModal.selectFile')}
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
              {!selectedFileName && (
                <p className="text-xs text-gray-500 mt-1">
                  {t('addModal.supportedFileTypes')}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end items-center gap-4">
          <span 
            className="text-danger cursor-pointer font-medium hover:underline" 
            onClick={onClose}
          >
            {t('addModal.cancel')}
          </span>
          <Button 
            color="primary" 
            size="md"
            radius='lg'
            onPress={handleSubmit}
            isLoading={addLoading}
            className="text-white"
          >
            {t('addModal.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DokumanEkleModal;