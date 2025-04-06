import { Store } from '@tanstack/react-store';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'localhost:5000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;  
}

// Define product type
export interface Product {
  _id: string;
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

// Define chat message type
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  // Chat state
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  recommendedProducts: Product[];
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
  // Chat state
  isChatOpen: false,
  chatMessages: [],
  recommendedProducts: [],
});

export const setRecommendedProducts = (products: Product[]) => {
  appStore.setState((state) => ({
    ...state,
    recommendedProducts: products,
  }));
};

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

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`http://${API_URL}/api/products/${productId}`, updates, { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const updatedProduct = response.data.product;
    appStore.setState((state) => ({
      ...state,
      products: state.products.map(p => p._id === productId ? updatedProduct : p),
      featuredProducts: state.products.filter(p => p.featured)
    }));

    return updatedProduct;
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;
  }
};


export const addToCart = (product: Product, quantity: number = 1) => {
  appStore.setState((state) => {
    const existingItem = state.cart.find((item) => item.product._id === product._id);
    // console.log(existingItem);
    if (existingItem) {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
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
    cart: state.cart.filter((item) => item.product._id !== productId),
  }));
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  appStore.setState((state) => {
    if (quantity <= 0) {
      return {
        ...state,
        cart: state.cart.filter((item) => item.product._id !== productId),
      };
    }

    return {
      ...state,
      cart: state.cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
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

// Chat actions
export const toggleChat = () => {
  appStore.setState((state) => ({
    ...state,
    isChatOpen: !state.isChatOpen,
  }));
};

export const addChatMessage = (message: Omit<ChatMessage, 'id'>) => {
  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
  };
  
  appStore.setState((state) => ({
    ...state,
    chatMessages: [...state.chatMessages, newMessage],
  }));
  
  return newMessage;
};

export const clearChatMessages = () => {
  appStore.setState((state) => ({
    ...state,
    chatMessages: [],
  }));
};

// Admin actions
export const login = async (credentials: AdminCredentials) => {
  try {
    const response = await axios.post(`http://${API_URL}/api/auth/login`, credentials);
    const {token, user} = response.data;

    if(token) {
      if(user.isAdmin) {
        localStorage.setItem('adminToken', token);
      }
      localStorage.setItem('isAuthenticated', 'true');
    
      appStore.setState((state) => ({
        ...state,
        isAuthenticated: true,
        adminToken: user.isAdmin ? token : null,
        // userRole: user.isAdmin ? 'admin' : 'user'
      }));
  
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const signup = async (userData: SignupData) => {
  try {
    const response = await axios.post(`http://${API_URL}/api/auth/signup`, userData);
    const token = response.data;

    if(token) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('isAuthenticated', 'true');
      
      appStore.setState((state) => ({
        ...state,
        isAuthenticated: true,
        adminToken: token,
      }));

      return {success: true, data: response.data};
    }

    return {success: false, erroor: 'Signup failed'};
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred during signup'
    };
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
  }));
};

export const toggleAdminPanel = () => {
  appStore.setState((state) => ({
    ...state,
    isAdminPanelOpen: !state.isAdminPanelOpen,
  }));
};

export const addProduct = async (product: Omit<Product, '_id'>) => {
  try {
    const token = appStore.state.adminToken || localStorage.getItem('adminToken');

    const response = await axios.post(`http://${API_URL}/api/products/create`, product, {
      headers: {'Authorization': `Bearer ${token}`}
    });

    const newProduct = response.data.product;

    appStore.setState((state) => {
      const updatedProducts = [...state.products, newProduct];
      return {
        ...state,
        products: updatedProducts,
        featuredProducts: updatedProducts.filter((p) => p.featured),
        filteredProducts: state.productFilter.category  || state.productFilter.culture || state.productFilter.searchQuery ? state.filteredProducts : updatedProducts,
      };
    });
    return newProduct;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`http://${API_URL}/api/products/${productId}`, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Immediately update the state after successful deletion
    appStore.setState((state) => {
      // Create new arrays instead of modifying existing ones
      const updatedProducts = state.products.filter(p => p._id !== productId);
      const updatedFeatured = updatedProducts.filter(p => p.featured);
      const updatedFiltered = state.filteredProducts.filter(p => p._id !== productId);
      const updatedCart = state.cart.filter(item => item.product._id !== productId);

      return {
        ...state,
        products: updatedProducts,
        featuredProducts: updatedFeatured,
        filteredProducts: updatedFiltered,
        cart: updatedCart
      };
    });

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`http://${API_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const products = response.data;
    appStore.setState((state) => ({
      ...state,
      products,
      featuredProducts: products.filter((p: Product) => p.featured),
      filteredProducts: products
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;
  }
};