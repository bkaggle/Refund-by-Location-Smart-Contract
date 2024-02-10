const HDWalletProvider = require('@truffle/hdwallet-provider');


const MNEMONIC = 'amazing analyst chuckle between obscure ice void skill parrot strike input profit';


const INFURA_PROJECT_ID = 'ec4fe7fa399c4a5d9c53bd59e430ac0a';

module.exports = {
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 1,
      gas: 5500000,
      gasPrice: 20000000000 // 20 gwei
    }
  }
};
