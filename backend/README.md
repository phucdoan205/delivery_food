# Food Delivery Backend - Multi Vendor

Hệ thống backend cho ứng dụng đặt đồ ăn trực tuyến đa nhà bán hàng (Multi-Vendor) tương tự ShopeeFood.

Tính năng chính:
- Hỗ trợ nhiều Seller tạo và quản lý Shop riêng
- Tính chiết khấu % tự động cho App theo từng Shop
- Quản lý sản phẩm, đơn hàng
- Xác thực JWT + phân quyền (Customer, Seller, Admin)
- Upload ảnh sản phẩm
- Seeder dữ liệu test

Công nghệ:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer upload ảnh
- dotenv, Helmet, CORS

Hướng dẫn cài đặt:

1. Cài đặt dependencies
```
npm install
```
2. Tạo file .env trong thư mục src/
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/food_delivery_db
JWT_SECRET=your_super_strong_jwt_secret_key_2026_foodapp
DEFAULT_PLATFORM_COMMISSION=15
NODE_ENV=development
```

3. Tạo dữ liệu test
```
npm run seed
```

4. Chạy Server
- Chạy trên môi trường Development:
```
npm run dev
```
- Chạy trên môi trường Production:
```
npm start
```

Tài khoản test sau khi chạy seeder:
Seller: seller@food.com / 123456
Admin: admin@food.com / 123456

Các API chính:

Auth:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Shop:
POST /api/shops
GET /api/shops/my-shop
PUT /api/shops/my-shop

Product:
POST /api/products     (hỗ trợ upload nhiều ảnh)
GET /api/products
GET /api/products/shop/:shopId

Order:
POST /api/orders
GET /api/orders/my-orders
GET /api/orders/shop-orders

Admin:
GET /api/admin/shops
PUT /api/admin/shops/:shopId/approve

Authorization:
Thêm header: Authorization: Bearer <token>

Upload ảnh:
Sử dụng multipart/form-data với field name = images

Lưu ý:
- Shop mới tạo phải được Admin duyệt mới thêm sản phẩm được
- Nên tạo thư mục src/uploads trước khi upload ảnh
- Bảo mật JWT_SECRET khi deploy
