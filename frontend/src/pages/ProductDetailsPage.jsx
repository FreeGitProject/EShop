import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams, useSearchParams } from "react-router-dom";
//import { productData } from "../static/data.js";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  // const productName=name.replace(/-/g," ");
  // console.log(name,productName);
 // console.log("ProductDetailsPage", allProducts);
 useEffect(() => {
  if (eventData !== null) {
    const data = allEvents && allEvents.find((i) => i._id === id);
    setData(data);
  } else {
    const data = allProducts && allProducts.find((i) => i._id === id);
    setData(data);
  }
}, [allProducts, allEvents]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
        {
          !eventData && (
            <>
            {data && <SuggestedProduct data={data} />}
            </>
          )
        }
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
