<script>
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import {Input} from '$lib/components/ui/input';
    import {Button} from '$lib/components/ui/button';
    import {Badge} from '$lib/components/ui/badge';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import {
        CreditCard,
        Trash2,
        PencilLine,
        Plus,
        Star,
        StarOff,
        Check,
        X,
        ChevronRight
    } from 'lucide-svelte';
    import { onMount } from "svelte";

    // Props
    let { open = $bindable(false) } = $props();

    // State variables
    let isMobile = $state(false);
    let isDeleteDialogOpen = $state(false);
    let currentMode = $state('view'); // view, add, edit
    let selectedCardId = $state(null);
    let selectedCardForDelete = $state(null);
    let activeTab = $state('cards');

    // Form data
    let formData = $state({
        id: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        cardType: 'visa',
        isDefault: false
    });

    // Form errors
    let errors = $state({});

    // Sample payment methods
    let paymentMethods = $state([
        {
            id: 'card1',
            type: 'visa',
            cardNumber: '4242 4242 4242 4242',
            maskedNumber: '•••• •••• •••• 4242',
            cardName: 'John Doe',
            expiryDate: '12/25',
            isDefault: true
        },
        {
            id: 'card2',
            type: 'mastercard',
            cardNumber: '5555 5555 5555 4444',
            maskedNumber: '•••• •••• •••• 4444',
            cardName: 'John Doe',
            expiryDate: '09/24',
            isDefault: false
        }
    ]);

    // Helper functions
    function formatCardNumber(value) {
        const digits = value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += digits[i];
        }
        return formatted.substring(0, 19);
    }

    function formatExpiryDate(value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length > 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4);
        } else {
            return digits;
        }
    }

    function handleCardNumberInput(event) {
        formData.cardNumber = formatCardNumber(event.target.value);
    }

    function handleExpiryInput(event) {
        formData.expiryDate = formatExpiryDate(event.target.value);
    }

    function detectCardType(number) {
        const firstDigit = number.replace(/\D/g, '').charAt(0);
        if (firstDigit === '4') return 'visa';
        if (firstDigit === '5') return 'mastercard';
        if (firstDigit === '3') return 'amex';
        return 'other';
    }

    function resetForm() {
        formData = {
            id: '',
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
            cardType: 'visa',
            isDefault: false
        };
        errors = {};
    }

    function openAddMode() {
        resetForm();
        currentMode = 'add';
    }

    function openEditMode(card) {
        formData = {
            id: card.id,
            cardNumber: card.cardNumber,
            cardName: card.cardName,
            expiryDate: card.expiryDate,
            cvv: '',
            cardType: card.type,
            isDefault: card.isDefault
        };
        selectedCardId = card.id;
        currentMode = 'edit';
    }

    function confirmDelete(card) {
        selectedCardForDelete = card;
        isDeleteDialogOpen = true;
    }

    function deleteCard() {
        if (selectedCardForDelete) {
            paymentMethods = paymentMethods.filter(card => card.id !== selectedCardForDelete.id);

            // If we deleted the default card, make another one default if available
            if (selectedCardForDelete.isDefault && paymentMethods.length > 0) {
                paymentMethods[0].isDefault = true;
            }

            isDeleteDialogOpen = false;
            selectedCardForDelete = null;
        }
    }

    function setAsDefault(cardId) {
        paymentMethods = paymentMethods.map(card => ({
            ...card,
            isDefault: card.id === cardId
        }));
    }

    function validate() {
        errors = {};

        if (!formData.cardNumber) {
            errors.cardNumber = 'Card number is required';
        } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
            errors.cardNumber = 'Please enter a valid card number';
        }

        if (!formData.cardName) {
            errors.cardName = 'Name on card is required';
        }

        if (!formData.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }

        if (currentMode === 'add' && !formData.cvv) {
            errors.cvv = 'CVV is required';
        } else if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
            errors.cvv = 'Please enter a valid CVV';
        }

        return Object.keys(errors).length === 0;
    }

    function saveCard() {
        if (!validate()) return;

        // Auto-detect card type based on number
        const cardType = detectCardType(formData.cardNumber);

        // Create masked number
        const digits = formData.cardNumber.replace(/\s/g, '');
        const lastFour = digits.slice(-4);
        const maskedNumber = '•••• •••• •••• ' + lastFour;

        if (currentMode === 'add') {
            // Handle default card logic
            if (formData.isDefault) {
                paymentMethods = paymentMethods.map(card => ({
                    ...card,
                    isDefault: false
                }));
            } else if (paymentMethods.length === 0) {
                // If this is the first card, make it default
                formData.isDefault = true;
            }

            const newCard = {
                id: 'card' + (paymentMethods.length + 1),
                type: cardType,
                cardNumber: formData.cardNumber,
                maskedNumber: maskedNumber,
                cardName: formData.cardName,
                expiryDate: formData.expiryDate,
                isDefault: formData.isDefault
            };

            paymentMethods = [...paymentMethods, newCard];
        } else if (currentMode === 'edit') {
            // Handle default card logic for edit
            if (formData.isDefault) {
                paymentMethods = paymentMethods.map(card => ({
                    ...card,
                    isDefault: card.id === selectedCardId
                }));
            } else {
                // Ensure we don't remove default from the only default card
                const currentCard = paymentMethods.find(card => card.id === selectedCardId);
                if (currentCard.isDefault && !paymentMethods.some(c => c.id !== selectedCardId && c.isDefault)) {
                    formData.isDefault = true;
                }
            }

            paymentMethods = paymentMethods.map(card => {
                if (card.id === selectedCardId) {
                    return {
                        ...card,
                        type: cardType,
                        cardNumber: formData.cardNumber,
                        maskedNumber: maskedNumber,
                        cardName: formData.cardName,
                        expiryDate: formData.expiryDate,
                        isDefault: formData.isDefault
                    };
                }
                return card;
            });
        }

        // Return to view mode
        currentMode = 'view';
        resetForm();
    }

    function cancelEdit() {
        currentMode = 'view';
        resetForm();
    }

    // Check if the device is mobile
    function checkIfMobile() {
        isMobile = window.innerWidth < 768;
    }

    onMount(() => {
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    });
</script>

