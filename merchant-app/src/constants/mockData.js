export const RESTAURANT_INFO = {
  name: "Thanh Liêm Bistro",
  status: "open",
  rating: 4.9,
  reviews: 468,
  followers: "1.2k",
  years: "3n",
  address: "123 Lê Lợi, Quận 1, TP.HCM",
  phone: "+84 901 234 567",
  description: "Thanh Liêm Bistro mang đến trải nghiệm ẩm thực đương đại lấy cảm hứng từ kỹ thuật nấu nướng bằng củi và than, tôn vinh hương vị nguyên bản nhất.",
  categories: ["BISTRO", "FINE DINING", "FUSION"],
  image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800",
  logo: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=200",
};

export const MENU_ITEMS = [
  {
    id: "1",
    name: "Cơm Trộn Cá Hồi Tươi",
    price: 125000,
    description: "Cơm trộn dẻo thơm kết hợp cùng cá hồi Nauy tươi rói, quả bơ, trứng cá chuồn và sốt đặc biệt.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    status: "active",
    views: 1250,
    likes: 145,
    category: "Món chính",
  },
  {
    id: "2",
    name: "Pizza Margherita",
    price: 185000,
    description: "Bánh nướng củi thủ công với sốt cà chua San Marzano, phô mai Mozzarella và lá húng quế.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    status: "active",
    views: 850,
    likes: 412,
    category: "Món chính",
  },
  {
    id: "3",
    name: "Pancake Việt Quất",
    price: 95000,
    description: "Bánh xếp mềm mịn phục vụ cùng mứt việt quất tự chế và mật ong nguyên chất.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400",
    status: "inactive",
    views: 450,
    likes: 92,
    category: "Tráng miệng",
  },
  {
    id: "4",
    name: "Phở Bò Kobe",
    price: 350000,
    description: "Sử dụng thịt bò Kobe thượng hạng, nước dùng ninh xương trong 48 giờ với các loại thảo mộc.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    status: "active",
    views: 3500,
    likes: 1200,
    category: "Món chính",
  },
];

export const ORDERS = [
  {
    id: "ORD-9921",
    time: "10:45",
    relativeTime: "Vừa xong",
    status: "new",
    items: [
      { name: "Phở bò Wagyu", quantity: 2, price: 450000 },
      { name: "Chả giò cua bể", quantity: 1, price: 120000 },
    ],
    total: 570000,
    customer: {
      name: "Lê Minh Hoàng",
      phone: "+84 901 234 567",
      address: "245/10 Bùi Viện, Q.1, TP.HCM",
    },
  },
  {
    id: "ORD-9918",
    time: "10:20",
    relativeTime: "15 phút trước",
    status: "new",
    items: [
      { name: "Bún chả đặc biệt", quantity: 1, price: 85000 },
      { name: "Nước cam vắt", quantity: 1, price: 25000 },
    ],
    total: 110000,
  },
  {
    id: "ORD-9915",
    time: "10:10",
    relativeTime: "25 phút trước",
    status: "preparing",
    isLargeOrder: true,
    items: [
      { name: "Cơm tấm sườn bì chả", quantity: 4, price: 260000 },
      { name: "Gỏi cuốn tôm thịt", quantity: 2, price: 90000 },
      { name: "Cà phê sữa đá", quantity: 2, price: 60000 },
    ],
    total: 410000,
  },
];

export const DASHBOARD_STATS = {
  revenue: "12.450.000",
  revenueGrowth: "+12%",
  newOrders: 48,
  avgRating: 4.8,
  performanceData: [
    { day: "TH2", value: 40 },
    { day: "TH3", value: 65 },
    { day: "TH4", value: 45 },
    { day: "TH5", value: 80 },
    { day: "TH6", value: 95 },
    { day: "TH7", value: 110 },
    { day: "CN", value: 30 },
  ],
};

export const TOP_SELLING_DISHES = [
  { id: "1", name: "Phở Đặc Biệt", price: "85.000đ", orders: 124, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", rank: 1 },
  { id: "2", name: "Gỏi Cuốn Tôm Thịt", price: "45.000đ", orders: 98, image: "https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=400" },
];

export const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Đơn hàng mới #ORD-9922',
    description: 'Bạn có một đơn hàng mới từ Lê Minh Hoàng. Hãy bắt đầu chuẩn bị ngay!',
    time: 'Vừa xong',
    type: 'order',
    isRead: false,
  },
  {
    id: '2',
    title: 'Thanh toán thành công',
    description: 'Kỳ thanh toán 15/05 - 21/05 đã được chuyển vào tài khoản ngân hàng của bạn.',
    time: '2 giờ trước',
    type: 'payment',
    isRead: false,
  },
  {
    id: '3',
    title: 'Cập nhật hệ thống',
    description: 'Hệ thống sẽ bảo trì vào lúc 02:00 AM ngày mai. Vui lòng lưu ý.',
    time: '5 giờ trước',
    type: 'system',
    isRead: true,
  },
  {
    id: '4',
    title: 'Đánh giá mới 5 sao',
    description: 'Khách hàng "Minh Quân" đã để lại đánh giá 5 sao cho món "Phở bò Wagyu".',
    time: 'Hôm qua',
    type: 'review',
    isRead: true,
  },
];

export const PROMOTIONS = [
  {
    id: '1',
    code: 'HELLOSUMMER',
    title: 'Chào Hè Rực Rỡ',
    discount: '20%',
    status: 'active',
    usage: '145/200',
    expiry: '30/06/2026',
  },
  {
    id: '2',
    code: 'FREESHIPBISTRO',
    title: 'Miễn phí vận chuyển',
    discount: '30k',
    status: 'active',
    usage: '890/1000',
    expiry: '15/07/2026',
  },
  {
    id: '3',
    code: 'TRIANKHACHHANG',
    title: 'Tri ân khách hàng cũ',
    discount: '15%',
    status: 'expired',
    usage: '500/500',
    expiry: '01/05/2026',
  },
];

export const STAFF = [
  { id: '1', name: 'Nguyễn Minh Hoàng', role: 'Đầu bếp trưởng', status: 'online', time: '08:00 - 17:00', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200' },
  { id: '2', name: 'Lê Thị Thanh Vân', role: 'Quản lý sảnh', status: 'online', time: '14:00 - 22:00', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  { id: '3', name: 'Trần Văn Tú', role: 'Phục vụ', status: 'offline', time: 'Ca chiều', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
];
