import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetProducts, UpdateProductStatus } from "../../api/products";
import moment from "moment";

const Products = () => {
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateProductStatus(id, status);
      dispatch(SetLoader(false));
      if(response.success){
        message.success(response.message)
        getData();
      }else{
        throw new Error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      render: (text, record) => {
        return (
          <img
            src={record?.images?.length > 0 ? record.images[0] : ""}
            alt=""
            className="w-20 h-20 object-cover rounded-full"
          />
        );
      },
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
      render : (text, record) => {
        return record.status.toUpperCase();
      }
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3">
            {status === "pending" && (
              <span
                className="underline cursor-pointer bg-[#73BBC9] text-white  font-bold rounded-2xl p-2"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                className="underline cursor-pointer bg-[#526D82] text-white  font-bold rounded-2xl p-2"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                className="underline cursor-pointer bg-[#526D82] text-white  font-bold rounded-2xl p-2"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer bg-[#A5D7E8] text-white  font-bold rounded-2xl p-2"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                UnBlock
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={products} />
    </div>
  );
};

export default Products;
