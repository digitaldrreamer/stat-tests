<script>
	import { onMount } from 'svelte';
    import { fade, scale, fly } from 'svelte/transition';

    let { message = "Loading..." } = $props();

    let quote = $state(null);
    let quoteError = $state(false);
    
    const setQuote = async () => {
        try {
            const req = await fetch('https://api.quotable.io/random');
            if (!req.ok) throw new Error('Failed to fetch quote');
            
            const res = await req.json();
            quote = {
                content: res.content,
                author: res.author
            };
        } catch (error) {
            console.error('Error fetching quote:', error);
            quoteError = true;
        }
    }

    onMount(() => setQuote());
</script>

<!-- Backdrop -->
<div
    class="fixed inset-0 z-50 select-none cursor-default"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
>
    <!-- Blur overlay -->
    <div
        class="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm"
        aria-hidden="true"
    ></div>

    <!-- Modal -->
    <div
        class="fixed inset-0 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loading-title"
    >
        <div
            class="relative rounded-lg bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 w-[90vw] max-w-md"
            in:scale={{ duration: 200, start: 0.95 }}
            out:scale={{ duration: 150, start: 1.05 }}
        >
            <div class="flex flex-col items-center text-center space-y-5">
                <!-- Spinner container with appropriate sizing -->
                <div class="spinner-container">
                    <video class="w-16 h-16 rounded-full object-cover" autoplay loop muted playsinline>
                        <source src="/assets/loading.webm" type="video/webm">
                    </video>
                </div>

                <div class="space-y-2">
                    <h2
                        id="loading-title"
                        class="text-lg font-semibold text-neutral-900 dark:text-white"
                    >
                        {message}
                    </h2>
                </div>
                
                {#if quote}
                <div 
                    class="quote-container" 
                    in:fly={{ y: 20, duration: 400, delay: 200 }}
                >
                    <blockquote class="text-sm text-neutral-600 dark:text-neutral-300 italic">
                        "{quote.content}"
                    </blockquote>
                    <div class="mt-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        — {quote.author}
                    </div>
                </div>
                {:else if !quoteError}
                <div class="quote-placeholder animate-pulse">
                    <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .spinner-container {
        position: relative;
        width: 64px;
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }
    
    .spinner-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        animation: pulse 2s infinite ease-in-out;
    }
    
    .quote-container {
        position: relative;
        width: 100%;
        padding: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0 0 0.5rem 0.5rem;
    }
    
    .quote-container::before {
        content: '"';
        position: absolute;
        top: 0.5rem;
        left: 0;
        font-size: 2rem;
        line-height: 1;
        color: rgba(0, 0, 0, 0.1);
        font-family: serif;
    }
    
    .quote-placeholder {
        width: 100%;
        padding: 1rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    @keyframes pulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.8; }
        100% { opacity: 0.3; }
    }
    
    /* For the animate-pulse class */
    @keyframes pulse-animation {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
    
    .animate-pulse {
        animation: pulse-animation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>