import React, { useState, useEffect } from 'react'
import { Elusiv, SEED_MESSAGE, TopupTxData } from '@elusiv/sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToggle } from 'usehooks-ts';
import Modal from './common/Modal';
import { Button } from '@chakra-ui/react';
import ViewPrivateTransaction from './ViewPrivateTransaction';

export default function ElusivApp() {
    const { publicKey, signMessage, signTransaction } = useWallet()
    const [elusiv, setElusiv] = useState<Elusiv>()
    const { connection } = useConnection()

    useEffect(() => {
        const getElusiv = async () => {
            if (publicKey && signMessage) {
                const encodedMessage = new TextEncoder().encode(SEED_MESSAGE)

                const seed = await signMessage(encodedMessage)
                const elusivInstance = await Elusiv.getElusivInstance(seed, publicKey, connection, 'devnet')
                setElusiv(elusivInstance);
            }
        }

        getElusiv()

        return () => {
            setElusiv(undefined)
        }

    }, [publicKey, connection])

    const [isTopUpModalVisible, toggleTopUpModalVisible, setIsTopUpModal] = useToggle();
    const [isSendModalVisible, toggleSendModalVisible, setIsSendModa] = useToggle();
    const [isViewTransactionModalVisible, toggleViewTransactionModalVisible, setIsViewTransactionModa] = useToggle();


    return (
        <div>
            <Button onClick={toggleTopUpModalVisible}>
                    Topup
            </Button>
            <Button onClick={toggleTopUpModalVisible}>
                    Topup
            </Button>
           {
            <Modal
            isOpen={isTopUpModalVisible}
            onClose={()=>{
                toggleTopUpModalVisible();
            }}
            />

           }

           <ViewPrivateTransaction elusiv={elusiv}/>
        </div>
    )
}
