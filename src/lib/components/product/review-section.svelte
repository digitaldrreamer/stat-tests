<script>
    import { onMount } from 'svelte';
    import {Progress} from '$lib/components/ui/progress';
    import * as Button from '$lib/components/ui/button';
    import * as Form from '$lib/components/ui/form';
    import * as Card from '$lib/components/ui/card';


    let { reviews = [], ratingStats, productId } = $props()

    let userRating = $state(0);
    let reviewText = $state('');
    let reviewerName = $state('');
    let reviewerEmail = $state('');

    async function handleSubmitReview(event) {
        event.preventDefault();

        // Submit review logic here
        const review = {
            productId,
            rating: userRating,
            text: reviewText,
            name: reviewerName,
            email: reviewerEmail,
            date: new Date().toISOString()
        };

        // API call would go here
        console.log('Submitting review:', review);

        // Reset form
        userRating = 0;
        reviewText = '';
        reviewerName = '';
        reviewerEmail = '';
    }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
    <!-- Rating Statistics -->
    <Card.Root class="h-full">
        <Card.Header class="pb-2 md:pb-4">
            <Card.Title>Rating Distribution</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="text-center mb-4 md:mb-6">
                <span class="text-4xl md:text-5xl font-bold dark:text-gray-300 text-gray-900">{ratingStats.average}</span>
                <div class="flex justify-center gap-1 my-2">
                    {#each Array(5) as _, i}
                        <svg
                                class="w-5 h-5 md:w-6 md:h-6 {i < Math.floor(ratingStats.average) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    {/each}
                </div>
                <p class="text-sm text-gray-500">Based on {ratingStats.total} reviews</p>
            </div>

            <div class="space-y-2 md:space-y-3">
                {#each Array(5).reverse() as _, i}
                    <div class="flex items-center gap-2">
                        <span class="w-4 text-right">{i + 1}</span>
                        <Progress value={ratingStats.distribution[i + 1]} class="flex-1 h-2" />
                        <span class="w-12 text-xs md:text-sm text-gray-500">
                            {ratingStats.distribution[i + 1]}%
                        </span>
                    </div>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>

    <!-- Review Form -->
    <Card.Root class="h-full">
        <Card.Header class="pb-2 md:pb-4">
            <Card.Title>Write a Review</Card.Title>
        </Card.Header>
        <Card.Content>
            <form onsubmit={handleSubmitReview} class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Rating</label>
                    <div class="flex gap-1">
                        {#each Array(5) as _, i}
                            <button
                                    type="button"
                                    class="p-1 focus:outline-none"
                                    onclick={() => userRating = i + 1}
                                    aria-label={`Rate ${i + 1} stars`}
                            >
                                <svg
                                        class="w-5 h-5 md:w-6 md:h-6 {i < userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block text-sm font-medium mb-2">Name</label>
                        <input
                                type="text"
                                id="name"
                                bind:value={reviewerName}
                                required
                                class="w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium mb-2">Email</label>
                        <input
                                type="email"
                                id="email"
                                bind:value={reviewerEmail}
                                required
                                class="w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                <div>
                    <label for="review" class="block text-sm font-medium mb-2">Review</label>
                    <textarea
                            id="review"
                            bind:value={reviewText}
                            required
                            rows="3"
                            class="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    ></textarea>
                </div>

                <Button.Root type="submit" class="w-full sm:w-auto">
                    Submit Review
                </Button.Root>
            </form>
        </Card.Content>
    </Card.Root>

    <!-- Reviews List -->
    <div class="lg:col-span-2">
        <h3 class="text-lg font-medium mb-4">Customer Reviews</h3>
        <div class="space-y-4 md:space-y-6">
            {#each reviews as review}
                <Card.Root class="overflow-hidden">
                    <Card.Content class="p-3 md:p-4">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="font-medium">{review.name}</span>
                                <div class="flex">
                                    {#each Array(5) as _, i}
                                        <svg
                                                class="w-3 h-3 md:w-4 md:h-4 {i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    {/each}
                                </div>
                            </div>
                            <span class="text-xs md:text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    </div>
</div>