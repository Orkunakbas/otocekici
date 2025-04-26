import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments, fetchTemsilciler, deleteTemsilci, deleteDepartment, clearDeleteStatus, addTemsilci, clearAddStatus } from '@/store/slices/organizasyonSlice';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import DepartmanEkleModal from './DepartmanEkleModal';
import TemsilciEkleModal from './TemsilciEkleModal';

const OrganizasyonPage = () => {
  const dispatch = useDispatch();
  const t = useTranslations('app.organizasyon');
  const { 
    departments, 
    loading, 
    temsilciler, 
    temsilcilerLoading, 
    deleteSuccess, 
    deleteError,
    addTemsilciSuccess,
    addTemsilciError
  } = useSelector((state) => state.organizasyon);
  const userInfo = useSelector((state) => state.userInfo.data);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isAddTemsilciModalOpen, setIsAddTemsilciModalOpen] = useState(false);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchDepartments());
      dispatch(fetchTemsilciler());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(deleteType === 'department' ? t('departments.delete.success') : t('representatives.delete.success'));
      dispatch(clearDeleteStatus());
    }
    if (deleteError) {
      toast.error(deleteType === 'department' ? t('departments.delete.error') : t('representatives.delete.error'));
      dispatch(clearDeleteStatus());
    }
  }, [deleteSuccess, deleteError, dispatch, deleteType, t]);

  const handleDeleteDepartment = (departmentId) => {
    setDeleteTarget(departmentId);
    setDeleteType('department');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTemsilci = (userId) => {
    setDeleteTarget(userId);
    setDeleteType('temsilci');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'department') {
      dispatch(deleteDepartment(deleteTarget));
    } else if (deleteType === 'temsilci') {
      dispatch(deleteTemsilci(deleteTarget));
    }
    setIsDeleteModalOpen(false);
  };

  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalOpen(true);
  };

  const openAddTemsilciModal = () => {
    setIsAddTemsilciModalOpen(true);
  };

  const handleAddTemsilci = (formData) => {
    dispatch(addTemsilci({
      ...formData,
      company_id: userInfo.company_id,
    })).then(() => {
      dispatch(fetchTemsilciler());
      dispatch(fetchDepartments());
    });
  };

  return (
    <div className='w-full px-6 py-6 flex'>
      {/* Sol taraf: Departmanlar */}
      <div className='w-1/4 pr-4'>
        <Button 
          color="primary" 
          className='mb-4 w-full'
          startContent={<FiPlus />}
          size="md"
          onClick={openAddDepartmentModal}
        >
          {t('departments.add')}
        </Button>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>{t('departments.title')}</h2>
          {loading ? (
            <div className="flex justify-center">
              <Spinner color="primary" size="md" />
            </div>
          ) : (
            <ul className="space-y-2">
              {departments.map((dept) => (
                <li 
                  key={dept?.department_id} 
                  className='flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors'
                >
                  <span className="text-sm">{dept?.department_name}</span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => handleDeleteDepartment(dept?.department_id)}
                    className="opacity-70 hover:opacity-100"
                  >
                    <FiX />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Sağ taraf: Temsilci Tablosu */}
      <div className='w-3/4 pl-4'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-lg font-semibold'>{t('representatives.title')}</h2>
            <Button 
              color="primary"
              size="md"
              startContent={<FiPlus />}
              onClick={openAddTemsilciModal}
            >
              {t('representatives.addRepresentative')}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableColumn>{t('representatives.name')}</TableColumn>
              <TableColumn>{t('representatives.email')}</TableColumn>
              <TableColumn>{t('representatives.department')}</TableColumn>
              <TableColumn className="text-right">{t('representatives.actions')}</TableColumn>
            </TableHeader>
            <TableBody>
              {temsilcilerLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex justify-center py-4">
                      <Spinner color="primary" size="md" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                temsilciler.map((temsilci) => (
                  <TableRow key={temsilci.user_id}>
                    <TableCell>{temsilci.fullname}</TableCell>
                    <TableCell>{temsilci.email}</TableCell>
                    <TableCell>
                      {temsilci.departments && temsilci.departments.length > 0 ? (
                        temsilci.departments[0]?.department_name
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={() => handleDeleteTemsilci(temsilci.user_id)}
                        className="opacity-70 hover:opacity-100"
                      >
                        <FiTrash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Silme Onay Modali */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            {deleteType === 'department' ? t('departments.delete.title') : t('representatives.delete.title')}
          </ModalHeader>
          <ModalBody>
            {deleteType === 'department' ? t('departments.delete.confirm') : t('representatives.delete.confirm')}
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={() => setIsDeleteModalOpen(false)}>
              {t('delete.cancel')}
            </Button>
            <Button color="danger" onClick={confirmDelete}>
              {t('delete.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Departman Ekleme Modal */}
      <DepartmanEkleModal 
        isOpen={isAddDepartmentModalOpen} 
        onClose={() => setIsAddDepartmentModalOpen(false)} 
      />

      {/* Temsilci Ekleme Modal */}
      <TemsilciEkleModal 
        isOpen={isAddTemsilciModalOpen} 
        onClose={() => setIsAddTemsilciModalOpen(false)} 
        onAdd={handleAddTemsilci}
      />
    </div>
  );
};

export default OrganizasyonPage;