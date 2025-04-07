<script>
    import { onMount } from 'svelte';
    import {
        CheckoutStepper,
        CustomerInfo,
        ShippingAddress,
        PaymentMethod,
        OrderReview,
        OrderSummary
    } from '$lib/components/checkout';
    import * as Button from '$lib/components/ui/button';
    import { ArrowLeft } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import {browser} from "$app/environment";

    // Checkout steps
    const STEPS = {
        CUSTOMER_INFO: 1,
        SHIPPING: 2,
        PAYMENT: 3,
        REVIEW: 4
    };

    let currentStep = $state(STEPS.CUSTOMER_INFO);
    let isMobile = $state(browser && window.innerWidth < 768);

    // Form data
    let customerData = $state({
        email: '',
        phone: '',
        savedProfileId: ''
    });

    let shippingData = $state({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        deliveryMethod: 'pickup-station',
        pickupStationId: ''
    });

    let paymentData = $state({
        method: 'credit-card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        savedCardId: ''
    });

    // Sample cart items
    const cartItems = [
        {
            id: 1,
            name: 'Premium Cotton T-Shirt',
            price: 29.99,
            quantity: 2,
            image: '/placeholder.svg?height=80&width=80',
            color: 'Black',
            size: 'L'
        },
        {
            id: 2,
            name: 'Slim Fit Jeans',
            price: 59.99,
            quantity: 1,
            image: '/placeholder.svg?height=80&width=80',
            color: 'Blue',
            size: '32'
        },
        {
            id: 3,
            name: 'Leather Jacket',
            price: 199.99,
            quantity: 1,
            image: '/placeholder.svg?height=80&width=80',
            color: 'Brown',
            size: 'M'
        }
    ];

    // Order summary calculations
    const subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    const shipping = $derived(0); // Free shipping for pickup
    const tax = $derived(subtotal * 0.08);
    const discount = $derived(20); // Sample discount
    const total = $derived(subtotal + shipping + tax - discount);

    function handleCustomerInfoSubmit(data) {
        customerData = { ...data };
        currentStep = STEPS.SHIPPING;
        scrollToTop();
    }

    function handleShippingSubmit(data) {
        shippingData = { ...data };
        currentStep = STEPS.PAYMENT;
        scrollToTop();
    }

    function handlePaymentSubmit(data) {
        paymentData = { ...data };
        currentStep = STEPS.REVIEW;
        scrollToTop();
    }

    function handleReviewSubmit() {
        // In a real app, this would submit the order to the backend
        goto('/order-confirmation');
    }

    function goBack() {
        if (currentStep === STEPS.CUSTOMER_INFO) {
            goto('/cart');
        } else {
            currentStep--;
            scrollToTop();
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Window resize listener for mobile detection
    function handleResize() {
        isMobile = window.innerWidth < 768;
    }

    onMount(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<svelte:head>
    <title>Checkout | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-6 md:py-10">
    <div class="flex items-center mb-6">
        <Button.Root variant="ghost" size="icon" onclick={goBack} class="mr-2">
            <ArrowLeft class="h-5 w-5" />
        </Button.Root>
        <h1 class="text-2xl font-bold">Checkout</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Checkout Column -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Stepper -->
            <CheckoutStepper currentStep={currentStep} />

            <!-- Current Step Content -->
            {#if currentStep === STEPS.CUSTOMER_INFO}
                <CustomerInfo
                        initialData={customerData}
                        onSubmit={handleCustomerInfoSubmit}
                />
            {:else if currentStep === STEPS.SHIPPING}
                <ShippingAddress
                        initialData={shippingData}
                        onSubmit={handleShippingSubmit}
                        onBack={() => currentStep = STEPS.CUSTOMER_INFO}
                />
            {:else if currentStep === STEPS.PAYMENT}
                <PaymentMethod
                        initialData={paymentData}
                        onSubmit={handlePaymentSubmit}
                        onBack={() => currentStep = STEPS.SHIPPING}
                />
            {:else if currentStep === STEPS.REVIEW}
                <OrderReview
                        customerData={customerData}
                        shippingData={shippingData}
                        paymentData={paymentData}
                        cartItems={cartItems}
                        onSubmit={handleReviewSubmit}
                        onBack={() => currentStep = STEPS.PAYMENT}
                />
            {/if}
        </div>

        <!-- Order Summary Column -->
        <div class="lg:col-span-1">
            <div class="sticky top-6">
                <OrderSummary
                        cartItems={cartItems}
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        discount={discount}
                        total={total}
                        showItems={!isMobile}
                />

                <!-- Mobile Order Summary Toggle -->
                {#if isMobile}
                    <details class="mt-4 border rounded-lg">
                        <summary class="p-4 font-medium cursor-pointer">
                            View Order Details ({cartItems.length} items)
                        </summary>
                        <div class="p-4 pt-0 border-t">
                            {#each cartItems as item}
                                <div class="flex items-center py-3 border-b last:border-b-0">
                                    <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            class="w-16 h-16 object-cover rounded"
                                    />
                                    <div class="ml-3 flex-grow">
                                        <h4 class="font-medium">{item.name}</h4>
                                        <p class="text-sm text-muted-foreground">
                                            {item.color}, Size: {item.size}
                                        </p>
                                        <div class="flex justify-between mt-1">
                                            <span class="text-sm">Qty: {item.quantity}</span>
                                            <span class="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </details>
                {/if}
            </div>
        </div>
    </div>
</div>