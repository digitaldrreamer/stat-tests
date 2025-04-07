<script>
    import { Check, User, Truck, CreditCard, ShoppingBag } from 'lucide-svelte';

    let { currentStep = 1, totalSteps = 4 } = $props()

    const steps = [
        {id: 1, label: 'Customer Info', icon: User},
        {id: 2, label: 'Shipping', icon: Truck},
        {id: 3, label: 'Payment', icon: CreditCard},
        {id: 4, label: 'Review', icon: ShoppingBag}
    ];

    function getStepStatus(stepId) {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    }
</script>

<div class="w-full">
    <!-- Desktop stepper -->
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
                            <Check class="h-5 w-5"/>
                        {:else}
                            {@const Icon = step.icon}
                            <Icon class="h-5 w-5"/>
                        {/if}
                    </div>
                    <span class="absolute -bottom-7 text-sm whitespace-nowrap text-center
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
        <!-- Progress bar -->
        <div class="h-1 w-full bg-muted mb-4 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300"
                 style="width: {((currentStep - 1) / (totalSteps - 1)) * 100}%"></div>
        </div>

        <div class="flex justify-between items-center">
            {#each steps as step}
                {@const Icon = step.icon}
                <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center
                                {getStepStatus(step.id) === 'completed' ? 'bg-primary text-primary-foreground' :
                                 getStepStatus(step.id) === 'current' ? 'bg-primary text-primary-foreground' :
                                 'bg-muted text-muted-foreground'}">
                        {#if getStepStatus(step.id) === 'completed'}
                            <Check class="h-4 w-4"/>
                        {:else}
                            <Icon class="h-4 w-4" />
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="mt-3 text-center">
            <span class="text-sm font-medium">
                Step {currentStep}: {steps.find(s => s.id === currentStep)?.label}
            </span>
        </div>
    </div>
</div>