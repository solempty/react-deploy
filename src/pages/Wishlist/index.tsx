import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { addToWishlist, getProductDetails, getWishlistItems, removeFromWishlist } from '@/api/hooks/useWishlist';
import type { ProductData } from '@/types';

export const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const wishlistResponse = await getWishlistItems();
        const productIds = wishlistResponse.map((item: { wishId: number }) => item.wishId);
        setWishlist(productIds);
        
        const productDetails = await Promise.all(
          productIds.map(async (id: number) => {
            const product = await getProductDetails(id);
            return product;
          })
        );
        setProducts(productDetails);
      } catch (error) {
        console.error('Failed to fetch wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleToggleFavorite = async (productId: number) => {
    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return (
    <Wrapper>
      <Title>위시리스트</Title>
      {loading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : products.length > 0 ? (
        <ItemList>
          {products.map((product) => (
            <WishlistItem key={product.id}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductDetails>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
                <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
              </ProductDetails>
              <HeartButton
                onClick={() => handleToggleFavorite(product.id)}
                isFavorite={wishlist.includes(product.id)}
              >
                {wishlist.includes(product.id) ? '❤️' : '🤍'}
              </HeartButton>
            </WishlistItem>
          ))}
        </ItemList>
      ) : (
        <EmptyMessage>위시리스트가 비어 있습니다.</EmptyMessage>
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

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
`;

const WishlistItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
`;

const ProductDetails = styled.div`
  flex-grow: 1;
`;

const ProductPrice = styled.p`
  margin-top: 5px;
  font-weight: bold;
`;

const HeartButton = styled.button<{ isFavorite: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.isFavorite ? 'red' : 'grey')};
`;

const EmptyMessage = styled.p`
  font-size: 18px;
  color: #999;
`;

const LoadingMessage = styled.p`
  font-size: 18px;
  color: #333;
`;
