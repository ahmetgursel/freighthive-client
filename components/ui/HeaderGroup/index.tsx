import { Divider, Flex, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons';
import React from 'react';
import CustomButton from '../CustomButton';

interface HeaderGroupProps {
  title: string;
  modalTitle: string;
}

const HeaderGroup: React.FC<HeaderGroupProps> = ({ title, modalTitle }) => {
  const [openedNewButton, { open: openNewButton, close: closeNewButton }] = useDisclosure(false);

  return (
    <>
      <Flex gap="md" justify="space-between" align="center" direction="row" wrap="wrap" px="md">
        <Text fz="xl" fw={700}>
          {title}
        </Text>

        <Group position="center">
          <CustomButton
            label="Yeni Araç Ekle"
            onClick={openNewButton}
            loading={openedNewButton}
            icon={<IconPlus size="1rem" />}
          />
        </Group>
      </Flex>

      <Divider my="sm" size={1} />

      <Modal opened={openedNewButton} onClose={closeNewButton} title={modalTitle} centered>
        {/* yeni iş ekleme modal buraya */}
      </Modal>
    </>
  );
};

export default HeaderGroup;
