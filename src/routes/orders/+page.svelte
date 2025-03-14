<script>
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as Select from '$lib/components/ui/select';
    import * as Input from '$lib/components/ui/input';
    import {OrderItem} from '$lib/components/orders';
    import { Search, Filter } from 'lucide-svelte';

    let orders = $state([]);
    let isLoading = $state(true);
    let activeTab = $state('all');
    let searchQuery = $state('');
    let dateFilter = $state('all');

    onMount(() => {
        // Simulate fetching orders
        setTimeout(() => {
            orders = [
                {
                    id: 'ORD123456',
                    date: '2023-12-01',
                    status: 'Delivered',
                    total: 329.96,
                    items: [
                        {
                            id: 1,
                            title: "Premium Leather Crossbody Bag",
                            price: 199.99,
                            quantity: 1,
                            image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/thumbnail.png"
                        },
                        {
                            id: 2,
                            title: "Silk Scarf",
                            price: 49.99,
                            quantity: 2,
                            image: "https://cdn.dummyjson.com/products/images/womens-bags/Women%20Handbag%20Black/thumbnail.png"
                        }
                    ],
                    tracking: {
                        number: 'TRK987654321',
                        carrier: 'FedEx',
                        url: '#'
                    }
                },
                {
                    id: 'ORD789012',
                    date: '2023-11-15',
                    status: 'Processing',
                    total: 149.97,
                    items: [
                        {
                            id: 3,
                            title: "Cotton T-Shirt",
                            price: 29.99,
                            quantity: 3,
                            image: "https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20Tshirt/thumbnail.png"
                        },
                        {
                            id: 4,
                            title: "Essence Mascara Lash Princess",
                            price: 59.99,
                            quantity: 1,
                            image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
                        }
                    ]
                },
                {
                    id: 'ORD345678',
                    date: '2023-10-20',
                    status: 'Cancelled',
                    total: 89.99,
                    items: [
                        {
                            id: 5,
                            title: "Men Plaid Shirt",
                            price: 89.99,
                            quantity: 1,
                            image: "https://cdn.dummyjson.com/products/images/womens-bags/Women%20Handbag%20Black/thumbnail.png"
                        }
                    ]
                }
            ];
            isLoading = false;
        }, 1000);
    });

    const filteredOrders = $derived(orders
        .filter(order => {
            // Filter by tab
            if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab) {
                return false;
            }

            // Filter by search
            if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Filter by date
            if (dateFilter !== 'all') {
                const orderDate = new Date(order.date);
                const now = new Date();

                if (dateFilter === 'last-30-days') {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    if (orderDate < thirtyDaysAgo) {
                        return false;
                    }
                } else if (dateFilter === 'last-6-months') {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(now.getMonth() - 6);
                    if (orderDate < sixMonthsAgo) {
                        return false;
                    }
                }
            }

            return true;
        })
    )
</script>

<svelte:head>
    <title>Order History | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Order History</h1>

    <div class="mb-6">
        <Tabs.Root value={activeTab} onValueChange={(value) => activeTab = value}>
            <Tabs.List class="w-full">
                <Tabs.Trigger value="all">All Orders</Tabs.Trigger>
                <Tabs.Trigger value="processing">Processing</Tabs.Trigger>
                <Tabs.Trigger value="shipped">Shipped</Tabs.Trigger>
                <Tabs.Trigger value="delivered">Delivered</Tabs.Trigger>
                <Tabs.Trigger value="cancelled">Cancelled</Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input.Root
                    type="text"
                    placeholder="Search by order number"
                    bind:value={searchQuery}
                    class="pl-10"
            />
        </div>

        <div class="w-full sm:w-48">
            <Select.Root value={dateFilter} onValueChange={(value) => dateFilter = value}>
                <Select.Trigger>
                    {dateFilter ?? "Filter by date"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="all">All Time</Select.Item>
                    <Select.Item value="last-30-days">Last 30 Days</Select.Item>
                    <Select.Item value="last-6-months">Last 6 Months</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
    </div>

    {#if isLoading}
        <div class="flex items-center justify-center min-h-[400px]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else if filteredOrders.length === 0}
        <Card.Root>
            <Card.Content class="flex flex-col items-center justify-center py-12">
                <div class="text-center">
                    <h3 class="text-lg font-medium mb-2">No orders found</h3>
                    <p class="text-muted-foreground mb-4">
                        {#if searchQuery || dateFilter !== 'all' || activeTab !== 'all'}
                            Try adjusting your filters
                        {:else}
                            You haven't placed any orders yet
                        {/if}
                    </p>

                    {#if searchQuery || dateFilter !== 'all' || activeTab !== 'all'}
                        <Button.Root variant="outline" onclick={() => {
                            searchQuery = '';
                            dateFilter = 'all';
                            activeTab = 'all';
                        }}>
                            Clear Filters
                        </Button.Root>
                    {:else}
                        <Button.Root href="/products">
                            Start Shopping
                        </Button.Root>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>
    {:else}
        <div class="space-y-6">
            {#each filteredOrders as order (order.id)}
                <OrderItem {order} />
            {/each}
        </div>
    {/if}
</div>