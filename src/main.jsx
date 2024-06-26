import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './GeneradorOutfits.css';
import './index.css';
import Home from './pages/Home/Home.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import Clothes from './pages/Clothes/Clothes.jsx';
import AppNavbar from './components/AppNavbar.jsx';
import AppFooter from "./components/AppFooter.jsx";
import ClotheDetails from './pages/ClotheDetails/ClotheDetails.jsx';
import ClotheSearch from './pages/ClotheSearch/ClotheSearch.jsx';
import { loader as ClotheDetailsLoader } from './pages/ClotheDetails/ClotheDetails.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import GeneradorOutfits from './pages/GeneradorOutfits/GeneradorOutfits.jsx';
import TestUpdateOutfit from './pages/GeneradorOutfits/TestUpdateOutfit.jsx';
import Sell from './pages/Shop/Sell.jsx';
import Buy from './pages/Shop/Buy.jsx';
import ShowOutfits from './pages/Outfit/ShowOutfits.jsx';
import UpdateProfile from './pages/User/UpdateProfile.jsx';
import UserOutfits from './pages/User/UserOutfits.jsx';
import Subscribe from './pages/Shop/Subscribe.jsx';

function AppLayout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <>
      <AppNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Outlet />
      <AppFooter />
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const router = createBrowserRouter([
    {
      element: <AppLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/Login", element: <Login setIsLoggedIn={setIsLoggedIn} /> },
        { path: "/Register", element: <Register setIsLoggedIn={setIsLoggedIn} /> },
        { path: "/Dashboard", element: <Dashboard setIsLoggedIn={setIsLoggedIn}  /> },
        { path: "/Clothes", element: <Clothes /> },
        { path: "/clotheDetails/:id", element: <ClotheDetails />, loader: ClotheDetailsLoader },
        { path: "/ClotheSearch/:query", element: <ClotheSearch /> },
        { path: "/GeneradorOutfits", element: <GeneradorOutfits /> },
        { path: "/GeneradorOutfitsTest", element: <TestUpdateOutfit /> },
        { path: "/CreateOffer", element: <Sell /> },
        { path: "/BuyOffer", element: <Buy /> },
        { path: "/ShowOutfits", element: <ShowOutfits /> },
        { path: "/UpdateImageProfile", element: <UpdateProfile /> },
        { path: "/ShowCreatedOutfits", element: <UserOutfits /> },
        { path: "/Subscribe", element: <Subscribe /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={5000} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
