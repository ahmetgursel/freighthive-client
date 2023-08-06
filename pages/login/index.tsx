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
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // TODO: redirect to dashboard
        console.log('Login successful');
      } else {
        // TODO: show error
        console.log('Login failed');
      }
    } catch (error) {
      // TODO: show error
      console.error('An error occurred:', error);
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
          <Button onClick={handleSignIn}>Sign in</Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default LoginPage;
