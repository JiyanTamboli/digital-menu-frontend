import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  './App.css';
import Admin from "./Pages/Admin";
import AdminLogin from "./Pages/AdminLogin";
import User from "./Pages/User";
import Navbr from "./Pages/Navbr";
import Footer from "./Pages/Footer";


function App() {
  return(
    <>
      <Router>
          <Navbr/> {/* Always render Navbar Component */}
    { <Routes>
      <Route path="/" element={<User />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin />} />
    </Routes> 
    }
    <Footer />
    </Router>
    </>
  )
}

export default App;