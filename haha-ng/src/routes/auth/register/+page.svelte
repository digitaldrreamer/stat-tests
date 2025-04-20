<script>
    import {RegisterForm} from "$lib/components/auth/index.js";
	import { fetchWithAuth } from "$lib/utils/fetch";
	import { toast } from "svelte-sonner";
	import { number } from "zod";
    import { loading } from '$lib/stores/loading.js';

    const registerUser = (e) => {
        toast.dismiss()
        $loading = true
        fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: e.email,
                password: e.password,
                firstName: e.name.split(' ')[0],
                lastName: e.name.split(' ')[1]
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.error || !res.status) {
                error = res.message
            } else {
                toast.success(res?.message || 'Account created successfully', {
                    duration: number.POSITIVE_INFINITY
                })
            }
        })
        .catch(err => {
            console.log(err)
            toast.error(err?.message || 'Something went wrong', {
                duration: 7000
            })
        })
        .finally(() => {
            isLoading = false
            $loading = false
        })
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