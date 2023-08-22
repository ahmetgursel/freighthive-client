import { ActionIcon, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconSettings, IconTrashOff } from '@tabler/icons';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { mutate } from 'swr';

interface ActionIconsGroupProps {
  rowId: string;
  updateModalTitle: string;
  deleteModalTitle: string;
  deleteModalText: string;
  deleteModalConfirmButtonLabel: string;
  deleteModalCancelButtonLabel: string;
  updateButtonModalForm: JSX.Element;
}

const ActionIconsGroup: React.FC<ActionIconsGroupProps> = ({
  rowId,
  updateModalTitle,
  deleteModalTitle,
  deleteModalText,
  deleteModalConfirmButtonLabel,
  deleteModalCancelButtonLabel,
  updateButtonModalForm,
}) => {
  const [openedUpdateIcon, { open: openUpdateIcon, close: closeUpdateIcon }] = useDisclosure(false);

  const handleDeleteConfirmButton = async () => {
    try {
      const response = await fetch(`/api/trucks/${rowId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        mutate('/api/trucks');
        notifications.show({
          color: 'teal',
          title: 'Araç başarıyla silindi',
          message:
            'Araç başarıyla silindi. Yeni bir araç silmek için tekrar silme ikonunu kullanabilirsiniz.',
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
      } else {
        //TODO: error handling geliştirilmeli
        throw new Error('Araç eklenirken bir hata oluştu');
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Araç silinirken hata oluştu',
        message: 'Malesef araç silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        icon: <IconX size="1rem" />,
        autoClose: 5000,
      });
    }
  };

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
      onConfirm: () => handleDeleteConfirmButton(),
    });

  return (
    <Flex gap="md">
      <ActionIcon>
        <IconSettings size="1rem" onClick={openUpdateIcon} />
      </ActionIcon>
      <ActionIcon color="red.7">
        <IconTrashOff size="1rem" onClick={openDeleteModal} />
      </ActionIcon>

      <Modal
        size="xl"
        opened={openedUpdateIcon}
        onClose={closeUpdateIcon}
        title={updateModalTitle}
        centered
      >
        {updateButtonModalForm}
      </Modal>
    </Flex>
  );
};
export default ActionIconsGroup;
