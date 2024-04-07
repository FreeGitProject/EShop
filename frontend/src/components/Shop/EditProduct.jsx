import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../reducx/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";
import { ProductStatus } from "../../enums/enums"; // Import ProductStatus enum if not already imported

const EditProduct = () => {
  const { id } = useParams(); // Get productId from URL params
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [status, setStatus] = useState(ProductStatus.Draft); // Default status Draft
  const [editedStatus, setEditedStatus] = useState(null); // State to track edited status
  const [showModal, setShowModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product update successfully!");
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  // Filter product based on productId
  useEffect(() => {
    const productToUpdate = products?.find((product) => product._id === id);
    if (productToUpdate) {
      setName(productToUpdate.name);
      setDescription(productToUpdate.description);
      setCategory(productToUpdate.category);
      setTags(productToUpdate.tags);
      setOriginalPrice(productToUpdate.originalPrice);
      setDiscountPrice(productToUpdate.discountPrice);
      setStock(productToUpdate.stock);
      setStatus(productToUpdate.status);
      setIsPublished(productToUpdate.isPublished);
      // Handle images separately
      if (productToUpdate.images && productToUpdate.images.length > 0) {
        const imageUrls = productToUpdate.images.map((image) => image.url);
        setImages(imageUrls);
      }
    }
  }, [products, id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    //setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const imageNew = [];
    // Use Promise.all to await all image uploads
    await Promise.all(
      images.map(async (image) => {
        // Check if the image is already uploaded (not base64 data URI)
        if (!image.startsWith("data:image")) {
          imageNew.push(image);
        } else {
          // Upload image to Cloudinary
          const {
            data: { imageUrl },
          } = await axios.post(`${server}/cloudinary/upload-image`, { image });
          imageNew.push(imageUrl);
        }
      })
    );
    // Overwrite existing image data with new image data
    setImages(imageNew);
    dispatch(
      updateProduct({
        id,
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        status: editedStatus || status, // Use editedStatus if available, otherwise use status
        shopId: seller._id,
        images,
        isPublished,
      })
    );
    setShowModal(false); // Close the modal after updating
  };
  const handleStatusChange = (newStatus) => {
    // if (newStatus !== status) {
    setEditedStatus(newStatus);
    setShowModal(true); // Open the modal for confirmation
    //}
  };
  const handleCheckboxChange = () => {
    setIsPublished(!isPublished);
  };
  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Edit Product</h5>
      {/* Status Start */}
      <div className="col-sm-6 col-6 text-right mt-2">
        <div className="col-sm-12 col-12 float-right">
          {/* Show buttons based on status */}
          {status === ProductStatus.Draft && (
            <button
              type="button"
              className="btn bg-yellow-500 text-xs px-2 py-1 mr-2"
              onClick={() => handleStatusChange(ProductStatus.Draft)}
            >
              Draft
            </button>
          )}
          {status === ProductStatus.Active && (
            <button
              type="button"
              className="btn bg-green-500 text-xs px-2 py-1 mr-2"
              onClick={() => handleStatusChange(ProductStatus.Active)}
            >
              Active
            </button>
          )}
          {status === ProductStatus.Archived && (
            <button
              type="button"
              className="btn bg-blue-500 text-xs px-2 py-1 mr-2"
              onClick={() => handleStatusChange(ProductStatus.Archived)}
            >
              Archived
            </button>
          )}
          {status === ProductStatus.Discontinued && (
            <button
              type="button"
              className="btn bg-red-500 text-xs px-2 py-1 mr-2"
              onClick={() => handleStatusChange(ProductStatus.Discontinued)}
            >
              Discontinued
            </button>
          )}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md max-w-md">
            <h2 className="text-lg font-semibold mb-3">Change Status</h2>
            <div>
              <label className="pb-2">
                New Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={editedStatus}
                onChange={(e) => setEditedStatus(parseInt(e.target.value))}
              >
                <option value={ProductStatus.Draft}>Draft</option>
                <option value={ProductStatus.Active}>Active</option>
                <option value={ProductStatus.Archived}>Archived</option>
                <option value={ProductStatus.Discontinued}>Discontinued</option>
              </select>
            </div>
            <div className="flex justify-end mt-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                 onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Status End */}
      {/* update product form */}
      <form onSubmit={handleUpdate}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
           {/* IsPublied start */}
           <div className="flex items-center">
            <label className="mr-4">Published</label>
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <span className="label flex items-center text-sm font-medium text-black">
                {isPublished ? "Yes" : "No"}
              </span>
              <span
                className={`slider flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                  isPublished ? "bg-[#227529]" : "bg-[#CCCCCE]"
                }`}
              >
                <span
                  className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                    isPublished ? "translate-x-[28px]" : ""
                  }`}
                ></span>
              </span>
            </label>
          </div>
          <br />
          {/* IsPublied start */}
          <div>
            <input
              type="submit"
              value="Update"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm hover:bg-gray-100 hover:text-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
