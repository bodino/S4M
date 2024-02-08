import { writable } from 'svelte/store';
import { STORE_NAME } from '../utils/constants';
import { retrieveData } from '../dataBaseInterface/indexedDBInterface';


export const isAuthenticated = writable(false);
export const uploadedStealthAddress = writable(false);
export const privSpend = writable(['','','']);
export const privViewUnencrypted = writable(undefined);
export const privView = writable(['','','']);
export const metaStealth = writable(['', '']);
export const walletDetails = writable({
    provider: false,
    providerType: false,
    address: false,
    chainId: false,
    isConnected: false,
    balance: 0,
    totalBalance: 0,
  });