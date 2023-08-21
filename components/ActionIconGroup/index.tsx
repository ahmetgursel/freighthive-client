import { ActionIcon, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconSettings, IconTrashOff } from '@tabler/icons';

import React from 'react';

interface ActionIconsGroupProps {
  rowId: string;
  updateModalTitle: string;
  deleteModalTitle: string;
  deleteModalText: string;
  deleteModalConfirmButtonLabel: string;
  deleteModalCancelButtonLabel: string;
}

const ActionIconsGroup: React.FC<ActionIconsGroupProps> = ({
  rowId,
  updateModalTitle,
  deleteModalTitle,
  deleteModalText,
  deleteModalConfirmButtonLabel,
  deleteModalCancelButtonLabel,
}) => {
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: `${deleteModalTitle}`,
      centered: true,
      children: <Text size="sm"> {deleteModalText} </Text>,
      labels: {
        confirm: `${deleteModalConfirmButtonLabel}`,
        cancel: `${deleteModalCancelButtonLabel}`,
      },
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

      <Modal opened={openedUpdateIcon} onClose={closeUpdateIcon} title={updateModalTitle} centered>
        <h1>{rowId}</h1>
      </Modal>
    </Flex>
  );
};
export default ActionIconsGroup;
