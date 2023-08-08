import { AppShell, Box, Header, NavLink, Navbar } from '@mantine/core';
import {
  IconAffiliate,
  IconBuildingWarehouse,
  IconGauge,
  IconReport,
  IconTicket,
  IconTir,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { UserCard } from '../ui/UserCard';

interface AppShellLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  icon: any;
  label: string;
  description: string;
  href: string;
}

const data: MenuItem[] = [
  {
    icon: IconGauge,
    label: 'Dashboard',
    description: 'Özet Grafik ve Bilgiler',
    href: '/dashboard',
  },
  {
    icon: IconTicket,
    label: 'Lojistik Takip Tablosu',
    description: 'Oluşturulan İşlerin Bilgileri',
    href: '/tickets',
  },
  {
    icon: IconTir,
    label: 'Araç Kayıtları',
    description: 'Araç ve Şoför Bilgileri',
    href: '/trucks',
  },
  {
    icon: IconBuildingWarehouse,
    label: 'Depo Kayıtları',
    description: 'Depo ve Adres Bilgileri',
    href: '/facilities',
  },
  {
    icon: IconAffiliate,
    label: 'Cari Kayıtları',
    description: 'Firma ve Adres Bilgileri',
    href: '/organizations',
  },
  { icon: IconReport, label: 'Raporlar', description: 'Raporlar', href: '/reports' },
];

const AppShellLayout: React.FC<AppShellLayoutProps> = ({ children }) => {
  const router = useRouter();

  const currentPath = router.pathname;

  const items = data.map((item) => (
    <NavLink
      key={item.label}
      active={item.href === currentPath}
      label={item.label}
      description={item.description}
      icon={<item.icon size="1rem" stroke={1.5} />}
      component="a"
      href={item.href}
      sx={(theme) => ({ borderRadius: theme.radius.sm })}
    />
  ));

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section grow mt="md">
            <Box>{items}</Box>
          </Navbar.Section>
          <Navbar.Section>
            <UserCard name="Ahmet Gürsel" email="ahmetgursel@protonmail.com" />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          Logo, Dark/Light Tema Butonu ve Logouut Butonu Buraya Gelecek
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default AppShellLayout;
