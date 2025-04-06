// Mock data for CultureDrop - Music and Fashion Concept Shop

import type { Product } from '../store/appStore';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock products data
export const mockProducts: Product[] = [
  // Clothing items
  {
    id: generateId(),
    name: 'Urban Graphic Tee',
    category: 'clothing',
    price: 39.99,
    image: '/images/urban-tee.jpg',
    description: 'Premium cotton graphic t-shirt featuring urban art designs.',
    culture: 'urban',
    featured: true,
  },
  {
    id: generateId(),
    name: 'Hip-Hop Oversized Hoodie',
    category: 'clothing',
    price: 79.99,
    image: '/images/hiphop-hoodie.jpg',
    description: 'Oversized hoodie with classic hip-hop inspired graphics.',
    culture: 'hiphop',
    featured: true,
  },
  {
    id: generateId(),
    name: 'Streetwear Cargo Pants',
    category: 'clothing',
    price: 89.99,
    image: '/images/streetwear-pants.jpg',
    description: 'Functional cargo pants with multiple pockets and streetwear aesthetic.',
    culture: 'streetwear',
  },
  {
    id: generateId(),
    name: 'Indie Band Tee',
    category: 'clothing',
    price: 34.99,
    image: '/images/indie-tee.jpg',
    description: 'Vintage-inspired band t-shirt with indie music graphics.',
    culture: 'indie',
  },
  {
    id: generateId(),
    name: 'Punk Leather Jacket',
    category: 'clothing',
    price: 149.99,
    image: '/images/punk-jacket.jpg',
    description: 'Classic punk-inspired faux leather jacket with studs and patches.',
    culture: 'punk',
    featured: true,
  },
  
  // Music items
  {
    id: generateId(),
    name: 'Urban Beats Vinyl',
    category: 'music',
    price: 29.99,
    image: '/images/urban-vinyl.jpg',
    description: 'Limited edition vinyl featuring the best of urban beats.',
    culture: 'urban',
  },
  {
    id: generateId(),
    name: 'Hip-Hop Classics Collection',
    category: 'music',
    price: 49.99,
    image: '/images/hiphop-collection.jpg',
    description: 'Collection of classic hip-hop albums on high-quality vinyl.',
    culture: 'hiphop',
    featured: true,
  },
  {
    id: generateId(),
    name: 'Street Sounds Headphones',
    category: 'music',
    price: 129.99,
    image: '/images/street-headphones.jpg',
    description: 'Premium headphones tuned specifically for street music.',
    culture: 'streetwear',
  },
  {
    id: generateId(),
    name: 'Indie Artist Compilation',
    category: 'music',
    price: 24.99,
    image: '/images/indie-compilation.jpg',
    description: 'Curated compilation of emerging indie artists on vinyl.',
    culture: 'indie',
  },
  {
    id: generateId(),
    name: 'Punk Rock Anthology',
    category: 'music',
    price: 39.99,
    image: '/images/punk-anthology.jpg',
    description: 'The definitive anthology of punk rock classics.',
    culture: 'punk',
  },
  
  // Accessories
  {
    id: generateId(),
    name: 'Urban Snapback Cap',
    category: 'accessories',
    price: 34.99,
    image: '/images/urban-cap.jpg',
    description: 'Premium snapback cap with urban-inspired embroidery.',
    culture: 'urban',
  },
  {
    id: generateId(),
    name: 'Hip-Hop Chain Necklace',
    category: 'accessories',
    price: 59.99,
    image: '/images/hiphop-chain.jpg',
    description: 'Statement chain necklace inspired by hip-hop culture.',
    culture: 'hiphop',
  },
  {
    id: generateId(),
    name: 'Streetwear Backpack',
    category: 'accessories',
    price: 79.99,
    image: '/images/streetwear-backpack.jpg',
    description: 'Functional backpack with streetwear aesthetics and multiple compartments.',
    culture: 'streetwear',
    featured: true,
  },
  {
    id: generateId(),
    name: 'Indie Beanie',
    category: 'accessories',
    price: 24.99,
    image: '/images/indie-beanie.jpg',
    description: 'Comfortable beanie with indie-inspired patch.',
    culture: 'indie',
  },
  {
    id: generateId(),
    name: 'Punk Studded Belt',
    category: 'accessories',
    price: 44.99,
    image: '/images/punk-belt.jpg',
    description: 'Classic punk-inspired studded belt.',
    culture: 'punk',
  },
];

// Export categories and cultures for filtering
export const productCategories = ['clothing', 'music', 'accessories'];
export const culturalThemes = ['urban', 'hiphop', 'streetwear', 'indie', 'punk'];