<script>
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Badge from '$lib/components/ui/badge';
    import * as Select from '$lib/components/ui/select';
    import * as Skeleton from '$lib/components/ui/skeleton';
    import * as Pagination from '$lib/components/ui/pagination';
    import { ProductCard } from "$lib/components/product/index.js";
    import { ProductFilters } from "$lib/components/misc/index.js";


    let { onperPageChange, onaddToCart, onpageChange, onsortChange, products = [], sortBy = null, isLoading = true,
        productsPerPage = 8, totalProducts = 0, currentPage = 1, siblingCount = 1 } = $props()

    function handleSortChange(value) {
        onsortChange(value);
    }

    function handlePerPageChange(value) {
        onperPageChange(value);
    }

    function handlePageChange(page) {
        onpageChange(page[0]);
    }

    function addToCart(product) {
        onaddToCart(product);
    }
</script>

<section class="py-10">
    <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold">Featured Products</h2>

            <ProductFilters
                    sortBy={sortBy}
                    {productsPerPage}
                    onsortChange={handleSortChange}
                    onperPageChange={handlePerPageChange}
            />
        </div>

        {#if isLoading}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {#each Array(8) as _}
                    <Card.Root>
                        <Skeleton.Skeleton class="h-64 w-full" />
                        <Card.Content class="p-4">
                            <Skeleton.Skeleton class="h-4 w-1/4 mb-2" />
                            <Skeleton.Skeleton class="h-6 w-3/4 mb-2" />
                            <Skeleton.Skeleton class="h-4 w-full mb-4" />
                            <div class="flex justify-between items-center">
                                <Skeleton.Skeleton class="h-6 w-1/4" />
                                <Skeleton.Skeleton class="h-10 w-1/3" />
                            </div>
                        </Card.Content>
                    </Card.Root>
                {/each}
            </div>
        {:else if products.length === 0}
            <div class="text-center py-10">
                <p class="text-lg text-neutral-500 dark:text-neutral-400">No products found. Try a different search or category.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {#each products as product (product.id)}
                    <ProductCard {product} onaddToCart={() => addToCart(product)} />
                {/each}
            </div>
        {/if}

        <!-- Pagination -->
        {#if totalProducts > 0}
            <div class="flex justify-center mt-8">
                <div class="w-full overflow-x-auto">
                    <div class="min-w-fit mx-auto">
                        <Pagination.Root count={totalProducts} perPage={productsPerPage} {siblingCount} onPageChange={handlePageChange}>
                            {#snippet children({ pages, currentPage })}
                                <Pagination.Content class="flex flex-wrap gap-1">
                                    <Pagination.Item>
                                        <Pagination.PrevButton />
                                    </Pagination.Item>
                                    {#each pages as page (page.key)}
                                        {#if page.type === "ellipsis"}
                                            <Pagination.Item>
                                                <Pagination.Ellipsis />
                                            </Pagination.Item>
                                        {:else}
                                            <Pagination.Item>
                                                <Pagination.Link {page} isActive={currentPage === page.value}>
                                                    {page.value}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        {/if}
                                    {/each}
                                    <Pagination.Item>
                                        <Pagination.NextButton />
                                    </Pagination.Item>
                                </Pagination.Content>
                            {/snippet}
                        </Pagination.Root>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>