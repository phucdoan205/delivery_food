export const CATEGORIES = [
  { id: '1', name: 'Đồ ăn', icon: 'utensils' },
  { id: '2', name: 'Đồ uống', icon: 'coffee' },
  { id: '3', name: 'Khai vị', icon: 'pizza' },
  { id: '4', name: 'Combo', icon: 'package' },
  { id: '5', name: 'Tráng miệng', icon: 'ice-cream' },
];

export const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Bún Chả Sinh Từ',
    address: 'Hàng Than, Hà Nội',
    rating: 4.8,
    reviews: 500,
    time: '20-30 phút',
    distance: '1.5km',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop',
    tags: ['Đổi tác', 'Phổ biến'],
    categories: ['Món chính', 'Đồ uống', 'Khai vị'],
  },
  {
    id: 'r2',
    name: 'Artisan Crust Bistro',
    address: 'Quận 1, TP. HCM',
    rating: 4.9,
    reviews: 1200,
    time: '15-20 phút',
    distance: '0.8km',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
    tags: ['Tinh tuyển'],
    categories: ['Pizza', 'Mỳ Ý'],
  },
  {
    id: 'r3',
    name: 'The Green Bowl',
    address: 'Quận 3, TP. HCM',
    rating: 4.7,
    reviews: 800,
    time: '25-30 phút',
    distance: '2.4km',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    tags: ['Hữu cơ'],
    categories: ['Healthy Food', 'Salad'],
  },
];

export const FOOD_ITEMS = [
  {
    id: 'f1',
    restaurantId: 'r1',
    name: 'Bún Chả Đặc Biệt',
    description: 'Bao gồm chả băm, chả miếng, nem hải sản và bún tươi kèm rau sống.',
    price: 65000,
    oldPrice: 85000,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop',
    category: 'Món chính',
    isPopular: true,
  },
  {
    id: 'f2',
    restaurantId: 'r1',
    name: 'Bún Chả Nem Cua Bể',
    description: 'Nem cua bể giòn rụm kết hợp với chả nướng thơm hoa truyền thống.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1562607349-590d2362e459?q=80&w=500&auto=format&fit=crop',
    category: 'Món chính',
  },
  {
    id: 'f3',
    restaurantId: 'r2',
    name: 'Pizza Ý Truyền Thống',
    description: 'Đế bánh mỏng giòn, sốt cà chua tươi và phô mai mozzarella hảo hạng.',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=500&auto=format&fit=crop',
    category: 'Pizza',
    isPopular: true,
  },
  {
    id: 'f4',
    name: 'Trà Sữa Trân Châu Đường Đen',
    description: 'Trà sữa cao cấp kết hợp sữa tươi nguyên bản và trân châu đường đen dẻo dai.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=500&auto=format&fit=crop',
    category: 'Đồ uống',
    time: '15 phút',
    distance: '0.5km',
  },
];

export const USER_INFO = {
  name: 'Julian Henderson',
  email: 'julian.h@culinarycurator.com',
  phone: '090 123 4567',
  address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  orders: 124,
  points: '2.8k',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
};

export const VOUCHERS = [
  { id: 'v1', name: 'Giảm 50% Toàn menu', description: 'Áp dụng cho mọi nhà hàng đối tác', code: 'SALE50' },
  { id: 'v2', name: 'Miễn phí vận chuyển', description: 'Giảm tối đa 15.000đ cho đơn hàng từ 100k', code: 'FREESHIP' },
];
