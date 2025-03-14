<script>
    import * as Skeleton from '$lib/components/ui/skeleton';

    let {
        count = 8,
        columns = {
            mobile: 2,
            tablet: 3,
            desktop: 4
        }
    } = $props();

    // Create an array of the specified count
    const items = Array(count).fill(null);
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each items as _, i}
        <div class="flex flex-col space-y-3">
            <Skeleton.Root class="h-[200px] w-full rounded-md" />
            <div class="space-y-2">
                <Skeleton.Root class="h-4 w-full" />
                <Skeleton.Root class="h-4 w-3/4" />
                <div class="flex justify-between items-center pt-2">
                    <Skeleton.Root class="h-5 w-1/3" />
                    <Skeleton.Root class="h-4 w-1/4 rounded-full" />
                </div>
            </div>
        </div>
    {/each}
</div>