# DGIAESG

A reference platform for the certification and directory of cooperatives committed to excellence.

## 🚀 Technologies & Tools

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build and development
- **Tailwind CSS** for styling
- **React Query** for asynchronous state management and caching
- **React Hook Form** + **Zod** for form validation
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** + **Express** (TypeScript)
- **MongoDB** with **Mongoose**
- **Zod** for API schema validation
- **JWT** for authentication
- **Multer** for image uploads
- **Swagger** (via `swagger-jsdoc` & `swagger-ui-express`) for API documentation
- **Chalk** for colorized backend logging

---

## ✨ Key Features

- **🛡️ Dynamic Certification**: Complete framework for auditing and certification of cooperatives.
- **📚 Digital Kiosk & Review**: Dedicated space for monthly digital magazines and impact reports.
- **📺 Multimedia Hub**: Centralized access to exclusive video and audio (FA TV / Podcasts).
- **📂 Personalized Library**: Member espace to save and manage articles/resources.
- **🔍 Advanced Search**: Unified search with real-time filtering by sector and date.
- **🌍 African Focus**: Data seeded and categorized by African regions and specific impact sectors.
- **📢 Newsletter System**: Interest-based subscription for targeted communications.
- **🛡️ Secure Admin Panel**: Role-based access (Admin/Editor) for complete content management.

---

## 🛠️ Setup & Configuration

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the following template:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dgiaesg
   JWT_SECRET=your_very_long_and_secure_secret
   NODE_ENV=development
   ```
4. Initialize the database (Seed with test data):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Launch the application:
   ```bash
   npm run dev
   ```

---

## 🔐 Admin Access

To access the administration dashboard:
- **URL**: `http://localhost:5173/login`
- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## 📖 API Documentation

Once the backend is running, the interactive Swagger documentation is available at:
- `http://localhost:5000/api-docs`
