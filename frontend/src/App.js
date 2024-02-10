import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
} from "./Routes.js";
//import {LoginPage} from "./routes/Routes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./reducx/store.js";
import { loadUser } from "./reducx/actions/user.js";
import { useSelector } from "react-redux";

const App = () => {
  const { loading } = useSelector((state) => state.user);
  useEffect(() => {
    //  axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
    //   toast.success(res.data.message);
    //   //console.log(res.data);
    //  }).catch((err) =>{
    //   toast.error(err.response.data.message);
    //  })
    Store.dispatch(loadUser());
  }, []);
  return (
    <>
    {
      loading ?(
        null
      ):(
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
      )
    }
    </>
  );
};

export default App;
