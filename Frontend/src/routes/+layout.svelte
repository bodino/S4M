<script>
import "../app.css";

import Nav from "$lib/Nav.svelte";
import Stats from "$lib/Stats.svelte";
import AddressTable from "$lib/AddressTable.svelte";
import {
    getBalance,
    getMetaAddress
} from "../utils/wallet"
import {
    writable
} from 'svelte/store';

import SendToken from "$lib/SendToken.svelte";
import {
    privSpend,
    privView,
    metaStealth,
    isAuthenticated,
    walletDetails,
    uploadedStealthAddress
} from "../stores/authStore";

import {
    createWeb3Modal,
    defaultConfig
} from "@web3modal/ethers5";

import {
    ethers
} from "ethers";
import {
    onMount
} from "svelte";

import {
    checkKeyStorage
} from "../onMountLogic/onMountLogic";
import {
    setContext
} from 'svelte';
import Toast from '$lib/TransactionToast.svelte';

const toastStore = writable({
    message: '',
    type: '',
    show: false
});

function showTransactionToast(message, type) {
    console.log(message, type);
    toastStore.set({
        message,
        type,
        show: true
    });
    if (type !== 'pending') {
        setTimeout(() => {
            toastStore.update(n => ({
                ...n,
                show: false
            }));
        }, 3000); // Hide toast after 3 seconds if not pending
    }
}

onMount(async () => {
    checkKeyStorage();
});

// 1. Get projectId
const projectId = "3c5e4ea6943c2ba4fda2bb5faf98387e";

// 2. Set chains
const polygon = {
    chainId: 137,
    name: "Polygon",
    currency: "MATIC",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://polygon.llamarpc.com",
};

// 3. Create modal
const metadata = {
    name: "Hello Website",
    description: "My Website description",
    url: "https://mywebsite.com",
    icons: ["https://avatars.mywebsite.com/"],
};

const modal = createWeb3Modal({
    themeVariables: {
        '--w3m-accent': '#00000'
    },

    ethersConfig: defaultConfig({
        metadata,
    }),
    featuredWalletIds: [
        "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
        "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
        "a9751f17a3292f2d1493927f0555603d69e9a3fcbcdf5626f01b49afa21ced91",
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    ],
    chains: [polygon],
    defaultChainId: 137,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    projectId,
});

const walletProvider = modal.getWalletProvider();
console.log(walletProvider);

async function handleChange({
    provider,
    providerType,
    address,
    chainId,
    isConnected
}) {
    var balance = 0
    if (provider != undefined) {
        balance = await getBalance(provider, address)
        console.log(balance)
    }

    var metaAddressOnChain = undefined
    if (address != undefined) {
        metaAddressOnChain = await getMetaAddress(provider, address)
        console.log("metaAddressOnChain")
        console.log(metaAddressOnChain)
    }

    if (metaStealth && $metaStealth.join) {
        if (metaAddressOnChain == $metaStealth.join('')) {
            uploadedStealthAddress.set(true);
        } else if (metaAddressOnChain != $metaStealth.join('') && (metaAddressOnChain != undefined && metaAddressOnChain != '')) {
            uploadedStealthAddress.set(3);
        }
    }

    // metaStealth.set(metaAddress)
    walletDetails.update((currentValues) => ({
        ...currentValues,
        provider,
        providerType,
        address,
        chainId,
        isConnected,
        balance,
    }));
}

modal.subscribeProvider(handleChange)

// Function to handle the button click
async function handleButtonClick() {
    const walletProvider = modal.getWalletProvider();
    if (!walletProvider) throw Error("User disconnected");
    const ethersProvider = new ethers.providers.Web3Provider(
        walletProvider,
    );
    const signer = await ethersProvider.getSigner();
    const message = "Your message to sign";

    const signature = await signer.signMessage(message);
    // You can do something with walletProvider here
    console.log(walletProvider);
}

setContext('showToast', showTransactionToast);
</script>

<Nav />
<div class="flex flex-row" style="justify-content: center">
    <Stats {modal}/>
        </div>

        <div class="flex flex-row" style="justify-content: center">
            <div class="basis-4/6 p-4">
                <AddressTable />
            </div >
            <div class="basis-2/6 p-4">
                <SendToken/>
            </div>
            
                </div>
                <slot />

                <Toast bind:message={$toastStore.message} bind:type={$toastStore.type} bind:show={$toastStore.show} />
