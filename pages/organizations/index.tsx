import { Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import ActionIconsGroup from '../../components/ActionIconGroup';
import AppShellLayout from '../../components/AppShellLayout';
import HeaderGroup from '../../components/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';
import fetcher from '../../utils/fetcher';
import NewOrganizationModal from '../../components/NewOrganizationModal';

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
  const { data, error: swrError } = useSWR('/api/organizations', fetcher);

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (authenticationData.isAuthenticated === false) {
    // Eğer kullanıcı oturum açmamışsa /login sayfasına yönlendir
    router.push('/login');
    return null;
  }

  if (!data && !swrError) {
    // Veri henüz yüklenmemişse veya hata oluşmamışsa loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (swrError) {
    // Hata durumunda hata mesajını görüntüle
    // TODO: error page oluştur
    // FIXME: Sayfa boş geliyorsa network hatası veriyor
    return <div>Hata oluştu: {swrError.message}</div>;
  }

  const handleDeleteConfirmButton = async (rowId: string) => {
    try {
      const response = await fetch(`/api/organizations/${rowId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        mutate('/api/organizations');
        notifications.show({
          color: 'teal',
          title: 'Cari kayıt başarıyla silindi',
          message:
            'Cari kayıt başarıyla silindi. Yeni bir cari kayıt silmek için tekrar silme ikonunu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        //TODO: error handling geliştirilmeli
        throw new Error('Cari kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Cari kayıt silinirken hata oluştu',
        message: 'Malesef cari kayıt silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        icon: <IconX size="1rem" />,
        autoClose: 5000,
      });
    }
  };

  return (
    <AppShellLayout>
      <HeaderGroup
        modalTitle="Yeni Cari Kayıt Ekle"
        title="Cari Listesi"
        addButtonTitle="Yeni Cari Kayıt Ekle"
        addButtonModalForm={<NewOrganizationModal />}
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
                  updateButtonModalForm={<h1>Cari Kaydını Güncelle</h1>}
                  handleDeleteConfirmButton={handleDeleteConfirmButton}
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
