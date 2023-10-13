import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import useAuthentication from '../../hooks/useAuthentication';

const Dashboard = () => {
  const authenticationData = useAuthentication();

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse "Loading..." görüntüle
    return <h1>Loading...</h1>;
  }

  if (authenticationData.isAuthenticated === false) {
    // Eğer kullanıcı oturum açmamışsa /login sayfasına yönlendir
    router.push('/login');
    return null;
  }

  return (
    <AppShellLayout>
      <h1>Dashboard</h1>
    </AppShellLayout>
  );
};

export default Dashboard;
