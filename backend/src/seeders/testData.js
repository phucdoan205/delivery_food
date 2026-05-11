require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Category = require('../models/Category');

const createTestData = async () => {
  try {
    console.log('🌱 Đang kết nối database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    console.log('🌱 Đang tạo dữ liệu test...');

    // === ADMIN ===
    let admin = await User.findOne({ email: 'admin@food.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@food.com',
        password: '123456',
        phone: '0123456789',
        role: 'admin'
      });
      console.log('✅ Admin created');
    }

    // === SELLER ===
    let seller = await User.findOne({ email: 'seller@food.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Nguyễn Văn Bán Hàng',
        email: 'seller@food.com',
        password: '123456',
        phone: '0987654321',
        role: 'seller'
      });
      console.log('✅ Seller created');
    }

    // === SHOP ===
    let shop = await Shop.findOne({ owner: seller._id });
    if (!shop) {
      shop = await Shop.create({
        owner: seller._id,
        name: 'Quán Cơm Tấm Ngon - Test',
        description: 'Cơm tấm sườn bì chả - Giao nhanh 20-30 phút',
        address: '123 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
        phone: '0987654321',
        isApproved: true,
        commissionRate: 12
      });
      console.log('✅ Shop created & approved');
    }

    // === CATEGORY ===
    const catNames = ['Cơm', 'Phở - Bún', 'Đồ ăn vặt', 'Đồ uống', 'Tráng miệng'];
    for (const name of catNames) {
      await Category.findOneAndUpdate({ name }, { name }, { upsert: true });
    }
    console.log('✅ Categories created');

    // === PRODUCTS ===
    const productsData = [
      { name: "Cơm Tấm Sườn Nướng", price: 45000, description: "Sườn nướng + bì + chả + trứng" },
      { name: "Cơm Tấm Đặc Biệt", price: 55000 },
      { name: "Phở Bò Nam Định", price: 65000 },
      { name: "Bún Chả Hà Nội", price: 50000 },
      { name: "Trà Sữa Trân Châu", price: 35000 }
    ];

    for (const p of productsData) {
      await Product.findOneAndUpdate(
        { shop: shop._id, name: p.name },
        {
          shop: shop._id,
          name: p.name,
          price: p.price,
          description: p.description || "Món ngon từ quán",
          isAvailable: true
        },
        { upsert: true }
      );
    }

    console.log('\n🎉 TẠO TEST DATA THÀNH CÔNG!');
    console.log('👤 Seller  → seller@food.com / 123456');
    console.log('🏪 Shop đã được duyệt');

  } catch (error) {
    console.error('❌ Lỗi tạo test data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
};

createTestData();