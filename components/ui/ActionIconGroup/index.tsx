import { ActionIcon, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconSettings, IconTrashOff } from '@tabler/icons';

import React from 'react';

interface ActionIconsGroupProps {
  rowId: string;
}

const ActionIconsGroup: React.FC<ActionIconsGroupProps> = ({ rowId }) => {
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Bu aracı silmek istediğinizden emin misiniz?',
      centered: true,
      children: (
        <Text size="sm">Bu işlem geri alınamaz. Bu araçla ilgili tüm veriler silinecektir.</Text>
      ),
      labels: { confirm: 'Aracı Sil', cancel: 'İptal' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log(`Confirmed delete action for ${rowId}}`),
    });

  return (
    <Flex gap="md">
      <ActionIcon>
        <IconSettings size="1rem" onClick={openUpdateIcon} />
      </ActionIcon>

      <ActionIcon color="red.7">
        <IconTrashOff size="1rem" onClick={openDeleteModal} />
      </ActionIcon>

      <Modal opened={openedUpdateIcon} onClose={closeUpdateIcon} title="Araç Güncelle" centered>
        <h1>{rowId}</h1>
      </Modal>
    </Flex>
  );
};
export default ActionIconsGroup;
