import React, { useState } from 'react';
import { Button, FormControl, Input } from '@chakra-ui/react';
import { TopUpIcon } from './icons';
import Modal from './common/Modal';

export default function Topup({
  isTopUpModalVisible,
  toggleTopUpModalVisible,
}: {
  isTopUpModalVisible: boolean;
  toggleTopUpModalVisible: () => void;
}) {
  return (
    <div>
      <Button
        leftIcon={<TopUpIcon />}
        colorScheme="purple"
        onClick={toggleTopUpModalVisible}
      >
        Topup
      </Button>
      <Modal
        isOpen={isTopUpModalVisible}
        actionLabel="Topup"
        onClose={toggleTopUpModalVisible}
        modalLabel="Topup"
        onSubmit={toggleTopUpModalVisible}
      >
        <FormControl>
          <Input></Input>
        </FormControl>
      </Modal>
    </div>
  );
}
