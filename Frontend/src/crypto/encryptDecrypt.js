export async function encryptData(data, password) {
    // Convert password to a cryptographic key
    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  
    // Derive a key from the password
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
  
    // Encrypt the data
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      new TextEncoder().encode(data)
    );
  
    return [encrypted, salt, iv];
  }


  export async function decryptData(encryptedData, password, salt, iv, showToast) {
    try {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt, // the salt used in encryption
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        // Decrypt the data
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv // the IV used in encryption
            },
            key,
            encryptedData
        );

        const decryptedData = new TextDecoder().decode(decrypted);

        // Show a success toast
        showToast('Decryption successful!', 'success');

        return decryptedData;
    } catch (error) {
        console.error("Error during decryption: ", error);

        // Show an error toast
        showToast('Decryption failed, incorrect password ' + error.message, 'error');

        // Rethrow the error or handle it as needed
        throw error;
    }
}