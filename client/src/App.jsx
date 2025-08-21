import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import OtpForm from './components/OtpForm';
import Forgot from './components/Forgot';
import AddPlace from './components/AddPlace';
import ResetPassword from './components/ResetPassword';
import PlacesList from './components/PlacesList';
import AboutUs from './components/AboutUs';
import SearchBar from './components/SearchBar';
import CityResult from './components/CityResults';
import Blog from './components/Blog';
import Admin from './components/Admin/AdminDashboard';
import Profile from './components/Profile';
import BookNow from './components/BookNow';
import Experience from './components/Experience';
import UpdatePlace from './components/UpdatePlace';
import OwnerRequestList from './components/Owner/OwnerRequestList';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ScrollToTop from './components/ScrollToTop';
import "./app.css";

function App() {

  return (
   <BrowserRouter>
   <ScrollToTop />
   <Routes>
   <Route path='/' element={<Home />}/>
    <Route path='/register' element={<Signup />}></Route>
    <Route path="/login" element={<Login />} />
    <Route path='/forgot' element={<Forgot />}/>
    <Route path='/otp-form/:email' element={<OtpForm />}/>
    <Route path='/add-places' element={<AddPlace />}/>
    <Route path='/reset-password-form' element={<ResetPassword />}/>
    <Route path='/places' element={<PlacesList />}/>
    <Route path='/about-us' element={<AboutUs />}/>
    <Route path='/search' element={<SearchBar />}/>
    <Route path="/places/:id" element={<CityResult />} />
    <Route path="/places/name/:city" element={<CityResult />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/admin/*" element={<Admin />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/book-now/:id" element={<BookNow />} />
    <Route path="/experience" element={<Experience />} />
    <Route path="/update-place/:id" element={<UpdatePlace />} />
    <Route path="/owner-dashboard" element={<OwnerDashboard />} />
    <Route path="/owner-request-list" element={<OwnerRequestList />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
  
   </Routes>
   </BrowserRouter>
  )
}

export default App
