import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Card,
  CardBody,
  Button,
} from "@heroui/react";
import { FiCalendar, FiUser, FiClock, FiRefreshCw } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { fetchGirisKayitlariData, updateGirisKayitlariData } from "../../../store/slices/girisKayitlariSlice";
import { useTranslations } from 'next-intl';

const GirisKayitlari = () => {
  const t = useTranslations('app.performans.girisKayitlari');
  const dispatch = useDispatch();
  const { filteredData, rawData, loading, error } = useSelector(state => state.girisKayitlari);
  const userInfo = useSelector(state => state.userInfo?.data);
  const girisKayitlariAll = filteredData?.girisKayitlari || [];
  
  // Danışman rolüne sahip olmayan kayıtları filtrele
  const girisKayitlari = useMemo(() => {
    return girisKayitlariAll.filter(item => item.rol !== 'danışman');
  }, [girisKayitlariAll]);
  
  const [page, setPage] = useState(1);
  const rowsPerPage = 25; // Sayfa başına 25 kayıt göster

  // Verileri yükleme fonksiyonu
  const loadData = useCallback(() => {
    dispatch(fetchGirisKayitlariData());
  }, [dispatch]);
  
  // Bileşen yüklendiğinde verileri getir
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Kullanıcı veya şirket bilgisi değiştiğinde veriyi yeniden filtrele
  useEffect(() => {
    if (userInfo && rawData.girisKayitlari.length > 0) {
      dispatch(updateGirisKayitlariData({ user: userInfo }));
    }
  }, [userInfo, rawData.girisKayitlari, dispatch]);

  // Sayfalama için verileri böl
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return girisKayitlari.slice(start, end);
  }, [girisKayitlari, page, rowsPerPage]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="flex justify-center items-center py-10">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="text-center text-danger py-10">
          <div className="flex flex-col items-center gap-4">
            <p>{t('error')}: {error}</p>
            <Button 
              color="primary"
              onClick={loadData}
              startContent={<FiRefreshCw />}
            >
              {t('retry')}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!girisKayitlari || girisKayitlari.length === 0) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-10">
          <div className="flex flex-col items-center gap-4">
            <p>{t('noData')}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table aria-label={t('tableTitle')}>
        <TableHeader>
          <TableColumn><div className="flex items-center gap-1"><FiUser /> {t('columns.role')}</div></TableColumn>
          <TableColumn><div className="flex items-center gap-1"><FiUser /> {t('columns.email')}</div></TableColumn>
          <TableColumn><div className="flex items-center gap-1"><FiCalendar /> {t('columns.date')}</div></TableColumn>
          <TableColumn><div className="flex items-center gap-1"><FiClock /> {t('columns.time')}</div></TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell>{item.rol || "-"}</TableCell>
                <TableCell>{item.e_posta || "-"}</TableCell>
                <TableCell>{item.giris_tarihi || "-"}</TableCell>
                <TableCell>{item.giris_saati || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {t('noDataInTable')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {girisKayitlari.length > rowsPerPage && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(girisKayitlari.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            aria-label={t('paginationLabel')}
          />
        </div>
      )}
    </div>
  );
};

export default GirisKayitlari;