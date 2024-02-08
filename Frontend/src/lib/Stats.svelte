<script>
  export let modal;
  let providerSubscription;
  import { onDestroy } from 'svelte';
  import OpenKeyGenModal from './keyGenModal.svelte'
  import { fade } from 'svelte/transition';
  import {updateMetaAddressRegistration} from '../utils/wallet'
  import DecryptionModal from './DecryptionModal.svelte';


  var testNum = 124.23421
  import { walletDetails, isAuthenticated, uploadedStealthAddress, metaStealth, privView, privViewUnencrypted} from '../stores/authStore';
  let loginStage = 0; // Starting at 0 for the first step
  
  $: showConnectWallet = !$walletDetails.isConnected;
  $: showGenerateKeys = $walletDetails.isConnected && !$isAuthenticated;
  $: showUploadAddress = $walletDetails.isConnected && $isAuthenticated && !$uploadedStealthAddress;
  $: showUnencryption = $walletDetails.isConnected && $isAuthenticated && $uploadedStealthAddress && !$privViewUnencrypted;
  $: dataToDecrypt = $privView

  $: {
    if (showConnectWallet) {
      loginStage = 0;
    } else if (showGenerateKeys) {
      loginStage = 1;
    } else if (showUploadAddress) {
      loginStage = 2;
    } 

  }

  const steps = [
    {
      title: "Connect Wallet",
      description: "Connect your wallet to begin the login process.",
      action: connectWallet,
    },
    {
      title: "Generate Private Keys",
      description: "Generate your private keys for secure access.",
      action: generatePrivateKeys,
    },
    {
      title: "Publish Stealth Address",
      description: "Upload your public stealth address for privacy.",
      action: uploadStealthAddress,
    },
  ];

  function connectWallet() {
    // Open the modal for wallet connection
    modal.open();

    // Subscribe to provider changes to handle a successful connection
    providerSubscription = modal.subscribeProvider(({ provider, isConnected }) => {
      if (isConnected) {
        advanceStage(); // Advance only if the wallet is connected
        providerSubscription(); // Unsubscribe from changes after handling the connection
      }
    });

    unsubscribeProvider()
  }

  function generatePrivateKeys() {
  const modal = document.getElementById("my_modal_5");
  modal.showModal();

  // Event listener for when the modal is closed
  modal.addEventListener('close', () => {
    advanceStage(); // Advance the stage after the modal is closed
  }, { once: true }); // 'once: true' ensures the listener is removed after it's invoked
}

  async function uploadStealthAddress() {
    updateMetaAddressRegistration($walletDetails.provider, $metaStealth)
    // Upload public stealth address logic here
    advanceStage();
  }

  function advanceStage() {
    if (loginStage < steps.length - 1) {
      loginStage++;
    }
  }

  // Make sure to call this function to clean up if the component is destroyed
function unsubscribeProvider() {
  if (providerSubscription) {
    providerSubscription();
  }
}

function unencrpytPrivViewKey() {
  const decryptModal = document.getElementById("decryption_modal");
  decryptModal.showModal();


  // Unencrypt private view key logic here
  
}
 // Svelte lifecycle hook to clean up subscriptions
</script>



<div class="stats shadow">
  
    <div class="stat">
      <!-- <div class="stat-figure text-primary">
        <img src="./polygon-matic-logo.svg" alt="description" style="width: 50px; height: 50px;"/>
      </div> -->
      <div class="stat-title">Connected Wallet Balance</div>
      <div class="stat-value text-primary" style="display: flex; align-items: center;">
        <a> {$walletDetails.balance.toFixed(2)}</a>
        <img src="./polygon-matic-logo.svg" alt="description" style="width: 40px; height: 40px; margin-left: 10px;"/>
    </div>

      {#if typeof $walletDetails.address === 'string'}
        <p class="stat-desc"> Address: {$walletDetails.address.slice(0, 5)}...{$walletDetails.address.slice(-5)}</p>
      {:else}
        <p class="stat-desc">Address: N/A</p>
      {/if}
    </div>
    
    <div class="stat">
      
      <div class="stat-title">Stealth Wallet Balance</div>
      <div class="stat-value text-secondary" style="display: flex; align-items: center;">
        <a> {$walletDetails.totalBalance.toFixed(2)}</a>
        <img class="secondary" src="./stealth-matic-logo.svg" alt="description" style="width: 40px; height: 40px; margin-left: 10px;"/>
    </div>

      <div class="stat-desc">Stealth Addresses</div>
    </div>
    
   
  
      {#if showConnectWallet}
      <div class="stat" >
        <div class="stat-title">Login Process {loginStage + 1}/{steps.length}</div>
        <button class="btn bg-white text-black" on:click={connectWallet}>
          {steps[0].title}
        </button>
        <div class="stat-desc">{steps[loginStage].description}</div>

      </div>
      {/if}
  
      {#if showGenerateKeys}
      <div class="stat " >
        <div class="stat-title">Login Process {loginStage + 1}/{steps.length}</div>
        <OpenKeyGenModal></OpenKeyGenModal>
        <button class="btn bg-white text-black" on:click={generatePrivateKeys}>
          {steps[1].title}
        </button>
        <div class="stat-desc">{steps[loginStage].description}</div>

        </div>
      {/if}
  
      {#if showUploadAddress}
      <div class="stat" >
        <div class="stat-title">Login Process {loginStage + 1}/{steps.length}</div>
        <button class="btn bg-white text-black" on:click={uploadStealthAddress}>
          {steps[2].title}
        </button>
        <div class="stat-desc">{steps[loginStage].description}</div>

        </div>
      {/if}

      {#if showUnencryption }
      <div class="stat" >
        <div class="stat-title">Unencrypt View Key</div>
        <DecryptionModal {dataToDecrypt}/>
        <button class="btn bg-white text-black" on:click={unencrpytPrivViewKey} >
          Unencrypt Key 
        </button>
        <div class="stat-desc">You Must Unencrypt Key To View Funds</div>

        </div>
      {/if}

      {#if $uploadedStealthAddress === 3}
      <div class="stat" >
        <div class="stat-title">Mismatch of Wallets</div>
        <button class="btn  btn-warning no-animation">
          WARNING, DANGER
        </button>
        <div class="stat-desc">Please Connect Original Wallet</div>

        </div>
      {/if}

  
  </div>

  <style>
    .login-process {
      /* Style for the login process container */
    }
    .btn {
      /* Style for the button */
      transition: background-color .3s, color .3s;
    }
    .btn:hover {
      /* Style for the hover state */
      background-color: #444;
      color: white;
    }
  </style>


