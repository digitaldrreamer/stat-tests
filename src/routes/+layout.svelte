<script>
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Footer, Header} from "$lib/components/navigation/index.js";
    import {cart} from "$lib/stores/cart.js";
    import {categories} from "$lib/stores/constants.js";
    import {Toaster} from "$lib/components/ui/sonner/index.js";

    let {children} = $props()

    const cartCount = $derived($cart.length);
</script>
<Toaster richColors />
<ModeWatcher/>
<div>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <Header
                cartCount={cartCount}
        />
        <main>
            {@render children?.()}
        </main>
        <Footer categories={$categories}/>
    </div>
</div>
