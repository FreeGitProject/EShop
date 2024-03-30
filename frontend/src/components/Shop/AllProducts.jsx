import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React,{ useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllProductsShop } from '../../reducx/actions/product';
import { deleteProduct } from '../../reducx/actions/product';
import Loader from '../Layout/Loader';
import { toast } from 'react-toastify';
 
const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

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
     // window.location.reload();
    } catch (error) {
      toast.error("Failed to delete product"); // Display a generic error message
      console.error(error); // Log the error for debugging purposes
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Product Id',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 100,
      flex: 0.65,
    },
    {
      field: 'Stock',
      headerName: 'Stock',
      type: 'number',
      minWidth: 80,
      flex: 0.7,
    },

    {
      field: 'sold',
      headerName: 'Sold out',
      type: 'number',
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: 'Preview',
      flex: 0.8,
      minWidth: 50,
      headerName: '',
      type: 'number',
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
      field: 'Delete',
      flex: 0.7,
      minWidth: 80,
      headerName: '',
      type: 'number',
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
        price: '₱ ' + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
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
