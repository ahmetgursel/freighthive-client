import { Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR from 'swr';
import AppShellLayout from '../../components/AppShellLayout';

import ActionIconsGroup from '../../components/ActionIconGroup';
import HeaderGroup from '../../components/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';
import fetcher from '../../utils/fetcher';

interface FacilityType {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

const columns = [
  { key: 'name', title: 'İsim' },
  { key: 'address', title: 'Adres' },
  { key: 'city', title: 'Şehir' },
  { key: 'country', title: 'Ülke' },
];

const Facilities = () => {
  const authenticationData = useAuthentication();
  const { data, error } = useSWR('/api/facilities', fetcher);

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
        modalTitle="Yeni Depo Ekle"
        title="Depo Listesi"
        addButtonTitle="Yeni Depo Ekle"
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
          {data.map((row: FacilityType, rowIndex: number) => (
            <tr key={rowIndex}>
              <td>{row.name}</td>
              <td>{row.address}</td>
              <td>{row.city}</td>
              <td>{row.country}</td>
              <td>
                <ActionIconsGroup
                  rowId={row.id}
                  updateModalTitle="Depo Kaydını Güncelle"
                  deleteModalTitle="Bu depo kaydını silmek istediğinizden emin misiniz?"
                  deleteModalText="Bu işlem geri alınamaz. Bu depo kaydıyla ilgili tüm veriler silinecektir."
                  deleteModalConfirmButtonLabel="Depo Kaydını Sil"
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

export default Facilities;
