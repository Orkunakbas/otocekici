import React, { useState, useEffect } from 'react';
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
  Spinner,
} from "@heroui/react";
import { 
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiFile,
  FiFileText,
  FiDownload,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import toast from 'react-hot-toast';
import Link from 'next/link';

import Image from 'next/image';
import pdfIcon from '@/images/pdf.png';
import wordIcon from '@/images/word.png';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDokumanlar, updateFilteredDokumanlar, deleteDokuman, archiveDokuman } from '@/store/slices/dokumanlarSlice';
import ConfirmModal from '../global/ConfirmModal';
import DokumanEkleModal from './DokumanEkleModal';
import DokumanGuncelleModal from './DokumanGuncelleModal';

const DokumanlarPage = () => {
  const t = useTranslations('app.dokumanlar');
  const dispatch = useDispatch();
  
  // Redux store'dan verileri al
  const { 
    filteredDokumanlar, 
    loading, 
    error, 
    deleteLoading, 
    deleteSuccess, 
    deleteError,
    archiveLoading, 
    archiveSuccess, 
    archiveError
  } = useSelector((state) => state.dokumanlar);
  const userInfo = useSelector((state) => state.userInfo.data);
  
  // Kullanıcı rolü kontrolü
  const isDanışman = userInfo?.role === 'danışman';
  const canManageDocuments = isDanışman; // Sadece danışmanlar döküman ekleyebilir ve silebilir
  
  // Tablo durumları
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Sayfa başına 20 öğe göster
  const [searchTerm, setSearchTerm] = useState("");
  
  // Silme işlemi için state
  const [selectedDokuman, setSelectedDokuman] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Arşivleme işlemi için state
  const [archiveDokuman_, setArchiveDokuman] = useState(null);
  const { 
    isOpen: isOpenArchiveModal, 
    onOpen: onOpenArchiveModal, 
    onClose: onCloseArchiveModal 
  } = useDisclosure();
  
  // Döküman Ekleme Modal
  const { 
    isOpen: isOpenAddModal, 
    onOpen: onOpenAddModal, 
    onClose: onCloseAddModal 
  } = useDisclosure();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Component mount olduğunda dokümanları yükle
  useEffect(() => {
    dispatch(fetchDokumanlar());
  }, [dispatch]);
  
  // userInfo değiştiğinde dokümanları yeniden filtrele
  useEffect(() => {
    if (userInfo) {
      dispatch(updateFilteredDokumanlar({ user: userInfo }));
    }
  }, [userInfo, dispatch]);
  
  // Filtreleme - Güvenli filtreleme
  const filteredData = React.useMemo(() => {
    if (!Array.isArray(filteredDokumanlar)) return [];
    
    return filteredDokumanlar.filter(item => {
      if (!item) return false;
      const dokumanIsmi = (item.dokuman_ismi || "").toLowerCase();
      const dokumanTur = (item.dokuman_tur || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      
      return dokumanIsmi.includes(term) || dokumanTur.includes(term);
    });
  }, [filteredDokumanlar, searchTerm]);

  // Sayfalama
  const paginatedData = React.useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  // Dosya indirme işlemi
  const handleDownload = (fileLink, fileName) => {
    if (!fileLink) return;
    
    // API URL'yi string olarak tanımla (process.env sorunu olabilir)
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
  
  // Silme modalını aç
  const handleDeleteClick = (dokuman) => {
    setSelectedDokuman(dokuman);
    setIsDeleteModalOpen(true);
  };
  
  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (selectedDokuman) {
      // Toast promise ile silme işlemi
      toast.promise(
        dispatch(deleteDokuman(selectedDokuman.id)).unwrap(),
        {
          loading: t('toast.deleting', { name: selectedDokuman.dokuman_ismi }) || `"${selectedDokuman.dokuman_ismi}" dokümanı siliniyor...`,
          success: t('toast.deleteSuccess', { name: selectedDokuman.dokuman_ismi }) || `"${selectedDokuman.dokuman_ismi}" dokümanı başarıyla silindi.`,
          error: (err) => t('toast.deleteError', { name: selectedDokuman.dokuman_ismi, error: err.message }) || 
            `"${selectedDokuman.dokuman_ismi}" dokümanı silinemedi: ${err.message || 'Bir hata oluştu'}`
        }
      );
    }
    onClose();
  };
  
  // Arşivleme modalını aç
  const handleArchiveClick = (dokuman) => {
    setArchiveDokuman(dokuman);
    setIsArchiveModalOpen(true);
  };
  
  // Arşivleme işlemini onayla
  const handleConfirmArchive = () => {
    if (archiveDokuman_) {
      // Toast promise ile arşivleme işlemi
      toast.promise(
        dispatch(archiveDokuman(archiveDokuman_.id)).unwrap(),
        {
          loading: t('toast.archiving', { name: archiveDokuman_.dokuman_ismi }),
          success: t('toast.archiveSuccess', { name: archiveDokuman_.dokuman_ismi }),
          error: (err) => t('toast.archiveError', { name: archiveDokuman_.dokuman_ismi, error: err.message || 'Bir hata oluştu' })
        }
      );
    }
    onCloseArchiveModal();
  };

  // Düzenleme modalını aç
  const handleEdit = (dokuman) => {
    setSelectedDokuman(dokuman);
    setIsUpdateModalOpen(true);
  };

  // Dosya türüne göre ikon seçimi
  const getFileIcon = (fileLink, dokuman) => {
    if (!fileLink) return (
      <div className="flex justify-center items-center w-full h-full">
        <FiFile size={32} />
      </div>
    );
    
    const fileExtension = fileLink.split('.').pop().toLowerCase();
    
    switch (fileExtension) {
      case 'pdf':
        return (
          <div 
            className="flex justify-center items-center w-full h-full cursor-pointer group"
            onClick={() => handleDownload(fileLink, dokuman.dokuman_ismi)}
          >
            <div className="relative">
              <Image 
                src={pdfIcon} 
                alt="PDF dosyası" 
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
            onClick={() => handleDownload(fileLink, dokuman.dokuman_ismi)}
          >
            <div className="relative">
              <Image 
                src={wordIcon} 
                alt="Word dosyası" 
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
            onClick={() => handleDownload(fileLink, dokuman.dokuman_ismi)}
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

  // İşlem butonları render
  const renderActions = (dokuman) => {
    // Sadece danışmanlar için işlem butonlarını göster
    if (!canManageDocuments) return null;
    
    return (
      <div className="flex justify-center gap-2">
        <Button 
          isIconOnly 
          size="sm" 
          variant="solid" 
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600" 
          aria-label={t('actions.edit')}
          onClick={() => handleEdit(dokuman)}
        >
          <FiEdit2 />
        </Button>
        <Button 
          isIconOnly 
          size="sm" 
          variant="solid" 
          className="bg-pink-100 hover:bg-pink-200 text-pink-600"
          aria-label={t('actions.delete')}
          onClick={() => handleDeleteClick(dokuman)}
          isLoading={deleteLoading && selectedDokuman?.id === dokuman.id}
        >
          <FiTrash2 />
        </Button>
        <Button 
          isIconOnly 
          size="sm" 
          variant="shadow" 
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600" 
          aria-label={t('actions.archive')}
          onClick={() => handleArchiveClick(dokuman)}
          isLoading={archiveLoading && archiveDokuman_?.id === dokuman.id}
        >
          <FiArchive />
        </Button>
      </div>
    );
  };

  // Toplam sayfa sayısı hesaplama
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Yükleme durumunu genişletilmiş kontrol - daha kapsamlı kontrol
  const isLoading = loading || 
                   !Array.isArray(filteredDokumanlar) || 
                   (filteredDokumanlar.length === 0 && searchTerm === "");

  // Yükleme durumunda gösterilecek içerik
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  // Hata durumunda gösterilecek içerik
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">
          <p className="text-lg font-semibold">Bir hata oluştu</p>
          <p>{error}</p>
          <Button color="primary" className="mt-4" onClick={() => dispatch(fetchDokumanlar())}>
            Yeniden Dene
          </Button>
        </div>
      </div>
    );
  }

  // Ekranı render etme
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
          
          {/* Butonlar - Sadece danışmanlar görebilir */}
          <div className="flex gap-2">
            {canManageDocuments && (
              <>
                <Button 
                  color="primary"
                  size='md'
                  className='text-stone-100'
                  startContent={<AiOutlinePlus />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  {t('buttons.addDocument')}
                </Button>
                <Link href="/dokuman-arsiv">
                  <Button 
                    size='md'
                    color="success"
                    startContent={<FiArchive />}
                    className="bg-emerald-100 text-emerald-600"
                  >
                    {t('buttons.archive')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Döküman Listesi Tablosu */}
        <div className="w-full">
          {canManageDocuments ? (
            // Danışman rolü için tam tablo
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
                <TableColumn isRowHeader={false}>{t('table.columns.documentName')}</TableColumn>
                <TableColumn isRowHeader={false}>{t('table.columns.documentType')}</TableColumn>
                <TableColumn isRowHeader={false}>{t('table.columns.lastUpdate')}</TableColumn>
                <TableColumn isRowHeader={false} className="text-center">{t('table.columns.document')}</TableColumn>
                <TableColumn isRowHeader={false} className="text-center">{t('table.columns.actions')}</TableColumn>
              </TableHeader>
              <TableBody 
                items={paginatedData}
                emptyContent={t('table.noData')}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.dokuman_ismi}</TableCell>
                    <TableCell>{item.dokuman_tur}</TableCell>
                    <TableCell>{formatDate(item.lastupdated)}</TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={t('actions.download')}>
                        {getFileIcon(item.dokuman_linki, item)}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">{renderActions(item)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            // Diğer roller için "actions" sütunu olmadan tablo
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
                <TableColumn isRowHeader={false}>{t('table.columns.documentName')}</TableColumn>
                <TableColumn isRowHeader={false}>{t('table.columns.documentType')}</TableColumn>
                <TableColumn isRowHeader={false}>{t('table.columns.lastUpdate')}</TableColumn>
                <TableColumn isRowHeader={false} className="text-center">{t('table.columns.document')}</TableColumn>
              </TableHeader>
              <TableBody 
                items={paginatedData}
                emptyContent={t('table.noData')}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.dokuman_ismi}</TableCell>
                    <TableCell>{item.dokuman_tur}</TableCell>
                    <TableCell>{formatDate(item.lastupdated)}</TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={t('actions.download')}>
                        {getFileIcon(item.dokuman_linki, item)}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Silme Onay Modal'ı - Sadece danışmanlar görebilir */}
      {canManageDocuments && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t('modal.deleteTitle')}
          message={t('modal.deleteMessage', { name: selectedDokuman?.dokuman_ismi || '' })}
          confirmText={t('modal.confirmDelete')}
          cancelText={t('modal.cancel')}
          confirmColor="danger"
        />
      )}
      
      {/* Arşivleme Onay Modal'ı - Sadece danışmanlar görebilir */}
      {canManageDocuments && (
        <ConfirmModal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleConfirmArchive}
          title={t('modal.archiveTitle')}
          message={t('modal.archiveMessage')}
          confirmText={t('modal.confirmArchive')}
          cancelText={t('modal.cancel')}
          confirmColor="warning"
        />
      )}
      
      {/* Döküman Ekleme Modal'ı - Sadece danışmanlar görebilir */}
      {canManageDocuments && (
        <DokumanEkleModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      
      <DokumanGuncelleModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)}
        dokumanId={selectedDokuman?.id}
      />
    </div>
  );
};

// Yardımcı fonksiyonlar
function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', options);
}

export default DokumanlarPage;