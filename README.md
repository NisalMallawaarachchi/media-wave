# 📷 Image Gallery - MERN Stack Application

````markdown
# 📷 Image Gallery - MERN Stack Application

A full-featured image gallery application built with the MERN stack (MongoDB, Express.js, React, Node.js) with cloud-based image storage using Cloudinary.

## ✨ Features

### 🖼️ Image Management

- Upload, view, and manage images in a beautiful grid layout
- Responsive design that works on all devices
- High-performance image loading with lazy loading
- Image details viewing with modal popup

### 👤 User Experience

- Secure authentication (signup/login)
- Bulk image uploads
- User-specific collections
- User dashboard

## 🛠️ Technologies Used

| Category      | Technologies                                                         |
| ------------- | -------------------------------------------------------------------- |
| **Frontend**  | React, Redux Toolkit, React Router, Axios, Tailwind CSS, React Icons |
| **Backend**   | Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, CORS            |
| **Storage**   | Cloudinary (Image hosting), Multer (File uploads)                    |
| **Dev Tools** | Nodemon, ESLint, Prettier, Git                                       |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (for image storage)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NisalMallawaarachchi/media-wave.git
   cd media-wave
   ```
````

2. **Set up environment variables**
   Create `.env` files in both `frontend` and `media-wave root` (not inside the backend folder) directories:

   **backend (.env)**

   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   **frontend (.env)**

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

3. **Install dependencies**

   ```bash
   # Install backend dependencies in media-ware root directory

   npm install


   # Install frontend dependencies

   cd frontend
   npm install
   ```

4. **Run the application**

   ```bash
   # Start the server (from root directory)
   npm run dev

   # Start the client (from frontend directory)
   npm run dev
   ```

   The app will be available at `http://localhost:5173/`

### Security

- JWT authentication
- Rate limiting
- Input sanitization

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Project Maintainer - [Nisal Mallawaarachchi](nisalmallawarachchi@gmail.com)

Project Link: [https://github.com/NisalMallawaarachchi/media-wave]

## Key Features of This README:

1. **Professional Badges**: Shows the MERN stack and license status at the top
2. **Organized Features**: Categorized into Image Management, Search, User Experience, and Admin sections
3. **Technology Table**: Clear visualization of all technologies used
4. **Detailed Setup**: Step-by-step installation guide with environment variables
5. **Project Structure**: Visual representation of the directory layout
6. **Advanced Features**: Highlights technical capabilities
7. **Contribution Guide**: Clear instructions for contributors
8. **Contact Information**: Makes it easy to reach the maintainer

You can copy this entire markdown content directly into your README.md file. The formatting uses standard GitHub Flavored Markdown and will render beautifully on GitHub. The emojis and visual elements make it more engaging while maintaining professional documentation standards.
