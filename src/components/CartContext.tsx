'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    restaurantId: string | null
    tableNumber: string | null
    addToCart: (item: CartItem, restaurantId: string) => void
    setTableNumber: (table: string | null) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [restaurantId, setRestaurantId] = useState<string | null>(null)
    const [tableNumber, setTableNumber] = useState<string | null>(null)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('bissaufood_cart')
        const savedRestaurantId = localStorage.getItem('bissaufood_restaurant_id')
        const savedTableNumber = localStorage.getItem('bissaufood_table_number')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
                setRestaurantId(savedRestaurantId)
                setTableNumber(savedTableNumber)
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('bissaufood_cart', JSON.stringify(cart))
        if (restaurantId) {
            localStorage.setItem('bissaufood_restaurant_id', restaurantId)
        } else {
            localStorage.removeItem('bissaufood_restaurant_id')
        }
        if (tableNumber) {
            localStorage.setItem('bissaufood_table_number', tableNumber)
        } else {
            localStorage.removeItem('bissaufood_table_number')
        }
    }, [cart, restaurantId, tableNumber])

    const addToCart = (item: CartItem, rid: string) => {
        setCart(prev => {
            // If adding from a different restaurant, clear cart first
            if (restaurantId && restaurantId !== rid) {
                setRestaurantId(rid)
                return [{ ...item, quantity: 1 }]
            }

            setRestaurantId(rid)
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (id: string) => {
        setCart(prev => {
            const newCart = prev.filter(i => i.id !== id)
            if (newCart.length === 0) setRestaurantId(null)
            return newCart
        })
    }

    const clearCart = () => {
        setCart([])
        setRestaurantId(null)
    }

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
    const itemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, restaurantId, tableNumber, addToCart, setTableNumber, removeFromCart, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
