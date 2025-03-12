<script>
    import {PromotionalImage} from "$lib/components/showcase/index.js";

    let {
        title = "Promotional Banner",
        description = "Check out our special offers",
        buttonText = "Shop Now",
        image = "",
        variant = 3,
        theme = "accent",
        discount = "",
        endDate = ""
    } = $props()
</script>

<section class="py-10">
    <div class="container mx-auto px-4">
        <PromotionalImage
                {title}
                {description}
                {buttonText}
                {image}
                {variant}
                {theme}
                {discount}
                {endDate}
        />
    </div>
</section>