<Button variant="outline" onclick={() => (open = !open)} size="sm" class="w-full justify-start">
    <CreditCard class="h-4 w-4 mr-2" />
    <span>Payment Methods</span>
</Button>
<!-- Mobile Sheet Component -->
{#if isMobile}
    <Sheet.Root bind:open={open}>
        <Sheet.Content side="bottom" class="w-full p-0 max-h-[80vh]">
            <Sheet.Header class="p-4 border-b">
                <Sheet.Title>Payment Methods</Sheet.Title>
                <Sheet.Description>Add, edit, or remove your payment methods</Sheet.Description>
            </Sheet.Header>

            <div class="flex-1 overflow-auto p-4">
                {#if currentMode === 'view'}
                    <!-- Custom Tabs Implementation -->
                    <div>
                        <div class="grid grid-cols-2 border-b">
                            <button
                                    class="py-2 text-center transition-colors relative {activeTab === 'cards' ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}"
                                    on:click={() => activeTab = 'cards'}
                            >
                                Cards
                                {#if activeTab === 'cards'}
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                {/if}
                            </button>
                            <button
                                    class="py-2 text-center transition-colors relative {activeTab === 'bank' ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}"
                                    on:click={() => activeTab = 'bank'}
                            >
                                Bank Accounts
                                {#if activeTab === 'bank'}
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                {/if}
                            </button>
                        </div>

                        <!-- Tab Contents -->
                        <div class="pt-4">
                            {#if activeTab === 'cards'}
                                <div class="space-y-4">
                                    {#if paymentMethods.length === 0}
                                        <div class="text-center py-6 text-neutral-500">
                                            <CreditCard class="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No payment cards added yet</p>
                                        </div>
                                    {:else}
                                        {#each paymentMethods as card}
                                            <Card.Root class="overflow-hidden">
                                                <Card.Content class="p-4">
                                                    <div class="flex items-start">
                                                        <div class="flex-1">
                                                            <div class="flex items-center gap-2">
                                                                {#if card.type === 'visa'}
                                                                    <div class="text-blue-600 font-semibold">VISA</div>
                                                                {:else if card.type === 'mastercard'}
                                                                    <div class="text-red-600 font-semibold">MASTERCARD</div>
                                                                {:else if card.type === 'amex'}
                                                                    <div class="text-blue-800 font-semibold">AMEX</div>
                                                                {:else}
                                                                    <div class="text-neutral-600 font-semibold">CARD</div>
                                                                {/if}

                                                                {#if card.isDefault}
                                                                    <Badge variant="outline" class="bg-neutral-100 text-neutral-800 border-neutral-200 text-xs">
                                                                        Default
                                                                    </Badge>
                                                                {/if}
                                                            </div>
                                                            <div class="mt-1 text-lg font-mono">{card.maskedNumber}</div>
                                                            <div class="text-sm text-neutral-500 mt-1">
                                                                <span>{card.cardName}</span>
                                                                <span class="mx-2">•</span>
                                                                <span>Exp: {card.expiryDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex justify-between mt-4 pt-3 border-t border-neutral-200">
                                                        <Button variant="ghost" size="sm" class="h-8"
                                                                onclick={() => confirmDelete(card)}>
                                                            <Trash2 class="h-4 w-4 mr-2 text-neutral-500" />
                                                            Delete
                                                        </Button>
                                                        <div class="flex gap-2">
                                                            {#if !card.isDefault}
                                                                <Button variant="ghost" size="sm" class="h-8"
                                                                        onclick={() => setAsDefault(card.id)}>
                                                                    <Star class="h-4 w-4 mr-2 text-neutral-500" />
                                                                    Set Default
                                                                </Button>
                                                            {/if}
                                                            <Button variant="ghost" size="sm" class="h-8"
                                                                    onclick={() => openEditMode(card)}>
                                                                <PencilLine class="h-4 w-4 mr-2 text-neutral-500" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card.Content>
                                            </Card.Root>
                                        {/each}
                                    {/if}

                                    <Button variant="outline" class="w-full mt-4" onclick={openAddMode}>
                                        <Plus class="h-4 w-4 mr-2" />
                                        Add New Card
                                    </Button>
                                </div>
                            {:else if activeTab === 'bank'}
                                <div class="text-center py-12 text-neutral-500">
                                    <div class="mb-3 opacity-30">🏦</div>
                                    <p>Bank account management coming soon</p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <!-- Add/Edit Card Form -->
                    <form class="space-y-4">
                        <h3 class="text-lg font-medium">
                            {currentMode === 'add' ? 'Add New Card' : 'Edit Card'}
                        </h3>

                        <div class="space-y-3">
                            <div class="space-y-2">
                                <label for="cardNumber" class="text-sm font-medium">
                                    Card Number
                                </label>
                                <div class="relative">
                                    <Input
                                            id="cardNumber"
                                            type="text"
                                            value={formData.cardNumber}
                                            oninput={handleCardNumberInput}
                                            placeholder="1234 5678 9012 3456"
                                            class={errors.cardNumber ? 'border-destructive' : ''}
                                    />
                                    {#if errors.cardNumber}
                                        <p class="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label for="cardName" class="text-sm font-medium">
                                    Name on Card
                                </label>
                                <Input
                                        id="cardName"
                                        type="text"
                                        bind:value={formData.cardName}
                                        placeholder="John Doe"
                                        class={errors.cardName ? 'border-destructive' : ''}
                                />
                                {#if errors.cardName}
                                    <p class="text-xs text-destructive mt-1">{errors.cardName}</p>
                                {/if}
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-2">
                                    <label for="expiryDate" class="text-sm font-medium">
                                        Expiry Date
                                    </label>
                                    <Input
                                            id="expiryDate"
                                            type="text"
                                            value={formData.expiryDate}
                                            oninput={handleExpiryInput}
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
                                    <Input
                                            id="cvv"
                                            type="text"
                                            bind:value={formData.cvv}
                                            placeholder="123"
                                            class={errors.cvv ? 'border-destructive' : ''}
                                            maxlength="4"
                                    />
                                    {#if errors.cvv}
                                        <p class="text-xs text-destructive mt-1">{errors.cvv}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="flex items-center pt-2">
                                <input type="checkbox" id="defaultCard"
                                       bind:checked={formData.isDefault}
                                       class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"/>
                                <label for="defaultCard" class="ml-2 text-sm">
                                    Set as default payment method
                                </label>
                            </div>
                        </div>
                    </form>
                {/if}
            </div>

            <Sheet.Footer class="p-4 border-t">
                {#if currentMode === 'view'}
                    <Button onclick={() => open = false} variant="outline" class="w-full">
                        Close
                    </Button>
                {:else}
                    <div class="flex gap-3">
                        <Button onclick={cancelEdit} variant="outline" class="flex-1">
                            <X class="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onclick={saveCard} class="flex-1">
                            <Check class="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                {/if}
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <!-- Desktop Dialog Component -->
    <Dialog.Root bind:open={open}>
        <Dialog.Content class="sm:max-w-[600px] overflow-y-auto max-h-[80vh]">
            <Dialog.Header>
                <Dialog.Title>Payment Methods</Dialog.Title>
                <Dialog.Description>Add, edit, or remove your payment methods</Dialog.Description>
            </Dialog.Header>

            <div class="py-4">
                {#if currentMode === 'view'}
                    <!-- Custom Tabs Implementation for Desktop -->
                    <div>
                        <div class="grid grid-cols-2 w-[400px] border-b">
                            <button
                                    class="py-2 text-center transition-colors relative {activeTab === 'cards' ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}"
                                    on:click={() => activeTab = 'cards'}
                            >
                                Cards
                                {#if activeTab === 'cards'}
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                {/if}
                            </button>
                            <button
                                    class="py-2 text-center transition-colors relative {activeTab === 'bank' ? 'text-primary font-medium' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}"
                                    on:click={() => activeTab = 'bank'}
                            >
                                Bank Accounts
                                {#if activeTab === 'bank'}
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                {/if}
                            </button>
                        </div>

                        <!-- Tab Contents -->
                        <div class="pt-4">
                            {#if activeTab === 'cards'}
                                <div class="space-y-4">
                                    {#if paymentMethods.length === 0}
                                        <div class="text-center py-10 text-neutral-500">
                                            <CreditCard class="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>No payment cards added yet</p>
                                        </div>
                                    {:else}
                                        {#each paymentMethods as card}
                                            <Card.Root class="overflow-hidden">
                                                <Card.Content class="p-4">
                                                    <div class="flex items-start">
                                                        <div class="flex-1">
                                                            <div class="flex items-center gap-2">
                                                                {#if card.type === 'visa'}
                                                                    <div class="text-blue-600 font-semibold">VISA</div>
                                                                {:else if card.type === 'mastercard'}
                                                                    <div class="text-red-600 font-semibold">MASTERCARD</div>
                                                                {:else if card.type === 'amex'}
                                                                    <div class="text-blue-800 font-semibold">AMEX</div>
                                                                {:else}
                                                                    <div class="text-neutral-600 font-semibold">CARD</div>
                                                                {/if}

                                                                {#if card.isDefault}
                                                                    <Badge variant="outline" class="bg-neutral-100 text-neutral-800 border-neutral-200 text-xs">
                                                                        Default
                                                                    </Badge>
                                                                {/if}
                                                            </div>
                                                            <div class="mt-1 text-lg font-mono">{card.maskedNumber}</div>
                                                            <div class="text-sm text-neutral-500 mt-1">
                                                                <span>{card.cardName}</span>
                                                                <span class="mx-2">•</span>
                                                                <span>Exp: {card.expiryDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex justify-between mt-4 pt-3 border-t border-neutral-200">
                                                        <Button variant="ghost" size="sm" class="h-8"
                                                                onclick={() => confirmDelete(card)}>
                                                            <Trash2 class="h-4 w-4 mr-2 text-neutral-500" />
                                                            Delete
                                                        </Button>
                                                        <div class="flex gap-2">
                                                            {#if !card.isDefault}
                                                                <Button variant="ghost" size="sm" class="h-8"
                                                                        onclick={() => setAsDefault(card.id)}>
                                                                    <Star class="h-4 w-4 mr-2 text-neutral-500" />
                                                                    Set Default
                                                                </Button>
                                                            {/if}
                                                            <Button variant="ghost" size="sm" class="h-8"
                                                                    onclick={() => openEditMode(card)}>
                                                                <PencilLine class="h-4 w-4 mr-2 text-neutral-500" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card.Content>
                                            </Card.Root>
                                        {/each}
                                    {/if}

                                    <Button variant="outline" class="w-full mt-4" onclick={openAddMode}>
                                        <Plus class="h-4 w-4 mr-2" />
                                        Add New Card
                                    </Button>
                                </div>
                            {:else if activeTab === 'bank'}
                                <div class="text-center py-12 text-neutral-500">
                                    <div class="mb-3 opacity-30">🏦</div>
                                    <p>Bank account management coming soon</p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <!-- Add/Edit Card Form -->
                    <form class="space-y-4">
                        <h3 class="text-lg font-medium">
                            {currentMode === 'add' ? 'Add New Card' : 'Edit Card'}
                        </h3>

                        <div class="space-y-3">
                            <div class="space-y-2">
                                <label for="cardNumber" class="text-sm font-medium">
                                    Card Number
                                </label>
                                <div class="relative">
                                    <Input
                                            id="cardNumber"
                                            type="text"
                                            value={formData.cardNumber}
                                            oninput={handleCardNumberInput}
                                            placeholder="1234 5678 9012 3456"
                                            class={errors.cardNumber ? 'border-destructive' : ''}
                                    />
                                    {#if errors.cardNumber}
                                        <p class="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label for="cardName" class="text-sm font-medium">
                                    Name on Card
                                </label>
                                <Input
                                        id="cardName"
                                        type="text"
                                        bind:value={formData.cardName}
                                        placeholder="John Doe"
                                        class={errors.cardName ? 'border-destructive' : ''}
                                />
                                {#if errors.cardName}
                                    <p class="text-xs text-destructive mt-1">{errors.cardName}</p>
                                {/if}
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-2">
                                    <label for="expiryDate" class="text-sm font-medium">
                                        Expiry Date
                                    </label>
                                    <Input
                                            id="expiryDate"
                                            type="text"
                                            value={formData.expiryDate}
                                            oninput={handleExpiryInput}
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
                                    <Input
                                            id="cvv"
                                            type="text"
                                            bind:value={formData.cvv}
                                            placeholder="123"
                                            class={errors.cvv ? 'border-destructive' : ''}
                                            maxlength="4"
                                    />
                                    {#if errors.cvv}
                                        <p class="text-xs text-destructive mt-1">{errors.cvv}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="flex items-center pt-2">
                                <input type="checkbox" id="defaultCard"
                                       bind:checked={formData.isDefault}
                                       class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"/>
                                <label for="defaultCard" class="ml-2 text-sm">
                                    Set as default payment method
                                </label>
                            </div>
                        </div>
                    </form>
                {/if}
            </div>

            <Dialog.Footer class="flex justify-end">
                {#if currentMode === 'view'}
                    <Button onclick={() => open = false}>
                        Close
                    </Button>
                {:else}
                    <div class="flex gap-3">
                        <Button onclick={cancelEdit} variant="outline">
                            <X class="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onclick={saveCard}>
                            <Check class="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                {/if}
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root open={isDeleteDialogOpen} onOpenChange={(open) => isDeleteDialogOpen = open}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Delete Payment Method</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={deleteCard} class="bg-destructive text-destructive-foreground hover:bg-destructive/80">Delete Card</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>