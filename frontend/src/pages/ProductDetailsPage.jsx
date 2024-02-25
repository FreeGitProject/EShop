import React, { useEffect,useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams } from "react-router-dom";
//import { productData } from "../static/data.js";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const {allProducts} = useSelector((state) => state.products);
  const {name} = useParams();
  const [data,setData] = useState(null);
  const productName=name.replace(/-/g," ");
  console.log(name,productName);
  console.log("ProductDetailsPage",allProducts);
  useEffect(()=>{
    console.log("ProductDetailsPage",allProducts);

const data= allProducts.find((i)=>i.name=== productName);
setData(data);
  },[]
  )
  return (
    <div>
      <Header />
      <ProductDetails data={data}/>
      <>
      {data && <SuggestedProduct data={data} />}
      </>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
