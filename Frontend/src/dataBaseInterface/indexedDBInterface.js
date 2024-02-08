
export async function initDB(storeName) {
  const DB_NAME = "stealthyDB";
  const DB_VERSION = 1;
  
  checkStoreExists()
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onerror = event => {
      reject('Error initializing IndexedDB:', event.target.error);
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };
  });
}

export async function storeInIndexedDB(storeName, id, data) {
  const db = await initDB(storeName);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const putRequest = store.put({ id, data });

    putRequest.onerror = event => {
      reject('Error storing data in IndexedDB:', event.target.error);
    };

    putRequest.onsuccess = () => {
      resolve('Data stored in IndexedDB successfully');
    };
  });
}

export async function retrieveFromIndexedDB(storeName, id) {
  const db = await initDB(storeName);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const getRequest = store.get(id);

    getRequest.onerror = event => {
      reject('Error retrieving data from IndexedDB:', event.target.error);
    };

    getRequest.onsuccess = () => {
      resolve(getRequest.result ? getRequest.result.data : null);
    };
  });
}

export async function checkStoreExists(storeName) {
  const DB_NAME = "MyDatabase";
  const DB_VERSION = 1; // Use the same version used in `initDB`

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      // This is only triggered if the database is being created or upgraded,
      // so if this event is triggered, the store does not exist.
      reject(`Database upgrade needed. Store '${storeName}' may not exist.`);
    };

    request.onerror = event => {
      reject('Error opening IndexedDB:', event.target.error);
    };

    request.onsuccess = event => {
      const db = event.target.result;
      if (db.objectStoreNames.contains(storeName)) {
        resolve(true); // Store exists
      } else {
        resolve(false); // Store does not exist
      }
      db.close();
    };
  });
}


export async function retrieveData(storeName) {
  try {
    const encryptedPrivViewKey = await retrieveFromIndexedDB(storeName, 'encryptedPrivViewKey');
    const encryptedPrivSpendKey = await retrieveFromIndexedDB(storeName, 'encryptedPrivSpendKey');
    const metaStealthAddress = await retrieveFromIndexedDB(storeName, 'metaStealthAddress');

    return [encryptedPrivViewKey, encryptedPrivSpendKey, metaStealthAddress]
  } catch (error) {
    console.error('Error retrieving data:', error);
    return false
  }
}