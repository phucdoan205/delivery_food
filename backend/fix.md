# FOOD DELIVERY BACKEND SETUP (EXPRESS + MONGODB)

## TECH STACK

### Backend

* NodeJS
* ExpressJS
* MongoDB
* Mongoose
* JWT Authentication

### Frontend

* Expo React Native
* ReactJS Admin Web

---

# 1. INSTALL DEPENDENCIES

## Main Packages

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

---

## Development Packages

```bash
npm install nodemon --save-dev
```

---

# 2. PROJECT STRUCTURE

```txt
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Review.js
│   │   ├── Complaint.js
│   │   └── Notification.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   └── cartController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   └── cartRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── services/
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   └── app.js
│
├── server.js
├── .env
├── .gitignore
└── package.json
```

---

# 3. UPDATE package.json

## Add Scripts

```json
"scripts": {
  "start": "nodemon server.js"
}
```

---

# 4. CREATE .env FILE

## .env

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
```

---

# 5. CREATE EXPRESS APP

## src/app.js

```js
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('API Running...')
})

module.exports = app
```

---

# 6. CREATE SERVER

## server.js

```js
require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

---

# 7. CONNECT MONGODB

## src/config/db.js

```js
const mongoose = require('mongoose')

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB Connected')

  } catch (error) {

    console.log(error)

    process.exit(1)
  }
}

module.exports = connectDB
```

---

# 8. DATABASE COLLECTIONS

| Collection    | Description                  |
| ------------- | ---------------------------- |
| users         | Store all users              |
| restaurants   | Store restaurant information |
| foods         | Store food menu              |
| orders        | Store customer orders        |
| carts         | Store cart items             |
| categories    | Store food categories        |
| reviews       | Store ratings and reviews    |
| complaints    | Store complaints             |
| notifications | Store notifications          |

---

# 9. CREATE USER MODEL

## src/models/User.js

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String
  },

  avatar: {
    type: String
  },

  address: {
    type: String
  },

  role: {
    type: String,
    enum: ['user', 'merchant', 'shipper', 'admin'],
    default: 'user'
  },

  status: {
    type: String,
    enum: ['active', 'pending', 'banned'],
    default: 'active'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
```

---

# 10. CREATE RESTAURANT MODEL

## src/models/Restaurant.js

```js
const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  address: {
    type: String
  },

  image: {
    type: String
  },

  rating: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
```

---

# 11. CREATE FOOD MODEL

## src/models/Food.js

```js
const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  isAvailable: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Food', foodSchema)
```

---

# 12. CREATE CATEGORY MODEL

## src/models/Category.js

```js
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)
```

---

# 13. CREATE CART MODEL

## src/models/Cart.js

```js
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
      },

      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

}, {
  timestamps: true
})

module.exports = mongoose.model('Cart', cartSchema)
```

---

# 14. CREATE ORDER MODEL

## src/models/Order.js

```js
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },

  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
      },

      quantity: Number,

      price: Number
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  deliveryAddress: {
    type: String
  },

  paymentMethod: {
    type: String,
    enum: ['cash', 'momo', 'zalopay']
  },

  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'delivering',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
```

---

# 15. CREATE REVIEW MODEL

## src/models/Review.js

```js
const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: {
    type: String
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
```

---

# 16. CREATE COMPLAINT MODEL

## src/models/Complaint.js

```js
const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },

  message: {
    type: String
  },

  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved'],
    default: 'pending'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Complaint', complaintSchema)
```

---

# 17. CREATE NOTIFICATION MODEL

## src/models/Notification.js

```js
const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  title: {
    type: String
  },

  message: {
    type: String
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema)
```

---

# 18. CREATE JWT TOKEN FUNCTION

## src/utils/generateToken.js

```js
const jwt = require('jsonwebtoken')

const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  )

}

module.exports = generateToken
```

---

# 19. IMPORTANT ROLE SYSTEM

```txt
user      -> order food
merchant  -> manage restaurant
shipper   -> deliver orders
admin     -> manage system
```

---

# 20. IMPORTANT ORDER FLOW

```txt
pending
→ confirmed
→ preparing
→ delivering
→ completed
```

---

# 21. IMPORTANT NOTES

## DO:

* Use JWT
* Hash passwords
* Separate folders
* Use middleware
* Validate inputs

---

## DON'T:

* Store raw passwords
* Write all logic in one file
* Trust frontend role validation
* Hardcode secrets
