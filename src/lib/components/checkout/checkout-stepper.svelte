<script>
    import { Check, User, Truck, CreditCard, ShoppingBag } from 'lucide-svelte';

    export let currentStep = 1;
    export let totalSteps = 4;

    const steps = [
        { id: 1, label: 'Customer Info', icon: User },
        { id: 2, label: 'Shipping', icon: Truck },
        { id: 3, label: 'Payment', icon: CreditCard },
        { id: 4, label: 'Review', icon: ShoppingBag }
    ];

    function getStepStatus(stepId) {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    }
</script>

<div class="w-full">
    <div class="hidden sm:flex items-center">
        {#each steps as step, index}
            <div class="flex items-center {index !== 0 ? 'flex-grow' : ''}">
                {#if index !== 0}
                    <div class="h-0.5 w-full bg-muted relative">
                        <div class="absolute inset-0 bg-primary transition-all duration-300"
                             style="transform: scaleX({currentStep > index ? 1 : 0}); transform-origin: left;"></div>
                    </div>
                {/if}

                <div class="relative flex items-center justify-center">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center
                                {getStepStatus(step.id) === 'completed' ? 'bg-primary text-primary-foreground' :
                                 getStepStatus(step.id) === 'current' ? 'bg-primary text-primary-foreground' :
                                 'bg-muted text-muted-foreground'}">
                        {#if getStepStatus(step.id) === 'completed'}
                            <Check class="h-5 w-5" />
                        {:else}
                            <svelte:component this={step.icon} class="h-5 w-5" />
                        {/if}
                    </div>
                    <span class="absolute -bottom-6 text-sm whitespace-nowrap
                                {getStepStatus(step.id) === 'completed' ? 'text-primary font-medium' :
                                 getStepStatus(step.id) === 'current' ? 'text-foreground font-medium' :
                                 'text-muted-foreground'}">
                        {step.label}
                    </span>
                </div>
            </div>
        {/each}
    </div>

    <!-- Mobile stepper -->
    <div class="sm:hidden">
        <div class="flex justify-between items-center">
            {#each steps as step}
                <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center
                                {getStepStatus(step.id) === 'completed' ? 'bg-primary text-primary-foreground' :
                                 getStepStatus(step.id) === 'current' ? 'bg-primary text-primary-foreground' :
                                 'bg-muted text-muted-foreground'}">
                        {#if getStepStatus(step.id) === 'completed'}
                            <Check class="h-4 w-4" />
                        {:else}
                            <svelte:component this={step.icon} class="h-4 w-4" />
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="mt-2 text-center">
            <span class="text-sm font-medium">
                Step {currentStep}: {steps.find(s => s.id === currentStep)?.label}
            </span>
        </div>
    </div>
</div>