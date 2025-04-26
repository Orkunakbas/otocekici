import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { addDepartment, clearAddStatus, fetchDepartments } from '@/store/slices/organizasyonSlice';

const DepartmanEkleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const t = useTranslations('app.organizasyon');
  const { data: userInfo } = useSelector((state) => state.userInfo);
  const { addSuccess, addError } = useSelector((state) => state.organizasyon);
  const [departmanName, setDepartmanName] = useState('');

  // Aktif şirket ID'sini al
  const activeCompanyId = userInfo?.companies?.find(company => company.company_active)?.company_id;

  // Başarılı ekleme durumunda
  React.useEffect(() => {
    if (addSuccess) {
      toast.success(t('departments.addSuccess'));
      dispatch(clearAddStatus());
      dispatch(fetchDepartments());
      onClose();
    }
    if (addError) {
      toast.error(t('departments.addError'));
      dispatch(clearAddStatus());
    }
  }, [addSuccess, addError, dispatch, onClose, t]);

  const handleSubmit = async () => {
    if (!departmanName) {
      toast.error(t('departments.namePlaceholder'));
      return;
    }

    dispatch(addDepartment({
      department_name: departmanName,
      company_id: activeCompanyId,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{t('departments.add')}</ModalHeader>
        <ModalBody>
          <Input
            label={t('departments.name')}
            value={departmanName}
            onChange={(e) => setDepartmanName(e.target.value)}
            placeholder={t('departments.namePlaceholder')}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="default" onClick={onClose}>
            {t('delete.cancel')}
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {t('departments.add')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DepartmanEkleModal;