import React from 'react';
import { useForm } from '@mantine/form';
import { Box, Button, Grid, Group, Select, TextInput } from '@mantine/core';
import { IconCheck, IconSquarePlus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { mutate } from 'swr';

interface TruckType {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: string;
}

interface TruckValueType {
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: string;
}

interface UpdateTruckModalProps {
  truckId: string;
  rowData: TruckType;
}

const UpdateTruckModal: React.FC<UpdateTruckModalProps> = ({ truckId, rowData }) => {
  const form = useForm({
    initialValues: {
      plateNumber: rowData.plateNumber,
      driverName: rowData.driverName,
      driverPhone: rowData.driverPhone,
      capacity: rowData.capacity,
      status: rowData.status === 'LOADED' ? 'YÜKLÜ' : 'BOŞ',
    },
    validate: {
      plateNumber: (value) => (!value ? 'Plaka numarası zorunludur' : null),
      driverName: (value) => (!value ? 'Sürücü ismi zorunludur' : null),
      driverPhone: (value) => (!value ? 'Sürücü telefon numarası zorunludur' : null),
      capacity: (value) =>
        Number.isNaN(Number(value)) || value === 0 ? 'Geçerli bir kapasite giriniz' : null,
    },
  });

  const handleSubmit = async (values: TruckValueType) => {
    try {
      // status değerini YÜKLÜ ya da BOŞ'tan LOADED ya da UNLOADED'a çevir
      const { status, capacity, ...otherValues } = values;
      const transformedStatus = status === 'YÜKLÜ' ? 'LOADED' : 'UNLOADED';
      const transformedValues = {
        ...otherValues,
        capacity: Number(capacity),
        status: transformedStatus,
      };

      const response = await fetch(`/api/trucks/${truckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedValues),
      });

      if (response.ok) {
        mutate('/api/trucks');
        notifications.show({
          color: 'teal',
          title: 'Araç başarıyla güncellendi',
          message:
            'Araç başarıyla güncellendi. Yeni bir araç güncellemek için tekrar formu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        throw new Error('Araç eklenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Araç güncellenirken hata oluştu',
        message: 'Malesef araç güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
        icon: <IconX size="1rem" />,
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter="xl">
        <Grid.Col md={6}>
          <TextInput
            id="plateNumber"
            placeholder="Plaka Numarası"
            label="Plaka Numarası"
            description="Lütfen Araç Plaka Numarasını Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('plateNumber')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="driverName"
            placeholder="Sürücü İsmi"
            label="Sürücü İsmi"
            description="Lütfen Araç Sürücüsünün İsmini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('driverName')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="driverPhone"
            placeholder="Sürücü Telefon Numarası"
            label="Sürücü Telefon Numarası"
            description="Lütfen Araç Sürücüsünün Telefon Numarasını Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('driverPhone')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="capacity"
            placeholder="Araç Kapasitesi"
            label="Araç Kapasitesi"
            description="Lütfen Araç Kapasitesini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('capacity')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Select
            id="status"
            description="Lütfen Araç Yük Durumunu Girin"
            data={['YÜKLÜ', 'BOŞ']}
            defaultValue="YÜKLÜ"
            label="Araç Durumu"
            radius="lg"
            withAsterisk
            {...form.getInputProps('status')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Box>
            <Group position="right" mt={36}>
              <Button type="submit" leftIcon={<IconSquarePlus size="1rem" />}>
                Araç Güncelle
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default UpdateTruckModal;
