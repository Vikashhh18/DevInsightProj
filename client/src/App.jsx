import './App.css'
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import { Outlet } from 'react-router-dom';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     <main className="min-h-screen max-w-screen-2xl w-full mx-auto px-4">
  <Outlet />
</main>
      <Footer/>
    </div>
  );
}
