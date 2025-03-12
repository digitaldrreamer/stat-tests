import {persisted} from "svelte-persisted-store";
import {derived} from "svelte/store";

const cart = persisted('cartStore', []);

const addItemToCart = (item) => {
    cart.update((items) => {
        return [...items, item]
    })
}

const removeItemFromCart = (item) => {
    cart.update((items) => {
        return items.filter((i) => i.id !== item.id)
    })
}

const clearCart = () => {
    cart.reset()
}

const getCartCount = () => {
    let count = 0
    const unsubscribe = cart.subscribe(items => {
        count += items.length
    })
    unsubscribe();
    return count
}


export { clearCart, addItemToCart, removeItemFromCart, cart }