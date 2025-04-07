<script>
    import { onMount } from 'svelte';

    // State management
    let email = $state('');
    let waitlistCount = $state(0);
    let isPending = $state(false);
    let toast = $state(null);
    let toastVisible = $state(false);
    let toastVariant = $state('default');
    let toastTitle = $state('');
    let toastDescription = $state('');

    // Simulated waitlist data (in a real app, this would be server-side)
    let waitlistEmails = new Set();

    // Simulate getting the waitlist count
    onMount(() => {
        // Simulate initial count (100 + any stored emails)
        waitlistCount = waitlistEmails.size + 100;
    });

    // Form validation
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Show toast notification
    function showToast(title, description, variant = 'default', duration = 5000) {
        toastTitle = title;
        toastDescription = description;
        toastVariant = variant;
        toastVisible = true;

        // Auto-hide toast after duration
        clearTimeout(toast);
        toast = setTimeout(() => {
            toastVisible = false;
        }, duration);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        if (!email) {
            showToast('Error', 'Email is required', 'destructive');
            return;
        }

        if (!isValidEmail(email)) {
            showToast('Error', 'Invalid email address', 'destructive');
            return;
        }

        isPending = true;

        try {
            // Simulate server action delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Add email to waitlist
            waitlistEmails.add(email);

            // Update count
            waitlistCount = waitlistEmails.size + 100;

            // Show success message
            showToast('Success!', 'You have been added to the waitlist! Check your email for confirmation.');

            // Reset form
            email = '';
        } catch (error) {
            showToast('Error', 'An unexpected error occurred. Please try again.', 'destructive');
        } finally {
            isPending = false;
        }
    }
</script>

<main
        class="min-h-screen flex items-center justify-center"
        style="background: radial-gradient(circle at center, #1E40AF, #000000);"
>
    <div class="bg-pattern"></div>
    <div class="content w-full">
        <div class="w-full max-w-xl mx-auto p-8 flex flex-col justify-between min-h-screen">
            <div class="flex-1 flex flex-col justify-center items-center text-center">
                <div>
                    <h2 class="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                        Join Our Product Launch Waitlist
                    </h2>
                </div>
                <div>
                    <p class="text-lg sm:text-xl mb-8 text-gray-300">
                        Be part of something truly extraordinary. Join thousands of others already gaining early access to our
                        revolutionary new product.
                    </p>
                </div>
                <div class="w-full">
                    <!-- Waitlist Form -->
                    <form onsubmit={handleSubmit} class="w-full space-y-4 mb-8">
                        <div class="flex overflow-hidden rounded-xl bg-white/5 py-1 px-2 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
                            <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    bind:value={email}
                                    aria-describedby="email-error"
                                    class="w-full border-0 bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
                            />
                            <button
                                    type="submit"
                                    disabled={isPending}
                                    class="bg-black hover:bg-gray-800 text-white font-semibold px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none w-[120px]"
                            >
                                {#if isPending}
                                    <svg class="h-5 w-5 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                {:else}
                                    Get Notified
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    <div class="flex items-center justify-center mt-8">
                        <div class="flex -space-x-2 mr-4">
                            <!-- Avatars -->
                            <div class="w-10 h-10 rounded-full border border-white/20 bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                JD
                            </div>
                            <div class="w-10 h-10 rounded-full border border-white/20 bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                AS
                            </div>
                            <div class="w-10 h-10 rounded-full border border-white/20 bg-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                                MK
                            </div>
                        </div>
                        <p class="text-white font-semibold">{waitlistCount}+ people on the waitlist</p>
                    </div>
                </div>
            </div>
            <div class="pt-8 flex justify-center space-x-6">
                <!-- Social Icons -->
                <a
                        href="https://x.com"
                        aria-label="X (formerly Twitter)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="w-6 h-6">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <a
                        href="https://instagram.com"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="w-6 h-6">
                        <path d="M20.947 8.305a6.53 6.53 0 00-.419-2.216 4.61 4.61 0 00-2.633-2.633 6.606 6.606 0 00-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 00-2.185.42 4.607 4.607 0 00-2.633 2.633 6.554 6.554 0 00-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 002.634 2.632 6.584 6.584 0 002.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 002.186-.419 4.615 4.615 0 002.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 010 9.246zm4.807-8.339a1.077 1.077 0 01-1.078-1.078 1.077 1.077 0 112.155 0c0 .596-.482 1.078-1.077 1.078z" />
                        <circle cx="11.994" cy="11.979" r="3.003" />
                    </svg>
                </a>
                <a
                        href="https://discord.com"
                        aria-label="Discord"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="w-6 h-6">
                        <path d="M14.82 4.26a10.14 10.14 0 00-.53 1.1 14.66 14.66 0 00-4.58 0 10.14 10.14 0 00-.53-1.1 16 16 0 00-4.13 1.3 17.33 17.33 0 00-3 11.59 16.6 16.6 0 005.07 2.59A12.89 12.89 0 008.23 18a9.65 9.65 0 01-1.71-.83 3.39 3.39 0 00.42-.33 11.66 11.66 0 0010.12 0q.21.18.42.33a10.84 10.84 0 01-1.71.84 12.41 12.41 0 001.08 1.78 16.44 16.44 0 005.06-2.59 17.22 17.22 0 00-3-11.59 16.09 16.09 0 00-4.09-1.35zM8.68 14.81a1.94 1.94 0 01-1.8-2 1.93 1.93 0 011.8-2 1.93 1.93 0 011.8 2 1.93 1.93 0 01-1.8 2zm6.64 0a1.94 1.94 0 01-1.8-2 1.93 1.93 0 011.8-2 1.92 1.92 0 011.8 2 1.92 1.92 0 01-1.8 2z" />
                    </svg>
                </a>
                <a
                        href="https://facebook.com"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="w-6 h-6">
                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                    </svg>
                </a>
                <a
                        href="https://linkedin.com"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="w-6 h-6">
                        <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 110-3.096 1.548 1.548 0 010 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
                    </svg>
                </a>
            </div>
        </div>
    </div>

    <!-- Toast notification -->
    {#if toastVisible}
        <div class="fixed top-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-5">
            <div class={`rounded-xl p-4 shadow-lg ${toastVariant === 'destructive' ? 'bg-red-900 text-white' : 'bg-zinc-900 text-white'} border ${toastVariant === 'destructive' ? 'border-red-800' : 'border-zinc-800'}`}>
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-sm">{toastTitle}</h3>
                        <p class="text-sm opacity-90 mt-1">{toastDescription}</p>
                    </div>
                    <button
                            onclick={() => toastVisible = false}
                            class="text-gray-400 hover:text-white ml-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    {/if}
</main>

<style>
    /* Background pattern */
    .bg-pattern {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
                linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
        z-index: 1;
    }

    .content {
        position: relative;
        z-index: 2;
    }

    /* Animation for toast */
    .animate-in {
        animation: fadeIn 0.3s ease-out;
    }

    .fade-in {
        opacity: 0;
        animation-fill-mode: forwards;
    }

    .slide-in-from-top-5 {
        transform: translateY(-20px);
        animation-fill-mode: forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>

