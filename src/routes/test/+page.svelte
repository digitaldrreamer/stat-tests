<script>
    import {PromotionalImage} from "$lib/components/showcase/index.js";

    // Featured promotions data
    const featuredPromotions = [
        {
            title: "Summer Collection",
            description: "Up to 40% off on selected summer styles",
            image: "https://images.unsplash.com/photo-1531265180709-e9b5fb594ca6?w=1000&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1bW1lciUyMGZhc2hpb24lMjBtYWxlfGVufDB8fDB8fHww",
            buttonText: "Shop Now",
            discount: "40% OFF",
            endDate: "2025-06-30",
            variant: 1,
            theme: "neutral"
        },
        {
            title: "New Arrivals",
            description: "Be the first to discover our latest fashion trends",
            image: "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
            buttonText: "Explore Now",
            variant: 4,
            theme: "light"
        },
        {
            title: "Exclusive Watches",
            description: "Luxury timepieces for every occasion",
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D",
            buttonText: "View Collection",
            variant: 4,
            theme: "dark"
        },
        {
            title: "Accessories",
            description: "Complete your look with our premium accessories",
            image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFzaGlvbiUyMHdhdGNoZXN8ZW58MHx8MHx8fDA%3D",
            buttonText: "Shop Accessories",
            variant: 4,
            theme: "accent"
        }
    ];

    // Category promotions
    const categoryPromotions = [
        {
            title: "Men's Collection",
            description: "Timeless styles for the modern man",
            image: "https://images.unsplash.com/photo-1535530705774-695729778c55?w=600&h=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hbGUlMjBmYXNoaW9ufGVufDB8fDB8fHww",
            buttonText: "Discover",
            variant: 7
        },
        {
            title: "Women's Collection",
            description: "Elegant designs for every occasion",
            image: "https://plus.unsplash.com/premium_photo-1680012590879-39a8ec7c7cea?w=600&h=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzbGltJTIwZmVtYWxlJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
            buttonText: "Explore",
            variant: 7,
            discount: "New Season"
        }
    ];
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Hero Promotion -->
    <section class="mb-12">
        <PromotionalImage {...featuredPromotions[0]} />
    </section>

    <!-- Featured Categories -->
    <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Featured Categories</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each categoryPromotions as promo}
                <PromotionalImage {...promo} />
            {/each}
        </div>
    </section>

    <!-- Featured Products Promotions -->
    <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Featured Collections</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each featuredPromotions.slice(1) as promo}
                <PromotionalImage {...promo} />
            {/each}
        </div>
    </section>

    <!-- Special Offer -->
    <section class="mb-12">
        <PromotionalImage
                variant={8}
                title="Limited Time Offer"
                description="Get an extra 15% off when you spend $100 or more. Use code EXTRA15 at checkout."
                image="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1000&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNob3BwaW5nfGVufDB8fDB8fHww"
                buttonText="Shop the Offer"
                discount="EXTRA 15% OFF"
                endDate="2025-04-30"
        />
    </section>
</div>