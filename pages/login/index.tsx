import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Popover,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuthentication from '../../hooks/useAuthentication';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const authenticationData = useAuthentication();

  if (authenticationData === null) {
    // Eğer authenticationData henüz gelmemişse "Loading..." görüntüle
    return <h1>Loading...</h1>;
  }

  if (authenticationData.isAuthenticated) {
    // Eğer kullanıcı oturum açmışsa /dashboard sayfasına yönlendir
    router.push('/dashboard');
    return null;
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // TODO: redirect to dashboard
        console.log('Login successful');
        router.push('/dashboard');
      } else {
        // TODO: show error
        console.log('Login failed');
      }
      setLoading(false);
    } catch (error) {
      // TODO: show error
      setLoading(false);
      console.error('An error occurred:', error);
      throw error;
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        mt="xl"
        align="center"
        sx={(theme) => ({ fontFamily: ` ${theme.fontFamily}`, fontWeight: 900 })}
      >
        FreighHive!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="organization@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Group position="apart" mt="lg">
          <Popover width={200} position="bottom" withArrow shadow="sm">
            <Popover.Target>
              <Button variant="subtle" size="sm">
                Forgot my pass!
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm">Please contact with Developer Team!</Text>
            </Popover.Dropdown>
          </Popover>
          <Button onClick={handleSignIn} loading={loading} loaderPosition="center">
            Sign in
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default LoginPage;
