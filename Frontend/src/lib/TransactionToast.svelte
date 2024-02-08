<!-- Toast.svelte -->
<script>
    export let message = '';
    export let type = '';
    export let show = false;

    // Function to get the appropriate color class based on the type
    function getColorClass(type) {
        switch(type) {
            case 'error': return 'bg-red-500';
            case 'success': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'info': return 'bg-blue-500';
            case 'pending': return 'bg-gray-500'; // Assuming pending uses gray
            default: return 'bg-gray-500'; // Default color
        }
    }

    $: if (show && type !== 'pending') {
        setTimeout(() => {
            show = false;
        }, 3000); // Hide toast after 3 seconds if not pending
    }
</script>

{#if show}
<div class="toast">
    <div class={`alert ${getColorClass(type)}`}>
        <span class="loading loading-dots loading-md"></span>

        <span>{message}</span>
    </div>
</div>
{/if}

<style>
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px; /* Changed from left to right */
        z-index: 1000;
        max-width: 250px; /* Limiting the width */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adding a subtle shadow for better visibility */
        border-radius: 4px; /* Slight rounding of corners */
    }

    .alert {
        padding: 10px 15px; /* Adjust padding for a compact look */
        color: white; /* Ensure text is white for better readability */
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem; /* Smaller font size */
    }
</style>