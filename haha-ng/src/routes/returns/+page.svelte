<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import { Search, ChevronDown, Package, ArrowUpDown, Filter, Calendar, ChevronRight } from "lucide-svelte";

    // Sample data
    const orders = [
        {
            id: "ORD-7391",
            date: "March 14, 2025",
            status: "Delivered",
            total: "$129.99",
            items: [
                { name: "Cotton T-shirt", quantity: 2, price: "$29.99", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" },
                { name: "Slim Jeans", quantity: 1, price: "$70.00", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" }
            ]
        },
        {
            id: "ORD-6254",
            date: "March 2, 2025",
            status: "Processing",
            total: "$85.50",
            items: [
                { name: "Leather Wallet", quantity: 1, price: "$45.50", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" },
                { name: "Sunglasses", quantity: 1, price: "$40.00", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" }
            ]
        },
        {
            id: "ORD-5127",
            date: "February 15, 2025",
            status: "Delivered",
            total: "$210.75",
            items: [
                { name: "Winter Jacket", quantity: 1, price: "$150.75", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" },
                { name: "Wool Scarf", quantity: 1, price: "$60.00", image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png" }
            ]
        }
    ];

    let searchQuery = $state("");
    let activeFilter = $state("all");
</script>

<div class="container mx-auto py-8 px-4 max-w-6xl">
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">Your Orders</h1>
            <p class="text-muted-foreground">View and manage your order history</p>
        </div>

        <Tabs.Root value="all" class="w-full">
            <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Tabs.List class="w-full sm:w-auto">
                    <Tabs.Trigger value="all" on:click={() => activeFilter = "all"}>All Orders</Tabs.Trigger>
                    <Tabs.Trigger value="processing" on:click={() => activeFilter = "processing"}>Processing</Tabs.Trigger>
                    <Tabs.Trigger value="delivered" on:click={() => activeFilter = "delivered"}>Delivered</Tabs.Trigger>
                    <Tabs.Trigger value="cancelled" on:click={() => activeFilter = "cancelled"}>Cancelled</Tabs.Trigger>
                </Tabs.List>

                <div class="flex gap-2">
                    <div class="relative">
                        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                                type="search"
                                placeholder="Search orders..."
                                class="pl-8 w-full sm:w-[250px]"
                                bind:value={searchQuery}
                        />
                    </div>

                    <Button variant="outline" size="icon" class="hidden sm:flex">
                        <Filter class="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon" class="hidden sm:flex">
                        <Calendar class="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs.Content value="all" class="mt-0">
                <div class="space-y-4">
                    {#each orders as order}
                        <Card.Root class="overflow-hidden">
                            <Card.Header class="bg-muted/40 p-4">
                                <div class="flex flex-col sm:flex-row justify-between gap-4">
                                    <div class="space-y-1">
                                        <div class="flex flex-wrap gap-2 items-center">
                                            <h3 class="font-semibold">Order {order.id}</h3>
                                            <Badge variant={order.status === "Delivered" ? "default" :
                                      order.status === "Processing" ? "secondary" :
                                      "destructive"}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <p class="text-sm text-muted-foreground">Placed on {order.date}</p>
                                    </div>
                                    <div class="flex flex-col sm:items-end gap-1">
                                        <p class="font-medium">Total: {order.total}</p>
                                        <div class="flex gap-2">
                                            <Button variant="outline" size="sm" class="h-8">
                                                Track Order
                                            </Button>
                                            <Button variant="outline" size="sm" class="h-8">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content class="p-4">
                                <div class="space-y-4">
                                    {#each order.items as item}
                                        <div class="flex gap-4">
                                            <img src={item.image} alt={item.name} class="h-20 w-20 object-cover rounded-md" />
                                            <div class="flex flex-col justify-center">
                                                <h4 class="font-medium">{item.name}</h4>
                                                <p class="text-sm text-muted-foreground">Qty: {item.quantity} · {item.price}</p>
                                            </div>
                                            <div class="ml-auto flex gap-2 items-center">
                                                <Button variant="ghost" size="sm">Buy Again</Button>
                                                <Button variant="ghost" size="sm">Review</Button>
                                            </div>
                                        </div>
                                        {#if item !== order.items[order.items.length - 1]}
                                            <Separator />
                                        {/if}
                                    {/each}
                                </div>
                            </Card.Content>
                        </Card.Root>
                    {/each}
                </div>
            </Tabs.Content>

            <Tabs.Content value="processing" class="mt-0">
                <div class="space-y-4">
                    {#each orders.filter(order => order.status === "Processing") as order}
                        <Card.Root class="overflow-hidden">
                            <!-- Same structure as in "all" tab -->
                            <Card.Header class="bg-muted/40 p-4">
                                <div class="flex flex-col sm:flex-row justify-between gap-4">
                                    <div class="space-y-1">
                                        <div class="flex flex-wrap gap-2 items-center">
                                            <h3 class="font-semibold">Order {order.id}</h3>
                                            <Badge variant="secondary">{order.status}</Badge>
                                        </div>
                                        <p class="text-sm text-muted-foreground">Placed on {order.date}</p>
                                    </div>
                                    <div class="flex flex-col sm:items-end gap-1">
                                        <p class="font-medium">Total: {order.total}</p>
                                        <div class="flex gap-2">
                                            <Button variant="outline" size="sm" class="h-8">
                                                Track Order
                                            </Button>
                                            <Button variant="outline" size="sm" class="h-8">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content class="p-4">
                                <div class="space-y-4">
                                    {#each order.items as item}
                                        <div class="flex gap-4">
                                            <img src={item.image} alt={item.name} class="h-20 w-20 object-cover rounded-md" />
                                            <div class="flex flex-col justify-center">
                                                <h4 class="font-medium">{item.name}</h4>
                                                <p class="text-sm text-muted-foreground">Qty: {item.quantity} · {item.price}</p>
                                            </div>
                                        </div>
                                        {#if item !== order.items[order.items.length - 1]}
                                            <Separator />
                                        {/if}
                                    {/each}
                                </div>
                            </Card.Content>
                        </Card.Root>
                    {/each}
                </div>
            </Tabs.Content>

            <Tabs.Content value="delivered" class="mt-0">
                <div class="space-y-4">
                    {#each orders.filter(order => order.status === "Delivered") as order}
                        <Card.Root class="overflow-hidden">
                            <!-- Same structure as in "all" tab -->
                            <Card.Header class="bg-muted/40 p-4">
                                <div class="flex flex-col sm:flex-row justify-between gap-4">
                                    <div class="space-y-1">
                                        <div class="flex flex-wrap gap-2 items-center">
                                            <h3 class="font-semibold">Order {order.id}</h3>
                                            <Badge>{order.status}</Badge>
                                        </div>
                                        <p class="text-sm text-muted-foreground">Placed on {order.date}</p>
                                    </div>
                                    <div class="flex flex-col sm:items-end gap-1">
                                        <p class="font-medium">Total: {order.total}</p>
                                        <div class="flex gap-2">
                                            <Button variant="outline" size="sm" class="h-8">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content class="p-4">
                                <div class="space-y-4">
                                    {#each order.items as item}
                                        <div class="flex gap-4">
                                            <img src={item.image} alt={item.name} class="h-20 w-20 object-cover rounded-md" />
                                            <div class="flex flex-col justify-center">
                                                <h4 class="font-medium">{item.name}</h4>
                                                <p class="text-sm text-muted-foreground">Qty: {item.quantity} · {item.price}</p>
                                            </div>
                                            <div class="ml-auto flex gap-2 items-center">
                                                <Button variant="ghost" size="sm">Buy Again</Button>
                                                <Button variant="ghost" size="sm">Review</Button>
                                            </div>
                                        </div>
                                        {#if item !== order.items[order.items.length - 1]}
                                            <Separator />
                                        {/if}
                                    {/each}
                                </div>
                            </Card.Content>
                        </Card.Root>
                    {/each}
                </div>
            </Tabs.Content>

            <Tabs.Content value="cancelled" class="mt-0">
                <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Package class="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 class="text-lg font-medium mb-2">No cancelled orders</h3>
                    <p class="text-muted-foreground mb-6 max-w-md">You don't have any cancelled orders at the moment.</p>
                    <Button>Continue Shopping</Button>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>