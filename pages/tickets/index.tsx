import { Badge, Table } from '@mantine/core';
import router from 'next/router';
import React from 'react';
import useSWR from 'swr';
import ActionIconsGroup from '../../components/ActionIconGroup';
import AppShellLayout from '../../components/AppShellLayout';
import HeaderGroup from '../../components/HeaderGroup';
import LoadingIcon from '../../components/ui/LoadingIcon';
import useAuthentication from '../../hooks/useAuthentication';
import fetcher from '../../utils/fetcher';

interface TicketType {
  id: string;
  containerNumber: string | null;
  entryTime: string | null;
  exitTime: string | null;
  createdById: string;
  truckId: string;
  organizationId: string;
  facilityId: string;
  isInvoiceCreated: boolean;
  createdAt: Date;
  updatedAt: Date;
  facility: FacilityType;
  truck: TruckType;
  organization: OrganizationType;
}

interface FacilityType {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationType {
  id: string;
  name: string;
  address: string;
  taxNumber: string;
  taxOffice: string;
  invoiceAddress: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TruckType {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: string;
  status: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

const columns = [
  { key: 'createdAt', title: 'Tarih' },
  { key: 'plateNumber', title: 'Plaka' },
  { key: 'containerNumber', title: 'Konteyner Numarası' },
  { key: 'ticketStatus', title: 'Yük Durumu' },
  { key: 'totalPrice', title: 'Nakliye Tutarı' },
  { key: 'isInvoiceCreated', title: 'Fatura Durumu' },
];

const definedHours = 6 * 60; // 6 saat
const baseShippingPrice = 100; // Sabit nakliye ücreti
const waitingPricePerCount = 20; // Bekleme başına ek ücret

const Tickets = () => {
  const authenticationData = useAuthentication();
  const { data, error } = useSWR('/api/tickets', fetcher);
  // kaç saatte bir bekleme olacağını belirleyen değişken

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
      <HeaderGroup modalTitle="Yeni İş Ekle" title="İş Listesi" addButtonTitle="Yeni İş Ekle" />

      <Table
        verticalSpacing="md"
        horizontalSpacing="md"
        fontSize="sm"
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
          {data.map((row: TicketType, rowIndex: number) => {
            const entryTime = row.entryTime ? new Date(row.entryTime) : null;
            const exitTime = row.exitTime ? new Date(row.exitTime) : null;
            const now = new Date();
            console.log({ entryTime, exitTime, now });

            let waitingTime = 0;
            if (entryTime && exitTime) {
              const timeDiff = exitTime.getTime() - entryTime.getTime(); // Milisaniye cinsinden fark
              waitingTime = Math.floor(timeDiff / (1000 * 60)); // dakika cinsinden fark
            }

            const waitingCount = Math.ceil(waitingTime / definedHours); // Her 6 saatte bir bekleme
            console.log({ waitingTime, waitingCount });

            let currentWaiting = 0;
            if (entryTime && !exitTime) {
              const timeDiff = now.getTime() - entryTime.getTime(); // Milisaniye cinsinden fark
              currentWaiting = Math.floor(timeDiff / (1000 * 60)); // dakika cinsinden fark
            }

            console.log({ currentWaiting });

            const totalWaitingPrice = waitingCount * waitingPricePerCount;
            const totalShippingPrice = baseShippingPrice + totalWaitingPrice;

            return (
              <tr key={rowIndex}>
                <td style={{ width: '8%' }}>
                  {new Date(row.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td style={{ width: '8%' }}>{row.truck?.plateNumber || '-'}</td>
                <td style={{ width: '14%' }}>{row.containerNumber || '-'}</td>
                <td style={{ width: '18%' }}>
                  {row.entryTime && !row.exitTime && currentWaiting >= definedHours ? (
                    <Badge color="yellow" variant="filled">
                      {`BEKLEME (${Math.floor(currentWaiting / definedHours)})`}
                    </Badge>
                  ) : row.entryTime && !row.exitTime ? (
                    <Badge color="green" variant="filled">
                      GİRİŞ YAPILDI
                    </Badge>
                  ) : (
                    <Badge color="red" variant="filled">
                      {`YÜK BOŞALTILDI (${waitingCount})`}
                    </Badge>
                  )}
                </td>
                <td style={{ width: '12%' }}>{totalShippingPrice}9999 TL</td>
                <td>
                  {row.isInvoiceCreated === true ? (
                    <Badge color="green" variant="filled">
                      KESİLDİ
                    </Badge>
                  ) : (
                    <Badge color="red" variant="filled">
                      KESİLMEDİ
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
            );
          })}
        </tbody>
      </Table>
    </AppShellLayout>
  );
};
export default Tickets;
