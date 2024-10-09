// Imports
import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// Generate keypair from wallet
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define the Turbin3 public key
const to = new PublicKey("3pzgiv8AQotxN6UVCVv9zVQ2qsf4Dx3LZY6ixZGau9M7");

//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)

        // Create a test transaction to calculate fees
        const transaction = new Transaction()
            .add(
                SystemProgram.transfer({
                    fromPubkey: from.publicKey,
                    toPubkey: to,
                    lamports: balance
                })
            );
        transaction.recentBlockhash = ( await connection.
            getLatestBlockhash('confirmed')
        ).blockhash;
        transaction.feePayer = from.publicKey;

        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        const fee = (await
        connection.getFeeForMessage(transaction.compileMessage(),
        'confirmed')).value || 0;
        // Remove our transfer instruction to replace it
        transaction.instructions.pop();

         // Now add the instruction back with correct amount of lamports
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );


        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch(err) {
        console.error(`Oops, something went wrong: ${err}`);
    }
})();