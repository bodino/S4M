
<script>
    let address = '';
    let amount = 0;
    import { getContext } from 'svelte';
    const showToast = getContext('showToast');
    import {sendToken} from '../utils/wallet'
    import {
        walletDetails,
    } from "../stores/authStore";
  
    const sendEthereum = async () => {
      // Ethereum sending logic goes here
      sendToken($walletDetails.provider, address, amount, showToast)
    };


    
  </script>


<form on:submit|preventDefault={sendEthereum} class="form-control ">
    <div class='p-4'>
        <button class="btn btn-xs btn-primary mr-2" >Normal Send</button>
        <button class="btn btn-xs btn-secondary" >Stealth Send</button>
    </div>
  
    <label class="label">
      <span class="label-text">Address</span>
    </label>
    <input type="text" bind:value={address} class="input input-bordered" />
  
    <label class="label">
      <span class="label-text">Amount (MATIC)</span>
    </label>
    <input type="float" bind:value={amount} class="input input-bordered" />
  
    <button type="submit" class="btn btn-primary mt-4">Send</button>
</form>
