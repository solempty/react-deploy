import axios from 'axios';

import { authSessionStorage } from '@/utils/storage';

import { BASE_URL } from '../instance';

const getAuthToken = () => {
  const token = authSessionStorage.get();
  if (!token || typeof token !== 'string') {
    throw new Error('No authentication token found or invalid token');
  }
  return token;
};

export const getWishlistItems = async () => {
  const token = getAuthToken();

  try {
    const response = await axios.get(`${BASE_URL}/api/wishes?page=0&size=10&sort=createdDate,desc`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wishlist items:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: number) => {
  const token = getAuthToken();

  try {
    const response = await axios.get(`${BASE_URL}/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product details for productId ${productId}:`, error);
    throw error;
  }
};

export const addToWishlist = async (productId: number) => {
  const token = getAuthToken();

  try {
    await axios.post(
      `${BASE_URL}/api/wishes/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(`Failed to add product ${productId} to wishlist:`, error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: number) => {
  const token = getAuthToken();

  try {
    await axios.delete(`${BASE_URL}/api/wishes/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Failed to remove product ${productId} from wishlist:`, error);
    throw error;
  }
};
