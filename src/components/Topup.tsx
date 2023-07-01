import React, { useContext, useState } from 'react';
import { Button, FormControl, Input, useToast } from '@chakra-ui/react';
import { TopUpIcon } from './icons';
import Modal from './common/Modal';
import { Elusiv, TopupTxData } from '@elusiv/sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { isNumber } from 'util';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AppContext } from '@/contexts/AppProvider';

export default function Topup({
  isTopUpModalVisible,
  toggleTopUpModalVisible,
}: {
  isTopUpModalVisible: boolean;
  toggleTopUpModalVisible: () => void;
  elusiv: Elusiv | undefined;
}) {
  const {
    wallet: { setElusiv, elusiv },
  } = useContext(AppContext);
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value as number);
  const toast = useToast();
  // topup function to elusiv wallet
  const topup = async () => {
    console.log('txn');
    console.log(elusiv)
    if (!signTransaction || !elusiv || !amount) return;
    setLoading(true);
    try {
      const topupTx = await elusiv?.buildTopUpTx(
        0.1 * LAMPORTS_PER_SOL,
        'LAMPORTS'
      );
      const signature = await signTransaction(topupTx.tx);

      const rebuildTopup = new TopupTxData(
        topupTx.getTotalFee(),
        'LAMPORTS',
        topupTx.lastNonce,
        topupTx.commitmentHash,
        topupTx.merkleStartIndex,
        topupTx.wardenInfo,
        signature,
        topupTx.hashAccIndex,
        topupTx.merge
      );

      await elusiv.sendElusivTx(rebuildTopup);
      toast({
        title: 'Topup succesfully.',
        description: `Topup ${amount} SOL succesfully.`,
        status: 'success',
        duration: 9000,
        position: 'top',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Topup failed.',
        description: error.message,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        isLoading={loading}
        leftIcon={<TopUpIcon />}
        colorScheme="purple"
        onClick={toggleTopUpModalVisible}
      >
        Topup
      </Button>
      <Modal
        loading={loading}
        isOpen={isTopUpModalVisible}
        actionLabel="Topup"
        onClose={toggleTopUpModalVisible}
        modalLabel="Topup"
        onSubmit={() => {
          topup();
        }}
      >
        <FormControl isRequired>
          <Input value={amount} onChange={handleInputChange}></Input>
        </FormControl>
      </Modal>
    </div>
  );
}
