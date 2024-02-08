import { ethers } from 'ethers';
import {META_ADDRESS_REGISTRAR_ADDRESS, META_ADDRESS_REGISTRAR_ABI } from './constants'
import { ec as EC } from 'elliptic';
import {RPC} from './constants'


const ec = new EC('secp256k1');

export async function getBalance(provider, address){
    try { 
    const ethersProvider = new ethers.providers.Web3Provider(provider);
      
    // Get the signer to perform transactions

    // Fetch the balance
    const balance = await ethersProvider.getBalance(address);

    // Convert the balance to a more readable format
    const readableBalance = parseFloat(ethers.utils.formatEther(balance));

    return(readableBalance)
  } catch (error) {
    console.error(error);
  }
}


export async function getBalance2(provider, address){
  try { 
    
  // Get the signer to perform transactions

  // Fetch the balance
  const balance = await provider.getBalance(address);

  // Convert the balance to a more readable format
  const readableBalance = parseFloat(ethers.utils.formatEther(balance));

  return(readableBalance)
} catch (error) {
  console.error(error);
}
}


export async function updateMetaAddressRegistration(provider, metaAddress){
  try { 
    const ethersProvider = new ethers.providers.Web3Provider(provider);

    // Get the signer to perform transactions
    const signer = ethersProvider.getSigner();

    // Contract Address and ABI
  
    // Create a new contract instance
    const contract = new ethers.Contract(META_ADDRESS_REGISTRAR_ADDRESS, META_ADDRESS_REGISTRAR_ABI, signer);

    // Call the updateMetaAddressRegistration function of the contract
    metaAddress = metaAddress.join('');

    console.log(metaAddress)
    await contract.updateMetaAddressRegistration(metaAddress);

    // If you need to return something, update this part
    return "Meta address registration updated";

  } catch (error) {
    console.error(error);
  }
}


export async function getMetaAddress(provider, address){
  try { 
    const ethersProvider = new ethers.providers.Web3Provider(provider);

       // Get the signer to perform transactions
    const signer = ethersProvider.getSigner();

    // Create a new contract instance with just a provider as it's a read-only call
    const contract = new ethers.Contract(META_ADDRESS_REGISTRAR_ADDRESS, META_ADDRESS_REGISTRAR_ABI, signer);

    // Call the getUserMetaAddress function of the contract
    const metaAddress = await contract.getUserMetaAddress(address);
    console.log(metaAddress)

    return metaAddress;
  } catch (error) {
    console.error(error);
  }
}


export async function sendToken(provider, address, amount, showToast){

  const metaAddress = await getMetaAddress(provider, address)
  //FIX if this doesn't resolve, need to alert user that person doesn't have a meta address

  const providerWatcher = new ethers.providers.JsonRpcProvider(RPC);

  console.log(metaAddress)

  const halfLength = metaAddress.length / 2;
  
  const spendPubKeyHex = metaAddress.slice(halfLength);
  const viewPubKeyHex = metaAddress.slice(0, halfLength);

  console.log(`View Public Key: ${viewPubKeyHex}`);
  console.log(`Spend Public Key: ${spendPubKeyHex}`);

  const steathAdressInfo = await generateStealthAddress(viewPubKeyHex,spendPubKeyHex )
  console.log(steathAdressInfo)

  const amountInWei = ethers.utils.parseEther(amount);

 const pubKeyRecipient = steathAdressInfo.stealthAddress

  const payload = steathAdressInfo.ephemeralPublicKey + steathAdressInfo.viewTagV
  console.log(payload)

  const ethersProvider = new ethers.providers.Web3Provider(provider);

  // // Get the signer to perform transactions
  const signer = ethersProvider.getSigner();

  // // Contract Address and ABI

  // // Create a new contract instance
  const contract = new ethers.Contract(META_ADDRESS_REGISTRAR_ADDRESS, META_ADDRESS_REGISTRAR_ABI, signer);


  // // call the transfer function of the contract
  try {
    console.log(provider); // Log the provider for debugging

    // Sending the transaction
    const txResponse = await contract.transferFundsAndStoreString(payload, pubKeyRecipient, { value: amountInWei });
    console.log(txResponse);
    showToast('Transaction pending...', 'pending');

    // Waiting for the transaction to be mined
    const trx = await providerWatcher.waitForTransaction(txResponse.hash);

    // If the transaction is successfully mined
    showToast('Transaction successful!', 'success');
    console.log(trx); // Log the transaction receipt for debugging
} catch (error) {
    console.error("Error during the transaction process: ", error);

    // Show an error message to the user
    showToast('Transaction failed: ' + error.message, 'error');

    // Further error handling logic can be added here
    // For example, you might want to retry the transaction, log the error for further analysis, etc.
}


}

