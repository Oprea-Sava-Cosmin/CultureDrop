import { Store } from '@tanstack/react-store';

// Define product type
export interface Product {
  id: string;
  name: string;
  category: 'clothing' | 'music' | 'accessories';
  price: number;
  image: string;
  description: string;
  culture: string;
  featured?: boolean;
}

// Define cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define app store state
interface AppState {
  products: Product[];
  featuredProducts: Product[];
  filteredProducts: Product[];
  productFilter: {
    category: string | null;
    culture: string | null;
    searchQuery: string;
  };
  cart: CartItem[];
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
}

// Create the store with initial state
export const appStore = new Store<AppState>({
  products: [],
  featuredProducts: [],
  filteredProducts: [],
  productFilter: {
    category: null,
    culture: null,
    searchQuery: '',
  },
  cart: [],
  isCartOpen: false,
  isMobileMenuOpen: false,
});

// Define store actions
export const setProducts = (products: Product[]) => {
  appStore.setState((state) => ({
    ...state,
    products,
    featuredProducts: products.filter((product) => product.featured),
    filteredProducts: products, // Assuming initial filtered products is the full list
  }));
};

export const filterProducts = (category?: string | null, culture?: string | null, searchQuery?: string) => {
  appStore.setState((state) => {
    const newFilter = {
      category: category !== undefined ? category : state.productFilter.category,
      culture: culture !== undefined ? culture : state.productFilter.culture,
      searchQuery: searchQuery !== undefined ? searchQuery : state.productFilter.searchQuery,
    };

    let filtered = [...state.products];

    if (newFilter.category) {
      filtered = filtered.filter((product) => product.category === newFilter.category);
    }

    if (newFilter.culture) {
      filtered = filtered.filter((product) => product.culture === newFilter.culture);
    }

    if (newFilter.searchQuery) {
      const query = newFilter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    return {
      ...state,
      productFilter: newFilter,
      filteredProducts: filtered,
    };
  });
};

export const addToCart = (product: Product, quantity: number = 1) => {
  appStore.setState((state) => {
    const existingItem = state.cart.find((item) => item.product.id === product.id);
    console.log(existingItem);
    if (existingItem) {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    } else {
      return {
        ...state,
        cart: [...state.cart, { product, quantity }],
      };
    }
  });
};

export const removeFromCart = (productId: string) => {
  appStore.setState((state) => ({
    ...state,
    cart: state.cart.filter((item) => item.product.id !== productId),
  }));
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  appStore.setState((state) => {
    if (quantity <= 0) {
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== productId),
      };
    }

    return {
      ...state,
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    };
  });
};

export const clearCart = () => {
  appStore.setState((state) => ({
    ...state,
    cart: [],
  }));
};

export const toggleCart = () => {
  appStore.setState((state) => ({
    ...state,
    isCartOpen: !state.isCartOpen,
  }));
};

export const toggleMobileMenu = () => {
  appStore.setState((state) => ({
    ...state,
    isMobileMenuOpen: !state.isMobileMenuOpen,
  }));
};

