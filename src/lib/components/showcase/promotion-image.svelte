<script>

    let {
        image = "/placeholder.svg?height=400&width=800",
        title = "Special Promotion",
        description = "Discover our amazing deals and offers",
        buttonText = "Shop Now",
        buttonLink = "#",
        variant = 1,
        theme = "neutral",
        discount = "",
        endDate = "",
        backgroundColor = "",
        textColor = "",
        height = "",
        width = "",
        secondaryImage = "/placeholder.svg?height=200&width=300"
    } = $props()

    // Computed styles based on theme
    const themeStyles = $state({
        neutral: {
            bg: "bg-neutral-100 dark:bg-neutral-800",
            text: "text-neutral-900 dark:text-neutral-100",
            button: "bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:bg-neutral-300",
            border: "border-neutral-300 dark:border-neutral-700"
        },
        dark: {
            bg: "bg-neutral-800 dark:bg-neutral-900",
            text: "text-white dark:text-neutral-100",
            button: "bg-neutral-600 text-white hover:bg-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-400",
            border: "border-neutral-700 dark:border-neutral-800"
        },
        light: {
            bg: "bg-neutral-50 dark:bg-neutral-700",
            text: "text-neutral-800 dark:text-neutral-100",
            button: "bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:bg-neutral-300",
            border: "border-neutral-200 dark:border-neutral-600"
        },
        accent: {
            bg: "bg-neutral-200 dark:bg-neutral-700",
            text: "text-neutral-900 dark:text-neutral-100",
            button: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
            border: "border-neutral-300 dark:border-neutral-600"
        }
    });

    // Format date if provided
    const formattedDate = $state(endDate ? new Date(endDate).toLocaleDateString() : "");

    // Custom background and text styles
    const customBgStyle = $state(backgroundColor ? `background-color: ${backgroundColor};` : "");
    const customTextStyle = $state(textColor ? `color: ${textColor};` : "");

    // Custom dimension styles
    const customHeightStyle = $state(height ? `height: ${height};` : "");
    const customWidthStyle = $state(width ? `width: ${width};` : "");
    const customSizeStyle = $state(`${customHeightStyle} ${customWidthStyle}`);

    // Determine if the date is expired
    const isExpired = $state(endDate ? new Date() > new Date(endDate) : false);
</script>

