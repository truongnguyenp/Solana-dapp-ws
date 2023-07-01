import React, { useState, useEffect, useContext } from 'react';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToggle } from 'usehooks-ts';
import { useToast } from '@chakra-ui/react';
import Topup from './Topup';
import Send from './Send';
import { AppContext } from '@/contexts/AppProvider';

export default function ElusivApp() {
  const {
    wallet: { setElusiv, elusiv },
  } = useContext(AppContext);
  const { publicKey, signMessage } = useWallet();
  const [totalBalance, setTotalBalance] = useState<bigint>();
  const { connection } = useConnection();
  const toast = useToast();

  useEffect(() => {
    const getElusiv = async () => {
      if (!publicKey || !signMessage) return;

      const encodedMessage = new TextEncoder().encode(SEED_MESSAGE);

      try {
        const seed = await signMessage(encodedMessage);
        const elusivInstance = await Elusiv.getElusivInstance(
          seed,
          publicKey,
          connection,
          'devnet'
        );
        setElusiv(elusivInstance); // Update the context value
        const totalBalance = await elusivInstance.getLatestPrivateBalance(
          'LAMPORTS'
        );
        setTotalBalance(totalBalance);
      } catch (error) {
        toast({
          title: 'Reject use Elusiv Payment',
          description: 'You reject to provide seed and key for Elusiv',
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }
    };

    getElusiv();

    return () => {
      setElusiv(undefined); // Reset the context value
    };
  }, [publicKey, connection, signMessage, setElusiv, toast]);

  const [isTopUpModalVisible, toggleTopUpModalVisible] = useToggle();
  const [isSendModalVisible, toggleSendModalVisible] = useToggle();

  return (
    <div>
      <div className="flex justify-center align-center space-between w-full gap-4">
        <Topup
          elusiv={elusiv}
          isTopUpModalVisible={isTopUpModalVisible}
          toggleTopUpModalVisible={toggleTopUpModalVisible}
        />
        <Send
          totalBalance={totalBalance}
          isSendModalVisible={isSendModalVisible}
          toggleSendModalVisible={toggleSendModalVisible}
        />
      </div>
    </div>
  );
}
