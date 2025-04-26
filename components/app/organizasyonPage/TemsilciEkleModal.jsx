import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { addTemsilci, clearAddStatus } from '@/store/slices/organizasyonSlice';
import { toast } from 'react-hot-toast';

const TemsilciEkleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const t = useTranslations('app.organizasyon');
  const departments = useSelector((state) => state.organizasyon.departments);
  const userInfo = useSelector((state) => state.userInfo.data);
  const { addTemsilciSuccess, addTemsilciError } = useSelector((state) => state.organizasyon);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    varlik_sorumlusu: '0',
    department_id: '',
  });

  const activeCompanyId = userInfo?.companies?.find(company => company.company_active)?.company_id;

  useEffect(() => {
    if (addTemsilciSuccess) {
      toast.success(t('representatives.add.success'));
      dispatch(clearAddStatus());
      onClose();
      setFormData({
        fullname: '',
        email: '',
        varlik_sorumlusu: '0',
        department_id: '',
      });
    }
    if (addTemsilciError) {
      toast.error(t('representatives.add.error'));
      dispatch(clearAddStatus());
    }
  }, [addTemsilciSuccess, addTemsilciError, onClose, t, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullname || !formData.email || !formData.department_id) {
      toast.error(t('form.required'));
      return;
    }

    dispatch(addTemsilci({
      ...formData,
      company_id: activeCompanyId,
      varlik_sorumlusu: parseInt(formData.varlik_sorumlusu),
      department_id: parseInt(formData.department_id),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{t('representatives.add.title')}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t('representatives.name')}
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                required
              />
              <Input
                type="email"
                label={t('representatives.email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Select
                label={t('representatives.varlik_sorumlusu')}
                value={formData.varlik_sorumlusu}
                onChange={(e) => setFormData({ ...formData, varlik_sorumlusu: e.target.value })}
                required
              >
                <SelectItem key="0" value="0">{t('no')}</SelectItem>
                <SelectItem key="1" value="1">{t('yes')}</SelectItem>
              </Select>
              <Select
                label={t('representatives.department')}
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                required
              >
                <SelectItem key="default" value="" disabled>{t('form.select')}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={onClose}>
              {t('form.cancel')}
            </Button>
            <Button color="primary" type="submit">
              {t('form.save')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TemsilciEkleModal;