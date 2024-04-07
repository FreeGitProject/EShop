import axios from "axios";
import { server } from "../../server";


// create product
export const createProduct =
  (
    name,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    shopId,
    images
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "productCreateRequest",
      });

      const { data } = await axios.post(
        `${server}/product/create-product`,
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId,
        images,
      );
      dispatch({
        type: "productCreateSuccess",
        payload: data.product,
      });
    } catch (error) {
      dispatch({
        type: "productCreateFail",
        payload: error.response.data.message,
      });
    }
  };

  // update product
export const updateProduct =
(
  id,
  name,
  description,
  category,
  tags,
  originalPrice,
  discountPrice,
  stock,
  status,
  shopId,
  images,
  isPublished,
) =>
async (dispatch) => {
  try {
    dispatch({
      type: "productUpdateRequest",
    });

    const { data } = await axios.post(
      `${server}/product/update-product`,
      id,
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      status,
      shopId,
      images,
      isPublished,
    );
    dispatch({
      type: "productUpdateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productUpdateFail",
      payload: error.response.data.message,
    });
  }
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  //const sellerToken = localStorage.getItem("seller_token");
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
    return data; // Return the response data
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};

// get all products with pagination
export const getAllProducts = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products?page=${page}&limit=${limit}`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
    return data; // Return the fetched products
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};




