<script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Switch } from "$lib/components/ui/switch";
    import { Label } from "$lib/components/ui/label";
    import { browser } from "$app/environment";
    import { PaymentManagement } from '$lib/components/profile'

    import {
        User,
        Settings,
        Heart,
        ShoppingCart,
        PackageOpen,
        RotateCcw,
        LogOut,
        CreditCard,
        Bell,
        Shield,
        ChevronRight,
        Plus,
        Wallet,
        Building,
        ArrowRight,
        Copy,
        CheckCircle,
        Home,
        AlertCircle,
        DollarSign
    } from "lucide-svelte";
    import {toast} from "svelte-sonner";

    // User data
    const userData = $state({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "/api/placeholder/100/100",
        walletBalance: 249.99,
        isAdmin: false,
        isSalesAgent: false
    });

    // Mobile detection
    let isMobile = $state(browser && window.innerWidth < 768);
    let isWalletSheetOpen = $state(false);
    let copiedToClipboard = $state(false);
    let activeTab = $state("profile");
    let topUpAmount = $state(0);

    let isPaymentModalOpen = $state(false)

    // Banking information
    const bankDetails = {
        accountName: "John Doe",
        accountNumber: "1234567890",
        bankName: "National Bank",
    };

    // Orders data
    const orders = [
        {
            id: "12345",
            date: "March 15, 2025",
            status: "Delivered",
            total: 189.99,
            items: [
                { name: "Wireless Headphones", quantity: 1, price: 149.99 },
                { name: "Charging Cable", quantity: 2, price: 20.00 }
            ]
        },
        {
            id: "12346",
            date: "March 12, 2025",
            status: "Shipped",
            total: 89.99,
            items: [
                { name: "Smartwatch Band", quantity: 1, price: 89.99 }
            ]
        }
    ];

    // Returns and refunds
    const returns = [
        {
            id: "RET-5678",
            orderId: "12345",
            date: "March 10, 2025",
            status: "Processing",
            amount: 89.99,
            reason: "Damaged item"
        },
        {
            id: "RET-9012",
            orderId: "12340",
            date: "February 28, 2025",
            status: "Refunded",
            amount: 45.50,
            reason: "Wrong size"
        }
    ];

    // addresses
    let addresses = $state([
        {
            label: "Home",
            street: "123 Home Str",
            address: "Ibadan, OY 200121",
            isDefault: true
        },
        {
            label: "Work",
            street: "456 Business Ave, Suite 200",
            address: "Ibadan, OY 200121",
            isDefault: false
        }
    ])

    // New state variables for the shipping address sheet
    let isNewAddressSheetOpen = $state(false);
    let isNewAddressDialogOpen = $state(false)
    let newSearchAddress = $state("");
    let newStreetInfo = $state("");
    let newAddressInfo = $state("");
    let newIsDefaultAddress = $state(false);

    function handleAddAddress() {
        if (newStreetInfo && newAddressInfo) {

        // Process and save the new address here
        if (newIsDefaultAddress) {
            addresses = addresses.map(address => {
                address.isDefault = false;
                return address;
            });
        }
        addresses = [...addresses, {
            label: "Address " + addresses.length + 1,
            street: newStreetInfo,
            address: newAddressInfo,
            isDefault: newIsDefaultAddress
        }]
        console.log("New Address Added:", {
            searchAddress: newSearchAddress,
            streetInfo: newStreetInfo,
            addressInfo: newAddressInfo,
            default: newIsDefaultAddress
        });
        // Reset the fields after saving
        newSearchAddress = "";
        newStreetInfo = "";
        newAddressInfo = "";
        newIsDefaultAddress = false;
        isNewAddressSheetOpen = false;
        isNewAddressDialogOpen = false;
        toast.success("Address added successfully")
    } else {
            toast.error("Please fill all required fields")
        }
    }

    function handleLogout() {
        // Implement logout functionality
        console.log("Logging out...");
    }

    function copyToClipboard(text) {
        if (browser) {
            navigator.clipboard.writeText(text);
            copiedToClipboard = true;
            setTimeout(() => {
                copiedToClipboard = false;
            }, 2000);
        }
    }

    function handleTopUp() {
        if (topUpAmount > 0) {
            userData.walletBalance += topUpAmount;
            topUpAmount = 0;
            isWalletSheetOpen = false;
        }
    }

    function handleResize() {
        isMobile = browser && window.innerWidth < 768;
    }

    function navigateTo(tab: string) {
        activeTab = tab;
    }

    onMount(() => {
        browser && window.addEventListener('resize', handleResize);
        return () => {
            browser && window.removeEventListener('resize', handleResize);
        };
    });
