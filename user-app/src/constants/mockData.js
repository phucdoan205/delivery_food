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
  { 
    id: 'v1', 
    name: 'Giảm 50% Toàn menu', 
    description: 'Áp dụng cho mọi nhà hàng đối tác từ 14:00 - 16:00', 
    code: 'SALE50',
    type: 'DISCOUNT',
    value: '50%'
  },
  { 
    id: 'v2', 
    name: 'Miễn phí vận chuyển', 
    description: 'Giảm tối đa 15.000đ cho đơn hàng từ 100k', 
    code: 'FREESHIP',
    type: 'FREE_SHIP',
    value: '15k'
  },
  { 
    id: 'v3', 
    name: 'Giảm trực tiếp 20.000đ', 
    description: 'Áp dụng cho đơn hàng trà sữa và đồ uống từ 50.000đ', 
    code: 'DRINK20',
    type: 'CASH',
    value: '20k'
  },
];

export const ORDER_HISTORY = [
  {
    id: 'ord1',
    restaurant: 'Artisan Crust Bistro',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
    items: '1x Truffle Mushroom Pizza, 2x Sparkling Lemonade',
    total: 42.50,
    status: 'Đang đến',
    time: '15-20 phút',
    date: 'Hôm nay',
    isCurrent: true,
  },
  {
    id: 'ord2',
    restaurant: 'Zen Garden Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop',
    items: 'Dragon Roll, Miso Soup, 2 more',
    total: 34.20,
    status: 'Đã hoàn thành',
    date: 'Oct 24, 2023',
    isCurrent: false,
  },
  {
    id: 'ord3',
    restaurant: 'The Green Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    items: 'Quinoa Power Salad, Ginger Tea',
    total: 18.90,
    status: 'Đã hoàn thành',
    date: 'Oct 21, 2023',
    isCurrent: false,
  },
  {
    id: 'ord4',
    restaurant: 'Stacker Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
    items: 'Double Stack, Truffle Fries',
    total: 22.45,
    status: 'Đã hoàn thành',
    date: 'Oct 18, 2023',
    isCurrent: false,
  },
];

export const ADDRESSES = [
  {
    id: 'addr1',
    type: 'Nhà',
    address: 'Số 45, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 'addr2',
    type: 'Công ty',
    address: 'Tầng 12, Tòa nhà Bitexco Financial, 2 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: false,
  },
  {
    id: 'addr3',
    type: 'Nhà bạn (Lan)',
    address: 'Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh',
    isDefault: false,
  },
];

export const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Trạng thái đơn hàng',
    description: 'Cập nhật về chuẩn bị và giao hàng',
    enabled: true,
    icon: 'package',
  },
  {
    id: 'n2',
    title: 'Tin nhắn từ tài xế',
    description: 'Liên lạc trực tiếp khi đang giao hàng',
    enabled: true,
    icon: 'message-square',
  },
  {
    id: 'n3',
    title: 'Khuyến mãi',
    description: 'Voucher độc quyền và giảm giá hàng ngày',
    enabled: true,
    icon: 'ticket',
  },
  {
    id: 'n4',
    title: 'Cập nhật hệ thống',
    description: 'Tính năng mới và bảo trì dịch vụ',
    enabled: false,
    icon: 'settings',
  },
];
