<script>
    import {LoginForm} from "$lib/components/auth/index.js";

    const logUserIn = async (e) => {

    }

    let error = $state('')
    let redirectTo = '/'
    let isLoading = $state(false)
</script>
<div class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <LoginForm onlogin={logUserIn} {error} {redirectTo} {isLoading}/>
    </div>
</div>