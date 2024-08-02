export const RouterPath = {
  root: '/',
  home: '/',
  category: '/category/:categoryId',
  myAccount: '/my-account',
  wishlist: '/wishlist',
  productsDetail: '/products/:productId',
  order: '/order',
  orders: '/orders',
  login: '/login',
  notFound: '*',
};

export const getDynamicPath = {
  category: (categoryId: string) => RouterPath.category.replace(':categoryId', categoryId),
  login: (redirect?: string) => {
    const currentRedirect = redirect ?? window.location.href;
    return `${RouterPath.login}?redirect=${encodeURIComponent(currentRedirect)}`;
  },
  productsDetail: (goodsId: number | string) =>
    RouterPath.productsDetail.replace(
      ':productId',
      typeof goodsId === 'number' ? goodsId.toString() : goodsId,
    ),
};