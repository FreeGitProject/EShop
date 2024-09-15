import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
//import { getAllProducts } from "../reducx/actions/product";
import { pageSize ,server} from "../server";
import axios from "axios";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [islodingg, setislodingg] = useState(false);

  //const dispatch = useDispatch();
  const productsPerPage = parseInt(pageSize);

  console.log("isLoading",isLoading);
  useEffect(() => {
    setislodingg(true);
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${server}/product/get-all-products?page=${currentPage}&limit=${productsPerPage}`);
        //// current senario we get direct to the endpoint not dispatch
        // const data = await dispatch(
        //   getAllProducts(currentPage, productsPerPage)
        // );
        const fetchedProducts = data.products;
        setTotalProductCount(data.productCount);
        let filteredProducts = fetchedProducts;
        if (categoryData !== null) {
          filteredProducts = fetchedProducts.filter(
            (product) => product.category === categoryData
          );
        }
        setData(filteredProducts);
        setislodingg(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
    //looks not good for product page unnecessary scrollup 
    //window.scrollTo(0, 0);
  }, [currentPage, categoryData]);

  ////[currentPage, categoryData, dispatch]

  // Get current products
  const currentProducts = data;

  // Calculate total pages
  const totalPages = Math.ceil(totalProductCount / productsPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Header activeHeading={3} />
      <br />
      <br />
      {islodingg ? (
        <Loader />
      ) : (
        <div>
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {currentProducts &&
                currentProducts.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </div>
            {data && data.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products found!
              </h1>
            ) : null}
            <div className="flex justify-center my-4">
              {currentPage > 1 && (
                <button
                  onClick={prevPage}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Previous
                </button>
              )}
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button
                  onClick={nextPage}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )};

export default ProductsPage;
