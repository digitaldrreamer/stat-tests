<script>
    import {Separator} from '$lib/components/ui/separator';
    import { categories } from '$lib/stores/constants.js'
</script>

<footer class="bg-neutral-800 dark:bg-neutral-900 text-white py-10">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <a href="/" class="flex items-center space-x-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-200">
                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                    </svg>
                    <span class="text-xl font-bold">Haha.ng</span>
                </a>
                <p class="text-neutral-400 mb-4">Your one-stop destination for all fashion needs.</p>
                <div class="flex space-x-4">
                    <a href="#" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                    </a>
                    <a href="#" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                    </a>
                    <a href="#" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Shop</h3>
                <ul class="space-y-2">
                    {#each $categories.slice(0, 5) as category}
                        <li>
                            <a href={category.url} class="text-neutral-400 hover:text-white">
                                {category.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Help</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-neutral-400 hover:text-white">FAQs</a></li>
                    <li><a href="#" class="text-neutral-400 hover:text-white">Shipping</a></li>
                    <li><a href="#" class="text-neutral-400 hover:text-white">Returns</a></li>
                    <li><a href="#" class="text-neutral-400 hover:text-white">Order Status</a></li>
                    <li><a href="#" class="text-neutral-400 hover:text-white">Payment Options</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Contact</h3>
                <ul class="space-y-2">
                    <li class="flex items-start space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-neutral-400">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span class="text-neutral-400">123 Fashion Street, City, Country</span>
                    </li>
                    <li class="flex items-start space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-neutral-400">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <span class="text-neutral-400">+1 234 567 890</span>
                    </li>
                    <li class="flex items-start space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 text-neutral-400">
                            <rect width="20" height="16" x="2" y="4" rx="2"/>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        <span class="text-neutral-400">support@haha.ng</span>
                    </li>
                </ul>
            </div>
        </div>

        <Separator class="my-8 bg-neutral-700" />

        <div class="text-center text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Haha.ng. All rights reserved.</p>
        </div>
    </div>
</footer>