import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import CustomTable from '../../components/ui/CustomTable';
import HeaderGroup from '../../components/ui/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';

const columns = [
  { key: 'plateNumber', title: 'Plaka' },
  { key: 'driverName', title: 'Sürücü' },
  { key: 'driverPhone', title: 'Telefon Numarası' },
  { key: 'capacity', title: 'Kapasite' },
];

const data = [
  {
    id: '0asd0a0ba0asd0a0',
    plateNumber: '34 ABC 34',
    driverName: 'Ahmet Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17.5,
  },
  {
    id: '0asd0a0ba0asd0a1',
    plateNumber: '34 DEF 34',
    driverName: 'Mehmet Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17,
  },
  {
    id: '0asd0a0ba0asd0a2',
    plateNumber: '34 GHI 34',
    driverName: 'Ali Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 27.5,
  },
  {
    id: '0asd0a0ba0asd0a3',
    plateNumber: '34 JKL 34',
    driverName: 'Veli Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 12.5,
  },
  {
    id: '0asd0a0ba0asd0a4',
    plateNumber: '34 MNO 34',
    driverName: 'Hasan Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34.5,
  },
  {
    id: '0asd0a0ba0asd0a5',
    plateNumber: '34 PQR 34',
    driverName: 'Hüseyin Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 27.5,
  },
  {
    id: '0asd0a0ba0asd0a6',
    plateNumber: '34 STU 34',
    driverName: 'Ayşe Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 11.5,
  },
  {
    id: '0asd0a0ba0asd0a7',
    plateNumber: '34 VWX 34',
    driverName: 'Fatma Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 17,
  },
  {
    id: '0asd0a0ba0asd0a8',
    plateNumber: '34 YZ 34',
    driverName: 'Zeynep Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 12,
  },
  {
    id: '0asd0a0ba0asd0a9',
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    id: '0asd0a0ba0asd0a010',
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    id: '0asd0a0ba0asd0a011',
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
  {
    id: '0asd0a0ba0asd0a012',
    plateNumber: '34 AHZ 34',
    driverName: 'Osman Gürsel',
    driverPhone: '0532 123 45 67',
    capacity: 34,
  },
];

const Trucks = () => {
  const authenticationData = useAuthentication();

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (authenticationData.isAuthenticated === false) {
    // Eğer kullanıcı oturum açmamışsa /login sayfasına yönlendir
    router.push('/login');
    return null;
  }

  return (
    <AppShellLayout>
      <HeaderGroup modalTitle="Araç Listesi Ekle" title="Araç Listesi" />

      <CustomTable columns={columns} data={data} />
    </AppShellLayout>
  );
};

export default Trucks;
