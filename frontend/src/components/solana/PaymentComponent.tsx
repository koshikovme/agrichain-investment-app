'use client';

import React, { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@project-serum/anchor';
import idl from "./diploma_storage.json"; // путь к IDL JSON

const programID = new PublicKey('YRoyDgtmHvKDpFdksFPdcCB16ymBspq2kUhgVz18JFQ');
const network = 'https://api.devnet.solana.com';
const opts = { preflightCommitment: 'processed' };

export const PaymentComponent = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const getProgram = () => {
        const connection = new Connection(network, opts.preflightCommitment as any);
        const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: 'processed' });

        return new Program(idl as any, programID, provider);
    };

    const initializeStorage = useCallback(async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            alert('Connect Phantom wallet');
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const program = getProgram();
            const owner = wallet.publicKey;

            const [paymentStoragePda] = await PublicKey.findProgramAddress(
                [Buffer.from('transactionBank'), owner.toBuffer()],
                program.programId
            );

            const tx = await program.methods
                .initializePaymentsStorage()
                .accounts({
                    paymentStorage: paymentStoragePda,
                    owner: owner,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setMessage(`✅ Storage initialized. Tx: ${tx}`);
        } catch (err: any) {
            console.error(err);
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    const addPayment = useCallback(async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            alert('Connect Phantom wallet');
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const program = getProgram();
            const owner = wallet.publicKey;

            const paymentId = 'pay1236789'; // max 12 chars
            const paymentOwner = owner;
            const paymentSender = owner;
            const paymentTimestamp =new BN(Math.floor(Date.now() / 1000));
            const paymentAmount = new BN(1000000);
            const paymentCurrency = [85, 83, 68]; // 'USD'
            const paymentUrl = 'https://example.com/tx/123';

            const [paymentStoragePda] = await PublicKey.findProgramAddress(
                [Buffer.from('transactionBank'), owner.toBuffer()],
                program.programId
            );

            const [paymentPda] = await PublicKey.findProgramAddress(
                [Buffer.from(paymentId,"utf8"), owner.toBuffer()],
                program.programId
            );
            console.log(Buffer.from(paymentId).length); // должно быть ≤ 32
            const tx = await program.methods
                .addPayment(
                    paymentId,
                    paymentOwner,
                    paymentSender,
                    paymentTimestamp,
                    paymentAmount,
                    paymentCurrency,
                    paymentUrl
                )
                .accounts({
                    payment: paymentPda,
                    paymentStorage: paymentStoragePda,
                    owner: owner,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();
            setMessage(`✅ Payment added. Tx: ${tx}`);
        } catch (err: any) {
            console.error(err);
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Receipt Diploma DApp</h2>

            <button onClick={initializeStorage} disabled={loading} style={{ marginTop: '10px', padding: '10px', width: '100%' }}>
                {loading ? 'Initializing...' : 'Initialize Storage'}
            </button>

            <button onClick={addPayment} disabled={loading} style={{ marginTop: '10px', padding: '10px', width: '100%' }}>
                {loading ? 'Sending Payment...' : 'Add Payment'}
            </button>

            {message && <p style={{ marginTop: '20px', fontSize: '14px' }}>{message}</p>}
        </div>
    );
};
