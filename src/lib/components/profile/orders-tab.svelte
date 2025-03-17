<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import { Search, Package, ExternalLink, ArrowDownToLine } from "lucide-svelte";

    let { users } = $props()

    // More sample orders data
    let orders = $state([
        ...user.recentOrders,
        {
            id: "ORD-5127",
            date: "February 15, 2025",
            status: "Delivered",
            total: "$60.00",
            items: [
                { name: "Wool Scarf", quantity: 1, price: "$60.00" }
            ]
        },
        {
            id: "ORD-4821",
            date: "January 28, 2025",
            status: "Delivered",
            total: "$145.95",
            items: [
                { name: "Winter Boots", quantity: 1, price: "$125.00" },
                { name: "Wool Socks", quantity: 1, price: "$20.95" }
            ]
        }
    ]);

    let searchQuery = $state("");
    let activeTab = $state("all");

    const filteredOrders = $state(orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "processing") return matchesSearch && order.status === "Processing";
        if (activeTab === "delivered") return matchesSearch && order.status === "Delivered";

        return matchesSearch;
    }));
</script>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between gap-4">
        <h2 class="text-2xl font-bold tracking-tight">Your Orders</h2>
        <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                    type="search"
                    placeholder="Search orders..."
                    class="pl-8 w-full sm:w-64"
                    bind:value={searchQuery}
            />
        </div>
    </div>

    <Tabs value={activeTab} onValueChange={(value) => activeTab = value} class="w-full">
        <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
    </Tabs>

    {#if filteredOrders.length > 0}
        <div class="space-y-4">
            {#each filteredOrders as order}
                <Card>
                    <CardHeader class="pb-2">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <div class="flex items-center gap-2">
                                    <CardTitle class="text-lg font-medium">Order {order.id}</CardTitle>
                                    <Badge variant={order.status === "Delivered" ? "outline" : "secondary"} class="text-xs">
                                        {order.status}
                                    </Badge>
                                </div>
                                <p class="text-sm text-muted-foreground">Placed on {order.date}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-medium">{order.total}</span>
                                <Button variant="outline" size="sm">
                                    <ExternalLink class="h-4 w-4 mr-1" />
                                    Details
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            {#each order.items as item, i}
                                <div class="flex items-start gap-4">
                                    <div class="bg-slate-100 dark:bg-slate-800 h-16 w-16 rounded-md flex items-center justify-center">
                                        <Package class="h-8 w-8 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-medium">{item.name}</p>
                                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Qty: {item.quantity}</span>
                                            <span>•</span>
                                            <span>{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                                {#if i < order.items.length - 1}
                                    <Separator />
                                {/if}
                            {/each}
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            {#if order.status === "Delivered"}
                                <Button variant="outline" size="sm">
                                    <ArrowDownToLine class="h-4 w-4 mr-1" />
                                    Invoice
                                </Button>
                                <Button variant="outline" size="sm">
                                    Return Item
                                </Button>
                            {/if}
                            <Button variant="outline" size="sm">
                                Buy Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            {/each}
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Package class="h-16 w-16 text-muted-foreground mb-4" />
            <h3 class="text-lg font-medium mb-2">No orders found</h3>
            <p class="text-muted-foreground mb-6 max-w-md">
                {#if searchQuery}
                    No orders match your search criteria. Try a different search term.
                {:else}
                    You haven't placed any orders yet.
                {/if}
            </p>
            <Button>Start Shopping</Button>
        </div>
    {/if}
</div>