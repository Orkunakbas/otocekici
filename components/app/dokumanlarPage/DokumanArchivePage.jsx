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
  FiList,
  FiCornerUpRight,
  FiRefreshCw,
} from "react-icons/fi";
import toast from 'react-hot-toast';
import Link from 'next/link';

import Image from 'next/image';
import pdfIcon from '@/images/pdf.png';
import wordIcon from '@/images/word.png';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDokumanlar, updateFilteredDokumanlar, deleteDokuman, unarchiveDokuman } from '@/store/slices/dokumanlarSlice';
import ConfirmModal from '../global/ConfirmModal';
import DokumanGuncelleModal from './DokumanGuncelleModal';

const DokumanArchivePage = () => {
  const t = useTranslations('app.dokumanlar');
  const dispatch = useDispatch();
  
  // Redux store'dan verileri al
  const { 
    rawData,
    filteredDokumanlar, 
    loading, 
    error, 
    deleteLoading, 
    deleteSuccess, 
    deleteError,
    unarchiveLoading, 
    unarchiveSuccess, 
    unarchiveError
  } = useSelector((state) => state.dokumanlar);
  const userInfo = useSelector((state) => state.userInfo.data);
  
  // Kullanıcı rolü kontrolü
  const isDanışman = userInfo?.role === 'danışman';
  const canManageDocuments = isDanışman; 
  
  // Tablo durumları
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  
  // İşlem için state
  const [selectedDokuman, setSelectedDokuman] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnarchiveModalOpen, setIsUnarchiveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Kullanıcı rolüne göre şirket ID'lerini belirle
  const getCompanyIds = (user) => {
    if (!user || !user.companies || user.companies.length === 0) {
      return [];
    }
    
    let companyIds = [];
    const activeCompanies = user.companies.filter(company => company.company_active === true);
    
    if (user.role === 'danışman') {
      const activeCompany = activeCompanies.length > 0 ? activeCompanies[0] : null;
      if (activeCompany) {
        companyIds = [String(activeCompany.company_id)];
      }
    } else if (user.role === 'yönetici' || user.role === 'temsilci') {
      const activeCompany = activeCompanies.length > 0 ? activeCompanies[0] : null;
      if (activeCompany) {
        companyIds = [String(activeCompany.company_id)];
      } else if (user.companies.length > 0) {
        companyIds = [String(user.companies[0].company_id)];
      }
    }
    
    return companyIds;
  };

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
  
  // Filtreleme - Sadece arşivlenmiş dökümanları göster (guncel=false)
  const filteredData = React.useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    
    // Aktif şirket ID'sini al
    const activeCompanyId = userInfo?.activeCompanyId || 
                          (userInfo?.companies && 
                          userInfo.companies.length > 0 && 
                          userInfo.companies.find(c => c.company_active)?.company_id);
    
    // Güncel değeri false olan ve şirket ID'si ile eşleşen dökümanları filtrele
    const archivedDocs = rawData.filter(item => {
      if (!item) return false;
      
      // Döküman arşivlenmiş mi? (guncel=false)
      const isArchived = item.guncel === false;
      
      if (!isArchived) return false; // Sadece arşivlenmiş dökümanlar
      
      // Tüm kullanıcılar (danışman dahil) sadece aktif şirkete ait dökümanları görebilir
      return String(item.company_id) === String(activeCompanyId);
    });
    
    // Arama terimine göre filtrele
    return archivedDocs.filter(item => {
      const dokumanIsmi = (item.dokuman_ismi || "").toLowerCase();
      const dokumanTur = (item.dokuman_tur || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      
      return dokumanIsmi.includes(term) || dokumanTur.includes(term);
    });
  }, [rawData, userInfo, isDanışman, searchTerm]);

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
    a.target = "_blank";
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
      toast.promise(
        dispatch(deleteDokuman(selectedDokuman.id)).unwrap(),
        {
          loading: t('toast.deleting', { name: selectedDokuman.dokuman_ismi }),
          success: () => {
            setIsDeleteModalOpen(false);
            return t('toast.deleteSuccess', { name: selectedDokuman.dokuman_ismi });
          },
          error: (err) => {
            setIsDeleteModalOpen(false);
            return t('toast.deleteError', { name: selectedDokuman.dokuman_ismi, error: err.message || 'Bir hata oluştu' });
          }
        }
      );
    }
  };
  
  // Arşivden çıkarma modalını aç
  const handleUnarchiveClick = (dokuman) => {
    setSelectedDokuman(dokuman);
    setIsUnarchiveModalOpen(true);
  };
  
  // Arşivden çıkarma işlemini onayla
  const handleConfirmUnarchive = () => {
    if (selectedDokuman) {
      toast.promise(
        dispatch(unarchiveDokuman(selectedDokuman.id)).unwrap(),
        {
          loading: t('toast.unarchiving', { name: selectedDokuman.dokuman_ismi }),
          success: () => {
            setIsUnarchiveModalOpen(false);
            return t('toast.unarchiveSuccess', { name: selectedDokuman.dokuman_ismi });
          },
          error: (err) => {
            setIsUnarchiveModalOpen(false);
            return t('toast.unarchiveError', { name: selectedDokuman.dokuman_ismi, error: err.message || 'Bir hata oluştu' });
          }
        }
      );
    }
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
          variant="solid" 
          className="bg-green-100 hover:bg-green-200 text-green-600"
          aria-label={t('actions.unarchive')}
          onClick={() => handleUnarchiveClick(dokuman)}
          isLoading={unarchiveLoading && selectedDokuman?.id === dokuman.id}
        >
          <FiRefreshCw />
        </Button>
      </div>
    );
  };

  // Toplam sayfa sayısı hesaplama
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Yükleme durumunu genişletilmiş kontrol - daha kapsamlı kontrol
  const isLoading = loading || 
                   !Array.isArray(rawData) || 
                   !Array.isArray(filteredData) || 
                   (rawData.length > 0 && filteredData.length === 0 && searchTerm === "");

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
        {/* Başlık */}
   
        
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
                <Link href="/dokumanlar">
                  <Button 
                    size='md'
                    color="success"
                    startContent={<FiCornerUpRight />}
                    className="bg-emerald-100 text-emerald-600"
                  >
                    {t('buttons.currentDocuments')}
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
              aria-label="Arşivlenmiş Dökümanlar"
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
                emptyContent={
                  <div className="text-center py-6">
                    <p className="text-gray-500">{t('archive.noData')}</p>
                  </div>
                }
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
              aria-label="Arşivlenmiş Dökümanlar"
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
                emptyContent={
                  <div className="text-center py-6">
                    <p className="text-gray-500">{t('archive.noData')}</p>
                  </div>
                }
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
      
      {/* Arşivden Çıkarma Modal'ı - Sadece danışmanlar görebilir */}
      {canManageDocuments && (
        <ConfirmModal
          isOpen={isUnarchiveModalOpen}
          onClose={() => setIsUnarchiveModalOpen(false)}
          onConfirm={handleConfirmUnarchive}
          title={t('modal.unarchiveTitle')}
          message={t('modal.unarchiveMessage', { name: selectedDokuman?.dokuman_ismi || '' })}
          confirmText={t('modal.confirmUnarchive')}
          cancelText={t('modal.cancel')}
          confirmColor="success"
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

export default DokumanArchivePage;