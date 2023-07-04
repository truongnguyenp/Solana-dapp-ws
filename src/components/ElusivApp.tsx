/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToggle } from 'usehooks-ts';
import { useToast, Text } from '@chakra-ui/react';
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
  const [isViewTransactionModalVisible, toggleViewTransactionModalVisible] =
    useToggle();

  return (
    <div className='flex w-full h-[100vh] justify-center bg-gray-800'>
      <div className="flex flex-col justify-center space-between gap-4 items-center w-[40%]">
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
        <ViewPrivateTransaction
          isViewTransactionModalVisible={isViewTransactionModalVisible}
          toggleViewTransactionModalVisible={toggleViewTransactionModalVisible}
        />
      </div>
      <div className='flex flex-col w-[60%] justify-center items-center'>
        <Text className='align-center text-white text-center w-[450px] font-medium text-xl'>
          This is a Elusiv Dapp Example for every body who want to know how to integrate Elusiv SDK to your app.
          Here we have build 3 function when using Elusiv SDK.
        </Text>
        <br />
        <ul className='list-disc text-white max-w-[400px] text-start'>
          <li>
            <Text className='align-center '>
              Topup use for you topup money to Elusiv Program
            </Text>
          </li>
          <li>
            <Text className='align-center'>
              Send use for you decide Elusiv send money to someone, this transaction can not view who is owner
            </Text>
          </li>
          <li>
            <Text className='align-center '>
              View Transaction use for when you want to see the "real transaction" made by Elusiv
            </Text>
          </li>
        </ul>
      </div>
    </div>
  );
}
