import { ActionIcon, Button, Divider, Flex, Group, Modal, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPlus, IconSettings, IconTrashOff } from '@tabler/icons';
import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import useAuthentication from '../../hooks/useAuthentication';

interface OrganizationRowData {
  name: string;
  address: string;
  taxNumber: string;
  taxOffice: string;
  invoiceAddress: string;
}

const OrganizationRowData: OrganizationRowData[] = [
  {
    name: 'ABC Ltd. Şti.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '1234567890',
    taxOffice: 'Istanbul V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'XYZ Ticaret A.Ş.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'MNO Teknoloji Ltd.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '5678901234',
    taxOffice: 'Izmir V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'PQR Danışmanlık',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'DEF Holding A.Ş.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '5678901234',
    taxOffice: 'Izmir V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'GHI Enerji Ltd. Şti.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '1234567890',
    taxOffice: 'Istanbul V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'JKL Gıda Sanayi',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'MNO Teknoloji Ltd.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '5678901234',
    taxOffice: 'Izmir V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'PQR Danışmanlık',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'DEF Holding A.Ş.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '5678901234',
    taxOffice: 'Izmir V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'ABC Ltd. Şti.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '1234567890',
    taxOffice: 'Istanbul V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'XYZ Ticaret A.Ş.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'MNO Teknoloji Ltd.',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '5678901234',
    taxOffice: 'Izmir V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    name: 'PQR Danışmanlık',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    taxNumber: '9876543210',
    taxOffice: 'Ankara V.D',
    invoiceAddress: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const Organizations = () => {
  const authenticationData = useAuthentication();
  const [
    openedNewOrganizationButton,
    { open: openNewOrganizationButton, close: closeNewOrganizationButton },
  ] = useDisclosure(false);
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Bu cari kaydı silmek istediğinizden emin misiniz?',
      centered: true,
      children: (
        <Text size="sm">
          Bu işlem geri alınamaz. Bu cari kayıt ile ilgili tüm veriler silinecektir.
        </Text>
      ),
      labels: { confirm: 'Cari Kayıt Sil', cancel: 'İptal' },
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

  const rows = OrganizationRowData.map((data, index) => (
    <tr key={index}>
      <td>{data.name}</td>
      <td>{data.address}</td>
      <td>{data.taxNumber}</td>
      <td>{data.taxOffice}</td>
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
          Cari Kayıt Listesi
        </Text>

        <Modal
          opened={openedNewOrganizationButton}
          onClose={closeNewOrganizationButton}
          title="Yeni Cari Kayıt Ekle"
          centered
        >
          {/* yeni cari kayıt ekleme modal buraya */}
        </Modal>

        <Group position="center">
          <Button
            size="md"
            radius="lg"
            compact
            variant="light"
            rightIcon={<IconPlus size="1rem" />}
            onClick={openNewOrganizationButton}
            loading={openedNewOrganizationButton}
            loaderPosition="right"
          >
            Yeni Cari Kayıt Ekle
          </Button>
        </Group>
      </Flex>

      <Divider my="sm" size={1} />

      <Modal
        opened={openedUpdateIcon}
        onClose={closeUpdateIcon}
        title="Cari Kayıt Güncelle"
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
            <th style={{ width: '20%' }}>İsim</th>
            <th>Adres</th>
            <th style={{ width: '15%' }}>Vergi Numarası</th>
            <th style={{ width: '15%' }}>Vergi Dairesi</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </AppShellLayout>
  );
};

export default Organizations;
