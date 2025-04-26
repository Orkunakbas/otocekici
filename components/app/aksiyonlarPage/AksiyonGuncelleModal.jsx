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
  Textarea,
} from "@heroui/react";
import { FiUpload, FiX } from "react-icons/fi";
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { updateAksiyon, fetchSingleAksiyon, fetchAksiyonlar } from '@/store/slices/aksiyonlarSlice';
import toast from 'react-hot-toast';

const AksiyonGuncelleModal = ({ isOpen, onClose, aksiyonId }) => {
  const t = useTranslations('app.aksiyonlar');
  const dispatch = useDispatch();
  
  const { updateLoading, selectedAksiyon, departments } = useSelector((state) => state.aksiyonlar);
  const { data: userInfo } = useSelector((state) => state.userInfo);

  // Aktif şirket ID'sini al
  const activeCompanyId = userInfo?.companies?.find(company => company.company_active)?.company_id;

  // Şirkete ait departmanları filtrele
  const companyDepartments = departments?.filter(
    (department) => Number(department.company_id) === Number(activeCompanyId)
  ) || [];

  // Form state
  const [formData, setFormData] = useState({
    aksiyon_ismi: '',
    aksiyon_aciklamasi: '',
    dokuman_linki: null,
    risk: '',
    department_id: '',
  });
  
  // Dosya seçildiğinde
  const [selectedFileName, setSelectedFileName] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        dokuman_linki: file,
      }));
      setSelectedFileName(file.name);
    }
  };
  
  // Dosyayı sil
  const handleFileRemove = () => {
    setSelectedFileName('');
    setFormData(prev => ({
      ...prev,
      dokuman_linki: null // Dosyayı null olarak işaretle
    }));
  };
  
  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Risk seviyeleri
  const riskSeviyeleri = [
    "Yüksek Risk",
    "Orta Risk",
    "Düşük Risk"
  ];

  // Aksiyon verilerini yükle
  useEffect(() => {
    if (isOpen && aksiyonId) {
      dispatch(fetchSingleAksiyon(aksiyonId));
    }
  }, [dispatch, aksiyonId, isOpen]);

  // Seçili aksiyon değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (selectedAksiyon) {
      setFormData({
        id: selectedAksiyon.id,
        aksiyon_ismi: selectedAksiyon.aksiyon_ismi || '',
        aksiyon_aciklamasi: selectedAksiyon.aksiyon_aciklamasi || '',
        risk: selectedAksiyon.risk || '',
        department_id: selectedAksiyon.department_id || '',
        dokuman_linki: null
      });
      setSelectedFileName(selectedAksiyon.dokuman_linki ? selectedAksiyon.dokuman_linki.split('/').pop() : '');
    }
  }, [selectedAksiyon]);
  
  // Formu gönder
  const handleSubmit = () => {
    // Form doğrulama
    if (!formData.aksiyon_ismi || !formData.risk || !formData.department_id) {
      toast.error(t('addModal.validation.requiredFields'));
      return;
    }

    // Aksiyon güncelleme isteği gönder
    toast.promise(
      dispatch(updateAksiyon(formData)).unwrap()
        .then(() => {
          dispatch(fetchAksiyonlar()); // Verileri yenile
          onClose();
        }),
      {
        loading: t('toast.updateLoading'),
        success: t('toast.updateSuccess'),
        error: (err) => t('toast.updateError', { error: err })
      }
    );
  };
  
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
          <div className="space-y-4">
            {/* Aksiyon İsmi */}
            <div>
              <Input
                name="aksiyon_ismi"
                value={formData.aksiyon_ismi}
                onChange={handleChange}
                label={t('updateModal.actionName')}
                placeholder={t('updateModal.actionNamePlaceholder')}
                variant="flat"
                size="sm"
                radius="lg"
                fullWidth
                required
              />
            </div>
            
            {/* Aksiyon Açıklaması */}
            <div>
              <Textarea
                name="aksiyon_aciklamasi"
                value={formData.aksiyon_aciklamasi}
                onChange={handleChange}
                label={t('updateModal.actionDescription')}
                placeholder={t('updateModal.actionDescriptionPlaceholder')}
                variant="flat"
                size="sm"
                radius="lg"
                fullWidth
              />
            </div>
            
            {/* Risk Seviyesi */}
            <div>
              <Select
                label={t('updateModal.risk')}
                placeholder={t('updateModal.riskPlaceholder')}
                selectedKeys={formData.risk ? [formData.risk] : []}
                variant="flat"
                size="sm"
                radius="lg"
                className="w-full"
                onChange={(keys) => {
                  setFormData({ ...formData, risk: keys.target.value });
                }}
              >
                {riskSeviyeleri.map((risk) => (
                  <SelectItem key={risk} value={risk}>
                    {risk}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Departman */}
            <div>
              <Select
                label={t('updateModal.department')}
                placeholder={t('updateModal.departmentPlaceholder')}
                selectedKeys={formData.department_id ? [String(formData.department_id)] : []}
                variant="flat"
                size="sm"
                radius="lg"
                className="w-full"
                onChange={(keys) => {
                  setFormData({ ...formData, department_id: keys.target.value });
                }}
              >
                {companyDepartments.map((department) => (
                  <SelectItem key={String(department.department_id)} value={String(department.department_id)}>
                    {department.department_name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            {/* Dosya Seçme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateModal.addDocumentLabel')}
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
                  {t('updateModal.selectFile')}
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
                      onClick={handleFileRemove}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>
              {!selectedFileName && (
                <p className="text-xs text-gray-500 mt-1">
                  {t('updateModal.supportedFileTypes')}
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
            {t('updateModal.cancel')}
          </span>
          <Button 
            color="primary" 
            size="md"
            radius='lg'
            onPress={handleSubmit}
            isLoading={updateLoading}
            className="text-white"
          >
            {t('updateModal.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AksiyonGuncelleModal;


