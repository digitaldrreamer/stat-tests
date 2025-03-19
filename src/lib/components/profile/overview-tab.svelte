<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Package, RefreshCw, Heart, ShoppingCart,
        MapPin, CreditCard, ChevronRight
    } from "lucide-svelte";

    let { user } = $props()
</script>

<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-lg font-medium">Recent Orders</CardTitle>
                <Package class="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {#if user.recentOrders.length > 0}
                    <div class="space-y-4">
                        {#each user.recentOrders.slice(0, 2) as order}
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium">{order.id}</p>
                                    <p class="text-sm text-muted-foreground">{order.date}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-medium">{order.total}</p>
                                    <Badge variant={order.status === "Delivered" ? "outline" : "secondary"} class="text-xs">
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                            {#if order !== user.recentOrders[user.recentOrders.length - 1]}
                                <Separator />
                            {/if}
                        {/each}
                    </div>
                {:else}
                    <p class="text-sm text-muted-foreground">No recent orders</p>
                {/if}
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" class="w-full">
                    <span>View All Orders</span>
                    <ChevronRight class="h-4 w-4 ml-1" />
                </Button>
            </CardFooter>
        </Card>

        <!-- Wishlist Summary -->
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-lg font-medium">Wishlist</CardTitle>
                <Heart class="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {#if user.wishlist.length > 0}
                    <div class="space-y-4">
                        {#each user.wishlist.slice(0, 2) as item}
                            <div class="flex items-start gap-3">
                                <img src={item.image} alt={item.name} class="h-12 w-12 rounded-md object-cover" />
                                <div class="flex-1">
                                    <p class="font-medium text-sm">{item.name}</p>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-medium">{item.price}</span>
                                        {#if item.originalPrice}
                                            <span class="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                            {#if item !== user.wishlist[user.wishlist.length - 1]}
                                <Separator />
                            {/if}
                        {/each}
                    </div>
                {:else}
                    <p class="text-sm text-muted-foreground">Your wishlist is empty</p>
                {/if}
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" class="w-full">
                    <span>View Wishlist</span>
                    <ChevronRight class="h-4 w-4 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
        <CardHeader>
            <CardTitle class="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" class="h-auto flex-col py-4 px-2">
                    <ShoppingCart class="h-5 w-5 mb-2" />
                    <span class="text-sm">View Cart</span>
                </Button>
                <Button variant="outline" class="h-auto flex-col py-4 px-2">
                    <Package class="h-5 w-5 mb-2" />
                    <span class="text-sm">Track Order</span>
                </Button>
                <Button variant="outline" class="h-auto flex-col py-4 px-2">
                    <RefreshCw class="h-5 w-5 mb-2" />
                    <span class="text-sm">Returns</span>
                </Button>
                <Button variant="outline" class="h-auto flex-col py-4 px-2">
                    <Heart class="h-5 w-5 mb-2" />
                    <span class="text-sm">Wishlist</span>
                </Button>
            </div>
        </CardContent>
    </Card>

    <!-- Account Information -->
    <Card>
        <CardHeader>
            <CardTitle class="text-lg font-medium">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="font-medium mb-2">Contact Details</h3>
                    <p class="text-sm">{user.name}</p>
                    <p class="text-sm">{user.email}</p>
                    <p class="text-sm text-muted-foreground">Member since {user.memberSince}</p>
                    <Button variant="link" size="sm" class="px-0 mt-1">Update Contact Details</Button>
                </div>
                <div>
                    <h3 class="font-medium mb-2">Default Address</h3>
                    {#if user.addresses.find(a => a.default)}
                        {@const defaultAddress = user.addresses.find(a => a.default)}
                        <p class="text-sm">{defaultAddress.line1}</p>
                        {#if defaultAddress.line2}
                            <p class="text-sm">{defaultAddress.line2}</p>
                        {/if}
                        <p class="text-sm">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</p>
                        <p class="text-sm">{defaultAddress.country}</p>
                        <Button variant="link" size="sm" class="px-0 mt-1">Change Default Address</Button>
                    {:else}
                        <p class="text-sm text-muted-foreground">No default address set</p>
                        <Button variant="link" size="sm" class="px-0 mt-1">Add Address</Button>
                    {/if}
                </div>
            </div>
        </CardContent>
    </Card>
</div>