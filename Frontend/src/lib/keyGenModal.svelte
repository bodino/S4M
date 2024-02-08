<script>
  import { onMount } from "svelte";
  import { generateValidMnemonic } from "../crypto/keyGen";
  import { generatePrivateKeys } from "../crypto/privKeyGen";
  import { encryptData, decryptData } from "../crypto/encryptDecrypt";
  import { storeInIndexedDB, retrieveFromIndexedDB, initDB } from "../dataBaseInterface/indexedDBinterface";
  import { STORE_NAME } from '../utils/constants';

  
  let canvas, ctx, w, h;
  let isComplete = false;
  let entropyPool = [];
  let progressValue = 0;
  const maxEntropy = 1000;
  let entropy = []; // This will hold your entropy data
  let keysGen = false;
  let keys = "";

  async function handleSubmit() {
    if (!keysGen) {
      alert("Please generate the keys first.");
      return false; // Prevent form submission
    } else {
      var password = document.getElementById("passwordInput").value;
      console.log(keys["privateKey1"]);
      const encryptedPrivViewKey = await encryptData(
        keys["privateKey1"],
        password,
      );
      const encryptedPrivSpendKey = await encryptData(
        keys["privateKey2"],
        password,
      );

      //sample unencryption
      // let unencryptedData = await decryptData(encryptedPrivViewKey[0],password, encryptedPrivViewKey[1], encryptedPrivViewKey[2])
      const pubViewKey = keys["publicKey1"];
      const pubSpendKey = keys["publicKey2"];
      const metaStealthAddress = [pubViewKey, pubSpendKey];


      //store encrypted keys in indexedDB
      await initDB(STORE_NAME);

      try {
          await initDB(STORE_NAME); // Replace 'myObjectStore' with your actual store name
          await storeInIndexedDB(STORE_NAME, 'encryptedPrivViewKey', encryptedPrivViewKey);
          await storeInIndexedDB(STORE_NAME, 'encryptedPrivSpendKey', encryptedPrivSpendKey);
          await storeInIndexedDB(STORE_NAME, 'metaStealthAddress', metaStealthAddress);

          console.log('All data stored successfully');
        } catch (error) {
          console.error('Error storing data:', error);
      }
      
   

      console.log('mongoose')
      // await storeInIndexedDB('metaStealthAddress',metaStealthAddress)      
      
      



      //delete unencrypted key storage and print to check.

      keys = [];
      password = [];
      console.log(password);
      console.log(keys);

      //use password to encrypt private keys
      document.getElementById("my_modal_5").close();
    }
    // Proceed with form submission or encryption logic
  }

  onMount(() => {
    // Assuming there is a container element with class "matrix-area"
    const matrixArea = document.querySelector(".matrix-area");
    canvas = document.getElementById("canv");
    ctx = canvas.getContext("2d");

    // Set canvas dimensions based on the container's size
    w = canvas.width = matrixArea.clientWidth;
    h = canvas.height = matrixArea.clientHeight;

    const cols = Math.floor(w); // Adjust column width as needed
    const ypos = Array(cols).fill(0);

    canvas.addEventListener("mousemove", () => {
      if (!isComplete) {
        matrix(ypos, cols);
      }
    });

    canvas.addEventListener("mouseleave", () => {
      //   ctx.fillStyle = '#000';
      //   ctx.fillRect(0, 0, w, h);
    });
  });

  function matrix(ypos, cols) {
    ctx.fillStyle = "#0001";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#0f0";
    ctx.font = "8pt monospace";

    ypos.forEach((y, ind) => {
      const text = String.fromCharCode(Math.random() * 128);
      const x = ind * 10;
      ctx.fillText(text, x, y);

      if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
      else ypos[ind] = y + 20;
    });
  }

  function renderCompletionMessage(message) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0f0";
    ctx.textAlign = "center"; // Align text to center
    ctx.textBaseline = "middle"; // Align text to middle
    ctx.font = "30pt monospace"; // Larger font size

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(" ");
      var line = "";

      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }

    // Define max width and line height
    var maxWidth = w - 20; // Adjust as needed
    var lineHeight = 25; // Adjust as needed
    var x = w / 2;
    var y = h / 3 - lineHeight / 2; // Adjust starting y based on line height

    wrapText(ctx, message, x, y, maxWidth, lineHeight);
  }

  function renderMnemonic(message, widthMod, heightMod) {
    // ctx.fillStyle = '#000';
    // ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0f0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "10pt monospace";

    // Function to wrap text
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(" ");
      var line = "";

      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }

    // Define max width and line height
    var maxWidth = w - 20; // Adjust as needed
    var lineHeight = 25; // Adjust as needed
    var x = w / widthMod;
    var y = h / heightMod - lineHeight / 2; // Adjust starting y based on line height

    wrapText(ctx, message, x, y, maxWidth, lineHeight);
  }

  async function addEntropy(event) {
    entropyPool.push(event.clientX, event.clientY, new Date().getTime());
    progressValue = Math.min((entropyPool.length / maxEntropy) * 100, 100);

    if (progressValue >= 100 && !isComplete) {
      isComplete = true;
      let mnemonic = await handleGetMnemonic();
      const message = "Complete, welcome to stealthy";

      keys = await generatePrivateKeys(mnemonic);
      console.log(keys);
      renderCompletionMessage(message);

      keysGen = true;

      //so we have mnemonic, now we want to generate the two private keys, prompt the user for a password, encrypt the keys, and then delete the mnemonic from memory.

      setTimeout(() => {
        renderMnemonic("Store your MNEMONIC below safely", 2, 2);
      }, 3000); // 3000 milliseconds delay (3 seconds)

      setTimeout(() => {
        renderMnemonic(mnemonic, 2, 1.5);
      }, 6000); // 3000 milliseconds delay (3 seconds)
    }
  }

  function clearEntropy() {
    entropyPool = [];
    entropyString = "";
    progressValue = 0;
  }

  async function handleGetMnemonic() {
    console.log("hi");
    return await generateValidMnemonic(entropy);
  }

  // Function to determine the progress bar color
  function progressBarColor(value) {
    if (value < 25) return "progress-error"; // Red for less than 25%
    if (value < 100) return "progress-warning"; // Yellow for less than 100%
    return "progress-success"; // Green for 100%
  }
