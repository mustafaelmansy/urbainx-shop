import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'


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
            {/* 1. الـ Home بقى محمي.. لو مش مسجل دخول، هيتحول تلقائي لـ /login */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            
            {/* 2. الـ Login والـ Register محميين بـ AuthRoute.. لو مسجل دخول يطرده للهوم، ولو مش مسجل يفتحوا عادي */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            
            {/* 3. باقي الصفحات زي ما هي */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />

            
            {/* 4. أي باص ضايع يرميه على الـ login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
