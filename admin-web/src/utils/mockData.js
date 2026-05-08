export const DASHBOARD_STATS = [
  {
    title: "TỔNG DOANH THU",
    value: "1.284M VND",
    trend: "+12.5%",
    trendType: "up",
    icon: "Wallet",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "TỔNG ĐƠN HÀNG",
    value: "3.452",
    trend: "+8.2%",
    trendType: "up",
    icon: "ShoppingBag",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "TỈ LỆ HOÀN TẤT",
    value: "94.8%",
    trend: "-0.5%",
    trendType: "down",
    icon: "CheckCircle",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "NGƯỜI DÙNG MỚI",
    value: "156",
    trend: "+24.1%",
    trendType: "up",
    icon: "Users",
    color: "bg-purple-100 text-purple-600",
  },
];

export const REVENUE_DATA = [
  { time: "06:00", revenue: 400, forecast: 450 },
  { time: "09:00", revenue: 300, forecast: 350 },
  { time: "12:00", revenue: 600, forecast: 550 },
  { time: "15:00", revenue: 800, forecast: 750 },
  { time: "18:00", revenue: 1100, forecast: 1000 },
  { time: "21:00", revenue: 500, forecast: 600 },
  { time: "00:00", revenue: 900, forecast: 850 },
];

export const TOP_RESTAURANTS = [
  {
    id: 1,
    name: "Le Gourmet Parisian",
    category: "Bistro & Grill",
    rating: 4.9,
    reviews: "1,240+",
    revenue: "245M",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
    trending: true,
  },
  {
    id: 2,
    name: "Dim Sum Master",
    category: "Ẩm thực Á Đông",
    rating: 4.7,
    reviews: "950+",
    revenue: "182M",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Phở Gia Truyền 1980",
    category: "Món Việt",
    rating: 4.8,
    reviews: "820+",
    revenue: "156M",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=100&h=100&fit=crop",
  },
];

export const TOP_DISHES = [
  {
    id: 1,
    name: "Salmon Poke Bowl",
    description: "Salad Cá Hồi Nauy & Bơ Sáp",
    price: "165.000đ",
    orders: "452 Lượt mua",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Pizza Margherita Củi",
    description: "Đế mỏng, phô mai Mozzarella tươi",
    price: "220.000đ",
    orders: "315 Lượt mua",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Combo Burger Classic",
    description: "Bò Wagyu 150g, Khoai tây chiên",
    price: "165.000đ",
    orders: "289 Lượt mua",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
  },
];

export const USERS_DATA = [
  {
    id: 1,
    name: "Nguyễn Hoàng Nam",
    email: "nam.nh@gmail.com",
    role: "KHÁCH HÀNG",
    status: "Hoạt động",
    joinedDate: "12 Thg 10, 2023",
    avatar: "https://i.pravatar.cc/150?u=nam",
  },
  {
    id: 2,
    name: "Lê Văn Hùng",
    email: "hung.lv.driver@outlook.com",
    role: "TÀI XẾ",
    status: "Bị chặn",
    joinedDate: "05 Thg 08, 2023",
    avatar: "https://i.pravatar.cc/150?u=hung",
  },
  {
    id: 3,
    name: "Phở Gia Truyền Hà Nội",
    email: "contact@phogiatruyen.vn",
    role: "ĐỐI TÁC QUÁN",
    status: "Hoạt động",
    joinedDate: "22 Thg 01, 2022",
    avatar: "https://i.pravatar.cc/150?u=pho",
  },
  {
    id: 4,
    name: "Trần Minh Phương",
    email: "phuong.tm88@yahoo.com",
    role: "KHÁCH HÀNG",
    status: "Hoạt động",
    joinedDate: "15 Thg 11, 2023",
    avatar: "https://i.pravatar.cc/150?u=phuong",
  },
];
