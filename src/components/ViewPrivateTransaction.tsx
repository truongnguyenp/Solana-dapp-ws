import { PrivateTxWrapper, getSendTxWithViewingKey } from '@elusiv/sdk';
import React, { useContext, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { GlobalIcon } from './icons';
import Modal from './common/Modal';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import { AppContext } from '@/contexts/AppProvider';
interface ViewPrivateTransactionProps {
  isViewTransactionModalVisible: boolean;
  toggleViewTransactionModalVisible: () => void;
}

interface TransactionModal {
  owner: string,
  recepient: string,
  amount: number,
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
  const [listOfTxs, setListOfTxs] = useState<TransactionModal[]>([])

  const handleViewTransaction = async () => {
    if (!publicKey || !elusiv) return;
    setLoading(true);
    const last10Txs = await elusiv.getPrivateTransactions(10, 'LAMPORTS');
    if (last10Txs.length === 0) {
      return
    }
    const listOfSendTx = last10Txs.filter((tx) => tx.txType === "SEND");
    const listOfResolvedTx: TransactionModal[] = []
    listOfSendTx.forEach(tx => {
      transformTransaction(tx).then(x => {
        if (x) {
          listOfResolvedTx.push(x)
        }
      });
    });

    setListOfTxs(listOfResolvedTx);
    setLoading(false);
  };

  const transformTransaction = async (tx: PrivateTxWrapper): Promise<TransactionModal | null> => {
    if (!elusiv) return null;


    const viewingKey = elusiv.getViewingKey(tx);
    const decryptedTx = await getSendTxWithViewingKey(
      connection,
      'devnet',
      viewingKey
    );

    return {
      owner: decryptedTx.owner.toString(),
      recepient: decryptedTx.sendTx.recipient!.toString(),
      amount: decryptedTx.sendTx.amount
    }
  }

  return (
    <>
      <Button
        leftIcon={<GlobalIcon />}
        colorScheme="telegram"
        isLoading={loading}
        onClick={async () => {
          await handleViewTransaction()
          toggleViewTransactionModalVisible();
        }}
      >
        view transaction
      </Button>
      {!loading && <Modal
        loading={loading}
        isOpen={isViewTransactionModalVisible}
        onClose={toggleViewTransactionModalVisible}
        modalLabel="View Private Transaction on Elusiv"
        onSubmit={() => {

        }}
      >
        {
          <>
            <div>memag</div>
            {listOfTxs.map(
              (tx, index) => {
                console.log(tx)

                return (
                  <div key={index}>
                    <p>Owner: {tx.owner}</p>
                    <p>Receipent: {tx.recepient}</p>
                    <p>Amount: {tx.amount} SOL</p>
                  </div>
                )
              }
            )}
          </>

        }
      </Modal>}
    </>
  );
}
