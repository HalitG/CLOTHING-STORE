import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Action types
export const CART_ACTIONS = {
  ADD_TO_CART: " ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
};

// Initial State
const InitialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItemIndex = state.item.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Items exists, update quantity
        updatedItems = state.item.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }

      const totals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );

      const totals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity,
          };
        }
        return item;
      });
      const totals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return InitialState;

    default:
      return state;
  }
};

// helper function to calculate totals
const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => {
      totals.totalItems += item.quantity;
      totals.totalAmount += item.price * item.quantity;
      return totals;
    },
    { totalItems: 0, totalAmount: 0 }
  );
};

// Cart provider component
export function CartProvider({ children }) {
  // Load cart from localStorage
  const loadInitialState = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : InitialState;
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return InitialState;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.split(",")[0],
        quantity,
      },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: productId,
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart muser be used within a CartProvider");
  }
  return context;
};
