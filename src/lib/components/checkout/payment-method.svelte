<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as RadioGroup from '$lib/components/ui/radio-group';
    import * as Button from '$lib/components/ui/button';
    import {Badge} from '$lib/components/ui/badge';
    import { CreditCard, Wallet, DollarSign, Smartphone, Zap } from 'lucide-svelte';

    let { initialData = {
        method: 'credit-card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    }, onSubmit, onBack } = $props()

    let method = $state(initialData.method);
    let cardNumber = $state(initialData.cardNumber);
    let cardName = $state(initialData.cardName);
    let expiryDate = $state(initialData.expiryDate);
    let cvv = $state(initialData.cvv);
    let errors = $state({});

    // Wallet balance for Haha Wallet
    const walletBalance = 250.75;

    function formatCardNumber(value) {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Add a space after every 4 digits
        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += digits[i];
        }

        return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
    }

    function formatExpiryDate(value) {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Format as MM/YY
        if (digits.length > 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4);
        } else {
            return digits;
        }
    }

    function handleCardNumberInput(event) {
        cardNumber = formatCardNumber(event.target.value);
    }

    function handleExpiryInput(event) {
        expiryDate = formatExpiryDate(event.target.value);
    }

    function validate() {
        errors = {};

        if (method === 'credit-card') {
            if (!cardNumber) {
                errors.cardNumber = 'Card number is required';
            } else if (cardNumber.replace(/\s/g, '').length < 16) {
                errors.cardNumber = 'Please enter a valid card number';
            }

            if (!cardName) {
                errors.cardName = 'Name on card is required';
            }

            if (!expiryDate) {
                errors.expiryDate = 'Expiry date is required';
            } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
            }

            if (!cvv) {
                errors.cvv = 'CVV is required';
            } else if (!/^\d{3,4}$/.test(cvv)) {
                errors.cvv = 'Please enter a valid CVV';
            }
        }

        return Object.keys(errors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            onSubmit({method, cardNumber, cardName, expiryDate, cvv});
        }
    }
</script>

