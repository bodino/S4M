export const STORE_NAME = 'keyStore'; // Replace with your actual store name
export const META_ADDRESS_REGISTRAR_ADDRESS = '0xA876929e8928084CD3806C96aD4da64f2A373076';
export const RPC = 'https://polygon-mainnet.g.alchemy.com/v2/O0mypzmBegExqUAIThuM-ooc7joUYjBs';
export const META_ADDRESS_REGISTRAR_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "FundTransfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserMetaAddress",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "transferFundsAndStoreString",
    "outputs": [
      
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newData",
        "type": "string"
      }
    ],
    "name": "updateMetaAddressRegistration",
    "outputs": [
      
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]