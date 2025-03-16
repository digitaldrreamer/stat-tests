<script>
    import { onMount } from 'svelte';
    import {OrderSummary, OrderReview, PaymentMethod, ShippingAddress, CheckoutStepper, CustomerInfo} from '$lib/components/checkout';

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

<div class="container mx-auto px-4 py-6 md:py-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Checkout</h1>

    <div class="mb-6 md:mb-8 lg:mb-16 mx-3 md:mx-4 lg:mx-6">
        <CheckoutStepper {currentStep} {totalSteps}/>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- On mobile, show order summary first on step 4 -->
        <div class="lg:hidden order-first {currentStep === 4 ? 'block' : 'hidden'}">
            <OrderSummary
                    {cartItems}
                    {subtotal}
                    {shipping}
                    {tax}
                    {total}
            />
        </div>

        <!-- Main content area -->
        <div class="lg:col-span-2 order-last lg:order-first">
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

        <!-- Desktop sidebar -->
        <div class="hidden lg:block lg:col-span-1">
            <div class="sticky top-6">
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
</div>