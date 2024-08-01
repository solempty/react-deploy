import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { OrderItem } from '@/api/hooks/orders';
import { BASE_URL } from '@/api/instance';
import { useAuth } from '@/provider/Auth';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const authInfo = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authInfo?.token) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/orders?page=0&size=10&sort=orderDateTime,desc`, {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [authInfo]);

  return (
    <Wrapper>
      <Title>주문 목록</Title>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.id}>
            <img src={order.imageUrl} alt={order.name} />
            <h2>{order.name}</h2>
            <p>{order.price}원</p>
            <p>수량: {order.quantity}</p>
            <p>주문일: {new Date(order.orderDateTime).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <EmptyMessage>주문 내역이 없습니다.</EmptyMessage>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const EmptyMessage = styled.p`
  font-size: 18px;
  color: #999;
`;