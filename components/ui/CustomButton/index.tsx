import { Button as MantineButton } from '@mantine/core';
import React from 'react';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onClick, loading = false, icon }) => (
  <MantineButton
    size="md"
    radius="lg"
    compact
    variant="light"
    rightIcon={icon}
    onClick={onClick}
    loading={loading}
    loaderPosition="right"
  >
    {label}
  </MantineButton>
);

export default CustomButton;
