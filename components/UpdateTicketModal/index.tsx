import { Autocomplete, Box, Button, Grid, Group, Select, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendarStats, IconCheck, IconSquarePlus, IconX } from '@tabler/icons-react';
import React from 'react';
import useSWR, { mutate } from 'swr';
import fetcher from '../../utils/fetcher';
import LoadingIcon from '../ui/LoadingIcon';

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

interface UpdateTicketModalProps {
  ticketId: string;
  rowData: TicketType;
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({ ticketId, rowData }) => {
  const form = useForm({
    initialValues: {
      containerNumber: rowData.containerNumber ? rowData.containerNumber : '',
      entryTime: rowData.entryTime ? new Date(rowData.entryTime) : '',
      exitTime: rowData.exitTime ? new Date(rowData.exitTime) : '',
      plateNumber: rowData.truck?.plateNumber ? rowData.truck.plateNumber : '',
      facilityName: rowData.facility.name,
      organizationName: rowData.organization.name,
      isInvoiceCreated: rowData.isInvoiceCreated ? 'KESİLDİ' : 'KESİLMEDİ',
    },
    validate: {
      organizationName: (value) => (!value ? 'Firma İsmi Gerekli' : null),
      facilityName: (value) => (!value ? 'Varış Birimi Gerekli' : null),
      isInvoiceCreated: (value) => (!value ? 'Fatura Durumu Gerekli' : null),
    },
  });

  const { data: truckData, error: truckError } = useSWR('/api/trucks', fetcher);

  const { data: organizationData, error: organizationError } = useSWR(
    '/api/organizations',
    fetcher
  );

  const { data: facilityData, error: facilityError } = useSWR('/api/facilities', fetcher);

  if (
    !truckData &&
    !truckError &&
    !organizationData &&
    !organizationError &&
    !facilityData &&
    !facilityError
  ) {
    // Veri henüz yüklenmemişse veya hata oluşmamışsa loading ikonunu görüntüle
    return <LoadingIcon />;
  }

  if (truckError || organizationError || facilityError) {
    return (
      <div>
        Hata oluştu: {truckError?.message || organizationError?.message || facilityError?.message}
      </div>
    );
  }

  const truckPlateNumbers =
    truckData
      ?.filter((truck: TruckType) => truck.status === 'UNLOADED') // Sadece UNLOADED olan kamyonları seçin
      .map((truck: TruckType) => truck.plateNumber) || [];
  const organizationNames =
    organizationData?.map((organization: OrganizationType) => organization.name) || [];
  const facilityNames = facilityData?.map((facility: FacilityType) => facility.name) || [];

  const handleSubmit = async (values: any) => {
    try {
      // seçilen aracın id'si
      const selectedTruck = truckData?.find(
        (truck: TruckType) => truck.plateNumber === values.plateNumber
      );

      // seçilen firmanın id'si
      const selectedOrganization = organizationData?.find(
        (organization: OrganizationType) => organization.name === values.organizationName
      );

      // seçilen depo birimin id'si
      const selectedFacility = facilityData?.find(
        (facility: FacilityType) => facility.name === values.facilityName
      );

      const transformedStatus = values.isInvoiceCreated !== 'KESİLMEDİ';
      const transformedEntryTime = values.entryTime
        ? new Date(values.entryTime).toISOString()
        : null;
      const transformedExitTime = values.exitTime ? new Date(values.exitTime).toISOString() : null;

      const ticketBody = {
        containerNumber: values.containerNumber || null,
        entryTime: transformedEntryTime || null,
        exitTime: transformedExitTime || null,
        facilityId: selectedFacility?.id || null,
        organizationId: selectedOrganization?.id || null,
        truckId: selectedTruck?.id || null,
        isInvoiceCreated: transformedStatus,
      };

      const unloadedTruckBody = {
        plateNumber: rowData.truck?.plateNumber,
        driverName: rowData.truck?.driverName,
        driverPhone: rowData.truck?.driverPhone,
        capacity: Number(rowData.truck?.capacity),
        status: 'UNLOADED',
      };

      const loadedTruckBody = {
        plateNumber: selectedTruck?.plateNumber,
        driverName: selectedTruck?.driverName,
        driverPhone: selectedTruck?.driverPhone,
        capacity: Number(selectedTruck?.capacity),
        status: 'LOADED',
      };

      const ticketResponse = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketBody),
      });

