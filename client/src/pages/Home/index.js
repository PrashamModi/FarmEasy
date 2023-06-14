import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetProducts } from "../../api/products";
import { message } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";
import moment from "moment";

const Home = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
    age: [],
  });
  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
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

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-filter-3-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <input
            type="text"
            placeholder="Search Products Here.."
            className="border border-gray-300 rounded border-solid p-2 h-14 w-full"
          />
        </div>
        <div
          className={`grid gap-5 ${
            showFilters ? "grid-cols-4" : "grid-cols-5"
          }`}
        >
          {products?.map((product) => {
            return (
              <div
                className="border border-gray-400 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer"
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0]}
                  className="w-full h-52 p-2 rounded-md object-cover"
                  alt=""
                />
                <div className="px-2 flex flex-col">
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  <p className="text-sm ">
                    {product.age}{' '}
                    {product.age === 1 ? "Year" : "Years"} {' '}Old
                  </p>
                  <Divider />
                  <span className="text-xl font-semibold text-green-700">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;