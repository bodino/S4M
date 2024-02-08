import { entropyToMnemonic } from "ethereum-cryptography/bip39/index.js";
import { wordlist } from "ethereum-cryptography/bip39/wordlists/english.js";


async function hashEntropy(entropyArray) {
  const encoder = new TextEncoder();
  const data = encoder.encode(entropyArray.join(''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

export async function generateValidMnemonic(entropy) {
  
  console.log("test")
  const systemEntropy = window.crypto.getRandomValues(new Uint8Array(16));

  // Get hashed entropy and convert it to a regular array
  const userEntropyBuffer = (await hashEntropy(entropy)).slice(0, 16);
  const userEntropy = Array.from(userEntropyBuffer);

  // Combine user entropy with system entropy
  const combinedEntropy = userEntropy.map((byte, index) => byte ^ systemEntropy[index]);

  // Convert combined entropy to a buffer
  const combinedEntropyBuffer = Buffer.from(combinedEntropy);

  // Ensure the size of the entropy is correct for BIP-39 (128, 160, 192, 224, or 256 bits)
  const mnemonic = entropyToMnemonic(combinedEntropyBuffer, wordlist);
  console.log(mnemonic)
  console.log('made it')
  return mnemonic;

}


