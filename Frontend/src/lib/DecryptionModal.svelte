<script>
    import { encryptData, decryptData } from "../crypto/encryptDecrypt";
    import { privViewUnencrypted} from '../stores/authStore';
    import { STORE_NAME } from '../utils/constants';
    import { getContext } from 'svelte';

    const showToast = getContext('showToast');

    //import data from parent component
    export let dataToDecrypt;

    let passwordInput;

    async function handleSubmit() {
        console.log(dataToDecrypt)
        const privViewKey = await decryptData(dataToDecrypt[0], passwordInput, dataToDecrypt[1], dataToDecrypt[2], showToast);
        //store in session / store
        passwordInput = '';
        console.log(privViewKey)
        privViewUnencrypted.set(privViewKey);
        document.getElementById("decryption_modal").close();
      }
      // Proceed with form submission or encryption logic
    
  </script>
  <!-- Modal -->
  <dialog id="decryption_modal" class="modal">
    <div class="modal-box bg-gray-800 text-white rounded-lg shadow-xl">
      <!-- Exit Button -->
      <button class="btn btn-sm btn-circle absolute right-2 top-2 text-white" onclick="document.getElementById('decryption_modal').close()">✕</button>
      
      <!-- Modal Title -->
      <h3 class="text-lg font-bold mb-4">Decryption Key Input</h3>
  
      <form class="modal-action flex items-center" method="dialog" on:submit|preventDefault={handleSubmit}>
        <!-- Password Input Field -->
        <div class="flex flex-grow items-center mr-2">
            <label for="passwordInput" class="mr-2 text-sm font-bold">Password:</label>
            <input bind:value={passwordInput} type="password" id="passwordInput" placeholder="Enter password" class="w-full px-2 py-1 bg-gray-700 border-0 rounded-md shadow-inner focus:ring focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="btn bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50 text-white font-bold px-4 py-1 rounded-md transition duration-200 ease-in-out">
          Decrypt
        </button>
      </form>
    </div>
  </dialog>
  
  
  <style>
    .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
  }

  .modal-box {
    margin: 1rem;
    padding: 1rem;
    position: relative;
    min-width: 300px; /* Adjust as needed for minimum size */
  }

  .btn-circle {
    border-radius: 50%;
  }

  .btn-ghost {
    background-color: transparent;
    color: inherit;
  }
  
  </style>
  