export const load = async ({ params }) => {
    const { product_slug } = params;
    // const req = await fetch(`https://dummyjson.com/products/${product_slug}`);
    // const data = await req.json();
    // if (!data) return { status: 404, error: new Error('No data found') };
    return { product: {
            id: 1,
            title: "Premium Leather Crossbody Bag",
            slug: "premium-leather-crossbody",
            price: 199.99,
            originalPrice: 249.99,
            discount: 20,
            rating: 4.5,
            reviewCount: 128,
            category: "Accessories",
            subcategory: "Bags",
            type: "Crossbody",
            brand: "LeatherCraft",
            isHot: true,
            isHighlyRated: true,
            inStock: true,
            description: `
            Crafted from premium full-grain leather, this versatile crossbody bag combines
            timeless style with modern functionality. Perfect for everyday use, it features:

            • Premium full-grain leather construction
            • Adjustable shoulder strap
            • Multiple interior compartments
            • Secure zip closure
            • Phone pocket and card slots
            • Signature hardware details
        `,
            features: [
                "Water-resistant leather",
                "Reinforced stitching",
                "Metal hardware",
                "Interior organization",
                "Adjustable strap"
            ],
            specifications: {
                "Material": "Full-grain leather",
                "Dimensions": "10\" x 8\" x 4\"",
                "Weight": "1.2 lbs",
                "Strap Length": "Adjustable up to 22\"",
                "Closure": "YKK zipper"
            },
            images: [
                "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/1.png",
                "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/2.png",
                "https://cdn.dummyjson.com/products/images/womens-bags/Heshe%20Women's%20Leather%20Bag/3.png"
            ],
            colors: [
                { id: 'brown', name: 'Brown', hex: '#8B4513' },
                { id: 'black', name: 'Black', hex: '#000000' },
                { id: 'tan', name: 'Tan', hex: '#D2B48C' }
            ],
            sizes: ['Small', 'Medium', 'Large']
        },
    reviews: {
        stats: {
            average: 4.5,
            total: 128,
            distribution: {
                5: 90,
                4: 60,
                3: 40,
                2: 30,
                1: 8
            }
        },
        comments: [
            {
                "rating": 4,
                "comment": "Highly impressed!",
                "date": "2024-05-23T08:56:21.627Z",
                "reviewerName": "Hunter Gordon",
                "reviewerEmail": "hunter.gordon@x.dummyjson.com"
            },
            {
                "rating": 5,
                "comment": "Awesome product!",
                "date": "2024-05-23T08:56:21.627Z",
                "reviewerName": "Ethan Fletcher",
                "reviewerEmail": "ethan.fletcher@x.dummyjson.com"
            },
            {
                "rating": 4,
                "comment": "Highly recommended!",
                "date": "2024-05-23T08:56:21.627Z",
                "reviewerName": "Aaron Cook",
                "reviewerEmail": "aaron.cook@x.dummyjson.com"
            }
        ]
    }};
}