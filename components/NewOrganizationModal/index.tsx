import { Box, Button, Grid, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { IconCheck, IconSquarePlus, IconX } from '@tabler/icons-react';
import React from 'react';
import { mutate } from 'swr';

interface OrganizationType {
  name: string;
  address: string;
  taxNumber: string;
  taxOffice: string;
  invoiceAddress: string;
}

const NewOrganizationModal = () => {
  const form = useForm<OrganizationType>({
    initialValues: {
      name: '',
      address: '',
      taxNumber: '',
      taxOffice: '',
      invoiceAddress: '',
    },
    validate: {
      name: (value) => (!value ? 'Şirket ismi zorunludur' : null),
      address: (value) => (!value ? 'Şirket adresi zorunludur' : null),
      taxNumber: (value) => (!value ? 'Vergi numarası zorunludur' : null),
      taxOffice: (value) => (!value ? 'Vergi dairesi zorunludur' : null),
      invoiceAddress: (value) => (!value ? 'Fatura adresi zorunludur' : null),
    },
  });

  const handleSubmit = async (values: OrganizationType) => {
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset(); // Formu sıfırla
        mutate('/api/organizations');
        notifications.show({
          color: 'teal',
          title: 'Cari kayıt başarıyla eklendi',
          message:
            'Cari kayıt başarıyla eklendi. Yeni bir kayıt eklemek için tekrar formu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        throw new Error('Cari kayıt eklenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Cari kayıt eklenirken hata oluştu',
        message: 'Malesef cari kayıt eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
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
            id="name"
            placeholder="Şirket İsmi"
            label="Şirket İsmi"
            description="Lütfen Şirket İsmini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="address"
            placeholder="Şirket Adresi"
            label="Şirket Adresi"
            description="Lütfen Şirket Adresini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('address')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="taxNumber"
            placeholder="Vergi Numarası"
            label="Vergi Numarası"
            description="Lütfen Vergi Numarasını Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('taxNumber')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="taxOffice"
            placeholder="Vergi Dairesi"
            label="Vergi Dairesi"
            description="Lütfen Vergi Dairesini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('taxOffice')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="invoiceAddress"
            placeholder="Fatura Adresi"
            label="Fatura Adresi"
            description="Lütfen Fatura Adresini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('invoiceAddress')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Box>
            <Group position="right" mt={36}>
              <Button type="submit" leftIcon={<IconSquarePlus size="1rem" />}>
                Cari Kayıt Ekle
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default NewOrganizationModal;
