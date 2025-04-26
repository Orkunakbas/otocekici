import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Spinner, Tabs, Tab } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { FaSave } from 'react-icons/fa';
import { IoIosPricetags } from "react-icons/io";
import { fetchVeriIslemeFaaliyeti, clearCurrentVeriIsleme, deleteVeriIslemeFaaliyeti, updateVeriIslemeFaaliyeti, fetchVeriIslemeFaaliyetleri, clearUpdateStatus } from '@/store/slices/veriIslemeSlice';
import UpdateKartDetayları from './UpdateKartDetayları';
import UpdateEtkiAnalizi from './UpdateEtkiAnalizi';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../global/ConfirmModal';

const VeriIslemeUpdateModal = ({ isOpen, onClose, faaliyetId }) => {
  const t = useTranslations('app.veriIsleme');
  const dispatch = useDispatch();
  const { currentVeriIsleme, detailLoading, detailError, updateLoading, updateSuccess, updateError } = useSelector(state => state.veriIsleme);
  const [selectedTab, setSelectedTab] = useState('kart-detaylari');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // İç state'i güncelle
  useEffect(() => {
    if (isOpen) {
      setInternalIsOpen(true);
    }
  }, [isOpen]);

  // Modal kapanırken yapılacak işlemler
  const handleClose = useCallback(() => {
    setInternalIsOpen(false);
    
    // Modal kapanma animasyonundan sonra parent'a bilgi ver ve state'i temizle
    setTimeout(() => {
      if (onClose) onClose();
      setFormData({});
      setSelectedTab('kart-detaylari');
      
      // CSS temizliği
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }, 150);
  }, [onClose]);

  // Faaliyet detaylarını getir
  useEffect(() => {
    if (internalIsOpen && faaliyetId) {
      dispatch(fetchVeriIslemeFaaliyeti(faaliyetId));
    }
    
    return () => {
      if (!internalIsOpen) {
        dispatch(clearCurrentVeriIsleme());
      }
    };
  }, [dispatch, internalIsOpen, faaliyetId]);

  // currentVeriIsleme geldiğinde formData'yı güncelle
  useEffect(() => {
    if (currentVeriIsleme) {
      setFormData(currentVeriIsleme);
    }
  }, [currentVeriIsleme]);

  // Başarılı update sonrası modalı kapat
  useEffect(() => {
    if (updateSuccess) {
      toast.success(t('toast.updateSuccess'));
      handleClose();
      dispatch(clearUpdateStatus());
      
      // Listeyi güncelle
      setTimeout(() => {
        dispatch(fetchVeriIslemeFaaliyetleri());
      }, 300);
    }
    
    if (updateError) {
      toast.error(t('toast.updateError'));
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch, t, handleClose]);

  // Form değerlerini güncelle
  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Silme modalını aç
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (faaliyetId) {
      toast.promise(
        dispatch(deleteVeriIslemeFaaliyeti(faaliyetId)).unwrap(),
        {
          loading: t('toast.deleting'),
          success: t('toast.deleteSuccess'),
          error: () => t('toast.deleteError')
        }
      );
      setIsDeleteModalOpen(false);
      handleClose();
    }
  };

  // Kaydet butonuna tıklandığında
  const handleSave = () => {
    const updateData = {
      ...formData,
      id: formData.id || faaliyetId
    };

    toast.promise(
      dispatch(updateVeriIslemeFaaliyeti(updateData)).unwrap(),
      {
        loading: t('toast.updating'),
        success: t('toast.updateSuccess'),
        error: () => t('toast.updateError')
      }
    );
  };

  // Modal kapanmasına ilişkin olay yakalama
  const handleCloseByEsc = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // ESC tuşuna basıldığında modalı kapat
  useEffect(() => {
    if (internalIsOpen && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleCloseByEsc);
      
      return () => {
        window.removeEventListener('keydown', handleCloseByEsc);
      };
    }
  }, [internalIsOpen, handleClose]);

  return (
    <>
      {internalIsOpen && (
        <Modal 
          isOpen={internalIsOpen}
          onClose={handleClose}
          size="full"
          hideCloseButton
          scrollBehavior="inside"
          classNames={{
            wrapper: "z-50",
            base: "bg-white rounded-lg shadow-lg max-w-7xl mx-auto",
            body: "overflow-y-auto",
            backdrop: "z-40",
            closeButton: "z-50"
          }}
        >
          <ModalContent>
            <ModalHeader className="flex justify-between items-center pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-2">
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
                  variant="solid"
                  className="h-9 px-3 flex items-center"
                  style={{ backgroundColor: "#22015e", color: "white" }}
                >
                  <IoIosPricetags size={16} /> ID:{faaliyetId || ''}
                </Button>
                <Button
                  variant="faded"
                  className="h-9 px-3"
                >
                  {currentVeriIsleme?.surec_ismi || t('modal.detailTitle')}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  isIconOnly 
                  radius="full" 
                  className="min-w-10 w-10 h-10"
                  onClick={handleDeleteClick}
                >
                  <FiTrash2 size={16} />
                </Button>
                <Button 
                  isIconOnly 
                  color="primary" 
                  radius="full" 
                  className="min-w-10 w-10 h-10"
                  onClick={handleSave}
                >
                  <FaSave size={16} />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="py-6 px-8 pb-12">
              {detailLoading && !Object.keys(formData).length && (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <Spinner size="lg" color="primary" />
                  <p>{t('loadingDetails')}</p>
                </div>
              )}
              
              {detailError && (
                <div className="text-center text-red-500 p-4">
                  <p>{t('error')}</p>
                  <p>{detailError}</p>
                </div>
              )}
              
              {((!detailLoading && !detailError && currentVeriIsleme) || Object.keys(formData).length > 0) && (
                <Tabs 
                  selectedKey={selectedTab} 
                  onSelectionChange={(key) => setSelectedTab(key)}
                  variant="underlined"
                  color="primary"
                  classNames={{
                    tabList: "gap-8 w-full relative rounded-none p-0 sticky top-0 bg-white z-10",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "text-base font-medium group-data-[selected=true]:text-primary"
                  }}
                >
                  <Tab key="kart-detaylari" title={<span className="text-lg">{t('tabs.kartDetaylari')}</span>}>
                    {selectedTab === 'kart-detaylari' && (
                      <UpdateKartDetayları 
                        formData={formData}
                        handleChange={updateFormValue}
                      />
                    )}
                  </Tab>
                  <Tab key="etki-analizi" title={<span className="text-lg">{t('tabs.etkiAnalizi')}</span>}>
                    {selectedTab === 'etki-analizi' && (
                      <UpdateEtkiAnalizi 
                        formData={formData}
                        handleChange={updateFormValue}
                      />
                    )}
                  </Tab>
                </Tabs>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Silme onay modalı */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('modal.deleteTitle')}
        message={t('modal.deleteMessage')}
        confirmText={t('modal.confirmDelete')}
        cancelText={t('modal.cancel')}
        confirmColor="danger"
      />
    </>
  );
};

export default VeriIslemeUpdateModal;