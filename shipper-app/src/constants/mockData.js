export const currentUser = {
  name: 'Nguyễn Văn An',
  id: 'DRV-882910',
  avatar: 'https://i.pravatar.cc/300?u=an',
  rating: 4.9,
  reviewsCount: 1240,
  level: 'Tài xế cấp cao',
  phone: '090 123 4567',
  email: 'an.nguyen.driver@craveco.vn',
  idCard: '012345678901',
  dob: '15/05/1992',
  address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  vehicle: {
    name: 'Honda Winner X',
    plate: '29-A1 123.45',
    status: 'Đã kiểm duyệt',
    experience: '2 Năm 4 Tháng',
  },
  stats: {
    totalTrips: 1248,
    trustScore: 4.95,
    todayIncome: 842000,
    todayOrders: 12,
  }
};

export const newOrders = [
  {
    id: 'ORD-001',
    restaurant: 'Pizza 4P\'s – Hai Bà Trưng',
    distance: '2.4 km',
    duration: '8 phút',
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    income: 35000,
    bonus: 15000,
    type: 'Premium',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'ORD-002',
    restaurant: 'The Salad Bar',
    distance: '1.1 km',
    duration: '4 phút',
    address: '45 Nguyễn Huệ, Quận 1, TP.HCM',
    income: 25000,
    bonus: 0,
    type: 'Regular',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop',
  }
];

export const currentOrder = {
  id: 'CURI-99821',
  status: 'ĐANG CHUẨN BỊ',
  restaurant: {
    name: 'Phở Thìn Lò Đúc',
    address: '13 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội',
    phone: '024 1234 5678',
    lat: 10.7769,
    lng: 106.7009,
  },
  customer: {
    name: 'Nguyễn Văn A',
    address: '24 Láng Hạ, Đống Đa, Hà Nội',
    phone: '098 765 4321',
    lat: 10.7720,
    lng: 106.6980,
  },
  items: [
    { id: 1, name: 'Phở bò tái lăn', quantity: 1, note: 'Nhiều hành, không ngỏ' },
    { id: 2, name: 'Trà đá nhài', quantity: 1, note: 'Ít đường, nhiều đá' },
  ],
  note: 'Vui lòng lấy thêm tương ớt và khăn giấy khô. Cảm ơn!',
  income: 35000,
  bonus: 5000,
};

export const history = [
  {
    id: 'DH-99281',
    time: 'Hôm nay, 14:20',
    restaurant: 'The Coffee House - Trần Duy Hưng',
    destination: 'Chung cư Vinhomes West Point, Đỗ Đức...',
    income: 52000,
    status: 'Hoàn thành',
  },
  {
    id: 'DH-99278',
    time: 'Hôm nay, 12:45',
    restaurant: 'Phở Thìn Lò Đúc - Cầu Giấy',
    destination: 'Số 12, Ngõ 81, Linh Lang, Ba Đình',
    income: 38000,
    status: 'Hoàn thành',
  },
  {
    id: 'DH-99210',
    time: 'Hôm qua, 19:10',
    restaurant: 'Pizza 4P\'s - Phan Kế Bính',
    destination: 'Lotte Center, Liễu Giai',
    income: 115000,
    status: 'Hoàn thành',
  }
];

export const earnings = {
  totalIncome: 1250000,
  growth: '+12%',
  totalOrders: 24,
  totalDistance: 142,
  dailyStats: [
    { day: 'T2', value: 400 },
    { day: 'T3', value: 300 },
    { day: 'T4', value: 500 },
    { day: 'T5', value: 450 },
    { day: 'T6', value: 600 },
    { day: 'T7', value: 850 },
    { day: 'CN', value: 700 },
  ],
  transactions: [
    { id: 'TX-001', type: 'order', orderId: 'CC-9281', amount: 52000, time: '18:42', method: 'Ví' },
    { id: 'TX-002', type: 'order', orderId: 'CC-9275', amount: 48500, time: '17:15', method: 'Tiền mặt' },
    { id: 'TX-003', type: 'bonus', title: 'Thưởng hiệu suất ngày', amount: 150000, time: '16:00', program: 'Curator Pro' },
  ]
};

export const bankAccounts = [
  {
    id: 1,
    bank: 'Vietcombank',
    accountNumber: '**** **** 8899',
    accountName: 'NGUYEN VAN TAI XE',
    isDefault: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_Vietcombank.svg/2560px-Logo_Vietcombank.svg.png',
  },
  {
    id: 2,
    bank: 'Techcombank',
    accountNumber: '**** **** 4321',
    accountName: 'NGUYEN VAN TAI XE',
    isDefault: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Techcombank_logo.png/1200px-Techcombank_logo.png',
  }
];
