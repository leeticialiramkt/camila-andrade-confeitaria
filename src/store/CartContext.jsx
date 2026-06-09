import { createContext, useContext, useReducer, useState } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.findIndex(i => i.cartId === action.payload.cartId)
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = action.payload
        return { ...state, items }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartId !== action.payload) }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const total = state.items.reduce((sum, item) => sum + item.subtotal, 0)
  const itemCount = state.items.length

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    setIsCartOpen(true)
  }

  const removeItem = (cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{
      items: state.items,
      total,
      itemCount,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      addItem,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
