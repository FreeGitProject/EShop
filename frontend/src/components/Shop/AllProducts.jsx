import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../reducx/actions/product";
import { deleteProduct } from "../../reducx/actions/product";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [selectedIds, setSelectedIds] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteProduct(id));
      if (response && response.message) {
        toast.success(response.message); // Display success message if available
      } else {
        throw new Error("Response message not found");
      }
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete product"); // Display a generic error message
      console.error(error); // Log the error for debugging purposes
    }
  };

  const handleRowSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMultiDelete = async () => {
    try {
      // Send a DELETE request with the selected IDs
      await axios
        .delete(`${server}/product/delete-shop-products`, {
          data: { productIds: selectedIds }, // Pass selectedIds as productIds in the request body
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setSelectedIds([]); // Clear selected rows after successful deletion
        })
        .catch((error) => {
          toast.error(
            error.response.data.message || "Failed to delete products"
          );
          console.error(error);
        });
        window.location.reload();
    } catch (error) {
      toast.error("Failed to delete products");
      console.error(error);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "Select",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <Checkbox
            color="primary"
            checked={selectedIds.includes(params.id)}
            onChange={() => handleRowSelection(params.id)}
          />
        );
      },
    },
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      minWidth: 30,
      minHeight: 30,
      sortable: false,
      renderCell: (params) => {
        return (
          <img
            src={params.row.image}
            alt={params.row.name}
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.65,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.7,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 50,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "isPublished",
      headerName: "Published",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "Edit",
      flex: 0.7,
      minWidth: 80,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/dashboard-edit-product/${params.id}`}>
              <Button>
                <AiOutlineEdit size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.7,
      minWidth: 80,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "₱ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
        image: item.images[0]?.url,
        status:item.status,
        isPublished:item.isPublished,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="mb-2">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AiOutlineDelete />}
              onClick={handleMultiDelete}
              disabled={selectedIds?.length === 0}
            >
              Delete Selected
            </Button>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
