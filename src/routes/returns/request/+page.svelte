<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import * as Card from '$lib/components/ui/card';
    import {Button} from '$lib/components/ui/button';
    import * as Select from '$lib/components/ui/select';
    import {Textarea} from '$lib/components/ui/textarea';
    import {Checkbox} from '$lib/components/ui/checkbox';
    import * as RadioGroup from '$lib/components/ui/radio-group';

    let orderId = $state('');
    let orderDetails = $state(null);
    let isLoading = $state(true);

    // Return form state
    let selectedItems = $state([]);
    let returnReason = $state('');
    let returnDescription = $state('');
    let returnMethod = $state('refund');
    let isSubmitting = $state(false);

    let returnReasons = [
        {
            label: "Wrong Size",
            value: "wrong-size"
        },
        {
            label: "Damaged Goods",
            value: "damaged"
        },
        {
            label: "Not as Described",
            value: "not-as-described"
        },
        {
            label: "Wrong Item",
            value: "wrong-item"
        },
        {
            label: "Changed Mind",
            value: "changed-mind"
        },
        {
            label: "Other",
            value: "other"
        }
    ]

    onMount(() => {
        // Get order ID from URL
        orderId = page.url.searchParams.get('id') || 'ORD123456';

        // Simulate fetching order details
        setTimeout(() => {
            orderDetails = {
                id: orderId,
                date: new Date().toLocaleDateString(),
                status: 'Delivered',
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
                        title: "Olay Ultra Moisture Shea Butter Body Wash",
                        price: 49.99,
                        quantity: 2,
                        image: "https://cdn.dummyjson.com/products/images/skin-care/Olay%20Ultra%20Moisture%20Shea%20Butter%20Body%20Wash/thumbnail.png"
                    }
                ]
            };
            isLoading = false;
        }, 1000);
    });

    function toggleItemSelection(itemId) {
        if (selectedItems.includes(itemId)) {
            selectedItems = selectedItems.filter(id => id !== itemId);
        } else {
            selectedItems = [...selectedItems, itemId];
        }
    }

    async function handleSubmitReturn() {
        if (selectedItems.length === 0 || !returnReason) {
            alert('Please select items and a return reason');
            return;
        }

        isSubmitting = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect to confirmation
        window.location.href = '/return-confirmation?id=RTN' + Math.floor(Math.random() * 1000000);
    }

</script>

<svelte:head>
    <title>Return Request | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-6 sm:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Return Request</h1>

    {#if isLoading}
        <div class="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    {:else}
        <div class="max-w-3xl mx-auto">
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-xl sm:text-2xl">Return Items from Order #{orderDetails.id}</Card.Title>
                    <Card.Description class="text-sm sm:text-base">
                        Select the items you want to return and provide a reason
                    </Card.Description>
                </Card.Header>

                <Card.Content>
                    <div class="space-y-4 sm:space-y-6">
                        <!-- Select Items -->
                        <div>
                            <h3 class="font-medium mb-3 sm:mb-4 text-base sm:text-lg">Select Items to Return</h3>
                            <div class="space-y-3 sm:space-y-4">
                                {#each orderDetails.items as item}
                                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                                        <div class="flex items-center gap-3 w-full sm:w-auto">
                                            <Checkbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={() => toggleItemSelection(item.id)}
                                                    class="mt-1 sm:mt-0"
                                            />

                                            <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.title}
                                                    class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                                            />
                                        </div>

                                        <div class="flex-grow ml-6 sm:ml-0">
                                            <h4 class="font-medium text-sm sm:text-base">{item.title}</h4>
                                            <p class="text-xs sm:text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <div class="text-right ml-auto sm:ml-0 mt-2 sm:mt-0">
                                            <p class="font-medium text-sm sm:text-base">₦{item.price}</p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Return Reason -->
                        <div>
                            <h3 class="font-medium mb-3 sm:mb-4 text-base sm:text-lg">Return Reason</h3>
                            <Select.Root value={returnReason} type="single" onValueChange={(value) => returnReason = value}>
                                <Select.Trigger class="capitalize w-full">
                                    {returnReason ? returnReasons.find(reason => reason.value === returnReason)?.label : "Select a reason"}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each returnReasons as reason}
                                        <Select.Item value={reason.value}>{reason.label}</Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </div>

                        <!-- Additional Details -->
                        <div>
                            <h3 class="font-medium mb-3 sm:mb-4 text-base sm:text-lg">Additional Details</h3>
                            <Textarea
                                    placeholder="Please provide any additional details about your return..."
                                    bind:value={returnDescription}
                                    rows={4}
                                    class="w-full"
                            />
                        </div>

                        <!-- Return Method -->
                        <div>
                            <h3 class="font-medium mb-3 sm:mb-4 text-base sm:text-lg">Return Method</h3>
                            <RadioGroup.Root value={returnMethod} onValueChange={(value) => returnMethod = value}>
                                <div class="flex flex-col gap-2 sm:gap-3">
                                    <div class="flex items-center gap-2">
                                        <RadioGroup.Item value="refund" id="refund" />
                                        <label for="refund" class="text-xs sm:text-sm font-medium">
                                            Refund to Original Payment Method
                                        </label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <RadioGroup.Item value="store-credit" id="store-credit" />
                                        <label for="store-credit" class="text-xs sm:text-sm font-medium">
                                            Store Credit
                                        </label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <RadioGroup.Item value="exchange" id="exchange" />
                                        <label for="exchange" class="text-xs sm:text-sm font-medium">
                                            Exchange for Another Item
                                        </label>
                                    </div>
                                </div>
                            </RadioGroup.Root>
                        </div>
                    </div>
                </Card.Content>

                <Card.Footer class="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
                    <Button variant="outline" href={`/orders/${orderId}`} class="w-full sm:w-auto">
                        Cancel
                    </Button>

                    <Button
                            onclick={handleSubmitReturn}
                            disabled={isSubmitting || selectedItems.length === 0 || !returnReason}
                            class="w-full sm:w-auto"
                    >
                        {#if isSubmitting}
                            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                            Processing...
                        {:else}
                            Submit Return Request
                        {/if}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </div>
    {/if}
</div>