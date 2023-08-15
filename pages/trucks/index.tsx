import { ActionIcon, Divider, Flex, Group, Modal, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPlus, IconSettings, IconTrashOff } from '@tabler/icons';
import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import CustomButton from '../../components/ui/CustomButton';
import useAuthentication from '../../hooks/useAuthentication';

interface RowData {
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
}

const RowData: RowData[] = [
  {
    plateNumber: '34 ABC 34',
    driverName: 'Ahmet Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17.5,
  },
  {
    plateNumber: '34 DEF 34',
    driverName: 'Mehmet Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17,
  },
  {
    plateNumber: '34 GHI 34',
    driverName: 'Ali Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 27.5,
  },
  {
    plateNumber: '34 JKL 34',
    driverName: 'Veli Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 12.5,
  },
  {
    plateNumber: '34 MNO 34',
    driverName: 'Hasan Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34.5,
  },
  {
    plateNumber: '34 PQR 34',
    driverName: 'Hüseyin Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 27.5,
  },
  {
    plateNumber: '34 STU 34',
    driverName: 'Ayşe Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 11.5,
  },
  {
    plateNumber: '34 VWX 34',
    driverName: 'Fatma Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17,
  },
  {
    plateNumber: '34 YZ 34',
    driverName: 'Zeynep Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 12,
  },
  {
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
];

const Trucks = () => {
  const authenticationData = useAuthentication();
  const [openedNewTruckButton, { open: openNewTruckButton, close: closeNewTruckButton }] =
    useDisclosure(false);
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Bu aracı silmek istediğinizden emin misiniz?',
      centered: true,
      children: (
        <Text size="sm">Bu işlem geri alınamaz. Bu araçla ilgili tüm veriler silinecektir.</Text>
      ),
      labels: { confirm: 'Aracı Sil', cancel: 'İptal' },
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

  // TODO: Araç listesini API'den çek ve ayrı bir component olarak yaz
  const rows = RowData.map((data, index) => (
    <tr key={index}>
      <td>{data.plateNumber}</td>
      <td>{data.driverName}</td>
      <td>{data.driverPhone}</td>
      <td>{data.capacity}</td>
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
          Araç Listesi
        </Text>

        <Modal
          opened={openedNewTruckButton}
          onClose={closeNewTruckButton}
          title="Yeni Araç Ekle"
          centered
        >
          {/* yeni iş ekleme modal buraya */}
        </Modal>

        <Group position="center">
          <CustomButton
            label="Yeni Araç Ekle"
            onClick={openNewTruckButton}
            loading={openedNewTruckButton}
            icon={<IconPlus size="1rem" />}
          />
        </Group>
      </Flex>

      <Divider my="sm" size={1} />

      <Modal opened={openedUpdateIcon} onClose={closeUpdateIcon} title="Araç Güncelle" centered>
        {/* araç güncelleme modal buraya */}
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
            <th>Plaka</th>
            <th>Sürücü</th>
            <th>Telefon Numarası</th>
            <th>Kapasite</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </AppShellLayout>
  );
};

export default Trucks;
