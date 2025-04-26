import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button } from "@heroui/react"
import { FiCalendar, FiUser, FiRefreshCw } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux'
import { fetchEnvanterData, updateEnvanterData } from '../../../store/slices/envanterGuncellemeSlice'
import { useTranslations } from 'next-intl'

const EnvanterGuncelleme = () => {
  const t = useTranslations('app.performans.envanterGuncelleme');
  const dispatch = useDispatch();
  const { filteredData, rawData, loading, error } = useSelector(state => state.envanterGuncelleme);
  const userInfo = useSelector(state => state.userInfo?.data);
  
  const envanterGuncellemeleri = filteredData?.envanterler || [];
  const departments = filteredData?.departments || [];
  
  const [page, setPage] = useState(1);
  const rowsPerPage = 25; // Sayfa başına 25 kayıt göster

  // Verileri yükleme fonksiyonu
  const loadData = useCallback(() => {
    dispatch(fetchEnvanterData());
  }, [dispatch]);
  
  // Bileşen yüklendiğinde verileri getir
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Kullanıcı veya şirket bilgisi değiştiğinde veriyi yeniden filtrele
  useEffect(() => {
    if (userInfo && rawData.envanterler.length > 0) {
      dispatch(updateEnvanterData({ user: userInfo }));
    }
  }, [userInfo, rawData.envanterler, dispatch]);

  // Sayfalama için verileri böl
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return envanterGuncellemeleri.slice(start, end);
  }, [envanterGuncellemeleri, page, rowsPerPage]);

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(envanterGuncellemeleri.length / rowsPerPage);

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>{t('error')}: {error}</p>
        <Button 
          color="primary"
          onClick={loadData}
          startContent={<FiRefreshCw />}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  if (!envanterGuncellemeleri || envanterGuncellemeleri.length === 0) {
    return <p className="text-center">{t('noData')}</p>;
  }

  return (
    <>
      <Table aria-label={t('tableTitle')}>
        <TableHeader>
          <TableColumn><div className="flex items-center gap-1">{t('columns.department')}</div></TableColumn>
          <TableColumn><div className="flex items-center gap-1"><FiUser /> {t('columns.email')}</div></TableColumn>
          <TableColumn><div className="flex items-center gap-1"><FiCalendar /> {t('columns.notificationDate')}</div></TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => {
            const departmentName = departments.find(dept => String(dept.department_id) === String(item.department_id))?.department_name || t('unknown');
            
            return (
              <TableRow key={item.id || index}>
                <TableCell>{departmentName}</TableCell>
                <TableCell>{item.e_posta || "-"}</TableCell>
                <TableCell>{item.bildirim_tarihi || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {envanterGuncellemeleri.length > rowsPerPage && (
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          className="mt-4 flex justify-center"
          aria-label={t('paginationLabel')}
        />
      )}
    </>
  );
};

export default EnvanterGuncelleme;