<script>
  import { metaStealth, privViewUnencrypted, walletDetails } from '../stores/authStore'; // Import the store
  import { writable } from 'svelte/store';
  import {checkForStealthAddress} from '../utils/wallet';
  import {META_ADDRESS_REGISTRAR_ABI, META_ADDRESS_REGISTRAR_ADDRESS, RPC} from '../utils/constants';
  import { ethers } from 'ethers';
  import {
    getBalance2,
} from "../utils/wallet"

  let stealthAccounts = [];
  const sortOption = writable('none'); // Store to track the active sort option
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  let isLoading = false; // Reactive variable to track loading state


  async function searchAddresses() {
    isLoading = true; // Set loading to true when the function starts

    console.log('test')
    console.log($metaStealth[0])
    const publicSpendKey = $metaStealth[1];

    const contract = new ethers.Contract(META_ADDRESS_REGISTRAR_ADDRESS, META_ADDRESS_REGISTRAR_ABI, provider);

    // Fetch all 'FundTransfer' events
    const events = await contract.queryFilter('FundTransfer', 0, 'latest');
    console.log("pass")
    console.log(events)

    const results = [];
    for (const event of events) {
        const { from, to, amount, data } = event.args;
        // Process each event
        // Example: Call checkForStealthAddress
        // Adjust the parameters as per your function's requirement
        const ephemkey = data.slice(0, -2);
        const viewTag = data.slice(-2);
        console.log(ephemkey)
        console.log(viewTag)


        const stealthAddress = await checkForStealthAddress(ephemkey, $privViewUnencrypted, publicSpendKey, viewTag);
        console.log(stealthAddress)
        console.log('testtest')

        // Assuming 'test' returns the structure you need for your addresses
        if (stealthAddress) {
            var balance = await getBalance2(provider,stealthAddress)
            results.push({stealthAddress, balance});
        }
    }

    console.log('LETSGO')
    stealthAccounts = results;
    //sum balance of all stealth accounts
    var totalBalance = 0;
    for (var i = 0; i < stealthAccounts.length; i++) {
      totalBalance += stealthAccounts[i].balance;
    }
    //now update walletDetails store with total balance
    walletDetails.update(n => ({...n, totalBalance: totalBalance}));
    
    isLoading = false; // Reactive variable to track loading state

}

  $: if ($privViewUnencrypted) {
      searchAddresses();
  }

  function sortByBalance() {
      addresses = [...addresses].sort((a, b) => b.balance - a.balance); // Corrected sorting order
      sortOption.set('balance');
  }

  function sortByColor() {
      addresses = [...addresses].sort((a, b) => a.color.localeCompare(b.color));
      sortOption.set('color');
  }
</script>

<div class="p-4 flex justify-between items-center">
  <div>
    <button class="btn btn-xs btn-primary mr-2" on:click={sortByBalance} class:active={$sortOption === 'balance'}>Sort by Balance</button>
    <button class="btn btn-xs btn-secondary" on:click={sortByColor} class:active={$sortOption === 'color'}>Sort by Color</button>
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 svg-button" on:click={searchAddresses}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
</div>



<!-- Static Default Placeholder -->
<!-- Conditional Rendering Based on Data and Loading State -->
<!-- Conditional Rendering Based on Data and Loading State -->
{#if stealthAccounts.length === 0 && !isLoading}
  <!-- Static Default Placeholder -->
  <div class="overflow-x-auto">
    <table class="table w-full table-zebra">
        <thead>
            <tr class='text-secondary  font-bold'>
                <th>#</th>
                <th>Address</th>
                <th>Matic</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {#each Array(5) as _, index}
                <tr class="hover">
                    <td class="font-bold">{index +1}</td>
                    <td class="font-semibold">Unencrypt To View</td>
                    <td class="font-semibold">...</td>
                    <td class="font-semibold small-box">...</td>
                </tr>
            {/each}
        </tbody>
    </table>
  </div>
{:else if isLoading}
  <!-- Table with Sliding Overlay for Loading -->
  <div class="overflow-x-auto relative">
    <table class="table w-full table-zebra" >
        <thead>
          <tr class='text-secondary font-bold'>
            <th>#</th>
            <th>Address</th>
            <th>Matic</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
            {#each Array(5) as _, index}
                <tr>
                    <td class="font-bold">{index +1}</td>
                    <td><div class="skeleton h-4 w-32"></div></td>
                    <td><div class="skeleton h-4 w-24"></div></td>
                    <td class='small-box'><div class="skeleton h-4 w-24"></div></td>
                </tr>
            {/each}
        </tbody>
    </table>
    <div class="sheen-overlay"></div>
  </div>
{:else}

<div class="overflow-x-auto">
  <table class="table w-full table-zebra">
      <!-- head -->
      <thead>
          <tr class="text-secondary font-bold">
              <th>#</th>
              <th>Address</th>
              <th>Matic</th>
              <th>Action</th>
          </tr>
      </thead>
      <tbody>
          {#each stealthAccounts as stealthAccount, index}
              <tr class="hover">
                  <th class="font-bold">{index + 1}</th>
                  <td class="font-semibold">{stealthAccount.stealthAddress.slice(0, 5)}...{stealthAccount.stealthAddress.slice(-5)}</td>
                  <td class="font-semibold">{stealthAccount.balance}</td>
                  <td class='small-box'>
                      <button class="btn btn-xs btn-secondary mr-2 ">Send</button>
                  </td>
              </tr>
          {/each}
      </tbody>
  </table>
</div>

{/if}



<style>
  .btn-xs {
      padding: 0.25rem 0.5rem; /* Smaller padding for extra-small buttons */
      font-size: 0.75rem; /* Smaller font size */
  }
  .active {
      background-color: var(--primary-focus); /* Different background for active button */
  }

  .skeleton {
    background-color: #e2e8f0; /* Adjust to match your theme */
    animation: pulse 1.5s ease-in-out infinite;
    border-radius: 4px;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }

  .sheen-overlay {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent 25%, rgba(255, 255, 255, 0.3) 50%, transparent 75%);
    animation: sheen 2s linear infinite;
  }

  .small-box {
    width:.1rem;
  }

  @keyframes sheen {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  .svg-button{
    cursor: pointer;
    transition: transform 0.2s;
  }

  .svg-button:active {
    transform: scale(0.9);
    transition: transform 0.1s;
  }
</style>

