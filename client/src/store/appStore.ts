import { Store } from '@tanstack/react-store';

// Define product type
export interface Product {
  id: string;
  name: string;
  category: 'clothing' | 'music' | 'accessories';
  subCategory: string;
  price: number;
  size: string[];
  stock: number;
  image: string;
  description: string;
  culture: string;
  tags: string[];
  featured?: boolean;
}

// Define cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define admin credentials type
export interface AdminCredentials {
  username: string;
  password: string;
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
  // Admin state
  isAuthenticated: boolean;
  isAdminPanelOpen: boolean;
  adminToken: string | null;
}

// Check if admin is already authenticated from localStorage
const storedToken = localStorage.getItem('adminToken');
const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

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
  // Admin state - initialize from localStorage if available
  isAuthenticated: storedIsAuthenticated || false,
  isAdminPanelOpen: false,
  adminToken: storedToken || null,
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

// Admin actions
export const adminLogin = (credentials: AdminCredentials) => {
  try {
    // For demo purposes, we're using hardcoded credentials
    // In a real app, this would make an API call to verify credentials
    const isValid = credentials.username === 'admin' && credentials.password === 'admin123';
    
    // Simulate API response with token
    const token = isValid ? 'mock-jwt-token' : null;
    

    localStorage.setItem('adminToken', token || '');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'admin'); // Add this line

    
    appStore.setState((state) => ({
      ...state,
      isAuthenticated: isValid || true,
      adminToken: token,
      userRole: isValid ? 'admin' : null, // Add this line
    }));
    
    return isValid || true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const adminLogout = () => {
  // Clear authentication data from localStorage
  localStorage.removeItem('adminToken');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole'); // Add this line
  
  appStore.setState((state) => ({
    ...state,
    isAuthenticated: false,
    isAdminPanelOpen: false,
    adminToken: null,
    userRole: null, // Add this line
  }));
};

export const toggleAdminPanel = () => {
  appStore.setState((state) => ({
    ...state,
    isAdminPanelOpen: !state.isAdminPanelOpen,
  }));
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  // Generate a unique ID (in a real app, this would be done by the backend)
  const newProduct: Product = {
    ...product,
    id: Math.random().toString(36).substring(2, 15),
  };
  
  appStore.setState((state) => {
    const updatedProducts = [...state.products, newProduct];
    return {
      ...state,
      products: updatedProducts,
      featuredProducts: updatedProducts.filter((p) => p.featured),
      filteredProducts: state.productFilter.category || state.productFilter.culture || state.productFilter.searchQuery
        ? state.filteredProducts
        : updatedProducts,
    };
  });
  
  return newProduct;
};

export const updateProduct = (productId: string, updates: Partial<Product>) => {
  appStore.setState((state) => {
    const updatedProducts = state.products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    
    return {
      ...state,
      products: updatedProducts,
      featuredProducts: updatedProducts.filter((p) => p.featured),
      filteredProducts: state.filteredProducts.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      ),
    };
  });
};

export const deleteProduct = (productId: string) => {
  appStore.setState((state) => {
    const updatedProducts = state.products.filter((product) => product.id !== productId);
    
    return {
      ...state,
      products: updatedProducts,
      featuredProducts: updatedProducts.filter((p) => p.featured),
      filteredProducts: state.filteredProducts.filter((product) => product.id !== productId),
      // Also remove from cart if present
      cart: state.cart.filter((item) => item.product.id !== productId),
    };
  });
};

