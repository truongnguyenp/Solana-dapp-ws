import React, { useEffect } from "react";
import { Elusiv } from '@elusiv/sdk';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

interface SendPrivateBalanceProps {
    elusiv: Elusiv | undefined
}

export default function SendPrivateBalance({ elusiv }: SendPrivateBalanceProps) {
    const {publicKey} = useWallet();
    const {connection} = useConnection();

    const handleSendPrivateBalance = async () => {
        if(!elusiv || !publicKey) return;

        console.log("sending");
        const sendTx = await elusiv!.buildSendTx(LAMPORTS_PER_SOL, new PublicKey("yamRr19VDJAf1ACdyLxLrxJaTRGYdLBNfScKi7whTkQ"), "LAMPORTS");
        const tx = await elusiv!.sendElusivTx(sendTx);
        console.log("success");
        console.log(tx.signature);
    }

    return (
        <>
            <div onClick={() => handleSendPrivateBalance()} >send</div>
        </>
    )
}