import { Elusiv, getSendTxWithViewingKey } from '@elusiv/sdk';
import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface ViewPrivateTransactionProps {
  elusiv: Elusiv | undefined;
}

export default function ViewPrivateTransaction({
  elusiv,
}: ViewPrivateTransactionProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const handleViewTransaction = async () => {
    if (!publicKey || !elusiv) return;

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
  };

  return (
    <>
      <button onClick={() => handleViewTransaction()}>view transaction</button>
    </>
  );
}
