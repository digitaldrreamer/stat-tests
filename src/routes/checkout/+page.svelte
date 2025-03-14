<script>
    import { onMount } from 'svelte';
    import CheckoutStepper from '$lib/components/checkout/CheckoutStepper.svelte';
    import CustomerInfo from '$lib/components/checkout/CustomerInfo.svelte';
    import ShippingAddress from '$lib/components/checkout/ShippingAddress.svelte';
    import PaymentMethod from '$lib/components/checkout/PaymentMethod.svelte';
    import OrderReview from '$lib/components/checkout/OrderReview.svelte';
    import OrderSummary from '$lib/components/checkout/OrderSummary.svelte';

    // Checkout state
    let currentStep = $state(1);
    let totalSteps = 4;
    let cartItems = $state([]);
    let customerData = $state({
        email: '',
        phone: ''
    });
    let shippingData = $state({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    let paymentData = $state({
        method: 'credit-card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    onMount(async () => {
        // Fetch cart items
        setTimeout(() => {
            cartItems = [
                {
                    id: 1,
                    title: "Premium Leather Crossbody Bag",
                    price: 199.99,
                    quantity: 1,
                    image: "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/thumbnail.png",
                    category: "Accessories",
                    subcategory: "Bags",
                    color: "Brown",
                    size: "Medium"
                },
                {
                    id: 2,
                    title: "Olay Ultra Moisture Shea Butter Body Wash",
                    price: 49.99,
                    quantity: 2,
                    image: "https://cdn.dummyjson.com/products/images/skin-care/Olay%20Ultra%20Moisture%20Shea%20Butter%20Body%20Wash/thumbnail.png",
                    category: "Creams and Lotions",
                    subcategory: "Body Care",
                    color: "Brown",
                    size: "500ml"
                }
            ];
        }, 500);
    });

    function handleNextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
        } else {
            // Submit order
            handlePlaceOrder();
        }
    }

    function handlePrevStep() {
        if (currentStep > 1) {
            currentStep--;
        }
    }

    function handleCustomerInfoSubmit(data) {
        customerData = data;
        handleNextStep();
    }

    function handleShippingSubmit(data) {
        shippingData = data;
        handleNextStep();
    }

    function handlePaymentSubmit(data) {
        paymentData = data;
        handleNextStep();
    }

    async function handlePlaceOrder() {
        // Simulate order placement
        window.location.href = '/order-confirmation?id=ORD' + Math.floor(Math.random() * 1000000);
    }

    const subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    const shipping = $derived(subtotal > 100 ? 0 : 10);
    const tax = $derived(subtotal * 0.1); // 10% tax
    const total = $derived(subtotal + shipping + tax);
</script>

<svelte:head>
    <title>Checkout | Fashion Store</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="mb-8">
        <CheckoutStepper {currentStep} {totalSteps} />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
            {#if currentStep === 1}
                <CustomerInfo
                        initialData={customerData}
                        onSubmit={handleCustomerInfoSubmit}
                />
            {:else if currentStep === 2}
                <ShippingAddress
                        initialData={shippingData}
                        onSubmit={handleShippingSubmit}
                        onBack={handlePrevStep}
                />
            {:else if currentStep === 3}
                <PaymentMethod
                        initialData={paymentData}
                        onSubmit={handlePaymentSubmit}
                        onBack={handlePrevStep}
                />
            {:else if currentStep === 4}
                <OrderReview
                        {customerData}
                        {shippingData}
                        {paymentData}
                        {cartItems}
                        onBack={handlePrevStep}
                        onPlaceOrder={handlePlaceOrder}
                />
            {/if}
        </div>

        <div class="lg:col-span-1">
            <OrderSummary
                    {cartItems}
                    {subtotal}
                    {shipping}
                    {tax}
                    {total}
            />
        </div>
    </div>
</div>