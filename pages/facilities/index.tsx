import { ActionIcon, Button, Divider, Flex, Group, Modal, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPlus, IconSettings, IconTrashOff } from '@tabler/icons';
import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import useAuthentication from '../../hooks/useAuthentication';

interface FacilityRowData {
  name: string;
  address: string;
  city: string;
  country: string;
}

const FacilityRowData: FacilityRowData[] = [
  {
    name: 'Uzun Depo 1',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Istanbul',
    country: 'Turkey',
  },
  {
    name: 'Geniş Depo 2',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Ankara',
    country: 'Turkey',
  },
  {
    name: 'Köşeli Depo 3',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Izmir',
    country: 'Turkey',
  },
  {
    name: 'Modern Depo 4',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Bursa',
    country: 'Turkey',
  },
  {
    name: 'Küçük Depo 5',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Adana',
    country: 'Turkey',
  },
  {
    name: 'Eski Depo 6',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Antalya',
    country: 'Turkey',
  },
  {
    name: 'Modern Depo 7',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Mersin',
    country: 'Turkey',
  },
  {
    name: 'Geniş Depo 8',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Gaziantep',
    country: 'Turkey',
  },
  {
    name: 'Köşeli Depo 9',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Konya',
    country: 'Turkey',
  },
  {
    name: 'Uzun Depo 10',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Kayseri',
    country: 'Turkey',
  },
  {
    name: 'Uzun Depo 10',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Kayseri',
    country: 'Turkey',
  },
  {
    name: 'Küçük Depo 11',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Eskisehir',
    country: 'Turkey',
  },
  {
    name: 'Eski Depo 12',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Trabzon',
    country: 'Turkey',
  },
  {
    name: 'Modern Depo 13',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Isparta',
    country: 'Turkey',
  },
  {
    name: 'Geniş Depo 14',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Kahramanmaras',
    country: 'Turkey',
  },
  {
    name: 'Köşeli Depo 15',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac fringilla quam.',
    city: 'Giresun',
    country: 'Turkey',
  },
];

const Facilities = () => {
  const authenticationData = useAuthentication();

  const [openedNewFacilityButton, { open: openNewFacilityButton, close: closeNewFacilityButton }] =
    useDisclosure(false);
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Bu depo kaydını silmek istediğinizden emin misiniz?',
      centered: true,
      children: (
        <Text size="sm">
          Bu işlem geri alınamaz. Bu depo kaydı ile ilgili tüm veriler silinecektir.
        </Text>
      ),
      labels: { confirm: 'Depo Kaydı Sil', cancel: 'İptal' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse "Loading..." görüntüle
    return <h1>Loading...</h1>;
  }

  if (authenticationData.isAuthenticated === false) {
    // Eğer kullanıcı oturum açmamışsa /login sayfasına yönlendir
    router.push('/login');
    return null;
  }

  const rows = FacilityRowData.map((data, index) => (
    <tr key={index}>
      <td>{data.name}</td>
      <td>{data.address}</td>
      <td>{data.city}</td>
      <td>{data.country}</td>
      <td>
        <Flex gap="md">
          <ActionIcon>
            <IconSettings size="1rem" onClick={openUpdateIcon} />
          </ActionIcon>
          <ActionIcon color="red.7">
            <IconTrashOff size="1rem" onClick={openDeleteModal} />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  ));

  return (
    <AppShellLayout>
      <Flex gap="md" justify="space-between" align="center" direction="row" wrap="wrap" px="md">
        <Text fz="xl" fw={700}>
          Depo Listesi
        </Text>

        <Modal
          opened={openedNewFacilityButton}
          onClose={closeNewFacilityButton}
          title="Yeni Depo Kayıt Ekle"
          centered
        >
          {/* yeni cari kaydı ekleme modal buraya */}
        </Modal>

        <Group position="center">
          <Button
            size="md"
            radius="lg"
            compact
            variant="light"
            rightIcon={<IconPlus size="1rem" />}
            onClick={openNewFacilityButton}
            loading={openedNewFacilityButton}
            loaderPosition="right"
          >
            Yeni Depo Kayıt Ekle
          </Button>
        </Group>
      </Flex>

      <Divider my="sm" size={1} />

      <Modal
        opened={openedUpdateIcon}
        onClose={closeUpdateIcon}
        title="Depo Kayıt Güncelle"
        centered
      >
        {/* cari kayıt güncelleme modal buraya */}
      </Modal>

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
            <th style={{ width: '25%' }}>İsim</th>
            <th>Adres</th>
            <th style={{ width: '10%' }}>Şehir</th>
            <th style={{ width: '10%' }}>Ülke</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </AppShellLayout>
  );
};

export default Facilities;
