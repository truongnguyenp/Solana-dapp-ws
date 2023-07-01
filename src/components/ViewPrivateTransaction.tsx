import { Elusiv } from "@elusiv/sdk"
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface ViewPrivateTransactionProps {
    elusiv: Elusiv | undefined
}

export default function ViewPrivateTransaction({ elusiv }: ViewPrivateTransactionProps) {
    const { publicKey } = useWallet();

    const handleViewTransaction = async () => {
        if(!publicKey || !elusiv) return;

        console.log("running...")
        const last5Txs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');
        console.log(last5Txs)
    }

    return (
        <>
            <button onClick={() => handleViewTransaction()}>
                view transaction
            </button>
        </>
    )   
}