async function generateStealthAddress(viewPubKeyHex, spendPubKeyHex) {

  const ephemeralPrivateKey = ec.genKeyPair();

  const viewPublicKey = ec.keyFromPublic(viewPubKeyHex, 'hex').getPublic();

  const sharedSecret = ephemeralPrivateKey.derive(viewPublicKey);

  const sH = await hashSharedSecret(sharedSecret); // Hash the shared secret

  const viewTagV = sH.slice(0, 2); // Take the first byte of the hash
  const S_H = ec.g.mul(Buffer.from(sH, 'hex')); // Convert hash to buffer and then multiply

  const spendPublicKey = ec.keyFromPublic(spendPubKeyHex, 'hex').getPublic();
  const PStealth = spendPublicKey.add(S_H);
  const stealthAddress = ethers.utils.computeAddress('0x' + PStealth.encodeCompressed('hex'));
 

  return {
      stealthAddress,
      ephemeralPublicKey: ephemeralPrivateKey.getPublic().encode('hex'),
      viewTagV
  };
}


async function hashSharedSecret(sharedSecret) {
  // Convert the shared secret to a Uint8Array

  const sharedSecretBytes = hexStringToUint8Array(sharedSecret.toString(16));

  // Hash the shared secret using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecretBytes);

  // Convert the hash buffer to a hex string
 
  return bufferToHex(hashBuffer);
}

function hexStringToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
      throw new Error('Invalid hex string');
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
      const byteValue = parseInt(hexString.substring(i, i + 2), 16);
      arrayBuffer[i / 2] = byteValue;
  }
  return arrayBuffer;
}

function bufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join('');
}

function publicKeyToAddress(publicKey) {
  // Ensure the public key is in the correct format (uncompressed, 64 bytes long)
  if (publicKey.length !== 130 || !publicKey.startsWith('04')) {
    throw new Error('Invalid public key format');
  }

  // Remove the '04' prefix, convert to a Buffer (or Uint8Array)
  const pubKeyBuffer = ethers.utils.arrayify('0x' + publicKey.slice(2));

  // Hash with Keccak-256
  const hashedPubKey = ethers.utils.keccak256(pubKeyBuffer);

  // Take the last 20 bytes as the address
  const address = ethers.utils.getAddress('0x' + hashedPubKey.substring(26));

  return address;
}

export async function checkForStealthAddress(ephemeralPublicKeyHex, privViewHex, pubSpendHex, viewTag) {
  try {
  const privView = ec.keyFromPrivate(privViewHex, 'hex');
  console.log("ephemeralPublicKeyHex")
  console.log(ephemeralPublicKeyHex)
  const ephemeralPublicKey = ec.keyFromPublic(ephemeralPublicKeyHex, 'hex').getPublic();
  console.log('mongoose')

  const sharedSecret = privView.derive(ephemeralPublicKey);

  const sH = await hashSharedSecret(sharedSecret); // Hash the shared secret

  const computedViewTag = sH.slice(0, 2); // Take the first byte of the hash
  
  console.log(viewTag)
  console.log(computedViewTag)

  if (viewTag != computedViewTag) {
      return false; // View tags do not match
  } else {
      console.log('view_tag matches'); // View tags match
  }
  const S_H = ec.g.mul(Buffer.from(sH, 'hex')); // Convert hash to buffer and then multiply
  const pubSpend = ec.keyFromPublic(pubSpendHex, 'hex').getPublic();
  const stealthPubKeyPoint = pubSpend.add(S_H);
  const stealthAddress = ethers.utils.computeAddress('0x' + stealthPubKeyPoint.encodeCompressed('hex'));

  return stealthAddress; // Check if the regenerated address matches the ephemeral public key
  } catch (error) {
    console.error(error);
    console.log('failure')
    return false;
  }
}