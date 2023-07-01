import React, { useState, useEffect } from 'react';
import { Elusiv, SEED_MESSAGE, TopupTxData } from '@elusiv/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToggle } from 'usehooks-ts';
import Modal from './common/Modal';
import { Button } from '@chakra-ui/react';
import { SendIcon, TopUpIcon, GlobalIcon } from './icons';
import Topup from './Topup';

export default function ElusivApp() {
  const { publicKey, signMessage, signTransaction } = useWallet();
  const [elusiv, setElusiv] = useState<Elusiv>();
  const { connection } = useConnection();

  useEffect(() => {
    const getElusiv = async () => {
      if (publicKey && signMessage) {
        const encodedMessage = new TextEncoder().encode(SEED_MESSAGE);

        const seed = await signMessage(encodedMessage);
        const elusivInstance = await Elusiv.getElusivInstance(
          seed,
          publicKey,
          connection,
          'devnet'
        );
        setElusiv(elusivInstance);
      }
    };

    getElusiv();

    return () => {
      setElusiv(undefined);
    };
  }, [publicKey, connection]);

  const [isTopUpModalVisible, toggleTopUpModalVisible] = useToggle();
  const [isSendModalVisible, toggleSendModalVisible] = useToggle();
  const [isViewTransactionModalVisible, toggleViewTransactionModalVisible] =
    useToggle();

  return (
    <div>
      <div className="flex justify-center align-center space-between w-full gap-4">
        <Topup
          isTopUpModalVisible={isTopUpModalVisible}
          toggleTopUpModalVisible={toggleTopUpModalVisible}
        />
      </div>
    </div>
  );
}
{
  /* <Button
          leftIcon={<TopUpIcon />}
          colorScheme="purple"
          onClick={toggleTopUpModalVisible}
        >
          Topup
        </Button>
        <Button
          leftIcon={<SendIcon />}
          colorScheme="whatsapp"
          onClick={toggleSendModalVisible}
        >
          Send
        </Button>
        <Button
          leftIcon={<GlobalIcon />}
          colorScheme="telegram"
          onClick={toggleViewTransactionModalVisible}
        >
          View transaction
        </Button>
      </div>

      <Modal
        actionLabel="Topup"
        isOpen={isTopUpModalVisible}
        onClose={() => {
          toggleTopUpModalVisible();
        }}
      />

      <Modal
        actionLabel="Send"
        isOpen={isSendModalVisible}
        onClose={() => {
          toggleSendModalVisible();
        }}
      />

      <Modal
        isOpen={isViewTransactionModalVisible}
        onClose={() => {
          toggleViewTransactionModalVisible();
        }}
      /> */
}