</script>

<!-- Modal -->
<dialog id="my_modal_5" class="modal">
  <div
    class="modal-box w-11/12 max-w-5xl bg-gray-800 text-white rounded-lg shadow-xl"
  >
    <h3 class="font-bold text-lg text-center mb-4">
      Generate Entropy with Mouse Movement
    </h3>
    <div class="py-4">
      <div
        class="matrix-area cursor-pointer p-6 mb-4 bg-gray-700 bg-opacity-25 rounded-md"
        on:mousemove={addEntropy}
        style="height: 500px; width: 100%; position: relative;"
      >
        <canvas id="canv" style="width: 100%; height: 100%;"></canvas>
        <!-- Include some visual instructions or cues here, if necessary -->
      </div>
      <progress
        class="progress w-full bg-gray-700"
        value={progressValue}
        max="100"
        style={progressBarColor(progressValue)}
      ></progress>
    </div>
    <form
      class="modal-action flex justify-between items-center"
      method="dialog"
      on:submit|preventDefault={handleSubmit}
    >
      <!-- Password Input Field -->
      <div class="flex-grow mr-4">
        <label for="passwordInput" class="block mb-2 text-sm font-bold"
          >Encryption Password</label
        >
        <input
          type="password"
          id="passwordInput"
          placeholder="Enter password"
          class="w-full px-4 py-2 bg-gray-700 border-0 rounded-md shadow-inner focus:ring focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <p class="mt-2 text-xs">
          This password will be used to encrypt your keys.
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50 text-white font-bold px-6 py-2 rounded-md transition duration-200 ease-in-out"
      >
        Encrypt & Close
      </button>
    </form>
  </div>
</dialog>

<style>
  .matrix-area {
    display: flex;
    height: 100vh;
    background-color: black;
    overflow: hidden;
  }

  .modal-box {
    margin: 1rem;
    padding: 1.5rem;
  }

  @keyframes stream-text {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(100%);
    }
  }

  .progress {
    height: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    backdrop-filter: blur(5px);
  }

  .transparent-button {
    background-color: transparent;
    color: transparent;
    border: none;
    /* Additional styles to ensure the element is invisible but still functional */
  }

</style>
