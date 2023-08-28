import { Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
  const { data, error: swrError } = useSWR('/api/facilities', fetcher);

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
      const response = await fetch(`/api/facilities/${rowId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        mutate('/api/facilities');
        notifications.show({
          color: 'teal',
          title: 'Depo başarıyla silindi',
          message:
            'Depo başarıyla silindi. Yeni bir depo silmek için tekrar silme ikonunu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        //TODO: error handling geliştirilmeli
        throw new Error('Depo silinirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Depo silinirken hata oluştu',
        message: 'Malesef depo silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        icon: <IconX size="1rem" />,
        autoClose: 5000,
      });
    }
  };

  return (
    <AppShellLayout>
      <HeaderGroup
        modalTitle="Yeni Depo Ekle"
        title="Depo Listesi"
        addButtonTitle="Yeni Depo Ekle"
        addButtonModalForm={<h1>Yeni Depo Kaydı Ekle</h1>}
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
                  updateButtonModalForm={<h1>Depo Kaydını Güncelle</h1>}
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

export default Facilities;
