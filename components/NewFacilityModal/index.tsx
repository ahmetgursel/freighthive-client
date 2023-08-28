import { Box, Button, Grid, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { IconCheck, IconSquarePlus, IconX } from '@tabler/icons-react';
import React from 'react';
import { mutate } from 'swr';

interface FacilityType {
  name: string;
  address: string;
  city: string;
  country: string;
}

const NewFacilityModal = () => {
  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      city: '',
      country: '',
    },
    validate: {
      name: (value) => (!value ? 'Depo ismi zorunludur' : null),
      address: (value) => (!value ? 'Depo adresi zorunludur' : null),
      city: (value) => (!value ? 'Şehir zorunludur' : null),
      country: (value) => (!value ? 'Ülke zorunludur' : null),
    },
  });

  const handleSubmit = async (values: FacilityType) => {
    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        mutate('/api/facilities');
        notifications.show({
          color: 'teal',
          title: 'Depo başarıyla eklendi',
          message:
            'Depo başarıyla eklendi. Yeni bir depo eklemek için tekrar formu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        throw new Error('Depo eklenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Depo eklenirken hata oluştu',
        message: 'Malesef depo eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
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
            placeholder="Depo İsmi"
            label="Depo İsmi"
            description="Lütfen Depo İsmini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="address"
            placeholder="Depo Adresi"
            label="Depo Adresi"
            description="Lütfen Depo Adresini Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('address')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="city"
            placeholder="Şehir"
            label="Şehir"
            description="Lütfen Şehir Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('city')}
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <TextInput
            id="country"
            placeholder="Ülke"
            label="Ülke"
            description="Lütfen Ülke Girin"
            radius="lg"
            withAsterisk
            {...form.getInputProps('country')}
          />
        </Grid.Col>
        <Grid.Col md={12}>
          <Box>
            <Group position="right" mt={36}>
              <Button type="submit" leftIcon={<IconSquarePlus size="1rem" />}>
                Depo Ekle
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default NewFacilityModal;
