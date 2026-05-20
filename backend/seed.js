const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./src/models/User');
const Restaurant = require('./src/models/Restaurant');
const Food = require('./src/models/Food');
const Category = require('./src/models/Category');
const Order = require('./src/models/Order');
const Cart = require('./src/models/Cart');

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery');
    console.log('Connected.');

    // 2. Clear existing collections
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('Collections cleared.');

    // 3. Create Users
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('123456', salt);

    const admin = await User.create({
      fullName: 'System Administrator',
      email: 'admin@culinarycurator.com',
      password: defaultPasswordHash,
      phone: '0123456789',
      role: 'admin',
      status: 'active',
      address: 'Trụ sở chính, Hà Nội'
    });

    const merchant = await User.create({
      fullName: 'Bún Chả Sinh Từ Owner',
      email: 'merchant@culinarycurator.com',
      password: defaultPasswordHash,
      phone: '0987654321',
      role: 'merchant',
      status: 'active',
      address: '12 Hàng Than, Hà Nội'
    });

    const shipper = await User.create({
      fullName: 'Nguyễn Văn Shipper',
      email: 'shipper@culinarycurator.com',
      password: defaultPasswordHash,
      phone: '0901234567',
      role: 'shipper',
      status: 'active',
      address: 'Quận 1, TP. HCM'
    });

    const customer = await User.create({
      fullName: 'Julian Henderson',
      email: 'user@culinarycurator.com',
      password: defaultPasswordHash,
      phone: '0901245678',
      role: 'user',
      status: 'active',
      address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
    });

    console.log('Users created successfully.');

    // 4. Create Categories
    console.log('Creating categories...');
    const catFood = await Category.create({ name: 'Đồ ăn', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' });
    const catDrink = await Category.create({ name: 'Đồ uống', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=200&auto=format&fit=crop' });
    const catAppetizer = await Category.create({ name: 'Khai vị', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=200&auto=format&fit=crop' });
    const catCombo = await Category.create({ name: 'Combo', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&auto=format&fit=crop' });
    const catDessert = await Category.create({ name: 'Tráng miệng', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=200&auto=format&fit=crop' });
    console.log('Categories created successfully.');

    // 5. Create Restaurants
    console.log('Creating restaurants...');
    const res1 = await Restaurant.create({
      ownerId: merchant._id,
      name: 'Bún Chả Sinh Từ',
      description: 'Hương vị bún chả truyền thống Hà Nội đậm đà khó quên.',
      address: 'Hàng Than, Hà Nội',
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      status: 'approved'
    });

    const res2 = await Restaurant.create({
      ownerId: merchant._id,
      name: 'Artisan Crust Bistro',
      description: 'Pizza đế mỏng và các món Âu tinh tuyển.',
      address: 'Quận 1, TP. HCM',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
      rating: 4.9,
      status: 'approved'
    });

    const res3 = await Restaurant.create({
      ownerId: merchant._id,
      name: 'The Green Bowl',
      description: 'Salad hữu cơ và đồ ăn uống healthy giảm cân.',
      address: 'Quận 3, TP. HCM',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
      rating: 4.7,
      status: 'approved'
    });

    console.log('Restaurants created successfully.');

    // 6. Create Foods
    console.log('Creating foods...');
    await Food.create({
      restaurantId: res1._id,
      categoryId: catFood._id,
      name: 'Bún Chả Đặc Biệt',
      description: 'Bao gồm chả băm, chả miếng nướng than, nem hải sản và bún tươi kèm rau sống.',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop',
      isAvailable: true
    });

    await Food.create({
      restaurantId: res1._id,
      categoryId: catFood._id,
      name: 'Bún Chả Nem Cua Bể',
      description: 'Nem cua bể giòn rụm kết hợp với chả nướng thơm ngon truyền thống.',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1562607349-590d2362e459?q=80&w=500&auto=format&fit=crop',
      isAvailable: true
    });

    await Food.create({
      restaurantId: res2._id,
      categoryId: catFood._id,
      name: 'Pizza Ý Truyền Thống',
      description: 'Đế bánh mỏng giòn, sốt cà chua tươi và phô mai mozzarella hảo hạng.',
      price: 185000,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=500&auto=format&fit=crop',
      isAvailable: true
    });

    await Food.create({
      restaurantId: res3._id,
      categoryId: catDrink._id,
      name: 'Trà Sữa Trân Châu Đường Đen',
      description: 'Trà sữa cao cấp kết hợp sữa tươi nguyên bản và trân châu đường đen dẻo dai.',
      price: 42000,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=500&auto=format&fit=crop',
      isAvailable: true
    });

    console.log('Foods created successfully.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
