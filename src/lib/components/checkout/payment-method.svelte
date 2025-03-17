<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as Input from '$lib/components/ui/input';
    import * as RadioGroup from '$lib/components/ui/radio-group';
    import * as Button from '$lib/components/ui/button';
    import * as Badge from '$lib/components/ui/badge';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Sheet from '$lib/components/ui/sheet';
    import {
        CreditCard,
        Wallet,
        DollarSign,
        Smartphone,
        Zap,
        ChevronRight,
        Check,
        Plus,
        Shield,
        CheckCircle, ChevronLeft, Info
    } from 'lucide-svelte';
    import {onMount} from "svelte";

    let {
        initialData = {
            method: 'credit-card',
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
            savedCardId: ''
        }, onSubmit, onBack
    } = $props()

    let method = $state(initialData.method);
    let cardNumber = $state(initialData.cardNumber);
    let cardName = $state(initialData.cardName);
    let expiryDate = $state(initialData.expiryDate);
    let cvv = $state(initialData.cvv);
    let savedCardId = $state(initialData.savedCardId || '');
    let errors = $state({});

    // Dialog/Sheet state
    let isSavedCardsOpen = $state(false);
    let isMobile = $state(window.innerWidth < 768);

    // Wallet balance for Haha Wallet
    const walletBalance = 250.75;

    // Sample saved payment methods
    const savedCards = [
        {
            id: 'card1',
            type: 'visa',
            name: 'Visa ending in 4242',
            cardNumber: '•••• •••• •••• 4242',
            cardName: 'John Doe',
            expiryDate: '12/25',
            isDefault: true
        },
        {
            id: 'card2',
            type: 'mastercard',
            name: 'Mastercard ending in 5555',
            cardNumber: '•••• •••• •••• 5555',
            cardName: 'John Doe',
            expiryDate: '09/24',
            isDefault: false
        }
    ];

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

    function getSelectedSavedCard() {
        return savedCards.find(card => card.id === savedCardId);
    }

    function selectSavedCard(card) {
        savedCardId = card.id;
        method = 'credit-card';
        isSavedCardsOpen = false;
    }

    function validate() {
        errors = {};

        if (method === 'credit-card') {
            if (savedCardId) {
                // Using saved card, no validation needed
                return true;
            }

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
            onSubmit({
                method,
                cardNumber,
                cardName,
                expiryDate,
                cvv,
                savedCardId
            });
        }
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

<Card.Root class="border shadow-md rounded-lg overflow-hidden">
    <Card.Header class="px-4 sm:px-6 py-5 border-b bg-gradient-to-r from-slate-50 dark:from-slate-800 to-white dark:to-neutral-900">
        <Card.Title class="text-xl font-semibold">Payment Method</Card.Title>
        <Card.Description class="text-muted-foreground mt-1">
            Choose how you'd like to pay for your order
        </Card.Description>
    </Card.Header>

    <Card.Content class="px-4 sm:px-6 py-6">
        <form onsubmit={handleSubmit} class="space-y-6">
            <!-- Saved Payment Methods -->
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <label class="text-sm font-medium">Your Payment Methods</label>
                    <Button.Root
                            variant="ghost"
                            size="sm"
                            onclick={() => isSavedCardsOpen = true}
                            class="text-xs h-8 hover:bg-slate-100"
                    >
                        Select Saved Card
                        <ChevronRight class="h-4 w-4 ml-1"/>
                    </Button.Root>
                </div>

                {#if savedCardId}
                    {#each getSelectedSavedCard() as card}
                        <div class="border rounded-lg p-4 relative bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div class="flex justify-between pr-6">
                                <div class="flex items-start gap-3">
                                    <div class="mt-0.5 bg-primary/10 p-2 rounded-full">
                                        <CreditCard class="h-5 w-5 text-primary flex-shrink-0"/>
                                    </div>
                                    <div>
                                        <h4 class="font-medium">{card.name}</h4>
                                        <p class="text-sm text-muted-foreground">{card.cardNumber}</p>
                                        <p class="text-sm text-muted-foreground">Expires: {card.expiryDate}</p>
                                    </div>
                                </div>
                                <Button.Root
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 absolute top-3 right-3 hover:bg-slate-200 rounded-full"
                                        onclick={() => isSavedCardsOpen = true}
                                >
                                    <ChevronRight class="h-4 w-4"/>
                                </Button.Root>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <RadioGroup.Root value={method} onValueChange={(value) => method = value} class="w-full">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <!-- Credit Card -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5
                                {method === 'credit-card' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}">
                        <RadioGroup.Item value="credit-card" id="credit-card" class="sr-only"/>
                        <label for="credit-card"
                               class="flex flex-row items-center gap-3 cursor-pointer w-full">
                            <div class="bg-primary/10 p-2 rounded-full">
                                <CreditCard class="h-5 w-5 text-primary flex-shrink-0"/>
                            </div>
                            <span class="font-medium">Credit Card</span>
                        </label>
                    </div>

                    <!-- OPay -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5
                                {method === 'opay' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}">
                        <RadioGroup.Item value="opay" id="opay" class="sr-only"/>
                        <label for="opay"
                               class="flex flex-row items-center gap-3 cursor-pointer w-full">
                            <div class="bg-[#50b64a]/10 p-2 rounded-full">
                                <Smartphone class="h-5 w-5 text-[#50b64a] flex-shrink-0"/>
                            </div>
                            <span class="font-medium">OPay</span>
                        </label>
                    </div>

                    <!-- Haha Wallet -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5
                                {method === 'haha-wallet' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}">
                        <RadioGroup.Item value="haha-wallet" id="haha-wallet" class="sr-only"/>
                        <label for="haha-wallet"
                               class="flex flex-row items-center gap-3 cursor-pointer w-full">
                            <div class="bg-primary/10 p-2 rounded-full">
                                <Wallet class="h-5 w-5 text-primary flex-shrink-0"/>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-medium">Haha Wallet</span>
                                    <Badge.Root variant="outline"
                                                class="bg-green-100 text-green-800 border-green-200 text-[10px] py-0 h-4">
                                        <Zap class="h-3 w-3 mr-1"/>
                                        Fastest
                                    </Badge.Root>
                                </div>
                                <span class="text-xs text-muted-foreground">Balance: ${walletBalance.toFixed(2)}</span>
                            </div>
                        </label>
                    </div>

                    <!-- Bank Transfer -->
                    <div class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5
                                {method === 'bank-transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}">
                        <RadioGroup.Item value="bank-transfer" id="bank-transfer" class="sr-only"/>
                        <label for="bank-transfer"
                               class="flex flex-row items-center gap-3 cursor-pointer w-full">
                            <div class="bg-primary/10 p-2 rounded-full">
                                <DollarSign class="h-5 w-5 text-primary flex-shrink-0"/>
                            </div>
                            <span class="font-medium">Bank Transfer</span>
                        </label>
                    </div>
                </div>
            </RadioGroup.Root>

            {#if method === 'credit-card' && !savedCardId}
                <div class="space-y-5 mt-6 border-t pt-6">
                    <div class="space-y-2">
                        <label for="cardNumber" class="text-sm font-medium flex items-center">
                            Card Number
                            <span class="text-xs text-muted-foreground ml-2">(Required)</span>
                        </label>
                        <div class="relative">
                            <Input.Root
                                    id="cardNumber"
                                    type="text"
                                    value={cardNumber}
                                    on:input={handleCardNumberInput}
                                    placeholder="1234 5678 9012 3456"
                                    class={errors.cardNumber ? 'border-destructive pr-10' : 'pr-10'}
                                    maxlength="19"
                            />
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CreditCard class="h-5 w-5 text-muted-foreground"/>
                            </div>
                        </div>
                        {#if errors.cardNumber}
                            <p class="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                        {/if}
                    </div>

                    <div class="space-y-2">
                        <label for="cardName" class="text-sm font-medium flex items-center">
                            Name on Card
                            <span class="text-xs text-muted-foreground ml-2">(Required)</span>
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
                            <label for="expiryDate" class="text-sm font-medium flex items-center">
                                Expiry Date
                                <span class="text-xs text-muted-foreground ml-2">(Required)</span>
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
                            <label for="cvv" class="text-sm font-medium flex items-center">
                                CVV
                                <span class="text-xs text-muted-foreground ml-2">(Required)</span>
                                <span class="ml-1 group relative">
                                    <span class="cursor-help">
                                        <Info class="h-4 w-4 text-muted-foreground"/>
                                    </span>
                                    <span class="hidden group-hover:block absolute bottom-full mb-2 bg-slate-800 text-white text-xs p-2 rounded w-48">
                                        3-4 digit security code found on the back of your card
                                    </span>
                                </span>
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

                    <div class="flex items-center mt-4">
                        <input type="checkbox" id="saveCard"
                               class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"/>
                        <label for="saveCard" class="ml-2 text-sm text-muted-foreground">
                            Save this card for future payments
                        </label>
                    </div>
                </div>
            {:else if method === 'opay'}
                <div class="p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900 mt-4">
                    <div class="text-center">
                        <p class="text-muted-foreground mb-4">
                            You'll be redirected to OPay to complete your payment.
                        </p>
                        <div class="bg-[#50b64a]/10 p-4 rounded-md flex items-center justify-center mb-4">
                            <div class="flex items-center gap-2">
                                <Smartphone class="h-6 w-6 text-[#50b64a]"/>
                                <span class="text-lg font-bold text-[#50b64a]">OPay</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                            <div class="flex items-center">
                                <Shield class="h-3 w-3 mr-1"/>
                                <span>Secure</span>
                            </div>
                            <div class="flex items-center">
                                <Zap class="h-3 w-3 mr-1"/>
                                <span>Fast</span>
                            </div>
                            <div class="flex items-center">
                                <Check class="h-3 w-3 mr-1"/>
                                <span>Reliable</span>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if method === 'haha-wallet'}
                <div class="p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900 mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <div class="bg-primary/10 p-2 rounded-full">
                                <Wallet class="h-5 w-5 text-primary"/>
                            </div>
                            <span class="font-medium">Haha Wallet</span>
                        </div>
                        <Badge.Root variant="outline" class="bg-green-100 text-green-800 border-green-200">
                            <Zap class="h-3 w-3 mr-1"/>
                            Fastest
                        </Badge.Root>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b">
                            <span class="text-sm text-muted-foreground">Available Balance:</span>
                            <span class="font-medium">${walletBalance.toFixed(2)}</span>
                        </div>

                        <div class="flex justify-between py-2 border-b">
                            <span class="text-sm text-muted-foreground">Order Total:</span>
                            <span class="font-medium">$299.99</span>
                        </div>

                        <div class="flex justify-between py-2 border-b">
                            <span class="text-sm font-medium">Remaining Balance:</span>
                            <span class="font-medium">${(walletBalance - 299.99).toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center bg-green-50 p-3 rounded-md text-green-800 text-sm">
                        <CheckCircle class="h-5 w-5 mr-2 flex-shrink-0"/>
                        <p>Your payment will be processed instantly with Haha Wallet.</p>
                    </div>
                </div>
            {:else if method === 'bank-transfer'}
                <div class="p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900 mt-4">
                    <div class="text-center mb-4">
                        <p class="text-muted-foreground mb-4">
                            You'll receive our bank details to complete your transfer.
                        </p>
                    </div>
                    <div class="bg-white dark:bg-neutral-800 p-4 rounded-md text-left space-y-2 border">
                        <div class="flex items-center">
                            <span class="font-medium w-32">Bank:</span>
                            <span>Fashion Bank</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium w-32">Account Name:</span>
                            <span>Fashion Store Inc.</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium w-32">Account Number:</span>
                            <span>XXXX-XXXX-XXXX-XXXX</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium w-32">Reference:</span>
                            <span>Your order number will be provided</span>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
                        <Info class="h-5 w-5 mr-2 flex-shrink-0"/>
                        <p>Please include your order reference when making the transfer.</p>
                    </div>
                </div>
            {/if}

            <div class="mt-6 pt-4 border-t">
                <div class="flex items-center mb-4">
                    <Shield class="h-5 w-5 text-green-600 mr-2"/>
                    <span class="text-sm">All payments are secure and encrypted</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <img src="https://www.svgrepo.com/download/508730/visa-classic.svg" alt="Visa" class="h-6"/>
                    <img src="https://www.svgrepo.com/download/508701/mastercard-full.svg" alt="Mastercard" class="h-6"/>
                    <img src="https://www.svgrepo.com/download/362029/verve.svg" alt="Verve" class="h-6"/>
                    <img src="https://goremote.sirv.com/GoRemote%20Media/opay.png" alt="OPay" class="h-6"/>
                </div>
            </div>
        </form>
    </Card.Content>

    <Card.Footer class="px-4 sm:px-6 py-5 border-t bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button.Root variant="outline" onclick={onBack}
                     class="order-2 sm:order-1 w-full sm:w-auto bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-slate-900">
            <ChevronLeft class="h-4 w-4 mr-2"/>
            Back to Shipping
        </Button.Root>

        <Button.Root onclick={handleSubmit} class="order-1 sm:order-2 w-full sm:w-auto">
            <span>Continue to Review</span>
            <ChevronRight class="h-4 w-4 ml-2"/>
        </Button.Root>
    </Card.Footer>
</Card.Root>

<!-- Saved Cards Dialog/Sheet -->
{#if isMobile}
    <Sheet.Root open={isSavedCardsOpen} onOpenChange={(open) => isSavedCardsOpen = open}>
        <Sheet.Content side="bottom" class="h-[70vh]">
            <Sheet.Header>
                <Sheet.Title>Saved Payment Methods</Sheet.Title>
                <Sheet.Description>Select from your saved cards</Sheet.Description>
            </Sheet.Header>

            <div class="py-4 space-y-3 overflow-y-auto px-1">
                {#each savedCards as card}
                    <div
                            class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-all {card.id === savedCardId ? 'border-primary bg-primary/5' : 'bg-slate-50 dark:bg-slate-700'}"
                            onclick={() => selectSavedCard(card)}
                    >
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5 bg-primary/10 p-2 rounded-full">
                                <CreditCard class="h-5 w-5 text-primary flex-shrink-0"/>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{card.name}</h4>
                                    {#if card.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm text-muted-foreground">{card.cardNumber}</p>
                                <p class="text-sm text-muted-foreground">Expires: {card.expiryDate}</p>
                            </div>
                            {#if card.id === savedCardId}
                                <Check class="h-5 w-5 text-primary flex-shrink-0"/>
                            {/if}
                        </div>
                    </div>
                {/each}

                <Button.Root
                        variant="outline"
                        class="w-full flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-slate-800 mt-2"
                        onclick={() => {
                        savedCardId = '';
                        isSavedCardsOpen = false;
                    }}
                >
                    <Plus class="h-4 w-4"/>
                    Use a new card
                </Button.Root>
            </div>

            <Sheet.Footer>
                <Button.Root variant="outline" onclick={() => isSavedCardsOpen = false}
                             class="w-full bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Cancel
                </Button.Root>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <Dialog.Root open={isSavedCardsOpen} onOpenChange={(open) => isSavedCardsOpen = open}>
        <Dialog.Content class="sm:max-w-[500px]">
            <Dialog.Header>
                <Dialog.Title>Saved Payment Methods</Dialog.Title>
                <Dialog.Description>Select from your saved cards</Dialog.Description>
            </Dialog.Header>

            <div class="py-4 space-y-3 max-h-[60vh] overflow-y-auto px-1">
                {#each savedCards as card}
                    <div
                            class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-all {card.id === savedCardId ? 'border-primary bg-primary/5' : 'bg-slate-50 bg-slate-700'}"
                            onclick={() => selectSavedCard(card)}
                    >
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5 bg-primary/10 p-2 rounded-full">
                                <CreditCard class="h-5 w-5 text-primary flex-shrink-0"/>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center">
                                    <h4 class="font-medium">{card.name}</h4>
                                    {#if card.isDefault}
                                        <Badge.Root variant="outline" class="ml-2 text-[10px] py-0 h-4">
                                            Default
                                        </Badge.Root>
                                    {/if}
                                </div>
                                <p class="text-sm text-muted-foreground">{card.cardNumber}</p>
                                <p class="text-sm text-muted-foreground">Expires: {card.expiryDate}</p>
                            </div>
                            {#if card.id === savedCardId}
                                <Check class="h-5 w-5 text-primary flex-shrink-0"/>
                            {/if}
                        </div>
                    </div>
                {/each}

                <Button.Root
                        variant="outline"
                        class="w-full flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-slate-800 mt-2"
                        onclick={() => {
                        savedCardId = '';
                        isSavedCardsOpen = false;
                    }}
                >
                    <Plus class="h-4 w-4"/>
                    Use a new card
                </Button.Root>
            </div>

            <Dialog.Footer class="flex justify-end">
                <Button.Root variant="outline" onclick={() => isSavedCardsOpen = false}
                             class="bg-white bg-neutral-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Cancel
                </Button.Root>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}