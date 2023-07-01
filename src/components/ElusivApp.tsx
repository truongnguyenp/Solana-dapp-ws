import React, { useState, useEffect, useContext } from 'react';
import { Elusiv, SEED_MESSAGE, TopupTxData } from '@elusiv/sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToggle } from 'usehooks-ts';
import { useToast } from '@chakra-ui/react';
import Topup from './Topup';
import Send from './Send';
import { AppContext } from '@/contexts/AppProvider';
export default function ElusivApp() {
  const { wallet: { setElusiv } } = useContext(AppContext);
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
        setElusiv(elusivInstance);
      const totalBalance = await elusivInstance.getLatestPrivateBalance("LAMPORTS");
      setTotalBalance(totalBalance);
      } catch (error) {
        toast({
          title: 'Reject use Elusiv Payment',
          description: "You reject to provide seed and key for Elusiv",
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: "top-right"
        })
        return;
      }
    };

    getElusiv();

    return () => {
      setElusiv(undefined);
    };
  }, [publicKey, connection]);

  const [isTopUpModalVisible, toggleTopUpModalVisible, setIsTopUpModal] =
    useToggle();
  const [isSendModalVisible, toggleSendModalVisible, setIsSendModa] =
    useToggle();
  const [
    isViewTransactionModalVisible,
    toggleViewTransactionModalVisible,
    setIsViewTransactionModa,
  ] = useToggle();

  return (
    <div>
      <div className="flex justify-center align-center space-between w-full gap-4">
        <Topup
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
