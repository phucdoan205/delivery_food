export const OPERATING_HOURS = [
  {
    id: "1",
    day: "Thứ Hai",
    enabled: true,
    open: "08:00 AM",
    close: "10:00 PM",
  },
  {
    id: "2",
    day: "Thứ Ba",
    enabled: true,
    open: "08:00 AM",
    close: "10:00 PM",
  },
  {
    id: "3",
    day: "Thứ Tư",
    enabled: true,
    open: "08:00 AM",
    close: "10:00 PM",
  },
  {
    id: "4",
    day: "Thứ Năm",
    enabled: false,
    note: "Nhà hàng ngừng hoạt động ngày này",
  },
  {
    id: "5",
    day: "Thứ Sáu",
    enabled: true,
    open: "08:00 AM",
    close: "10:30 PM",
  },
  {
    id: "6",
    day: "Thứ Bảy",
    enabled: true,
    open: "08:00 AM",
    close: "10:30 PM",
  },
  {
    id: "7",
    day: "Chủ Nhật",
    enabled: true,
    open: "08:00 AM",
    close: "10:30 PM",
  },
];

export const PAYMENT_METHODS = [
  { id: "1", name: "MoMo", detail: "Ví điện tử liên kết", color: "#FFF1EC" },
  { id: "2", name: "ZaloPay", detail: "Thanh toán quét mã", color: "#FFF7E6" },
];

export const PAYOUT_HISTORY = [
  {
    id: "1",
    period: "15/06 - 21/06",
    amount: "+18.240.000 đ",
    status: "success",
  },
  {
    id: "2",
    period: "08/06 - 14/06",
    amount: "+15.900.000 đ",
    status: "pending",
  },
  {
    id: "3",
    period: "01/06 - 07/06",
    amount: "+22.480.000 đ",
    status: "success",
  },
];

export const STAFF_FILTERS = ["Tất cả", "Quản lý", "Đầu bếp", "Phục vụ"];

export const REVIEW_SUMMARY = {
  average: 4.8,
  positiveCount: "1,248",
  negativeCount: "24",
};

export const CUSTOMER_REVIEWS = [
  {
    id: "1",
    name: "Minh Quân",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    rating: 5,
    time: "30 phút trước",
    comment:
      "Bún hải sản tươi và đầy đặn, nước dùng rất đậm vị. Mong quán giữ phong độ này cho các đơn tối.",
    reply:
      "Cảm ơn anh Minh Quân. Quán đã chuyển lời khen này cho bếp ngay hôm nay.",
    needsAttention: true,
  },
  {
    id: "2",
    name: "Linh Chi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    rating: 4,
    time: "1 giờ trước",
    comment:
      "Món ăn giao khá nhanh, đồ đóng gói gọn gàng. Mình muốn có thêm mức cay tùy chọn.",
    reply: "Quán ghi nhận đề xuất này và sẽ cập nhật tùy chọn trong menu sớm.",
  },
  {
    id: "3",
    name: "Hoàng Nam",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    rating: 5,
    time: "18 giờ trước",
    comment:
      "Món ít cay nhưng vị rất cân bằng, phù hợp cho cả gia đình. Sẽ quay lại.",
  },
];

export const SUPPORT_TOPICS = [
  {
    id: "1",
    title: "Chat Trực Tiếp",
    subtitle: "Hồi đáp 24/7",
    action: "Mở chat",
    iconBg: "#23C16B",
  },
  {
    id: "2",
    title: "Gọi Yêu Cầu",
    subtitle: "Nhận cuộc gọi trong 15 phút",
    action: "Tạo yêu cầu",
    iconBg: "#F5A623",
  },
  {
    id: "3",
    title: "Gửi Email Đối Tác",
    subtitle: "Dành cho các vấn đề chi tiết",
    action: "Soạn email",
    iconBg: "#F26B4F",
  },
];

export const SUPPORT_FAQS = [
  {
    id: "1",
    question: "Làm cách nào để kích hoạt thực đơn mới?",
    answer:
      "Vào quản lý món ăn, chọn Thêm món mới, điền thông tin và chuyển trạng thái sang hiển thị.",
  },
  {
    id: "2",
    question: "Khi nào tôi nhận được tiền thanh toán từ đơn hàng?",
    answer:
      "Doanh thu sẽ được đối soát và chuyển khoản theo lịch hàng tuần hiển thị trong Cài đặt thanh toán.",
  },
  {
    id: "3",
    question: "Làm sao để thiết lập nhiều ca làm việc khác nhau?",
    answer:
      "Trong Quản lý nhân viên, bạn có thể gán lịch làm việc theo vai trò cho từng nhân sự.",
  },
  {
    id: "4",
    question: "Làm cách nào để tạo chương trình khuyến mãi?",
    answer:
      "Mở mục Khuyến mãi, chọn Tạo khuyến mãi mới và cài đặt mã giảm cho từng điều kiện áp dụng.",
  },
];
