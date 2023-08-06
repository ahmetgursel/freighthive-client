import { useEffect, useState } from 'react';

const useAuthentication = () => {
  const [authenticationData, setAuthenticationData] = useState<{
    isAuthenticated: boolean;
    user: any;
  } | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch('/api/auth/check-auth', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthenticationData(data);
      }
    };

    checkAuthentication();
  }, []);

  return authenticationData;
};

export default useAuthentication;
