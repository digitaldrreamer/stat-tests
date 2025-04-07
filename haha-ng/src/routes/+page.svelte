<script>
    import {onMount} from 'svelte';
    import {MediaQuery} from "svelte/reactivity";
    import {Footer, Header} from "$lib/components/navigation/index.js";
    import {Benefits, HeroCarousel, PromotionalBanner} from "$lib/components/showcase/index.js";
    import {CategoryFilter, ProductGrid} from "$lib/components/product/index.js";
    import {Newsletter, Toast} from "$lib/components/misc/index.js";
    import {addItemToCart, cart} from "$lib/stores/cart.js";
    import { categories } from '$lib/stores/constants.js'
    import {derived} from "svelte/store";

    // Import components

    // Stores
    let products = $state([]);
    let searchQuery = $state('');
    let selectedCategory = $state('all');
    let totalProducts = $state(0);
    let currentPage = $state(1);
    let productsPerPage = $state(8);
    let sortBy = $state('');
    let sortOrder = $state('asc');
    let isLoading = $state(true);
    const cartCount = $derived($cart.length);


    // Add these variables for pagination
    const isDesktop = new MediaQuery("(min-width: 768px)");
    const siblingCount = $derived(isDesktop.current ? 1 : 0);



    // Fetch products based on filters, pagination, and sorting
    async function fetchProducts() {
        isLoading = true;

        try {
            let url = 'https://dummyjson.com/products';

            // Apply category filter if not 'all'
            if (selectedCategory !== 'all') {
                url = `https://dummyjson.com/products/category/${selectedCategory}`;
            }

            // Apply pagination
            const limit = productsPerPage;
            const skip = (currentPage - 1) * productsPerPage;

            // Apply sorting if selected
            let queryParams = `limit=${limit}&skip=${skip}`;
            if (sortBy) {
                queryParams += `&sortBy=${sortBy}&order=${sortOrder}`;
            }

            // Add search query if present
            if (searchQuery) {
                url = `https://dummyjson.com/products/search?q=${searchQuery}&${queryParams}`;
            } else {
                url = `${url}?${queryParams}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            products = data.products;
            totalProducts = data.total;
        } catch (error) {
            console.error('Error fetching products:', error);
            products = [];
        } finally {
            isLoading = false;
        }
    }

    // Watch for changes in filters, pagination, and sorting
    $effect(() => {
        fetchProducts();
    });

    // Add to cart function
    function addToCart(product) {

        addItemToCart(product);
        // Show toast notification
        showToast(`Added ${product?.title} to cart`);
    }

    // Toast notification
    let toast = $state({visible: false, message: ''});

    function showToast(message) {
        toast = {visible: true, message};
        setTimeout(() => {
            toast = {visible: false, message: ''};
        }, 3000);
    }


    // Filter products by category
    function setCategory(categorySlug) {
        selectedCategory = categorySlug;
        currentPage = 1; // Reset to first page when changing category
    }

    // Handle page change
    function goToPage(page) {
        currentPage = page;
    }

    // Handle sort change
    function handleSortChange(value) {
        if (value === 'price-asc') {
            sortBy = 'price';  // Remove the space
            sortOrder = 'asc';
        } else if (value === 'price-desc') {
            sortBy = 'price';
            sortOrder = 'desc';
        } else if (value === 'title-asc') {
            sortBy = 'title';
            sortOrder = 'asc';
        } else if (value === 'title-desc') {
            sortBy = 'title';
            sortOrder = 'desc';
        } else {
            sortBy = '';
            sortOrder = 'asc';
        }
        currentPage = 1; // Reset to first page when changing sort
    }

    // Promotional banners data
    const promotions = [
        {
            id: 1,
            title: "Summer Collection",
            description: "Up to 50% off on all summer essentials",
            image: "https://images.unsplash.com/photo-1531265180709-e9b5fb594ca6?w=1200&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1bW1lciUyMGZhc2hpb24lMjBtYWxlfGVufDB8fDB8fHww",
            buttonText: "Shop Now",
            variant: 1,
            theme: "light",
            discount: "50% OFF"
        },
        {
            id: 2,
            title: "New Arrivals",
            description: "Check out our latest fashion trends",
            image: "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=1200&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
            buttonText: "Explore Collection",
            variant: 8,
            theme: "dark",
            endDate: "2025-06-30"
        },
        {
            id: 3,
            title: "Limited Offer",
            description: "Free shipping on orders over $50",
            image: "https://plus.unsplash.com/premium_photo-1680012590879-39a8ec7c7cea?w=1200&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzbGltJTIwZmVtYWxlJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
            buttonText: "Shop Now",
            variant: 2,
            theme: "accent",
            discount: "FREE SHIPPING"
        }
    ];

    // Calculate total pages
    const totalPages = $derived(Math.ceil(totalProducts / productsPerPage));

    $inspect('$products', products)
    $inspect('selectedCategory', selectedCategory)
    $inspect('categories', $categories)
    $inspect('sortBy', sortBy)
    $inspect('sortOrder', sortOrder)
    $inspect('cart', $cart)
    $inspect('cartCount', cartCount)
</script>


            <HeroCarousel {promotions}/>

            <CategoryFilter
                    categories={$categories}
                    bind:selectedCategory={selectedCategory}
                    onsetCategory={(e) => setCategory(e)}
            />

            <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    sortBy={sortBy}
                    productsPerPage={productsPerPage}
                    totalProducts={totalProducts}
                    currentPage={currentPage}
                    siblingCount={siblingCount}
                    onaddToCart={(e) => addToCart(e)}
                    onsortChange={(e) => handleSortChange(e)}
                    onpageChange={(e) => goToPage(e)}
                    onperPageChange={(e) => {
                    productsPerPage = parseInt(e);
                    currentPage = 1;
                }}
            />

            <PromotionalBanner
                    title="New Season Arrivals"
                    description="Discover the latest trends in fashion with our new collection."
                    buttonText="Explore Collection"
                    image="https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFzaGlvbiUyMHdhdGNoZXN8ZW58MHx8MHx8fDA%3D"
                    variant={3}
                    theme="accent"
                    discount="NEW COLLECTION"
            />

            <Benefits/>

            <Newsletter/>
