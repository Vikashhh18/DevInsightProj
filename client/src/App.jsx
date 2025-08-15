import './App.css'
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     <main className="min-h-screen max-w-screen-2xl w-full mx-auto px-4">
  <Outlet />
</main>
      <Footer/>
        <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
