import { Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR from 'swr';
import ActionIconsGroup from '../../components/ActionIconGroup';
import AppShellLayout from '../../components/AppShellLayout';
import HeaderGroup from '../../components/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';
import fetcher from '../../utils/fetcher';

interface OrganizationType {
  id: string;
  name: string;
  address: string;
  taxNumber: string;
  taxOffice: string;
}

const columns = [
  { key: 'name', title: 'İsim' },
  { key: 'address', title: 'Adres' },
  { key: 'taxNumber', title: 'Vergi Numarası' },
  { key: 'taxOffice', title: 'Vergi Dairesi' },
];

const Organizations = () => {
  const authenticationData = useAuthentication();
  const { data, error } = useSWR('/api/organizations', fetcher);

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
        modalTitle="Yeni Cari Kayıt Ekle"
        title="Cari Listesi"
        addButtonTitle="Yeni Cari Kayıt Ekle"
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
          {data.map((row: OrganizationType, rowIndex: number) => (
            <tr key={rowIndex}>
              <td>{row.name}</td>
              <td>{row.address}</td>
              <td>{row.taxNumber}</td>
              <td>{row.taxOffice}</td>
              <td>
                <ActionIconsGroup
                  rowId={row.id}
                  updateModalTitle="Cari Kaydını Güncelle"
                  deleteModalTitle="Bu cari kaydını silmek istediğinizden emin misiniz?"
                  deleteModalText="Bu işlem geri alınamaz. Bu cari kaydıyla ilgili tüm veriler silinecektir."
                  deleteModalConfirmButtonLabel="Cari Kaydını Sil"
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

export default Organizations;
