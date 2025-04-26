import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Button, Spinner } from '@heroui/react';
import { FiTrash2, FiArrowUp, FiMove, FiPlus } from 'react-icons/fi';
import { fetchVeriIslemeFaaliyetleri, deleteVeriIslemeFaaliyeti, clearDeleteStatus } from '@/store/slices/veriIslemeSlice';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import VeriIslemeCreateModal from './VeriIslemeCreateModal';
import VeriIslemeUpdateModal from './VeriIslemeUpdateModal';
import ConfirmModal from '../global/ConfirmModal';

const VeriIslemePage = () => {
  const t = useTranslations('app.veriIsleme');
  const dispatch = useDispatch();
  const { veriIslemeFaaliyetleri, loading, error, deleteLoading } = useSelector(
    (state) => state.veriIsleme
  );
  const userInfo = useSelector((state) => state.userInfo.data);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedFaaliyet, setSelectedFaaliyet] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (userInfo && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      dispatch(fetchVeriIslemeFaaliyetleri());
    }
  }, [dispatch, userInfo]);

  // Silme modalını aç
  const handleDeleteClick = (faaliyet) => {
    setSelectedFaaliyet(faaliyet);
    setIsDeleteModalOpen(true);
  };

  // Detay modalını aç
  const handleDetailsClick = (faaliyet) => {
    setSelectedFaaliyet(faaliyet);
    setOpenUpdateModal(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (selectedFaaliyet) {
      // Toast promise ile silme işlemi
      toast.promise(
        dispatch(deleteVeriIslemeFaaliyeti(selectedFaaliyet.id)).unwrap(),
        {
          loading: t('toast.deleting'),
          success: t('toast.deleteSuccess'),
          error: () => t('toast.deleteError')
        }
      );
      // Modal'ı kapat
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddNew = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // DOM temizleme yardımcı fonksiyonu
  const cleanUpDOM = () => {
    if (typeof window === 'undefined') return;
    
    // Body stillerini ve sınıflarını temizle
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    document.body.style.pointerEvents = '';
    document.body.style.touchAction = '';
    document.body.classList.remove('overflow-hidden', 'modal-open', 'fixed');
    
    // Modal ve Tab elementlerini temizle
    const elementsToClean = [
      '[role="dialog"]',
      '[role="tabpanel"]',
      '[role="tab"]',
      '[data-overlay="true"]',
      '.modal-backdrop',
      '.modal-overlay',
      '.fixed.inset-0',
      '[data-headlessui-state]'
    ];
    
    elementsToClean.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });
    
    // Aria hidden özelliklerini temizle
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
      el.removeAttribute('aria-hidden');
    });
  };

  const handleCloseUpdateModal = () => {
    // Önce modal state'ini kapat
    setOpenUpdateModal(false);
    
    // Bir süre sonra selected faaliyet'i sıfırla ve verileri yenile
    setTimeout(() => {
      setSelectedFaaliyet(null);
      dispatch(fetchVeriIslemeFaaliyetleri());
    }, 300);
  };

  // String formatındaki kişisel verileri düzgün gösterme
  const renderKisiselVeriler = (verilerString) => {
    if (!verilerString) return "-";
    
    // String değilse veya boşsa
    if (typeof verilerString !== 'string' || verilerString.trim() === '') {
      return "-";
    }
    
    try {
      // Formatlanmış metni satırlara ayır
      const lines = verilerString.split('\n');
      let currentCategory = null;
      let items = [];
      let result = [];
      
      // Her satırı işle
      lines.forEach((line, index) => {
        // Kategori başlığı satırı mı?
        if (line.includes(':') && !line.startsWith('-')) {
          // Önceki kategorinin itemlerini ekleyelim
          if (currentCategory && items.length > 0) {
            result.push(
              <div key={`category-${result.length}`} className="mb-3">
                <div className="font-bold text-primary-700">{currentCategory}</div>
                <ul className="list-disc ml-5">
                  {items.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            );
            items = []; // Yeni kategori için temizle
          }
          
          // Yeni kategori adını ayarla
          currentCategory = line.replace(':', '').trim();
        } 
        // Madde içeren satır mı?
        else if (line.trim().startsWith('-')) {
          const item = line.replace('-', '').trim();
          items.push(item);
        }
      });
      
      // Son kategoriyi ekle
      if (currentCategory && items.length > 0) {
        result.push(
          <div key={`category-${result.length}`} className="mb-3">
            <div className="font-bold text-primary-700">{currentCategory}</div>
            <ul className="list-disc ml-5">
              {items.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        );
      }
      
      return result.length > 0 ? result : verilerString;
    } catch (error) {
      console.error("Kişisel veri görüntüleme hatası:", error);
      return verilerString; // Herhangi bir hata durumunda stringi olduğu gibi göster
    }
  };

  // JSON string'i parse eden yardımcı fonksiyon
  const parseJsonArray = (jsonString) => {
    if (!jsonString) return "-";

    try {
      // Eğer string değilse veya boş stringse
      if (typeof jsonString !== 'string' || jsonString.trim() === '') {
        return "-";
      }

      // JSON parse etmeyi dene
      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON parsing error:", e);
        return jsonString; // Parse edilemezse stringi olduğu gibi göster
      }
      
      // Eğer obje ise (kategori -> veri listesi formatında)
      if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        // Herhangi bir veri var mı?
        if (Object.keys(parsedData).length === 0) {
          return "-";
        }

        // Her kategori için formatlı görünüm oluştur
        return (
          <div>
            {Object.entries(parsedData).map(([category, dataList], index) => (
              <div key={index} className="mb-3">
                <h4 className="font-bold text-primary-700">{category}</h4>
                <ul className="list-disc pl-5 mt-1">
                  {Array.isArray(dataList) && dataList.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                  {!Array.isArray(dataList) && <li>{String(dataList)}</li>}
                </ul>
              </div>
            ))}
          </div>
        );
      }
      
      // Eğer array ise liste olarak göster
      if (Array.isArray(parsedData)) {
        if (parsedData.length === 0) return "-";
        
        return (
          <ul className="list-disc pl-5">
            {parsedData.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      }
      
      // Diğer durumlar için stringi olduğu gibi göster
      return jsonString;
    } catch (e) {
      console.error("Error parsing data:", e);
      return jsonString;
    }
  };

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDateTime = (dateString) => {
    if (!dateString) return t('no_data');
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${formattedDate} - ${formattedTime}`;
  };

  return (
    <div className="px-4 py-10">
      <div className="flex justify-end mb-6">
        <Button 
          color="primary" 
          startContent={<FiPlus size={18} />}
          onClick={handleAddNew}
        >
          {t('buttons.add')}
        </Button>
      </div>

      {/* Hiç veri fetch edilmediyse veya loading durumundaysa spinner göster */}
      {(loading || !dataFetchedRef.current) ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">
          <p>{t('error')}</p>
          <p>{error}</p>
        </div>
      ) : veriIslemeFaaliyetleri.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {veriIslemeFaaliyetleri.map((faaliyet) => (
            <Card
              key={faaliyet.id}
              className="p-6 rounded-lg shadow-md border border-gray-400"
              radius="lg"
              style={{ backgroundColor: "white" }}
            >
              <div className="flex flex-col space-y-5">
                <div>
                  <div className="flex items-start mb-1">
                    <div className="w-0.5 h-12 rounded " style={{ backgroundColor: "#22015e" }}></div>
                    <div className="flex-1 ml-3">
                      <h3 className="text-md font-medium">{faaliyet.surec_ismi}</h3>
                      <p className="text-sm text-gray-500">{faaliyet.faaliyet_amaci}</p>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="default"
                      className="text-gray-500 hover:text-gray-700 p-1 min-w-0 h-auto ml-2"
                    >
                      <FiMove size={16} />
                    </Button>
                  </div>
                  <div className="mt-4 border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">{t('fields.related_person')}</label>
                  <Input
                    variant="flat"
                    color="secondary"
                    value={faaliyet.ilgili_kisi || faaliyet.kime_ait_veri_temini}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">{t('fields.personal_data')}</label>
                  <div 
                    className="bg-secondary-100 rounded-lg px-3 py-2 h-[70px] overflow-y-auto text-sm text-gray-800"
                  >
                    {renderKisiselVeriler(faaliyet.islenen_kisisel_veriler)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">{t('fields.last_update')}</label>
                  <Input
                    variant="flat"
                    color="secondary"
                    value={`${faaliyet.guncelleyen ? (faaliyet.guncelleyen.length > 9 ? faaliyet.guncelleyen.substring(0, 9) + ' -' : faaliyet.guncelleyen) : ''} ${formatDateTime(faaliyet.updatedAt || faaliyet.createdAt)}`}
                    readOnly
                  />
                </div>

                <div className="flex space-x-3 mt-4">
                  <Button
                    fullWidth
                    color="primary"
                    startContent={<FiArrowUp size={18} />}
                    onClick={() => handleDetailsClick(faaliyet)}
                  >
                    {t('buttons.details')}
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    startContent={<FiTrash2 size={18} />}
                    onClick={() => handleDeleteClick(faaliyet)}
                    isLoading={deleteLoading && selectedFaaliyet?.id === faaliyet.id}
                  >
                    {t('buttons.delete')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
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

      {/* Ekleme modalı */}
      <VeriIslemeCreateModal 
        isOpen={openAddModal} 
        onClose={handleCloseAddModal} 
      />

      {/* Detay/Düzenleme modalı */}
      <VeriIslemeUpdateModal
        isOpen={openUpdateModal}
        onClose={handleCloseUpdateModal}
        faaliyetId={selectedFaaliyet?.id}
      />
    </div>
  );
};

export default VeriIslemePage;
