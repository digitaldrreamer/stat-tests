<script>
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Footer, Header} from "$lib/components/navigation/index.js";
    import {cart} from "$lib/stores/cart.js";
    import {categories} from "$lib/stores/constants.js";
    import {Toaster} from "$lib/components/ui/sonner/index.js";
    import {onMount} from "svelte";
	import { toast } from "svelte-sonner";
    import { loading } from '$lib/stores/loading.js';

    let {children, data} = $props()

    const cartCount = $derived($cart.length);

    onMount(async () => {
        try {
            const response = await fetch('https://dummyjson.com/products/categories');
            const data = await response.json();
            console.log(data)

            // Transform categories into objects with slug, name, and url
            const formattedCategories = [
                {slug: 'all', name: 'All Products', url: 'https://dummyjson.com/products'},
                ...data.map(category => ({
                    slug: category.slug,
                    name: category.name,
                    url: `https://dummyjson.com/products/category/${category.slug}`
                }))
            ];

            $categories = formattedCategories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback categories
            $categories = [
                {slug: 'all', name: 'All Products', url: 'https://dummyjson.com/products'},
                {slug: 'smartphones', name: 'Smartphones', url: 'https://dummyjson.com/products/category/smartphones'},
                {slug: 'laptops', name: 'Laptops', url: 'https://dummyjson.com/products/category/laptops'},
                {slug: 'fragrances', name: 'Fragrances', url: 'https://dummyjson.com/products/category/fragrances'},
                {slug: 'skincare', name: 'Skincare', url: 'https://dummyjson.com/products/category/skincare'}
            ];
        }
    });

    let loader;

    if ($loading) {
        loader = toast.loading('Loading...', {
            duration: Number.POSITIVE_INFINITY
        })
    }
    if (!$loading && loader) {
        toast.dismiss(loader)
    }
</script>
<Toaster richColors />
<ModeWatcher/>
<div>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <Header
                isAuthenticated={!!data.user}
                user={data.user}
                cartCount={cartCount}
        />
        <main>
            {@render children?.()}
        </main>
        <Footer categories={$categories}/>
    </div>
</div>
