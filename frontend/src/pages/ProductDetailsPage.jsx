import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams, useSearchParams } from "react-router-dom";
//import { productData } from "../static/data.js";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector } from "react-redux";
import { server } from "../server.js";
import axios from "axios";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const productData = allProducts && allProducts.find((i) => i._id === id);
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `${server}/product/get-all-product/${id}`
          );
          setData(data.products);
          //productData =data.products;
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      if (!productData) 
      fetchData();
      else
      setData(productData);
    }
  }, [allProducts, allEvents]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
