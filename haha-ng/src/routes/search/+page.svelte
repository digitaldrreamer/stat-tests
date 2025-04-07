<script>
    import { onMount } from 'svelte';
    import {SearchFilters, SearchBar, SearchResults} from '$lib/components/search/index.js';
    import * as Button from '$lib/components/ui/button';
    import { MediaQuery } from 'svelte/reactivity';
    import {page} from "$app/state";
    import {goto} from "$app/navigation";


    // State
    let searchQuery = $state(page.url.searchParams.get('q'));
    let isLoading = $state(false);
    let searchResults = $state([]);
    let isFiltersOpen = $state(false);
    let cartCount = $state(0);
    let appliedFilters = $state({
        categories: [],
        subcategories: [],
        types: [],
        priceRange: { min: 0, max: 1000 },
        sort: 'relevance'
    });

    $effect(() => {
        if (page.url.searchParams.get('q') && searchQuery !== page.url.searchParams.get('q')) {
            searchQuery = page.url.searchParams.get('q');
            handleSearch(searchQuery);
        }
    })

    // Check if mobile
    const isMobile = new MediaQuery('max-width: 768px').current

    // Handle search submission
    async function handleSearch(query) {
        searchQuery = query;
        if (!query.trim()) return;

        if (searchQuery && page.url.searchParams.get('q') !== searchQuery) {
            const params = new URLSearchParams(page.url.search);
            params.set('q', searchQuery)
            await goto(`?${params.toString()}`, { replaceState: true });
        }
        isLoading = true;
        try {
            // Construct URL with query and filters
            let url = `/api/v1/search?q=${encodeURIComponent(query)}`;

            // Add sort parameter if not default
            if (appliedFilters.sort && appliedFilters.sort !== 'relevance') {
                url += `&sort=${encodeURIComponent(appliedFilters.sort)}`;
            }

            // Add filters if any are applied
            if (appliedFilters.categories.length > 0) {
                url += `&filters=${encodeURIComponent(appliedFilters.categories.join(','))}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // The endpoint returns products directly as an array
            searchResults = data;
        } catch (err) {
            console.error('Error fetching search results:', err);
            searchResults = [];
        } finally {
            isLoading = false;
        }
    }

    // Handle filter changes
    function handleFilterChange(filters) {
        appliedFilters = filters;

        // Re-search with new filters if we have a query
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
        } else {
            // If no query, fetch all products with filters
            fetchAllProducts();
        }
    }

    // Fetch all products with current filters
    async function fetchAllProducts() {
        isLoading = true;
        try {
            // Construct URL with filters
            let url = `/api/v1/search?q=`;

            // Add sort parameter if not default
            if (appliedFilters.sort && appliedFilters.sort !== 'relevance') {
                url += `&sort=${encodeURIComponent(appliedFilters.sort)}`;
            }

            // Add filters if any are applied
            if (appliedFilters.categories.length > 0) {
                url += `&filters=${encodeURIComponent(appliedFilters.categories.join(','))}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            searchResults = data;
        } catch (err) {
            console.error('Error fetching all products:', err);
            searchResults = [];
        } finally {
            isLoading = false;
        }
    }

    // Toggle filters panel
    function toggleFilters() {
        isFiltersOpen = !isFiltersOpen;
    }

    // Handle adding product to cart
    function handleAddToCart(product) {
        // Increment cart count (this would be replaced with actual cart functionality)
        cartCount++;

        // You could show a toast notification here
        console.log(`Added ${product.title} to cart`);
    }

    // Get suggestions for autocomplete
    function getSuggestions(query) {
        const suggestions = [
            'T-Shirt', 'Jeans', 'Shoes', 'Wallet', 'Headphones',
            'Dress', 'Smartwatch', 'Backpack', 'Sunglasses', 'Jacket',
            'Yoga Mat', 'Lamp', 'Essentials', 'Denim Co', 'SportMax',
            'LeatherCraft', 'SoundWave', 'Fashion Forward', 'TechGear',
            'Perfume', 'Cologne', 'Skirt', 'Formal Shoes', 'Kids'
        ];

        if (!query.trim()) return [];

        return suggestions
            .filter(item => item.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }

    // Initialize with some results
    onMount(() => {
        if (searchQuery && searchQuery !== '') {
            handleSearch(searchQuery);
        } else {
        fetchAllProducts();
        }
    });
</script>

<svelte:head>
    <title>Search | Haha.ng</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Search Products</h1>

    <div class="flex flex-col md:flex-row gap-6">
        <!-- Mobile filter button -->
        <div class="md:hidden mb-4">
            <Button.Root onclick={toggleFilters} variant="outline" class="w-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                </svg>
                Filters
            </Button.Root>
        </div>

        <!-- Search bar -->
        <div class="w-full">
            <SearchBar
                    onSearch={handleSearch}
                    getSuggestions={getSuggestions}
            />

            <!-- Search results -->
            <div class="mt-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                    </h2>

                    <!-- Desktop filter button -->
                    <div class="hidden md:block">
                        <Button.Root onclick={toggleFilters} variant="outline" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round" class="mr-2">
                                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                            </svg>
                            Filters
                        </Button.Root>
                    </div>
                </div>

                <SearchResults
                        results={searchResults}
                        isLoading={isLoading}
                        onAddToCart={handleAddToCart}
                />
            </div>
        </div>
    </div>

    <!-- Filters panel -->
    <SearchFilters
            isOpen={isFiltersOpen}
            onClose={() => isFiltersOpen = false}
            filters={appliedFilters}
            onFilterChange={handleFilterChange}
            isMobile={isMobile}
    />
</div>