import { useSuspenseQuery } from '@tanstack/react-query';

import type { ProductOptionsData } from '@/types';

import { BASE_URL, fetchInstance } from '../instance';
import type { ProductDetailRequestParams } from './useGetProductDetail';

type Props = ProductDetailRequestParams;

export type ProductOptionsResponseData = ProductOptionsData[];

export const getProductOptionsPath = (productId: string) =>
  `${BASE_URL}/api/products/${productId}/options`;

export const getProductOptions = async (params: ProductDetailRequestParams): Promise<ProductOptionsResponseData> => {
  try {
    const response = await fetchInstance.get<ProductOptionsResponseData>(
      getProductOptionsPath(params.productId),
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product options:', error);
    throw new Error('Could not fetch product options');
  }
};

export const useGetProductOptions = ({ productId }: Props) => {
  return useSuspenseQuery({
    queryKey: [getProductOptionsPath(productId)],
    queryFn: () => getProductOptions({ productId }),
  });
};
