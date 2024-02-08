import { privSpend, privView, metaStealth, isAuthenticated } from '../stores/authStore';
import { STORE_NAME } from '../utils/constants';
import { retrieveData } from '../dataBaseInterface/indexedDBInterface';
import { get } from 'svelte/store';


// Function to check if keys exist and update the store and set variables
export async function checkKeyStorage() {
    try {
        let [encryptedPrivViewKey, encryptedPrivSpendKey, metaStealthAddress] = await retrieveData(STORE_NAME);
        privSpend.set(encryptedPrivSpendKey);
        privView.set(encryptedPrivViewKey);
        if (metaStealthAddress === null) metaStealthAddress = ['', '']; // If metaStealthData is null, set it to an empty array (this is to prevent errors    
        metaStealth.set(metaStealthAddress);

        // Update isAuthenticated based on whether the keys exist
        const isAuth = encryptedPrivSpendKey && encryptedPrivViewKey && metaStealthAddress;
        isAuthenticated.set(isAuth);
        console.log('mongoose')
        console.log(get(privView));
    } catch (error) {
        console.error('Error retrieving data:', error);
        isAuthenticated.set(false);
    }
}

