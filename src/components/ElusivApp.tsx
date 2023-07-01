import React, { useState, useEffect, useContext } from 'react';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToggle } from 'usehooks-ts';
import { useToast } from '@chakra-ui/react';
import Topup from './Topup';
import Send from './Send';
import { AppContext } from '@/contexts/AppProvider';
import ViewPrivateTransaction from './ViewPrivateTransaction';

export default function ElusivApp() {
  const {
    wallet: { setElusiv, elusiv },
  } = useContext(AppContext);
  const { publicKey, signMessage } = useWallet();
  const [totalBalance, setTotalBalance] = useState<bigint>();
  // THIS IS USE FOR CHECK IF HAD TRANSACTION, FETCH TOTAL BALANCE IN ELUSIV
  const [transaction, setTransaction] = useState();
  const { connection } = useConnection();
  const toast = useToast();

  const fetchTotalBalance = async (elusiv: Elusiv | undefined) => {
    if (!elusiv) return;

    const totalBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');
    setTotalBalance(totalBalance);
  };

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
        fetchTotalBalance(elusivInstance);
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
  }, [publicKey, connection, signMessage, setElusiv]);

  useEffect(() => {
    fetchTotalBalance(elusiv);
  }, [transaction]);

  const [isTopUpModalVisible, toggleTopUpModalVisible] = useToggle();
  const [isSendModalVisible, toggleSendModalVisible] = useToggle();

  return (
    <div>
      <div className="flex justify-center align-center space-between w-full gap-4">
        <Topup
          isTopUpModalVisible={isTopUpModalVisible}
          toggleTopUpModalVisible={toggleTopUpModalVisible}
          setTransaction={setTransaction}
        />
        <Send
          setTransaction={setTransaction}
          totalBalance={totalBalance}
          isSendModalVisible={isSendModalVisible}
          toggleSendModalVisible={toggleSendModalVisible}
        />
        <ViewPrivateTransaction elusiv={elusiv} />
      </div>
    </div>
  );
}
