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
  Textarea,
} from "@heroui/react";
import { FiUpload, FiX } from "react-icons/fi";
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { addAksiyon, fetchAksiyonlar } from '@/store/slices/aksiyonlarSlice';
import toast from 'react-hot-toast';

const AksiyonEkleModal = ({ isOpen, onClose }) => {
  const t = useTranslations('app.aksiyonlar');
  const dispatch = useDispatch();
  const { addLoading, addSuccess, addError, departments } = useSelector((state) => state.aksiyonlar);
  const { data: userInfo } = useSelector((state) => state.userInfo);

  // Aktif şirket ID'sini al
  const activeCompanyId = userInfo?.companies?.find(company => company.company_active)?.company_id;

  // Şirkete ait departmanları filtrele
  const companyDepartments = departments?.filter(
    (department) => Number(department.company_id) === Number(activeCompanyId)
  ) || [];

  // Form state
  const [newAksiyon, setNewAksiyon] = useState({
    aksiyon_ismi: '',
    aksiyon_aciklamasi: '',
    dokuman_linki: null,
    durum: 'beklemede',
    department_id: '',
    sorumlu_id: '',
    bitis_tarihi: '',
    oncelik: 'normal',
    company_id: activeCompanyId,
  });
  
  // Dosya seçildiğinde
  const [selectedFileName, setSelectedFileName] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAksiyon((prev) => ({
        ...prev,
        dokuman_linki: file,
      }));
      setSelectedFileName(file.name);
    }
  };
  
  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAksiyon({ ...newAksiyon, [name]: value });
  };
  
  // Risk seviyeleri
  const riskSeviyeleri = [
    "Yüksek Risk",
    "Orta Risk",
    "Düşük Risk"
  ];

  // Formu sıfırla
  const resetForm = () => {
    setNewAksiyon({
      aksiyon_ismi: '',
      aksiyon_aciklamasi: '',
      dokuman_linki: null,
      durum: 'beklemede',
      department_id: '',
      sorumlu_id: '',
      bitis_tarihi: '',
      oncelik: 'normal',
      company_id: activeCompanyId,
    });
    setSelectedFileName('');
  };
  
  // Formu gönder
  const handleSubmit = () => {
    // Form doğrulama
    if (!newAksiyon.aksiyon_ismi || !newAksiyon.risk || !newAksiyon.department_id) {
      toast.error(t('addModal.validation.requiredFields'));
      return;
    }

    // Gönderilecek veriyi hazırla
    const submissionData = {
      ...newAksiyon,
      company_id: activeCompanyId
    };

    // Eğer dosya varsa dokuman_linki olarak ekle
    if (newAksiyon.dokuman_linki) {
      submissionData.dokuman_linki = newAksiyon.dokuman_linki;
    }

    // Aksiyon ekleme isteği gönder
    toast.promise(
      dispatch(addAksiyon(submissionData)).unwrap()
        .then(() => {
          resetForm();
          onClose();
        }),
      {
        loading: t('toast.addLoading'),
        success: t('toast.addSuccess'),
        error: (err) => t('toast.addError', { error: err })
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
          <h3 className="text-xl font-semibold text-gray-800">{t('addModal.title')}</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Aksiyon İsmi */}
            <div>
              <Input
                name="aksiyon_ismi"
                value={newAksiyon.aksiyon_ismi}
                onChange={handleChange}
                label={t('addModal.actionName')}
                placeholder={t('addModal.actionNamePlaceholder')}
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
                value={newAksiyon.aksiyon_aciklamasi}
                onChange={handleChange}
                label={t('addModal.actionDescription')}
                placeholder={t('addModal.actionDescriptionPlaceholder')}
                variant="flat"
                size="sm"
                radius="lg"
                fullWidth
              />
            </div>
            
            {/* Risk Seviyesi */}
            <div>
              <Select
                label={t('addModal.risk')}
                placeholder={t('addModal.riskPlaceholder')}
                selectedKeys={newAksiyon.risk ? [newAksiyon.risk] : []}
                variant="flat"
                size="sm"
                radius="lg"
                className="w-full"
                onChange={(keys) => {
                  setNewAksiyon({ ...newAksiyon, risk: keys.target.value });
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
                label={t('addModal.department')}
                placeholder={t('addModal.departmentPlaceholder')}
                selectedKeys={newAksiyon.department_id ? [newAksiyon.department_id] : []}
                variant="flat"
                size="sm"
                radius="lg"
                className="w-full"
                onChange={(keys) => {
                  setNewAksiyon({ ...newAksiyon, department_id: keys.target.value });
                }}
              >
                {companyDepartments.map((department) => (
                  <SelectItem key={department.department_id} value={department.department_id}>
                    {department.department_name}
                  </SelectItem>
                ))}
              </Select>
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
                        setNewAksiyon({...newAksiyon, dokuman_linki: null});
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

export default AksiyonEkleModal;