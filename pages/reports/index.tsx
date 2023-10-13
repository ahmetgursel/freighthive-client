import router from 'next/router';
import React from 'react';
import AppShellLayout from '../../components/AppShellLayout';
import useAuthentication from '../../hooks/useAuthentication';

const Reports = () => {
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
      <h1>Reports</h1>
    </AppShellLayout>
  );
};

export default Reports;
