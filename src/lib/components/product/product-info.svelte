<script>
    import * as RadioGroup from '$lib/components/ui/radio-group';
    import * as Select from '$lib/components/ui/select';

    let { oncolorChange, onsizeChange, product, selectedColor, selectedSize, quantity = $bindable(1) } = $props()


    function handleColorChange(color) {
        oncolorChange(color);
    }

    function handleSizeChange(size) {
        onsizeChange(size);
    }
</script>

<div class="space-y-6">
    <!-- Price -->
    <div class="flex items-center gap-4">
        <span class="text-3xl font-bold text-gray-900">${product.price}</span>
        {#if product.originalPrice > product.price}
            <span class="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            <span class="text-green-600 font-medium">Save {product.discount}%</span>
        {/if}
    </div>

    <!-- Rating -->
    <div class="flex items-center gap-2">
        <div class="flex items-center">
            {#each Array(5) as _, i}
                <svg
                        class="w-5 h-5 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            {/each}
        </div>
        <span class="text-sm text-gray-600">
            {product.rating} ({product.reviewCount} reviews)
        </span>
    </div>

    <!-- Color Selection -->
    <div>
        <h3 class="text-sm font-medium text-gray-900 mb-4">Color</h3>
        <RadioGroup.Root
                value={selectedColor.id}
                onValueChange={(value) => handleColorChange(product.colors.find(c => c.id === value))}
        >
            <div class="flex gap-3">
                {#each product.colors as color}
                    <RadioGroup.Item
                            value={color.id}
                            class="w-8 h-8 rounded-full border-2 border-transparent"
                            style="background-color: {color.hex}"
                    >
                        <span class="sr-only">{color.name}</span>
                    </RadioGroup.Item>
                {/each}
            </div>
        </RadioGroup.Root>
    </div>

    <!-- Size Selection -->
    <div>
        <h3 class="text-sm font-medium text-gray-900 mb-4">Size</h3>
        <Select.Root value={selectedSize} onValueChange={handleSizeChange}>
            <Select.Trigger>
                {selectedSize ?? "Select size"}
            </Select.Trigger>
            <Select.Content>
                {#each product.sizes as size}
                    <Select.Item value={size}>{size}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>

    <!-- Quantity -->
    <div>
        <h3 class="text-sm font-medium text-gray-900 mb-4">Quantity</h3>
        <div class="flex items-center gap-2">
            <button
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onclick={() => quantity = Math.max(1, quantity - 1)}
            >
                -
            </button>
            <input
                    type="number"
                    bind:value={quantity}
                    min="1"
                    class="w-16 text-center border-gray-300 rounded-md"
            />
            <button
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onclick={() => quantity++}
            >
                +
            </button>
        </div>
    </div>
</div>