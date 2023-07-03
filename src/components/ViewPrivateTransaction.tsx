import {getSendTxWithViewingKey } from '@elusiv/sdk';
import React, { useContext, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { GlobalIcon } from './icons';
import Modal from './common/Modal';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import { AppContext } from '@/contexts/AppProvider';
interface ViewPrivateTransactionProps {
  isViewTransactionModalVisible: boolean;
  toggleViewTransactionModalVisible: () => void;
}

export default function ViewPrivateTransaction({
  isViewTransactionModalVisible,
  toggleViewTransactionModalVisible,
}: ViewPrivateTransactionProps) {
  const {
    wallet: { setElusiv, elusiv },
  } = useContext(AppContext);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  const handleViewTransaction = async () => {
    if (!publicKey || !elusiv) return;
    setLoading(true);
    console.log('running...');
    const last5Txs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');
    console.log(last5Txs);
    const lastTx = last5Txs.find((tx) => tx.txType === 'SEND');
    if (!lastTx) {
      return;
    }
    const viewingKey = elusiv.getViewingKey(lastTx);
    const decryptedTx = await getSendTxWithViewingKey(
      connection,
      'devnet',
      viewingKey
    );
    console.log(decryptedTx.owner.toBase58());
    console.log(decryptedTx.sendTx);
    console.log(decryptedTx.sendTx.recipient!.toBase58());
    setLoading(false);
  };

  return (
    <>
      <Button
        leftIcon={<GlobalIcon />}
        colorScheme="telegram"
        isLoading={loading}
        onClick={() => {
          toggleViewTransactionModalVisible();
          handleViewTransaction()
        }}
      >
        view transaction
      </Button>
      <Modal
        loading={loading}
        isOpen={isViewTransactionModalVisible}
        onClose={toggleViewTransactionModalVisible}
        modalLabel="View Private Transaction on Elusiv"
        onSubmit={() => {
        }}
      >
        <FormControl isRequired>
          <FormLabel>Amount (SOL)</FormLabel>
        </FormControl>
      </Modal>
    </>
  );
}
