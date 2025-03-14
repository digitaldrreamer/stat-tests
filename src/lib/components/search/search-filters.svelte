<script>
    import { createEventDispatcher } from 'svelte';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Checkbox from '$lib/components/ui/checkbox';
    import * as RadioGroup from '$lib/components/ui/radio-group';
    import * as Slider from '$lib/components/ui/slider';
    import * as Button from '$lib/components/ui/button';
    import * as Accordion from '$lib/components/ui/accordion';
    import * as Select from '$lib/components/ui/select';

    let {
        isOpen = false,
        onClose,
        filters = {
            categories: [],
            subcategories: [],
            types: [],
            priceRange: { min: 0, max: 1000 },
            sort: 'relevance'
        },
        onFilterChange,
        isMobile = false
    } = $props();

    const dispatch = createEventDispatcher();

    // Local copy of filters for editing
    let localFilters = $state(JSON.parse(JSON.stringify(filters)));

    // Available filter options - hierarchical categories
    const categoryStructure = [
        {
            id: 'clothing',
            label: 'Clothing',
            subcategories: [
                { id: 'mens', label: "Men's" },
                { id: 'womens', label: "Women's" },
                { id: 'kids', label: "Kids'" },
                { id: 'unisex', label: "Unisex" }
            ],
            types: [
                { id: 'tshirts', label: "T-shirts" },
                { id: 'shirts', label: "Shirts" },
                { id: 'pants', label: "Pants" },
                { id: 'jeans', label: "Jeans" },
                { id: 'dresses', label: "Dresses" },
                { id: 'skirts', label: "Skirts" },
                { id: 'jackets', label: "Jackets" },
                { id: 'sweaters', label: "Sweaters" },
                { id: 'activewear', label: "Activewear" },
                { id: 'underwear', label: "Underwear" },
                { id: 'sleepwear', label: "Sleepwear" },
                { id: 'swimwear', label: "Swimwear" }
            ]
        },
        {
            id: 'footwear',
            label: 'Footwear',
            subcategories: [
                { id: 'mens', label: "Men's" },
                { id: 'womens', label: "Women's" },
                { id: 'kids', label: "Kids'" }
            ],
            types: [
                { id: 'casual', label: "Casual Shoes" },
                { id: 'formal', label: "Formal Shoes" },
                { id: 'sports', label: "Sports Shoes" },
                { id: 'sandals', label: "Sandals" },
                { id: 'boots', label: "Boots" },
                { id: 'slippers', label: "Slippers" },
                { id: 'heels', label: "Heels" }
            ]
        },
        {
            id: 'accessories',
            label: 'Accessories',
            subcategories: [],
            types: [
                { id: 'watches', label: "Watches" },
                { id: 'jewelry', label: "Jewelry" },
                { id: 'bags', label: "Bags" },
                { id: 'belts', label: "Belts" },
                { id: 'sunglasses', label: "Sunglasses" },
                { id: 'hats', label: "Hats/Caps" }
            ]
        },
        {
            id: 'fragrances',
            label: 'Fragrances',
            subcategories: [],
            types: [
                { id: 'perfumes', label: "Perfumes" },
                { id: 'colognes', label: "Colognes" },
                { id: 'bodymists', label: "Body Mists" },
                { id: 'giftsets', label: "Gift Sets" }
            ]
        }
    ];

    // Flattened categories for easier access
    const categories = categoryStructure.map(cat => ({ id: cat.id, label: cat.label }));

    // Get all subcategories for a given category
    function getSubcategories(categoryId) {
        const category = categoryStructure.find(cat => cat.id === categoryId);
        return category ? category.subcategories : [];
    }

    // Get all types for a given category
    function getTypes(categoryId) {
        const category = categoryStructure.find(cat => cat.id === categoryId);
        return category ? category.types : [];
    }

    // Get visible subcategories based on selected categories
    $effect(() => {
        visibleSubcategories = localFilters.categories.length > 0
            ? localFilters.categories.flatMap(catId => getSubcategories(catId))
            : [];
    });

    // Get visible types based on selected categories
    $effect(() => {
        visibleTypes = localFilters.categories.length > 0
            ? localFilters.categories.flatMap(catId => getTypes(catId))
            : [];
    });

    let visibleSubcategories = $state([]);
    let visibleTypes = $state([]);

    const colors = [
        { id: 'black', label: 'Black', class: 'bg-black' },
        { id: 'white', label: 'White', class: 'bg-white border border-neutral-300' },
        { id: 'red', label: 'Red', class: 'bg-red-500' },
        { id: 'blue', label: 'Blue', class: 'bg-blue-500' },
        { id: 'green', label: 'Green', class: 'bg-green-500' },
        { id: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
        { id: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { id: 'pink', label: 'Pink', class: 'bg-pink-500' },
        { id: 'brown', label: 'Brown', class: 'bg-amber-800' },
        { id: 'gray', label: 'Gray', class: 'bg-neutral-500' },
        { id: 'navy', label: 'Navy', class: 'bg-indigo-900' },
        { id: 'silver', label: 'Silver', class: 'bg-neutral-300' }
    ];

    const sizes = [
        { id: 'XS', label: 'XS' },
        { id: 'S', label: 'S' },
        { id: 'M', label: 'M' },
        { id: 'L', label: 'L' },
        { id: 'XL', label: 'XL' },
        { id: 'XXL', label: 'XXL' },
        { id: '32', label: '32' },
        { id: '34', label: '34' },
        { id: '36', label: '36' },
        { id: '38', label: '38' },
        { id: '40', label: '40' },
        { id: '42', label: '42' },
        { id: 'One Size', label: 'One Size' }
    ];

    const brands = [
        {id: 'Essentials', label: 'Essentials'},
        {id: 'Denim Co', label: 'Denim Co'},
        {id: 'SportMax', label: 'SportMax'},
        {id: 'LeatherCraft', label: 'LeatherCraft'},
        {id: 'SoundWave', label: 'SoundWave'},
        {id: 'Fashion Forward', label: 'Fashion Forward'},
        {id: 'TechGear', label: 'TechGear'},
        {id: 'TravelPro', label: 'TravelPro'},
        {id: 'SunStyle', label: 'SunStyle'},
        {id: 'OutdoorLife', label: 'OutdoorLife'},
        {id: 'ZenFit', label: 'ZenFit'},
        {id: 'HomeEssentials', label: 'HomeEssentials'}
    ];

    const sortOptions = [
        {value: 'relevance', label: 'Relevance'},
        {value: 'price-low-high', label: 'Price: Low to High'},
        {value: 'price-high-low', label: 'Price: High to Low'},
        {value: 'best-selling', label: 'Best Selling'},
        {value: 'newest', label: 'Newest First'}
    ];

    // Handle checkbox changes
    function toggleCategory(categoryId) {
        if (localFilters.categories.includes(categoryId)) {
            // Remove the category
            localFilters.categories = localFilters.categories.filter(id => id !== categoryId);

            // Also remove any subcategories and types that belong to this category
            const subcatsToRemove = getSubcategories(categoryId).map(sub => sub.id);
            const typesToRemove = getTypes(categoryId).map(type => type.id);

            localFilters.subcategories = localFilters.subcategories.filter(id => !subcatsToRemove.includes(id));
            localFilters.types = localFilters.types.filter(id => !typesToRemove.includes(id));
        } else {
            localFilters.categories = [...localFilters.categories, categoryId];
        }
    }

    function toggleSubcategory(subcategoryId) {
        if (localFilters.subcategories.includes(subcategoryId)) {
            localFilters.subcategories = localFilters.subcategories.filter(id => id !== subcategoryId);
        } else {
            localFilters.subcategories = [...localFilters.subcategories, subcategoryId];
        }
    }

    function toggleType(typeId) {
        if (localFilters.types.includes(typeId)) {
            localFilters.types = localFilters.types.filter(id => id !== typeId);
        } else {
            localFilters.types = [...localFilters.types, typeId];
        }
    }

    function handlePriceChange(event) {
        localFilters.priceRange.min = event.detail[0];
        localFilters.priceRange.max = event.detail[1];
    }

    // Handle sort changes
    function handleSortChange(value) {
        localFilters.sort = value;
    }

    // Apply filters
    function applyFilters() {
        onFilterChange(localFilters);
        onClose();
    }

    // Reset filters
    function resetFilters() {
        localFilters = {
            categories: [],
            subcategories: [],
            types: [],
            priceRange: {min: 0, max: 1000},
            sort: 'relevance'
        };
    }

    // Update local filters when props change
    $effect(() => {
        localFilters = JSON.parse(JSON.stringify(filters));
    });
</script>

<Sheet.Root open={isOpen} onOpenChange={onClose}>
    <Sheet.Content side={isMobile ? "bottom" : "right"} class={isMobile ? "h-[85vh]" : "w-[400px]"}>
        <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Refine your search results</Sheet.Description>
        </Sheet.Header>

        <div class="py-4 overflow-y-auto h-full pb-20">
            <Accordion.Root type="multiple" class="w-full">
                <!-- Categories -->
                <Accordion.Item value="categories">
                    <Accordion.Trigger>Categories</Accordion.Trigger>
                    <Accordion.Content class="sm:px-6 px-2">
                        <div class="space-y-4 pt-2">
                            <!-- All Categories -->
                            <div class="space-y-2">
                                {#each categories as category}
                                    <div class="flex items-center space-x-2">
                                        <Checkbox.Root
                                                id={`category-${category.id}`}
                                                checked={localFilters.categories.includes(category.id)}
                                                onCheckedChange={() => toggleCategory(category.id)}
                                        />
                                        <label
                                                for={`category-${category.id}`}
                                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {category.label}
                                        </label>
                                    </div>
                                {/each}
                            </div>

                            <!-- Subcategories (if any categories are selected) -->
                            {#if visibleSubcategories.length > 0}
                                <div class="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                                    <h4 class="text-sm font-medium mb-2">Subcategories</h4>
                                    <div class="space-y-2 pl-2">
                                        {#each visibleSubcategories as subcategory}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox.Root
                                                        id={`subcategory-${subcategory.id}`}
                                                        checked={localFilters.subcategories.includes(subcategory.id)}
                                                        onCheckedChange={() => toggleSubcategory(subcategory.id)}
                                                />
                                                <label
                                                        for={`subcategory-${subcategory.id}`}
                                                        class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {subcategory.label}
                                                </label>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}

                            <!-- Types (if any categories are selected) -->
                            {#if visibleTypes.length > 0}
                                <div class="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                                    <h4 class="text-sm font-medium mb-2">Types</h4>
                                    <div class="space-y-2 pl-2">
                                        {#each visibleTypes as type}
                                            <div class="flex items-center space-x-2">
                                                <Checkbox.Root
                                                        id={`type-${type.id}`}
                                                        checked={localFilters.types.includes(type.id)}
                                                        onCheckedChange={() => toggleType(type.id)}
                                                />
                                                <label
                                                        for={`type-${type.id}`}
                                                        class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {type.label}
                                                </label>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>

                <!-- Price Range -->
                <Accordion.Item value="price">
                    <Accordion.Trigger>Price Range</Accordion.Trigger>
                    <Accordion.Content class="sm:px-6 px-2">
                        <div class="space-y-4 pt-2">
                            <Slider.Root
                                    min={0}
                                    max={1000}
                                    step={10}
                                    value={[localFilters.priceRange.min, localFilters.priceRange.max]}
                                    onValueChange={handlePriceChange}
                                    class="my-6"
                            />
                            <div class="flex items-center justify-between">
                                <div class="text-sm">
                                    ₦{localFilters.priceRange.min}
                                </div>
                                <div class="text-sm">
                                    ₦{localFilters.priceRange.max}
                                </div>
                            </div>

                            <!-- Min/Max inputs -->
                            <div class="flex items-center space-x-2 mt-4">
                                <div class="w-1/2">
                                    <label for="min-price" class="text-xs mb-1 block">Min Price</label>
                                    <input
                                            type="number"
                                            id="min-price"
                                            min="0"
                                            max={localFilters.priceRange.max}
                                            bind:value={localFilters.priceRange.min}
                                            class="w-full p-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md"
                                    />
                                </div>
                                <div class="w-1/2">
                                    <label for="max-price" class="text-xs mb-1 block">Max Price</label>
                                    <input
                                            type="number"
                                            id="max-price"
                                            min={localFilters.priceRange.min}
                                            max="1000"
                                            bind:value={localFilters.priceRange.max}
                                            class="w-full p-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion.Item>

                <!-- Sort By -->
                <Accordion.Item value="sort">
                    <Accordion.Trigger>Sort By</Accordion.Trigger>
                    <Accordion.Content class="sm:px-6 px-2">
                        <RadioGroup.Root
                                value={localFilters.sort}
                                onValueChange={handleSortChange}
                                class="space-y-2 pt-2"
                        >
                            {#each sortOptions as option}
                                <div class="flex items-center space-x-2">
                                    <RadioGroup.Item value={option.value} id={`sort-${option.value}`}/>
                                    <label
                                            for={`sort-${option.value}`}
                                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            {/each}
                        </RadioGroup.Root>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
            <Button.Root variant="outline" onclick={resetFilters}>
                Reset
            </Button.Root>
            <Button.Root onclick={applyFilters}>
                Apply Filters
            </Button.Root>
        </div>
    </Sheet.Content>
</Sheet.Root>