      if (rowData.truck?.plateNumber !== selectedTruck?.plateNumber) {
        if (rowData.truck?.plateNumber && selectedTruck?.plateNumber) {
          const unloadedTruckResponse = await fetch(`/api/trucks/${rowData.truck?.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(unloadedTruckBody),
          });

          const loadedTruckResponse = await fetch(`/api/trucks/${selectedTruck.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loadedTruckBody),
          });

          if (!unloadedTruckResponse.ok || !loadedTruckResponse.ok) {
            throw new Error('İş kaydı güncellenirken bir hata oluştu');
          }
        } else if (!rowData.truck?.plateNumber && selectedTruck?.plateNumber) {
          const loadedTruckResponse = await fetch(`/api/trucks/${selectedTruck.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loadedTruckBody),
          });

          if (!loadedTruckResponse.ok) {
            throw new Error('İş kaydı güncellenirken bir hata oluştu');
          }
        } else if (rowData.truck?.plateNumber && !selectedTruck?.plateNumber) {
          const unloadedTruckResponse = await fetch(`/api/trucks/${rowData.truck?.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(unloadedTruckBody),
          });

          if (!unloadedTruckResponse.ok) {
            throw new Error('İş kaydı güncellenirken bir hata oluştu');
          }
        } else {
          return;
        }
      }

      if (ticketResponse.ok) {
        mutate('/api/tickets');
        notifications.show({
          color: 'teal',
          title: 'İş kaydı başarıyla güncellendi',
          message:
            'İş kaydı başarıyla güncellendi. Yeni bir iş kaydı güncellemek için tekrar formu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        throw new Error('İş kaydı güncellenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'İş kaydı güncellenirken hata oluştu',
        message: 'Malesef iş kaydı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
        icon: <IconX size="1rem" />,
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter="xl">
        <Grid.Col md={6}>
          <Autocomplete
            id="plateNumber"
            placeholder="Plaka Numarası"
            label="Plaka Numarası"
            description="Lütfen Araç Plaka Numarasını Seçin"
            radius="lg"
            data={truckPlateNumbers}
            transitionProps={{
              transition: 'pop-top-left',
              duration: 80,
              timingFunction: 'ease',
            }}
            {...form.getInputProps('plateNumber')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <DateTimePicker
            id="entryTime"
            placeholder="Giriş Tarih ve Saati"
            label="Giriş Tarih ve Saati"
            description="Lütfen Giriş Tarih ve Saatini Girin"
            icon={<IconCalendarStats size="1rem" />}
            radius="lg"
            {...form.getInputProps('entryTime')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Autocomplete
            id="organizationName"
            placeholder="Firma İsmi"
            label="Firma İsmi"
            description="Lütfen Firma İsmini Seçin"
            radius="lg"
            data={organizationNames}
            transitionProps={{
              transition: 'pop-top-left',
              duration: 80,
              timingFunction: 'ease',
            }}
            withAsterisk
            {...form.getInputProps('organizationName')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <DateTimePicker
            id="exitTime"
            placeholder="Çıkış Tarih ve Saati"
            label="Çıkış Tarih ve Saati"
            description="Lütfen Çıkış Tarih ve Saatini Girin"
            icon={<IconCalendarStats size="1rem" />}
            radius="lg"
            {...form.getInputProps('exitTime')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Autocomplete
            id="facilityName"
            placeholder="Varış Birimi"
            label="Varış Birimi"
            description="Lütfen Varış Birimini Seçin"
            radius="lg"
            data={facilityNames}
            transitionProps={{
              transition: 'pop-top-left',
              duration: 80,
              timingFunction: 'ease',
            }}
            withAsterisk
            {...form.getInputProps('facilityName')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="containerNumber"
            placeholder="Konteyner Numarası"
            label="Konteyner Numarası"
            description="Lütfen Konteyner Numarasını Girin"
            radius="lg"
            {...form.getInputProps('containerNumber')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Select
            id="isInvoiceCreated"
            description="Lütfen Fatura Durumunu Seçin"
            data={['KESİLMEDİ', 'KESİLDİ']}
            defaultValue="KESİLMEDİ"
            label="Fatura Durumu"
            radius="lg"
            withAsterisk
            {...form.getInputProps('isInvoiceCreated')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Box>
            <Group position="right" mt={36}>
              <Button type="submit" leftIcon={<IconSquarePlus size="1rem" />}>
                İş Kaydını Güncelle
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default UpdateTicketModal;