</script>

<div class="container mx-auto py-8 px-4 max-w-6xl">
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">My Profile</h1>
            <p class="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Profile Summary Card -->
            <Card.Root class="md:col-span-1">
                <Card.Header class="flex flex-row items-center gap-4">
                    <Avatar.Root class="h-16 w-16">
                        <Avatar.Image src={userData.avatar} alt={userData.name} />
                        <Avatar.Fallback>{userData.name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                        <h2 class="text-xl font-semibold">{userData.name}</h2>
                        <p class="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div class="flex flex-col gap-4">
                        <!-- Wallet Balance -->
                        <div class="bg-primary/10 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center gap-2">
                                    <Wallet class="h-5 w-5 text-primary" />
                                    <span class="font-medium">Wallet Balance</span>
                                </div>
                                <Button variant="outline" size="sm" onclick={() => isWalletSheetOpen = true}>
                                    <Plus class="h-4 w-4 mr-1" />
                                    Top Up
                                </Button>
                            </div>
                            <p class="text-2xl font-bold">${userData.walletBalance.toFixed(2)}</p>
                        </div>

                        <!-- Navigation Links -->
                        <div class="flex flex-col gap-1">
                            <Button variant="ghost" class="justify-start h-10" onclick={() => navigateTo("profile")}>
                                <User class="h-4 w-4 mr-2" />
                                Personal Information
                            </Button>
                            <Button variant="ghost" class="justify-start h-10">
                                <ShoppingCart class="h-4 w-4 mr-2" />
                                My Cart
                            </Button>
                            <Button variant="ghost" class="justify-start h-10">
                                <Heart class="h-4 w-4 mr-2" />
                                Wishlist
                            </Button>
                            <Button variant="ghost" class="justify-start h-10" onclick={() => navigateTo("orders")}>
                                <PackageOpen class="h-4 w-4 mr-2" />
                                My Orders
                            </Button>
                            <Button variant="ghost" class="justify-start h-10" onclick={() => navigateTo("returns")}>
                                <RotateCcw class="h-4 w-4 mr-2" />
                                Returns & Refunds
                            </Button>
                            <Button variant="ghost" class="justify-start h-10" onclick={() => navigateTo("settings")}>
                                <Settings class="h-4 w-4 mr-2" />
                                Settings
                            </Button>

                            {#if userData.isAdmin || userData.isSalesAgent}
                                <Separator class="my-2" />
                                <Button variant="ghost" class="justify-start h-10">
                                    <Building class="h-4 w-4 mr-2" />
                                    Go to Dashboard
                                </Button>
                            {/if}

                            <Separator class="my-2" />
                            <Button variant="ghost" class="justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10" onclick={handleLogout}>
                                <LogOut class="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Main Content Area -->
            <div class="md:col-span-2">
                <Tabs.Root bind:value={activeTab} class="w-full">
                    <Tabs.List class="grid grid-cols-4 mb-6">
                        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                        <Tabs.Trigger value="orders">Orders</Tabs.Trigger>
                        <Tabs.Trigger value="returns">Returns</Tabs.Trigger>
                    </Tabs.List>

                    <!-- Profile Tab Content -->
                    <Tabs.Content value="profile" class="space-y-6">
                        <Card.Root>
                            <Card.Header>
                                <h3 class="text-lg font-semibold">Personal Information</h3>
                            </Card.Header>
                            <Card.Content>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <Label for="name">Full Name</Label>
                                        <Input id="name" value={userData.name} />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="email">Email Address</Label>
                                        <Input id="email" value={userData.email} />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="phone">Phone Number</Label>
                                        <Input id="phone" value={userData.phone} />
                                    </div>
                                </div>
                            </Card.Content>
                            <Card.Footer>
                                <Button>Save Changes</Button>
                            </Card.Footer>
                        </Card.Root>

                        <Card.Root>
                            <Card.Header>
                                <h3 class="text-lg font-semibold">Saved Addresses</h3>
                            </Card.Header>
                            <Card.Content>
                                {#each addresses as address}
                                <div class="border rounded-lg p-4 mb-4">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <h4 class="font-medium">{address.label}</h4>
                                                {#if address.isDefault}
                                                <Badge variant="outline" class="text-xs">Default</Badge>
                                                    {/if}
                                            </div>
                                            <p class="text-sm">{address.street}</p>
                                            <p class="text-sm">{address.address}</p>
                                            <p class="text-sm text-muted-foreground">Nigeria</p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <ChevronRight class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                    {/each}

                                <Button onclick={() => {
                                    if (isMobile) {
                                        isNewAddressSheetOpen = true
                                    } else {
                                        isNewAddressDialogOpen = true
                                    }
                                }} variant="outline" class="w-full">
                                    <Plus class="h-4 w-4 mr-2" />
                                    Add New Address
                                </Button>
                            </Card.Content>
                        </Card.Root>
                    </Tabs.Content>

                    <!-- Settings Tab Content -->
                    <Tabs.Content value="settings" class="space-y-6">
                        <Card.Root>
                            <Card.Header>
                                <h3 class="text-lg font-semibold">Account Settings</h3>
                            </Card.Header>
                            <Card.Content>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <Label class="text-base">Email Notifications</Label>
                                            <p class="text-sm text-muted-foreground">Receive order updates and promotions</p>
                                        </div>
                                        <Switch checked={true} />
                                    </div>
                                    <Separator />
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <Label class="text-base">SMS Notifications</Label>
                                            <p class="text-sm text-muted-foreground">Get text messages for order status</p>
                                        </div>
                                        <Switch checked={false} />
                                    </div>
                                    <Separator />
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <Label class="text-base">Two-Factor Authentication</Label>
                                            <p class="text-sm text-muted-foreground">Add an extra layer of security</p>
                                        </div>
                                        <Switch checked={false} />
                                    </div>
                                    <Separator />
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-0.5">
                                            <Label class="text-base">Save Payment Information</Label>
                                            <p class="text-sm text-muted-foreground">Securely save payment methods for future purchases</p>
                                        </div>
                                        <Switch checked={true} />
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Root>

                        <Card.Root>
                            <Card.Header>
                                <h3 class="text-lg font-semibold">Privacy and Security</h3>
                            </Card.Header>
                            <Card.Content>
                                <div class="space-y-4">
                                    <Button variant="outline" class="w-full justify-start">
                                        <Shield class="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                    <Button variant="outline" onclick={() => {
                                        isPaymentModalOpen = !isPaymentModalOpen
                                    }} class="w-full justify-start">
                                        <CreditCard class="h-4 w-4 mr-2" />
                                        Payment Methods
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card.Root>

                        <Card.Root>
                            <Card.Header>
                                <h3 class="text-lg font-semibold">Connected Devices</h3>
                            </Card.Header>
                            <Card.Content>
                                <div class="space-y-4">
                                    {#each [{ device: 'iPhone 15 Pro', os: 'iOS', location: 'New York, NY', lastActive: 'Active now' },
                                        { device: 'MacBook Pro 16"', os: 'macOS', location: 'London, UK', lastActive: '2 hours ago' }] as device}
                                        <div class="flex items-center justify-between p-3 rounded-lg border">
                                            <div class="flex items-center gap-4">
                                                <div class="bg-primary/10 p-2 rounded-full">
                                                    <Home class="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p class="font-medium">{device.device}</p>
                                                    <p class="text-sm text-muted-foreground">{device.os} • {device.location}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-sm font-medium text-primary">{device.lastActive}</p>
                                                {#if device.lastActive === 'Active now'}
                                                    <Button variant="link" size="sm" class="text-destructive">Logout</Button>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </Card.Content>
                        </Card.Root>
                    </Tabs.Content>

                    <!-- Orders Tab Content -->
                    <Tabs.Content value="orders" class="space-y-6">
                        {#if orders.length === 0}
                            <div class="flex flex-col items-center justify-center h-96 gap-4">
                                <PackageOpen class="h-12 w-12 text-muted-foreground" />
                                <p class="text-lg font-medium">No orders found</p>
                                <p class="text-muted-foreground">Your orders will appear here once you make a purchase</p>
                                <Button>Start Shopping</Button>
                            </div>
                        {:else}
                            {#each orders as order}
                                <Card.Root>
                                    <Card.Header class="flex flex-row justify-between items-center">
                                        <div>
                                            <h3 class="font-semibold">Order #{order.id}</h3>
                                            <p class="text-sm text-muted-foreground">{order.date}</p>
                                        </div>
                                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                                    </Card.Header>
                                    <Card.Content class="flex flex-col gap-4">
                                        {#each order.items as item}
                                            <div class="flex items-center gap-4">
                                                <div class="h-16 w-16 bg-muted rounded-lg" />
                                                <div class="flex-1">
                                                    <p class="font-medium">{item.name}</p>
                                                    <p class="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p class="font-medium">${item.price}</p>
                                            </div>
                                        {/each}
                                    </Card.Content>
                                    <Card.Footer class="flex justify-between items-center">
                                        <p class="text-sm text-muted-foreground">{order.items.length} items</p>
                                        <div class="flex items-center gap-2">
                                            <p class="font-medium">Total: ${order.total.toFixed(2)}</p>
                                            <Button variant="outline" size="sm">
                                                View Details
                                                <ArrowRight class="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card.Root>
                            {/each}
                        {/if}
                    </Tabs.Content>

                    <!-- Returns Tab Content -->
                    <Tabs.Content value="returns" class="space-y-6">
                        {#each returns as itemReturn}
                            <Card.Root>
                                <Card.Header class="flex flex-row justify-between items-center">
                                    <div>
                                        <h3 class="font-semibold">Return #{itemReturn.id}</h3>
                                        <p class="text-sm text-muted-foreground">Order #{itemReturn.orderId} • {itemReturn.date}</p>
                                    </div>
                                    <Badge variant={itemReturn.status === 'Refunded' ? 'default' : 'secondary'}>{itemReturn.status}</Badge>
                                </Card.Header>
                                <Card.Content>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <p class="text-sm text-muted-foreground">Reason</p>
                                            <p class="font-medium">{itemReturn.reason}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-muted-foreground">Amount</p>
                                            <p class="font-medium">${itemReturn.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                                <Card.Footer>
                                    <Button variant="outline" size="sm">
                                        Track Return
                                        <RotateCcw class="h-4 w-4 ml-2" />
                                    </Button>
                                </Card.Footer>
                            </Card.Root>
                        {/each}
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    </div>

    <!-- Wallet Top Up Sheet -->
    <Sheet.Root bind:open={isWalletSheetOpen}>
        <Sheet.Content side={isMobile ? 'bottom' : 'right'} class="rounded-t-2xl md:rounded-none">
            <Sheet.Header>
                <Sheet.Title>Top Up Wallet</Sheet.Title>
                <Sheet.Description>
                    Transfer funds to the account below and enter the amount to add to your wallet
                </Sheet.Description>
            </Sheet.Header>

            <div class="space-y-6 py-4">
                <div class="space-y-2">
                    <Label>Amount to Top Up</Label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                                type="number"
                                bind:value={topUpAmount}
                                class="pl-8"
                                placeholder="Enter amount"
                        />
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Account Name</span>
                            <div class="flex items-center gap-2">
                                <span class="font-medium">{bankDetails.accountName}</span>
                                <Button variant="ghost" size="sm" onclick={() => copyToClipboard(bankDetails.accountName)}>
                                    {#if copiedToClipboard}
                                        <CheckCircle class="h-4 w-4 text-green-500" />
                                    {:else}
                                        <Copy class="h-4 w-4" />
                                    {/if}
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Bank Name</span>
                            <span class="font-medium">{bankDetails.bankName}</span>
                        </div>
                        <Separator />
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Account Number</span>
                            <div class="flex items-center gap-2">
                                <span class="font-medium">{bankDetails.accountNumber}</span>
                                <Button variant="ghost" size="sm" onclick={() => copyToClipboard(bankDetails.accountNumber)}>
                                    <Copy class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-yellow-50/50 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle class="h-5 w-5 text-yellow-600 dark:text-yellow-300 mt-0.5" />
                        <p class="text-sm text-yellow-800  dark:text-yellow-200">Funds will be added to your wallet immediately it is automatically verified (which should be instant)</p>
                    </div>
                </div>
            </div>

            <Sheet.Footer>
                <Button onclick={handleTopUp} class="w-full">
                    Confirm Top Up
                </Button>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>

<!--  Add Shipping Address Sheet  -->
    <Sheet.Root bind:open={isNewAddressSheetOpen}>
        <Sheet.Content side="bottom" class="sm:rounded-t-lg">
            <Sheet.Header>
                <Sheet.Title>Add New Shipping Address</Sheet.Title>
                <Sheet.Description>Fill in your address details below.</Sheet.Description>
            </Sheet.Header>
            <div class="space-y-4 my-4">
                <!-- Google Maps Autocomplete Search (Placeholder) -->
                <div>
                    <Label for="addressSearch">Search Address</Label>
                    <Input
                            id="addressSearch"
                            type="text"
                            bind:value={newSearchAddress}
                            placeholder="Search for address..."
                            list="addressSuggestions"
                    />
                    <datalist id="addressSuggestions">
                        <option value="123 Main St, Anytown, USA"></option>
                        <option value="456 Elm St, Somewhere, USA"></option>
                        <option value="789 Oak St, Elsewhere, USA"></option>
                    </datalist>
                </div>

                <!-- Street Info Field -->
                <div>
                    <Label for="streetInfo">Street Info</Label>
                    <Input
                            id="streetInfo"
                            type="text"
                            bind:value={newStreetInfo}
                            placeholder="Enter street information"
                    />
                </div>

                <!-- Address Info Field -->
                <div>
                    <Label for="addressInfo">Address Info</Label>
                    <Input
                            id="addressInfo"
                            type="text"
                            bind:value={newAddressInfo}
                            placeholder="Enter address details"
                    />
                </div>

                <!-- Set as Default Address Switch -->
                <div class="flex items-center space-x-2">
                    <Switch id="defaultAddress" bind:checked={newIsDefaultAddress} />
                    <Label for="defaultAddress">Set as Default Address</Label>
                </div>
            </div>
            <Sheet.Footer>
                <Button onclick={handleAddAddress} class="w-full">Add Address</Button>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>

<!--  Add Shipping Address Dialog  -->
    <Dialog.Root bind:open={isNewAddressDialogOpen}>
        <Dialog.Content class="sm:rounded-t-lg">
            <Dialog.Header>
                <Dialog.Title>Add New Shipping Address</Dialog.Title>
                <Dialog.Description>Fill in your address details below.</Dialog.Description>
            </Dialog.Header>
            <div class="space-y-4 my-4">
                <!-- Google Maps Autocomplete Search (Placeholder) -->
                <div>
                    <Label for="addressSearch">Search Address</Label>
                    <Input
                            id="addressSearch"
                            type="text"
                            bind:value={newSearchAddress}
                            placeholder="Search for address..."
                            list="addressSuggestions"
                    />
                    <datalist id="addressSuggestions">
                        <option value="123 Main St, Anytown, USA"></option>
                        <option value="456 Elm St, Somewhere, USA"></option>
                        <option value="789 Oak St, Elsewhere, USA"></option>
                    </datalist>
                </div>

                <!-- Street Info Field -->
                <div>
                    <Label for="streetInfo">Street Info</Label>
                    <Input
                            id="streetInfo"
                            type="text"
                            bind:value={newStreetInfo}
                            placeholder="Enter street information"
                    />
                </div>

                <!-- Address Info Field -->
                <div>
                    <Label for="addressInfo">Address Info</Label>
                    <Input
                            id="addressInfo"
                            type="text"
                            bind:value={newAddressInfo}
                            placeholder="Enter address details"
                    />
                </div>

                <!-- Set as Default Address Switch -->
                <div class="flex items-center space-x-2">
                    <Switch id="defaultAddress" bind:checked={newIsDefaultAddress} />
                    <Label for="defaultAddress">Set as Default Address</Label>
                </div>
            </div>
            <Dialog.Footer>
                <Button onclick={handleAddAddress} class="w-full">Add Address</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>

    <PaymentManagement bind:open={isPaymentModalOpen} />

</div>