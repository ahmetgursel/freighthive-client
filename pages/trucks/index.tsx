import { Badge, Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR from 'swr';
import AppShellLayout from '../../components/AppShellLayout';
import ActionIconsGroup from '../../components/ui/ActionIconGroup';
import HeaderGroup from '../../components/ui/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';
import fetcher from '../../utils/fetcher';

interface TruckType {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: string;
}

const columns = [
  { key: 'plateNumber', title: 'Plaka' },
  { key: 'driverName', title: 'Sürücü' },
  { key: 'driverPhone', title: 'Telefon Numarası' },
  { key: 'capacity', title: 'Kapasite' },
  { key: 'status', title: 'Durum' },
];

const Trucks = () => {
  const authenticationData = useAuthentication();
  const { data, error } = useSWR('/api/trucks', fetcher);

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (authenticationData.isAuthenticated === false) {
    // Eğer kullanıcı oturum açmamışsa /login sayfasına yönlendir
    router.push('/login');
    return null;
  }

  if (!data && !error) {
    // Veri henüz yüklenmemişse veya hata oluşmamışsa loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (error) {
    // Hata durumunda hata mesajını görüntüle
    // TODO: error page oluştur
    return <div>Hata oluştu: {error.message}</div>;
  }

  return (
    <AppShellLayout>
      <HeaderGroup
        modalTitle="Yeni Araç Ekle"
        title="Araç Listesi"
        addButtonTitle="Yeni Araç Ekle"
      />

      <Table
        verticalSpacing="md"
        horizontalSpacing="md"
        fontSize="lg"
        my="md"
        mx="md"
        striped
        highlightOnHover
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((row: TruckType, rowIndex: number) => (
            <tr key={rowIndex}>
              <td>{row.plateNumber}</td>
              <td>{row.driverName}</td>
              <td>{row.driverPhone}</td>
              <td>{row.capacity}</td>
              <td>
                {row.status === 'LOADED' ? (
                  <Badge color="red" variant="filled">
                    YÜKLÜ
                  </Badge>
                ) : (
                  <Badge color="green" variant="filled">
                    BOŞ
                  </Badge>
                )}
              </td>
              <td>
                <ActionIconsGroup
                  rowId={row.id}
                  updateModalTitle="Araç Kaydını Güncelle"
                  deleteModalTitle="Bu araç kaydını silmek istediğinizden emin misiniz?"
                  deleteModalText="Bu işlem geri alınamaz. Bu araç kaydıyla ilgili tüm veriler silinecektir."
                  deleteModalConfirmButtonLabel="Araç Kaydını Sil"
                  deleteModalCancelButtonLabel="İptal"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AppShellLayout>
  );
};

export default Trucks;
