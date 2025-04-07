<script>
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { X, Check, Eye, EyeOff } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import {onMount} from "svelte";

    // Sheet component for password change with additional old password field
    let { open = false } = $props()

    let oldPassword = $state("");
    let newPassword = $state("");
    let confirmPassword = $state("");
    let isMobile = $state(false);
    let errors = $state({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    let showOldPassword = $state(false);
    let showNewPassword = $state(false);
    let showConfirmPassword = $state(false);
    let isSubmitting = $state(false);

    // Function to validate form
    const validateForm = () => {
        let isValid = true;
        errors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        };

        if (!oldPassword) {
            errors.oldPassword = "Current password is required";
            isValid = false;
        }

        if (!newPassword) {
            errors.newPassword = "New password is required";
            isValid = false;
        } else if (newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters";
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        return isValid;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        isSubmitting = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form
            oldPassword = "";
            newPassword = "";
            confirmPassword = "";

            // Close sheet
            open = false;

            // Show success toast
            toast.success("Password updated", {
                description: "Your password has been successfully updated.",
            });
        } catch (error) {
            toast.error("Error", {
                description: "Failed to update password. Please try again.",
            });
        } finally {
            isSubmitting = false;
        }
    };

    // Reset form when sheet is closed
    $effect(() => {
        if (!open) {
            oldPassword = "";
            newPassword = "";
            confirmPassword = "";
            errors = {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            };
        }
    })

    // Toggle password visibility
    const toggleOldPasswordVisibility = () => {
        showOldPassword = !showOldPassword;
    };

    const toggleNewPasswordVisibility = () => {
        showNewPassword = !showNewPassword;
    };

    const toggleConfirmPasswordVisibility = () => {
        showConfirmPassword = !showConfirmPassword;
    };

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

{#if isMobile}
<Sheet.Root bind:open={open}>
    <Sheet.Content side="bottom" class="max-h-[90vh] overflow-y-auto sm:h-auto sm:max-w-md sm:rounded-lg sm:mx-auto">
        <Sheet.Header class="border-b pb-4 mb-4">
            <Sheet.Title>Change Password</Sheet.Title>
            <Sheet.Description>Update your account password</Sheet.Description>
        </Sheet.Header>

        <div class="p-4 overflow-y-auto">
            <form onsubmit={handleSubmit} class="space-y-4">
                <!-- Old Password -->
                <div class="space-y-2">
                    <label for="oldPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Current Password
                    </label>
                    <div class="relative">
                        <Input
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                bind:value={oldPassword}
                                placeholder="Enter current password"
                                class={errors.oldPassword ? "border-red-500" : ""}
                        />
                        <button
                                type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                onclick={toggleOldPasswordVisibility}
                        >
                            {#if showOldPassword}
                                <EyeOff size={18} />
                            {:else}
                                <Eye size={18} />
                            {/if}
                        </button>
                    </div>
                    {#if errors.oldPassword}
                        <p class="text-xs text-red-500 mt-1">{errors.oldPassword}</p>
                    {/if}
                </div>

                <!-- New Password -->
                <div class="space-y-2">
                    <label for="newPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        New Password
                    </label>
                    <div class="relative">
                        <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                bind:value={newPassword}
                                placeholder="Enter new password"
                                class={errors.newPassword ? "border-red-500" : ""}
                        />
                        <button
                                type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                onclick={toggleNewPasswordVisibility}
                        >
                            {#if showNewPassword}
                                <EyeOff size={18} />
                            {:else}
                                <Eye size={18} />
                            {/if}
                        </button>
                    </div>
                    {#if errors.newPassword}
                        <p class="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                    {/if}
                </div>

                <!-- Confirm Password -->
                <div class="space-y-2">
                    <label for="confirmPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Confirm New Password
                    </label>
                    <div class="relative">
                        <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                bind:value={confirmPassword}
                                placeholder="Confirm new password"
                                class={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        <button
                                type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                onclick={toggleConfirmPasswordVisibility}
                        >
                            {#if showConfirmPassword}
                                <EyeOff size={18} />
                            {:else}
                                <Eye size={18} />
                            {/if}
                        </button>
                    </div>
                    {#if errors.confirmPassword}
                        <p class="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                    {/if}
                </div>

                <!-- Password requirement hints -->
                <div class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 mt-2">
                    <p>Password requirements:</p>
                    <ul class="list-disc pl-5">
                        <li>At least 8 characters long</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Include at least one number</li>
                        <li>Include at least one special character</li>
                    </ul>
                </div>
            </form>
        </div>

        <Sheet.Footer class="border-t pt-4 mt-4">
            <div class="flex gap-3 flex-col sm:flex-row">
                <Button
                        variant="outline"
                        class="flex-1"
                        onclick={() => open = false}
                >
                    <X class="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button
                        class="flex-1"
                        onclick={handleSubmit}
                        disabled={isSubmitting}
                >
                    {#if isSubmitting}
                        <span class="animate-spin mr-2">⏳</span>
                        Updating...
                    {:else}
                        <Check class="h-4 w-4 mr-2" />
                        Update Password
                    {/if}
                </Button>
            </div>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
    {:else}
    <Dialog.Root bind:open={open}>
        <Dialog.Content class="overflow-y-auto max-h-[80vh] sm:h-auto sm:max-w-md sm:rounded-lg sm:mx-auto">
            <Dialog.Header class="border-b pb-4 mb-4">
                <Dialog.Title>Change Password</Dialog.Title>
                <Dialog.Description>Update your account password</Dialog.Description>
            </Dialog.Header>

            <div class="p-4 overflow-y-auto">
                <form onsubmit={handleSubmit} class="space-y-4">
                    <!-- Old Password -->
                    <div class="space-y-2">
                        <label for="oldPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Current Password
                        </label>
                        <div class="relative">
                            <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    bind:value={oldPassword}
                                    placeholder="Enter current password"
                                    class={errors.oldPassword ? "border-red-500" : ""}
                            />
                            <button
                                    type="button"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    onclick={toggleOldPasswordVisibility}
                            >
                                {#if showOldPassword}
                                    <EyeOff size={18} />
                                {:else}
                                    <Eye size={18} />
                                {/if}
                            </button>
                        </div>
                        {#if errors.oldPassword}
                            <p class="text-xs text-red-500 mt-1">{errors.oldPassword}</p>
                        {/if}
                    </div>

                    <!-- New Password -->
                    <div class="space-y-2">
                        <label for="newPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            New Password
                        </label>
                        <div class="relative">
                            <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    bind:value={newPassword}
                                    placeholder="Enter new password"
                                    class={errors.newPassword ? "border-red-500" : ""}
                            />
                            <button
                                    type="button"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    onclick={toggleNewPasswordVisibility}
                            >
                                {#if showNewPassword}
                                    <EyeOff size={18} />
                                {:else}
                                    <Eye size={18} />
                                {/if}
                            </button>
                        </div>
                        {#if errors.newPassword}
                            <p class="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                        {/if}
                    </div>

                    <!-- Confirm Password -->
                    <div class="space-y-2">
                        <label for="confirmPassword" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Confirm New Password
                        </label>
                        <div class="relative">
                            <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    bind:value={confirmPassword}
                                    placeholder="Confirm new password"
                                    class={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            <button
                                    type="button"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    onclick={toggleConfirmPasswordVisibility}
                            >
                                {#if showConfirmPassword}
                                    <EyeOff size={18} />
                                {:else}
                                    <Eye size={18} />
                                {/if}
                            </button>
                        </div>
                        {#if errors.confirmPassword}
                            <p class="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                        {/if}
                    </div>

                    <!-- Password requirement hints -->
                    <div class="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 mt-2">
                        <p>Password requirements:</p>
                        <ul class="list-disc pl-5">
                            <li>At least 8 characters long</li>
                            <li>Include uppercase and lowercase letters</li>
                            <li>Include at least one number</li>
                            <li>Include at least one special character</li>
                        </ul>
                    </div>
                </form>
            </div>

            <Dialog.Footer class="border-t pt-4 mt-4">
                <div class="flex gap-3 flex-col sm:flex-row">
                    <Button
                            variant="outline"
                            class="flex-1"
                            onclick={() => open = false}
                    >
                        <X class="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                            class="flex-1"
                            onclick={handleSubmit}
                            disabled={isSubmitting}
                    >
                        {#if isSubmitting}
                            <span class="animate-spin mr-2">⏳</span>
                            Updating...
                        {:else}
                            <Check class="h-4 w-4 mr-2" />
                            Update Password
                        {/if}
                    </Button>
                </div>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
    {/if}