import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Input,
  Tooltip,
  useDisclosure,
  Switch,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { 
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiFile,
  FiDownload,
  FiEdit,
} from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import pdfIcon from '@/images/pdf.png';
import wordIcon from '@/images/word.png';
import { useTranslations } from 'next-intl';
import { 
  fetchAksiyonlar, 
  fetchDepartments,
  updateAksiyonDurum,
  deleteAksiyon,
  archiveAksiyon,
  clearDeleteStatus,
  clearArchiveStatus,
  clearUpdateDurumStatus,
  updateFilteredAksiyonlar
} from '@/store/slices/aksiyonlarSlice';
import AksiyonEkleModal from './AksiyonEkleModal';
import AksiyonGuncelleModal from './AksiyonGuncelleModal';
import { toast } from 'react-hot-toast';

// Tarihi formatla
function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', options);
}

const AksiyonArchivePage = () => {
  const t = useTranslations('app.aksiyonlar');
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo.data);
  
  const { 
    filteredAksiyonlar, 
    departments,
    loading, 
    error,
    deleteSuccess,
    archiveSuccess,
    updateDurumSuccess
  } = useSelector((state) => state.aksiyonlar);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAksiyon, setSelectedAksiyon] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const { isOpen: isOpenDescription, onOpen: onOpenDescription, onClose: onCloseDescription } = useDisclosure();
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAksiyonId, setSelectedAksiyonId] = useState(null);

  // Departman adını bul
  const getDepartmentName = React.useCallback((departmentId) => {
    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return 'Yükleniyor...';
    }
    
    const department = departments.find(d => d.department_id === departmentId);
    return department ? department.department_name : 'Bilinmiyor';
  }, [departments]);

  // Yükleme durumunu kontrol et
  const isLoading = loading || !Array.isArray(filteredAksiyonlar);

  // Filtreleme - Sadece guncel değeri false olan aksiyonları göster
  const filteredData = React.useMemo(() => {
    if (!filteredAksiyonlar || !Array.isArray(filteredAksiyonlar)) {
      return [];
    }
    
    // Sadece guncel değeri false olan aksiyonları filtrele
    const archivedAksiyonlar = filteredAksiyonlar.filter(item => item.guncel === false);
    
    if (!searchTerm) {
      return archivedAksiyonlar;
    }
    
    return archivedAksiyonlar.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const departmanName = getDepartmentName(item.department_id);
      return (
        departmanName.toLowerCase().includes(searchLower) ||
        item.aksiyon_ismi.toLowerCase().includes(searchLower)
      );
    });
  }, [filteredAksiyonlar, searchTerm, getDepartmentName]);

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchDepartments()).unwrap();
        if (userInfo) {
          await dispatch(fetchAksiyonlar()).unwrap();
          // Arşiv sayfası için arşivlenmiş aksiyonları filtrele
          dispatch(updateFilteredAksiyonlar({ user: userInfo, isArchive: true }));
        }
      } catch (error) {
        // Hata durumunda state'e yansıyacak
      }
    };

    fetchData();
  }, [dispatch, userInfo]);

  // Başarılı işlemler sonrası state'i temizle
  useEffect(() => {
    if (deleteSuccess) {
      setIsDeleteModalOpen(false);
      dispatch(clearDeleteStatus());
    }
    if (archiveSuccess) {
      setIsArchiveModalOpen(false);
      dispatch(clearArchiveStatus());
    }
    if (updateDurumSuccess) {
      dispatch(clearUpdateDurumStatus());
    }
  }, [deleteSuccess, archiveSuccess, updateDurumSuccess, dispatch]);

  // Sayfalama
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  // Toplam sayfa sayısı
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Risk rengini ve font ağırlığını belirleme
  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Yüksek Risk':
        return 'text-[#1e203e] font-bold'; // Koyu gri ve kalın
      case 'Orta Risk':
        return 'text-[#515692] font-bold'; // Orta gri ve kalın
      case 'Düşük Risk':
        return 'text-[#8e95e7] font-bold'; // Açık gri ve kalın
      default:
        return '';
    }
  };

  // Silme işlemi
  const handleDeleteClick = (aksiyon) => {
    setSelectedAksiyon(aksiyon);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAksiyon) {
      try {
        await dispatch(deleteAksiyon(selectedAksiyon.id)).unwrap();
        toast.success('Aksiyon başarıyla silindi');
      } catch (error) {
        toast.error(error || 'Aksiyon silinirken bir hata oluştu');
      }
    }
  };

  // Arşivleme işlemi
  const handleArchiveClick = (aksiyon) => {
    setSelectedAksiyon(aksiyon);
    setIsArchiveModalOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (selectedAksiyon) {
      try {
        await dispatch(archiveAksiyon(selectedAksiyon.id)).unwrap();
        toast.success('Aksiyon başarıyla arşivlendi');
        setIsArchiveModalOpen(false);
      } catch (error) {
        toast.error(error || 'Aksiyon arşivlenirken bir hata oluştu');
      }
    }
  };

  // Durum değiştirme
  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAksiyonDurum({ id, durum: newStatus }));
  };

  // Dosya indirme işlemi
  const handleDownload = (fileLink, fileName) => {
    if (!fileLink) return;
    
    // API URL'yi string olarak tanımla
    const uploadsPath = "https://admin.dpox.app";
    
    // URL oluşturmak için doğru şekilde birleştir
    const fullUrl = fileLink.startsWith('/') 
      ? `${uploadsPath}${fileLink}`
      : `${uploadsPath}/${fileLink}`;
    
    // Direkt bağlantı açmak yerine, bir indirme bağlantısı oluştur
    const a = document.createElement('a');
    a.href = fullUrl;
    a.download = fileName || 'dosya';
    a.target = "_blank"; // Yeni sekmede açmak için
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Dosya türüne göre ikon seçimi
  const getFileIcon = (fileLink, aksiyon) => {
    if (!fileLink) {
      return (
        <div className="flex justify-center items-center w-full h-full text-gray-400">
          {t('table.noDocument')}
        </div>
      );
    }
    
    const fileExtension = fileLink.split('.').pop().toLowerCase();
    
    switch (fileExtension) {
      case 'pdf':
        return (
          <div 
            className="flex justify-center items-center w-full h-full cursor-pointer group"
            onClick={() => handleDownload(fileLink, aksiyon.aksiyon_ismi)}
          >
            <div className="relative">
              <Image 
                src={pdfIcon} 
                alt={t('table.pdfFile')} 
                width={32} 
                height={32}
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black bg-opacity-50 rounded-full p-1">
                  <FiDownload className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div 
            className="flex justify-center items-center w-full h-full cursor-pointer group"
            onClick={() => handleDownload(fileLink, aksiyon.aksiyon_ismi)}
          >
            <div className="relative">
              <Image 
                src={wordIcon} 
                alt={t('table.wordFile')} 
                width={32} 
                height={32}
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black bg-opacity-50 rounded-full p-1">
                  <FiDownload className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div 
            className="flex justify-center items-center w-full h-full cursor-pointer group"
            onClick={() => handleDownload(fileLink, aksiyon.aksiyon_ismi)}
          >
            <div className="relative">
              <FiFile size={32} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black bg-opacity-50 rounded-full p-1">
                  <FiDownload className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Güncelleme modalını aç
  const handleUpdateClick = (id) => {
    setSelectedAksiyonId(id);
    setIsUpdateModalOpen(true);
  };

  // İşlem butonları
  const renderActions = (item) => {
    return (
      <div className="flex items-center gap-2">
        {/* Güncelle butonu */}
        <Tooltip content={t('actions.edit')}>
          <Button
            isIconOnly
            size="sm"
            variant="solid" 
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
            aria-label={t('actions.edit')}
            onClick={() => handleUpdateClick(item.id)}
          >
            <FiEdit2 />
          </Button>
        </Tooltip>
        <Tooltip content={t('actions.delete')}>
          <Button 
            isIconOnly 
            size="sm" 
            variant="solid" 
            className="bg-pink-100 hover:bg-pink-200 text-pink-600"
            aria-label={t('actions.delete')}
            onClick={() => handleDeleteClick(item)}
          >
            <FiTrash2 />
          </Button>
        </Tooltip>
        <Tooltip content={t('actions.archive')}>
          <Button 
            isIconOnly 
            size="sm" 
            variant="shadow" 
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600"
            aria-label={t('actions.archive')}
            onClick={() => handleArchiveClick(item)}
          >
            <FiArchive />
          </Button>
        </Tooltip>
      </div>
    );
  };

  // Yükleme durumunda gösterilecek içerik
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="py-6 px-4 pb-10 w-full">
      <div className="flex flex-col gap-6">
        {/* Arama ve Butonlar */}
        <div className="flex justify-between items-center">
          {/* Arama */}
          <div className="w-full md:w-64">
            <Input
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "shadow-sm border border-gray-200 rounded-lg h-10 bg-white"
              }}
              placeholder={t('table.search')}
              size="sm"
              startContent={<FiSearch size={18} className="text-gray-400" />}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Butonlar */}
          <div className="flex gap-2">
            <Link href="/aksiyonlar">
              <Button 
                size='md'
                color="success"
                startContent={<FiArchive />}
                className="bg-emerald-100 text-emerald-600"
              >
                {t('buttons.currentActions')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Tablo */}
        <div className="w-full">
          <Table 
            aria-label={t('title')}
            bottomContent={
              pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              ) : null
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn>{t('table.columns.department')}</TableColumn>
              <TableColumn>{t('table.columns.actionName')}</TableColumn>
              <TableColumn>{t('table.columns.date')}</TableColumn>
              <TableColumn>{t('table.columns.document')}</TableColumn>
              <TableColumn>{t('table.columns.risk')}</TableColumn>
              <TableColumn>{t('table.columns.status')}</TableColumn>
              <TableColumn className="text-center">{t('table.columns.actions')}</TableColumn>
            </TableHeader>
            <TableBody items={paginatedData} emptyContent={t('table.noData')}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{getDepartmentName(item.department_id)}</TableCell>
                  <TableCell>
                    <div>
                      <Tooltip content={t('table.clickForDescription')}>
                        <span 
                          className="cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => {
                            setSelectedAksiyon(item);
                            onOpenDescription();
                          }}
                        >
                          {item.aksiyon_ismi}
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <Tooltip content={t('actions.download')}>
                      {getFileIcon(item.dokuman_linki, item)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <span className={getRiskStyle(item.risk)}>
                      {item.risk}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={Boolean(item.durum)}
                      size="sm"
                      color="primary"
                      className="ml-1"
                      onChange={(e) => handleStatusChange(item.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{renderActions(item)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Aksiyon Ekleme Modal */}
        <AksiyonEkleModal 
          isOpen={isOpenAddModal}
          onClose={onCloseAddModal}
        />

        {/* Açıklama Modal'ı */}
        <Modal 
          isOpen={isOpenDescription} 
          onClose={onCloseDescription}
          size="lg"
        >
          <ModalContent>
            <ModalBody className="py-6">
              <div className="whitespace-pre-wrap text-gray-700">
                {selectedAksiyon?.aksiyon_aciklamasi || t('table.noDescription')}
              </div>
            </ModalBody>
            <ModalFooter className="justify-end">
              <Button color="danger" variant="light" onPress={onCloseDescription}>
                {t('modal.close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Silme Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">{t('modal.deleteTitle')}</h3>
              <p>{t('modal.deleteMessage', { name: selectedAksiyon?.aksiyon_ismi })}</p>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  color="default"
                  variant="light"
                  onPress={() => setIsDeleteModalOpen(false)}
                >
                  {t('modal.cancel')}
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                >
                  {t('modal.confirmDelete')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Arşivleme Modal */}
        {isArchiveModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">{t('modal.archiveTitle')}</h3>
              <p>{t('modal.archiveMessage', { name: selectedAksiyon?.aksiyon_ismi })}</p>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  color="default"
                  variant="light"
                  onPress={() => setIsArchiveModalOpen(false)}
                >
                  {t('modal.cancel')}
                </Button>
                <Button
                  color="success"
                  onPress={handleConfirmArchive}
                >
                  {t('modal.confirmArchive')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Güncelleme Modalı */}
        <AksiyonGuncelleModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedAksiyonId(null);
          }}
          aksiyonId={selectedAksiyonId}
        />
      </div>
    </div>
  );
};

export default AksiyonArchivePage;