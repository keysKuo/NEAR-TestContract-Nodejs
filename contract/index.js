require('dotenv').config();
const nearAPI = require('near-api-js');
const { keyStores, connect, Contract, KeyPair } = nearAPI;

const ACCOUNT_ID = process.env.ACCOUNT_ID || "nkeyskuo147.testnet"
const NETWORK_ID = process.env.NETWORK_ID || "testnet";

const KEY_STORE = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'ed25519:59y2NCBgSQbxAkzytyYSvc2Z4EFGRD2WECa7ppPF6SGpMAfWyHu93Fez1HkYxSmbiUzrXhchrEw5Jx2kKJqeo5BE';
const keyPair = KeyPair.fromString(PRIVATE_KEY);


module.exports.load_contract =  async () => {
    await KEY_STORE.setKey("testnet", ACCOUNT_ID , keyPair)
    
    const connectionConfig = {
        networkId: NETWORK_ID,
        keyStore: KEY_STORE, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const nearConnection = await connect(connectionConfig);
    const account = await nearConnection.account(process.env.ACCOUNT_ID || "nkeyskuo147.testnet");
    
    const cts = new Contract(
        account, // the account object that is connecting
        process.env.CONTRACT_ID || "dev-1696468698784-72327693165514",
        {
            // name of contract you're connecting to
            viewMethods: ["view_all_jobs","view_job_by_id", "view_freelancer_by_id"], // view methods do not change state but usually return a value
            changeMethods: ["register_executor", "register_client", "create_job", "take_job", "update_job", "remove_job", "payment", "pay_for_job"], // change methods modify state
        }
    );

    return cts;
}

