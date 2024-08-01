import { fetchInstance } from '../instance';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  orderDateTime: string;
}

export const createOrder = async (token: string, optionId: number, quantity: number, message: string) => {
  const response = await fetchInstance.post('/api/orders', {
    optionId,
    quantity,
    message,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOrders = async (token: string, page: number = 0, size: number = 10) => {
  const response = await fetchInstance.get(`/api/orders?page=${page}&size=${size}&sort=orderDateTime,desc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
