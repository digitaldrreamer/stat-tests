<script>
    import {RegisterForm} from "$lib/components/auth/index.js";

    const registerUser = (e) => {
        // register user
    }

    let error = $state('')
    let isLoading = $state(false)

</script>

<svelte:head>
    <title>Create Account | Haha.ng</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Create Your Account</h1>
        <RegisterForm onregister={registerUser} {error} {isLoading}/>
    </div>
</div>