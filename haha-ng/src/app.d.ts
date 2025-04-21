/**
 * @typedef {Object} Product
 * @property {string} slug - The unique slug identifier for the product
 */
interface Product {
    slug: string;
}

/**
 * @typedef {Object} CartItem
 * @property {Product} product - The product information in the cart
 */
interface CartItem {
    product: Product;
}

/**
 * @typedef {Object} UserProfile
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {string} profilePicture - URL or path to user's profile picture
 * @property {CartItem[]} cart - Array of items in user's cart
 * @property {number} cartCount - Number of items in the cart
 * @property {number} wishlistCount - Number of items in the wishlist
 * @property {number} ordersCount - Number of orders placed by the user
 * @property {number} notificationsCount - Number of unread notifications
 * @property {number} returnsCount - Number of return requests
 */
interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    cart: CartItem[];
    cartCount: number;
    wishlistCount: number;
    ordersCount: number;
    notificationsCount: number;
    returnsCount: number;
}

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: UserProfile | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};