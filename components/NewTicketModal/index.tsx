import React from 'react';
import { Autocomplete, Box, Button, Grid, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCalendarStats, IconCheck, IconSquarePlus, IconX } from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import fetcher from '../../utils/fetcher';
import LoadingIcon from '../ui/LoadingIcon';

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

const NewTicketModal = () => {
  const form = useForm({
    initialValues: {
      containerNumber: '',
      entryTime: '',
      exitTime: '',
      plateNumber: '',
      facilityName: '',
      organizationName: '',
      isInvoiceCreated: 'KESİLMEDİ',
    },
    validate: {
      plateNumber: (value) => (!value ? 'Plaka Numarası Gerekli' : null),
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

  const truckPlateNumbers = truckData?.map((truck: TruckType) => truck.plateNumber) || [];
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

      // fatura kesilme durumunu boolean'a çevir
      const transformedStatus = values.isInvoiceCreated !== 'KESİLMEDİ';
      const transformedEntryTime = values.entryTime
        ? new Date(values.entryTime).toISOString()
        : null;
      const transformedExitTime = values.exitTime ? new Date(values.exitTime).toISOString() : null;

      const ticketBody = {
        containerNumber: values.containerNumber || null,
        entryTime: transformedEntryTime,
        exitTime: transformedExitTime,
        facilityId: selectedFacility?.id || null,
        organizationId: selectedOrganization?.id || null,
        truckId: selectedTruck?.id || null,
        isInvoiceCreated: transformedStatus,
      };

      const updatedTruckBody = {
        plateNumber: selectedTruck?.plateNumber,
        driverName: selectedTruck?.driverName,
        driverPhone: selectedTruck?.driverPhone,
        capacity: Number(selectedTruck?.capacity),
        status: 'LOADED',
      };

      const ticketResponse = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketBody),
      });

      const truckResponse = await fetch(`/api/trucks/${selectedTruck?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTruckBody),
      });

      if (ticketResponse.ok && truckResponse.ok) {
        form.reset();
        mutate('/api/tickets');
        notifications.show({
          color: 'teal',
          title: 'İş kaydı başarıyla eklendi',
          message:
            'İş kaydı başarıyla eklendi. Yeni bir iş kaydı eklemek için tekrar formu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        throw new Error('İş kaydı eklenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'İş kaydı eklenirken hata oluştu',
        message: 'Malesef iş kaydı eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
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
            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
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
            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
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
            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
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
                Yeni İş Ekle
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default NewTicketModal;
