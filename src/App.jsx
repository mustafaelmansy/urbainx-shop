import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'

// 🔐 1. كومبوننت لحماية الصفحات اللي محتاجة تسجيل دخول (زي الكارت)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('freshcartToken');
  
  // لو مفيش توكن، اطرده لصفحة الـ Login فوراً
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // لو فيه توكن، خليه يشوف الصفحة عادي
  return children;
}

// 🔐 2. كومبوننت يمنع المستخدم المسجل إنه يدخل لصفحات الـ Login والـ Register تاني
function AuthRoute({ children }) {
  const token = localStorage.getItem('freshcartToken');
  
  // لو هو مسجل دخول أصلاً وعنده توكن، ورايح للـ login، رجعه للهوم
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <main>
          <Routes>
  <Route path="/" element={<Home />} />
  
  {/* شيلنا الـ AuthRoute من هنا عشان يفتحوا معاك صريح وقت الـ Logout */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* صفحة الكارت بتفضل محمية زي ما هي بالـ ProtectedRoute */}
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="*" element={<Navigate replace to="/" />} />
</Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
