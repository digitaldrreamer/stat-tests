<script>
    let { toast = { visible: false, message: '' } } = $props()
</script>

{#if toast.visible}
    <div class="fixed bottom-4 right-4 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="m9 11 3 3L22 4"/>
        </svg>
        <span>{toast.message}</span>
    </div>
{/if}