<Card.Root class="border-none sm:border shadow-none sm:shadow">
    <Card.Header class="px-0 sm:px-6">
        <Card.Title class="text-xl mx-4">Payment Method</Card.Title>
        <Card.Description class="mx-4">
            Choose how you'd like to pay
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-0 sm:px-6">
        <form onsubmit={handleSubmit} class="space-y-6 mx-4">
            <RadioGroup.Root value={method} onValueChange={(value) => method = value}>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <!-- Credit Card -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary
                                {method === 'credit-card' ? 'border-primary bg-primary/5' : ''}">
                        <RadioGroup.Item value="credit-card" id="credit-card" class="sr-only"/>
                        <label for="credit-card"
                               class="flex flex-row items-center gap-3 cursor-pointer">
                            <CreditCard class="h-5 w-5 flex-shrink-0"/>
                            <span class="font-medium">Credit Card</span>
                        </label>
                    </div>

                    <!-- OPay -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary
                                {method === 'opay' ? 'border-primary bg-primary/5' : ''}">
                        <RadioGroup.Item value="opay" id="opay" class="sr-only"/>
                        <label for="opay"
                               class="flex flex-row items-center gap-3 cursor-pointer">
                            <Smartphone class="h-5 w-5 flex-shrink-0"/>
                            <span class="font-medium">OPay</span>
                        </label>
                    </div>

                    <!-- Haha Wallet -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary
                                {method === 'haha-wallet' ? 'border-primary bg-primary/5' : ''}">
                        <RadioGroup.Item value="haha-wallet" id="haha-wallet" class="sr-only"/>
                        <label for="haha-wallet"
                               class="flex flex-row items-center gap-3 cursor-pointer">
                            <Wallet class="h-5 w-5 flex-shrink-0"/>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">Haha Wallet</span>
                                    <Badge variant="outline" class="bg-green-100 text-green-800 border-green-200 text-[10px] py-0 h-4">
                                        <Zap class="h-3 w-3 mr-1" />
                                        Fastest
                                    </Badge>
                                </div>
                                <span class="text-xs text-muted-foreground">Balance: ${walletBalance.toFixed(2)}</span>
                            </div>
                        </label>
                    </div>

                    <!-- Bank Transfer -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary
                                {method === 'bank-transfer' ? 'border-primary bg-primary/5' : ''}">
                        <RadioGroup.Item value="bank-transfer" id="bank-transfer" class="sr-only"/>
                        <label for="bank-transfer"
                               class="flex flex-row items-center gap-3 cursor-pointer">
                            <DollarSign class="h-5 w-5 flex-shrink-0"/>
                            <span class="font-medium">Bank Transfer</span>
                        </label>
                    </div>
                </div>
            </RadioGroup.Root>

            {#if method === 'credit-card'}
                <div class="space-y-5 mt-6">
                    <div class="space-y-2">
                        <label for="cardNumber" class="text-sm font-medium">
                            Card Number
                        </label>
                        <Input.Root
                                id="cardNumber"
                                type="text"
                                value={cardNumber}
                                on:input={handleCardNumberInput}
                                placeholder="1234 5678 9012 3456"
                                class={errors.cardNumber ? 'border-destructive' : ''}
                                maxlength="19"
                        />
                        {#if errors.cardNumber}
                            <p class="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                        {/if}
                    </div>

                    <div class="space-y-2">
                        <label for="cardName" class="text-sm font-medium">
                            Name on Card
                        </label>
                        <Input.Root
                                id="cardName"
                                type="text"
                                bind:value={cardName}
                                placeholder="John Doe"
                                class={errors.cardName ? 'border-destructive' : ''}
                        />
                        {#if errors.cardName}
                            <p class="text-xs text-destructive mt-1">{errors.cardName}</p>
                        {/if}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label for="expiryDate" class="text-sm font-medium">
                                Expiry Date
                            </label>
                            <Input.Root
                                    id="expiryDate"
                                    type="text"
                                    value={expiryDate}
                                    on:input={handleExpiryInput}
                                    placeholder="MM/YY"
                                    class={errors.expiryDate ? 'border-destructive' : ''}
                                    maxlength="5"
                            />
                            {#if errors.expiryDate}
                                <p class="text-xs text-destructive mt-1">{errors.expiryDate}</p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <label for="cvv" class="text-sm font-medium">
                                CVV
                            </label>
                            <Input.Root
                                    id="cvv"
                                    type="text"
                                    bind:value={cvv}
                                    placeholder="123"
                                    class={errors.cvv ? 'border-destructive' : ''}
                                    maxlength="4"
                            />
                            {#if errors.cvv}
                                <p class="text-xs text-destructive mt-1">{errors.cvv}</p>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else if method === 'opay'}
                <div class="p-4 sm:p-6 text-center mt-4">
                    <p class="text-muted-foreground mb-4">
                        You'll be redirected to OPay to complete your payment.
                    </p>
                    <div class="bg-[#50b64a]/10 p-4 rounded-md flex items-center justify-center">
                        <div class="flex items-center gap-2">
                            <Smartphone class="h-6 w-6 text-[#50b64a]" />
                            <span class="text-lg font-bold text-[#50b64a]">OPay</span>
                        </div>
                    </div>
                    <p class="text-sm text-muted-foreground mt-4">
                        Secure and fast mobile payments
                    </p>
                </div>
            {:else if method === 'haha-wallet'}
                <div class="p-4 sm:p-6 mt-4">
                    <div class="bg-muted p-4 rounded-md">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-2">
                                <Wallet class="h-5 w-5 text-primary" />
                                <span class="font-medium">Haha Wallet</span>
                            </div>
                            <Badge variant="outline" class="bg-green-100 text-green-800 border-green-200">
                                <Zap class="h-3 w-3 sm:mr-1" />
                                <span class="sm:inline hidden">Fastest</span>
                            </Badge>
                        </div>

                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-sm text-muted-foreground">Available Balance:</span>
                                <span class="font-medium">${walletBalance.toFixed(2)}</span>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-sm text-muted-foreground">Order Total:</span>
                                <span class="font-medium">$299.99</span>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-sm text-muted-foreground">Remaining Balance:</span>
                                <span class="font-medium">${(walletBalance - 299.99).toFixed(2)}</span>
                            </div>
                        </div>

                        <p class="text-xs text-muted-foreground mt-4">
                            Your payment will be processed instantly with Haha Wallet.
                        </p>
                    </div>
                </div>
            {:else if method === 'bank-transfer'}
                <div class="p-4 sm:p-6 text-center mt-4">
                    <p class="text-muted-foreground mb-4">
                        You'll receive our bank details to complete your transfer.
                    </p>
                    <div class="bg-muted p-4 rounded-md text-left">
                        <p class="text-sm"><span class="font-medium">Bank:</span> Fashion Bank</p>
                        <p class="text-sm"><span class="font-medium">Account Name:</span> Fashion Store Inc.</p>
                        <p class="text-sm"><span class="font-medium">Account Number:</span> XXXX-XXXX-XXXX-XXXX</p>
                        <p class="text-sm"><span class="font-medium">Reference:</span> Your order number will be
                            provided</p>
                    </div>
                </div>
            {/if}
        </form>
    </Card.Content>

    <Card.Footer class="mx-4 px-0 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack} class="order-2 sm:order-1 w-full sm:w-auto">
            Back
        </Button.Root>

        <Button.Root onclick={handleSubmit} class="order-1 sm:order-2 w-full sm:w-auto">
            Continue to Review
        </Button.Root>
    </Card.Footer>
</Card.Root>