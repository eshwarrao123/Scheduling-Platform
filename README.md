# 🗓️ Schedula — Smart Scheduling Platform

Schedula is a full-stack web-based scheduling platform inspired by Calendly. It allows users to manage availability, create events, and share booking links to schedule meetings without back-and-forth communication.

---

## 🌐 Live Demo

🔗 Live URL: https://your-app.vercel.app  
🎥 Demo Video: https://your-demo-link  

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- Secure password handling
- Session management using localStorage

---

### 📅 Event & Availability Management
- Create custom events (title, duration, description)
- Set availability slots
- Manage personal schedule

---

### 🔗 Public Booking System
- Unique booking link for each user
- Guests can view available slots
- Book meetings easily

---

### 📌 Booking Management
- Bookings stored in MongoDB
- Dashboard shows upcoming meetings
- Prevents double booking

---

### 🤖 AI Feature (Bonus)
- Generate event descriptions automatically
- Improves user experience and saves time

---

### 🌍 Timezone Support
- Detects user's local timezone
- Displays time accordingly

---

### 📥 Calendar Integration (Basic)
- Generates downloadable `.ics` file
- Can be added to Google Calendar / Outlook

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS

### Backend
- Next.js API Routes

### Database
- MongoDB (Mongoose)

### Deployment
- Vercel

---

## 🏗️ Architecture

app/
 ├── dashboard/
 ├── create-event/
 ├── availability/
 ├── book/[username]/
 ├── api/
components/
lib/
models/



---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/eshwarrao123/Scheduling-Platform.git
cd Scheduling-Platform
```



### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

### 3. Environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB connection
MONGODB_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/schedula?retryWrites=true&w=majority

# JWT secret
JWT_SECRET=your_jwt_secret_key

# AI API key (optional)
OPENAI_API_KEY=your_openai_key
```

---

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Usage

### 1. Sign up

Create an account to get your booking link.

### 2. Create events

Define event types (e.g., 30-min meeting, 1-hour call).

### 3. Set availability

Choose days and times you're available.

### 4. Share your link

Your link will look like: `https://your-app.vercel.app/book/yourusername`

### 5. Guests book meetings

Anyone can book a slot on your public page.

---

## 📂 Project Structure

```
schedula/
├── app/
│   ├── dashboard/          # User dashboard
│   ├── create-event/       # Create events
│   ├── availability/       # Manage availability
│   ├── book/[username]/    # Public booking page
│   └── api/                # API routes
├── components/             # Reusable components
├── lib/                    # Auth, database, utilities
├── models/                 # Mongoose models
├── public/                 # Static assets
└── .env.local              # Environment variables
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Availability
- `GET /api/availability` - Get availability slots
- `POST /api/availability` - Create availability
- `GET /api/availability/:id` - Get slot details
- `PUT /api/availability/:id` - Update slot
- `DELETE /api/availability/:id` - Delete slot

### Bookings
- `GET /api/book` - Get bookings
- `POST /api/book` - Create booking
- `GET /api/book/:id` - Get booking details
- `DELETE /api/book/:id` - Cancel booking

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/slots` - Get available slots

### AI
- `POST /api/ai/generate-description` - Generate event description

---

## 🧪 Testing

### Run tests

```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```

