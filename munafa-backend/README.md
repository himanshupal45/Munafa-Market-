# Munafa Backend - MERN Stack API

## Setup

### 1. Install karo
```bash
cd munafa-backend
npm install
```

### 2. .env file banao
```bash
cp .env.example .env
```
`.env` mein apni MongoDB URI daalo:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/munafa
JWT_SECRET=apna_koi_bhi_secret_key_daalo
JWT_EXPIRE=7d
```

### 3. Admin aur default data seed karo
```bash
node seeder.js
```
Admin credentials: mobile=`9999999999`, password=`admin123`

### 4. Server start karo
```bash
npm run dev    # development (nodemon)
npm start      # production
```

---

## Frontend mein API connect karna

Frontend ke `src/` mein ek `api.js` file banao:

```js
const API_BASE = 'http://localhost:5000/api'

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.token || ''
}

export const api = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = { Authorization: `Bearer ${getToken()}` }
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : null,
  })
  return res.json()
}
```

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Apni profile |
| PUT | `/api/auth/update-profile` | Profile update |
| PUT | `/api/auth/change-password` | Password change |

### Users (Admin)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/users` | Sare users |
| GET | `/api/users/:id` | Ek user |
| PUT | `/api/users/:id/status` | Status change |
| PUT | `/api/users/:id/assign-role` | Role assign |
| PUT | `/api/users/:id/wallet` | Wallet add/deduct |
| DELETE | `/api/users/:id` | User delete |
| GET | `/api/users/roles/all` | Sare roles |
| POST | `/api/users/roles/create` | Role banao |
| PUT | `/api/users/roles/:id` | Role update |
| DELETE | `/api/users/roles/:id` | Role delete |

### Games
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/games` | Sare games |
| POST | `/api/games` | Game banao |
| PUT | `/api/games/:id` | Game update |
| DELETE | `/api/games/:id` | Game delete |
| GET | `/api/games/results` | Results |
| POST | `/api/games/results` | Result add |
| PUT | `/api/games/results/:id/publish` | Result publish + bets settle |
| GET | `/api/games/bets` | Bet report |
| POST | `/api/games/bets/place` | Bet lagao (user) |

### Wallet
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/wallet/deposits` | Deposit requests |
| GET | `/api/wallet/withdrawals` | Withdrawal requests |
| PUT | `/api/wallet/deposits/:id` | Deposit approve/reject |
| PUT | `/api/wallet/withdrawals/:id` | Withdrawal approve/reject |
| POST | `/api/wallet/deposit-request` | Deposit request bhejo |
| POST | `/api/wallet/withdraw-request` | Withdrawal request bhejo |
| GET | `/api/wallet/summary` | Summary |

### Misc
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET/POST/DELETE | `/api/notifications` | Notifications |
| GET/POST/PUT/DELETE | `/api/enquiries` | Enquiries |
| GET/POST/PUT/DELETE | `/api/banners` | Banners |
| GET/POST/PUT/DELETE | `/api/payment-qr` | Payment QR |
| GET/PUT | `/api/site-settings` | Site settings |

---

## Project Structure
```
munafa-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Login/Register
│   ├── userController.js  # Users & Roles
│   ├── gameController.js  # Games, Results, Bets
│   ├── walletController.js# Deposits & Withdrawals
│   └── miscController.js  # Notifications, Banners, etc.
├── middleware/
│   ├── auth.js            # JWT Protection
│   └── upload.js          # File upload (Multer)
├── models/
│   ├── User.js
│   ├── Role.js
│   ├── Game.js
│   ├── GameResult.js
│   ├── Bet.js
│   ├── Transaction.js
│   ├── Notification.js
│   ├── Enquiry.js
│   ├── Banner.js
│   ├── PaymentQR.js
│   └── SiteSetting.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── games.js
│   ├── wallet.js
│   └── misc.js
├── uploads/               # Uploaded images yahan store hongi
├── .env.example
├── seeder.js             # Default data seed karne ke liye
└── server.js             # Entry point
```
