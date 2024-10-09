// Imports
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const kp = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        const txhash = await connection.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Success! Check our your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(err) {
        console.log(`Oops, something went wrong: ${err}`);
    }
})();