<!-- Container with custom dimensions if provided -->
<div class="promo-container" style={customSizeStyle}>
    <!-- Variation 1: Full-width banner with text overlay -->
    {#if variant === 1}
        <div class="relative overflow-hidden rounded-lg shadow-md {themeStyles[theme].bg} transition-all duration-300 hover:shadow-lg h-full" style={customBgStyle}>
            <div class="absolute inset-0">
                <img src={image} alt={title} class="w-full h-full object-cover opacity-80 dark:opacity-60" loading="lazy" />
            </div>
            <div class="relative z-10 p-8 md:p-12 flex flex-col items-center text-center h-full justify-center">
                {#if discount && !isExpired}
                    <div class="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-3xl md:text-4xl font-bold mb-4 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                <p class="text-lg mb-6 max-w-lg {themeStyles[theme].text}" style={customTextStyle}>{description}</p>
                <a href={buttonLink} class="px-6 py-3 rounded-full font-medium transition-colors {themeStyles[theme].button}">
                    {buttonText}
                </a>
                {#if formattedDate && !isExpired}
                    <p class="mt-4 text-sm opacity-80 {themeStyles[theme].text}">Offer ends: {formattedDate}</p>
                {:else if isExpired}
                    <p class="mt-4 text-sm opacity-80 text-red-500">This offer has expired</p>
                {/if}
            </div>
        </div>

        <!-- Variation 2: Split layout (image left, text right) -->
    {:else if variant === 2}
        <div class="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border transition-all duration-300 hover:shadow-lg h-full">
            <div class="md:w-1/2 h-full">
                <img src={image} alt={title} class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="md:w-1/2 p-8 flex flex-col justify-center {themeStyles[theme].bg} h-full" style={customBgStyle}>
                {#if discount && !isExpired}
                    <div class="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-4 self-start">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-2xl md:text-3xl font-bold mb-4 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                <p class="mb-6 {themeStyles[theme].text}" style={customTextStyle}>{description}</p>
                <a href={buttonLink} class="px-6 py-3 rounded-full font-medium transition-colors self-start {themeStyles[theme].button}">
                    {buttonText}
                </a>
                {#if formattedDate && !isExpired}
                    <p class="mt-4 text-sm opacity-80 {themeStyles[theme].text}">Offer ends: {formattedDate}</p>
                {:else if isExpired}
                    <p class="mt-4 text-sm opacity-80 text-red-500">This offer has expired</p>
                {/if}
            </div>
        </div>

        <!-- Variation 3: Split layout (text left, image right) -->
    {:else if variant === 3}
        <div class="flex flex-col md:flex-row-reverse rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border transition-all duration-300 hover:shadow-lg h-full">
            <div class="md:w-1/2 h-full">
                <img src={image} alt={title} class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="md:w-1/2 p-8 flex flex-col justify-center {themeStyles[theme].bg} h-full" style={customBgStyle}>
                {#if discount && !isExpired}
                    <div class="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-4 self-start">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-2xl md:text-3xl font-bold mb-4 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                <p class="mb-6 {themeStyles[theme].text}" style={customTextStyle}>{description}</p>
                <a href={buttonLink} class="px-6 py-3 rounded-full font-medium transition-colors self-start {themeStyles[theme].button}">
                    {buttonText}
                </a>
                {#if formattedDate && !isExpired}
                    <p class="mt-4 text-sm opacity-80 {themeStyles[theme].text}">Offer ends: {formattedDate}</p>
                {:else if isExpired}
                    <p class="mt-4 text-sm opacity-80 text-red-500">This offer has expired</p>
                {/if}
            </div>
        </div>

        <!-- Variation 4: Card with image on top, text below -->
    {:else if variant === 4}
        <div class="rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
            <div class="relative flex-shrink-0">
                <img src={image} alt={title} class="w-full h-64 object-cover" loading="lazy" />
                {#if discount && !isExpired}
                    <div class="absolute top-4 right-4 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-3 py-1 rounded-full text-sm font-bold">
                        {discount}
                    </div>
                {/if}
            </div>
            <div class="p-6 {themeStyles[theme].bg} flex-grow flex flex-col" style={customBgStyle}>
                <h2 class="text-xl font-bold mb-3 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                <p class="mb-4 {themeStyles[theme].text} flex-grow" style={customTextStyle}>{description}</p>
                <div class="flex justify-between items-center">
                    <a href={buttonLink} class="px-5 py-2 rounded-full text-sm font-medium transition-colors {themeStyles[theme].button}">
                        {buttonText}
                    </a>
                    {#if formattedDate && !isExpired}
                        <p class="text-sm opacity-80 {themeStyles[theme].text}">Until: {formattedDate}</p>
                    {:else if isExpired}
                        <p class="text-sm opacity-80 text-red-500">Expired</p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Variation 5: Circular image with surrounding text -->
    {:else if variant === 5}
        <div class="p-6 rounded-lg {themeStyles[theme].bg} {themeStyles[theme].border} border shadow-md transition-all duration-300 hover:shadow-lg text-center h-full flex items-center" style={customBgStyle}>
            <div class="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                <div class="w-40 h-40 rounded-full overflow-hidden border-4 {themeStyles[theme].border} flex-shrink-0">
                    <img src={image} alt={title} class="w-full h-full object-cover" loading="lazy" />
                </div>
                <div class="flex-1 max-w-md">
                    {#if discount && !isExpired}
                        <div class="inline-block bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-3">
                            {discount}
                        </div>
                    {/if}
                    <h2 class="text-2xl font-bold mb-3 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                    <p class="mb-4 {themeStyles[theme].text}" style={customTextStyle}>{description}</p>
                    <a href={buttonLink} class="inline-block px-5 py-2 rounded-full text-sm font-medium transition-colors {themeStyles[theme].button}">
                        {buttonText}
                    </a>
                    {#if formattedDate && !isExpired}
                        <p class="mt-3 text-sm opacity-80 {themeStyles[theme].text}">Offer ends: {formattedDate}</p>
                    {:else if isExpired}
                        <p class="mt-3 text-sm opacity-80 text-red-500">This offer has expired</p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Variation 6: Diagonal split with image and text -->
    {:else if variant === 6}
        <div class="relative rounded-lg overflow-hidden shadow-md h-80 transition-all duration-300 hover:shadow-lg">
            <div class="absolute inset-0 clip-diagonal">
                <img src={image} alt={title} class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="absolute inset-0 clip-diagonal-inverse {themeStyles[theme].bg}" style={customBgStyle}></div>
            <div class="relative z-10 h-full p-6 flex flex-col justify-center items-start max-w-md ml-auto">
                {#if discount && !isExpired}
                    <div class="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-3">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-2xl font-bold mb-3 {themeStyles[theme].text}" style={customTextStyle}>{title}</h2>
                <p class="mb-4 {themeStyles[theme].text}" style={customTextStyle}>{description}</p>
                <a href={buttonLink} class="px-5 py-2 rounded-full text-sm font-medium transition-colors {themeStyles[theme].button}">
                    {buttonText}
                </a>
                {#if formattedDate && !isExpired}
                    <p class="mt-2 text-sm opacity-80 {themeStyles[theme].text}">Until: {formattedDate}</p>
                {:else if isExpired}
                    <p class="mt-2 text-sm opacity-80 text-red-500">Expired</p>
                {/if}
            </div>
        </div>

    {:else if variant === 7}
        <div class="relative rounded-lg overflow-hidden shadow-sm {themeStyles[theme].border} border transition-all duration-300 hover:shadow-md group">
            <img src={image || "/placeholder.svg"} alt={title} class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex flex-col justify-end p-6">
                {#if discount}
                    <div class="bg-white text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-2 self-start opacity-90">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-xl font-bold mb-1 text-white">{title}</h2>
                <p class="text-sm text-neutral-200 mb-3 max-w-xs">{description}</p>
                <div class="overflow-hidden h-8">
                    <a href={buttonLink} class="inline-block text-sm font-medium text-white underline decoration-2 underline-offset-4 transform translate-y-8 transition-transform duration-300 group-hover:translate-y-0">
                        {buttonText} →
                    </a>
                </div>
                {#if formattedDate}
                    <p class="mt-2 text-xs text-neutral-300">Ends {formattedDate}</p>
                {/if}
            </div>
        </div>

        <!-- Variation 8: Full-bleed background image with centered text -->
    {:else if variant === 8}
        <div class="relative rounded-lg overflow-hidden shadow-md h-96 transition-all duration-300 hover:shadow-lg group">
            <div class="absolute inset-0">
                <img src={image || "/placeholder.svg"} alt={title} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-neutral-900/50 group-hover:bg-neutral-900/60 transition-colors duration-300"></div>
            </div>
            <div class="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                {#if discount}
                    <div class="bg-white text-neutral-800 px-4 py-1 rounded-full text-sm font-bold mb-4 transform -translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {discount}
                    </div>
                {/if}
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">{title}</h2>
                <p class="text-lg mb-6 max-w-md text-neutral-100">{description}</p>
                <a href={buttonLink} class="px-8 py-3 bg-white text-neutral-900 hover:bg-neutral-200 rounded-full font-medium transition-colors transform scale-95 group-hover:scale-100 duration-300">
                    {buttonText}
                </a>
                {#if formattedDate}
                    <p class="mt-4 text-sm text-neutral-200">Available until {formattedDate}</p>
                {/if}
            </div>
        </div>

        <!-- Variation 9: Grid layout with multiple small promotions -->
    {:else if variant === 9}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg overflow-hidden">
            <div class="col-span-2 relative rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border">
                <img src={image || "/placeholder.svg"} alt={title} class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex flex-col justify-end p-6">
                    {#if discount}
                        <div class="bg-white text-neutral-800 px-3 py-1 rounded-full text-sm font-bold mb-2 self-start">
                            {discount}
                        </div>
                    {/if}
                    <h2 class="text-2xl font-bold mb-2 text-white">{title}</h2>
                    <a href={buttonLink} class="text-sm font-medium text-white underline decoration-2 underline-offset-4">
                        {buttonText} →
                    </a>
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <div class="flex-1 relative rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border {themeStyles[theme].bg}" style={customBgStyle}>
                    <div class="p-4">
                        <h3 class="text-lg font-bold mb-1 {themeStyles[theme].text}" style={customTextStyle}>Related Offer</h3>
                        <p class="text-sm mb-2 {themeStyles[theme].text}" style={customTextStyle}>Check out our other deals</p>
                        <a href={buttonLink} class="text-xs font-medium underline {themeStyles[theme].text}">
                            View More →
                        </a>
                    </div>
                </div>
                <div class="flex-1 relative rounded-lg overflow-hidden shadow-md {themeStyles[theme].border} border">
                    <img src="/placeholder.svg?height=200&width=300" alt="Secondary promotion" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex flex-col justify-end p-4">
                        <h3 class="text-lg font-bold mb-1 text-white">More Savings</h3>
                        <a href={buttonLink} class="text-xs font-medium text-white underline">
                            Explore →
                        </a>
                    </div>
                </div>
            </div>
            {#if formattedDate}
                <div class="col-span-1 md:col-span-3 text-center text-sm {themeStyles[theme].text} bg-neutral-100 dark:bg-neutral-800 py-2 rounded-b-lg">
                    Limited time offer - Ends {formattedDate}
                </div>
            {/if}
        </div>

        <!-- Variation 10: Interactive hover effect promotion -->
    {:else if variant === 10}
        <div class="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group">
            <div class="absolute inset-0 bg-neutral-900 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
            <img src={image || "/placeholder.svg"} alt={title} class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />

            <!-- Static content (visible by default) -->
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-900/90 to-transparent z-20">
                <h2 class="text-2xl font-bold text-white mb-1">{title}</h2>
                {#if discount}
                    <div class="inline-block bg-white text-neutral-800 px-3 py-1 rounded-full text-sm font-bold">
                        {discount}
                    </div>
                {/if}
            </div>

            <!-- Hover content (appears on hover) -->
            <div class="absolute inset-0 z-30 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <h2 class="text-2xl font-bold text-white mb-3">{title}</h2>
                <p class="text-neutral-200 mb-5 text-center max-w-md">{description}</p>
                <a href={buttonLink} class="px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-200 rounded-full font-medium transition-colors">
                    {buttonText}
                </a>
                {#if formattedDate}
                    <p class="mt-4 text-sm text-neutral-300">Offer valid until {formattedDate}</p>
                {/if}
            </div>
        </div>
        {/if}
</div>
<!-- </div> -->

<style>
    .clip-diagonal {
        clip-path: polygon(0 0, 0% 100%, 100% 0);
    }

    .clip-diagonal-inverse {
        clip-path: polygon(100% 100%, 0% 100%, 100% 0);
    }
</style>