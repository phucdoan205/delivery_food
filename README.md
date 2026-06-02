# 🍔 Delivery Food Project

Hệ thống đặt đồ ăn và giao hàng toàn diện, bao gồm các ứng dụng dành cho Người dùng (User), Cửa hàng (Merchant), Tài xế giao hàng (Shipper) và Trang quản trị (Admin).

## 📚 Tổng quan kiến trúc hệ thống

Dự án được chia thành 5 thành phần chính:
1. **`backend`**: Máy chủ Node.js (Express) cung cấp API, quản lý cơ sở dữ liệu MongoDB, xử lý xác thực (JWT), gửi email (Nodemailer), upload ảnh (Cloudinary) và kết nối thời gian thực (Socket.io).
2. **`admin-web`**: Bảng điều khiển quản trị viên xây dựng bằng React (Vite), sử dụng Tailwind CSS, Zustand để quản lý state và Recharts để vẽ biểu đồ thống kê.
3. **`user-app`**: Ứng dụng di động dành cho khách hàng đặt đồ ăn, xây dựng bằng React Native (Expo).
4. **`merchant-app`**: Ứng dụng di động dành cho chủ nhà hàng quản lý thực đơn, đơn hàng và khuyến mãi, xây dựng bằng React Native (Expo).
5. **`shipper-app`**: Ứng dụng di động dành cho tài xế nhận đơn và giao hàng, xây dựng bằng React Native (Expo).

---

## 🛠 Yêu cầu hệ thống (Prerequisites)
Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã được cài đặt:
- **Node.js** (Khuyên dùng phiên bản LTS mới nhất - v18 hoặc v20)
- **Git**
- **Điện thoại / Trình giả lập (Emulator)** cài đặt ứng dụng **Expo Go** (để chạy các app React Native).

---

## ⚙️ Hướng dẫn cài đặt khi pull dự án về

Khi bạn vừa `git pull` dự án về, bạn cần cài đặt thư viện (dependencies) cho **tất cả** các thư mục con.

Mở terminal tại thư mục gốc của dự án, sau đó chạy lần lượt các lệnh sau:

### 1. Cài đặt cho Backend
```bash
cd backend
npm install

### 2. Cài đặt cho Admin Web
```bash
cd admin-web
npm install

### 3. Cài đặt cho User App
```bash
cd user-app
npm install

### 4. Cài đặt cho Merchant App
```bash
cd merchant-app
npm install

### 5. Cài đặt cho Shipper App
```bash
cd shipper-app
npm install

> **Lưu ý:** Nếu trong quá trình chạy app (User, Merchant, Shipper) có thông báo cảnh báo về phiên bản thư viện expo không tương thích, hãy dùng lệnh `npx expo install --fix` trong từng thư mục app đó để tự động sửa lỗi.

---

## 🚀 Hướng dẫn chạy dự án

Để hệ thống hoạt động hoàn chỉnh, bạn cần chạy theo thứ tự: **Backend -> Admin -> Các Mobile App**.

### Bước 1: Chạy Backend (Bắt buộc chạy đầu tiên)
Backend cung cấp API và kết nối Database/Socket cho toàn bộ hệ thống.
- Mở terminal mới, đi tới thư mục `backend` và chạy:
```bash
cd backend
npm run dev
```
*(Backend sẽ khởi chạy bằng nodemon, tự động khởi động lại khi có thay đổi code)*

### Bước 2: Chạy Admin Web (Website quản trị)
- Mở terminal mới, đi tới thư mục `admin-web` và chạy:
```bash
cd admin-web
npm run dev
```
*(Mở đường dẫn `http://localhost:5173` trên trình duyệt để truy cập trang quản trị)*

### Bước 3: Chạy các ứng dụng Mobile (User, Merchant, Shipper)
Mỗi ứng dụng mobile cần được chạy trên một terminal riêng biệt. 

**Chạy User App:**
```bash
cd user-app
npm start
```
**Chạy Merchant App:**
```bash
cd merchant-app
npm start
```
**Chạy Shipper App:**
```bash
cd shipper-app
npm start
```

**Cách xem app (Expo):**
- Sau khi chạy `npm start`, một mã QR sẽ hiển thị trên terminal.
- **Nếu dùng điện thoại thật:** Cài app **Expo Go** từ App Store / Google Play, quét mã QR (iOS dùng camera mặc định, Android dùng ứng dụng Expo Go quét). 
- **Nếu dùng trình giả lập (Android Studio / Xcode):** Nhấn phím `a` (cho Android) hoặc `i` (cho iOS) trực tiếp trên terminal đang chạy.
- **Nếu muốn chạy trên web browser:** Nhấn phím `w`.

> **⚠️ Chú ý quan trọng về kết nối mạng:** 
> Để các app điện thoại gọi API được tới Backend, bạn cần đảm bảo cấu hình URL gọi API trong source code frontend hoặc file `.env` đang trỏ tới **địa chỉ IPv4 của máy tính bạn** (ví dụ: `http://192.168.1.5:3000`) thay vì `localhost`. Điện thoại và máy tính phải dùng chung một mạng Wi-Fi.

---
## 📝 Môi trường cấu hình (Environment Variables)
Đảm bảo bạn có file `.env` trong thư mục `backend` chứa các cấu hình cần thiết, ví dụ:
- `MONGO_URI`: Chuỗi kết nối đến cơ sở dữ liệu MongoDB.
- `PORT`: Cổng chạy server (Thường là 3000, 4000 hoặc 5000).
- Các keys cấu hình cho JWT (Xác thực), Cloudinary (Lưu trữ ảnh), và Nodemailer (Gửi Email OTP).

*(Nếu file `.env` bị bỏ qua bởi `.gitignore`, hãy xin các khóa bảo mật này từ team của bạn)*
