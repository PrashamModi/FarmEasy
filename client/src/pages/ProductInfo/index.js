import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBids, GetProductById } from "../../api/products";
import { Button, message } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import Divider from "../../components/Divider";
import { useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";

const ProductInfo = () => {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({
          ...response.data,
          bids: bidsResponse.data,
        });
      }
      else{
        console.log(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  },[]);
  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* {images} */}
          <div className="flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              alt=""
              className="w-full h-96 object-cover"
            />

            <div className="flex gap-5">
              {product.images.map((image, index) => {
                return (
                  <img
                    className={
                      "w-20 h-20 object-cover rounded-md cursor pointer" +
                      (selectedImageIndex === index
                        ? "border-3 border-[#394867] border-dashed p-2 "
                        : "")
                    }
                    src={image}
                    alt=""
                    onClick={() => setSelectedImageIndex(index)}
                  />
                );
              })}
            </div>
            <Divider />
            <div>
              <h1 className="text-gray-600 mb-1">Added On</h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("MMM D , YYYY hh:mm A")}
              </span>
            </div>
          </div>
          {/*Details*/}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl font-black text-black mb-2">
                {product.name}
              </h1>
              <span className="text-lg text-gray-500">
                {product.description}
              </span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-600">
                Product Details
              </h1>
              <div className="flex justify-between mt-2 font-medium">
                <span>Price</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "YES" : "NO"}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Warrenty Available</span>
                <span>{product.warrentyAvailable ? "YES" : "NO"}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "YES" : "NO"}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Packaging Available</span>
                <span>{product.packagingAvailable ? "YES" : "NO"}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Purchased Year</span>
                <span>{moment().subtract(product.age, 'years').format("YYYY")} ({product.age} years ago)</span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-600">
                Seller Details
              </h1>
              <div className="flex justify-between mt-2 font-medium">
                <span>Name</span>
                <span>{product.seller.name}</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Email</span>
                <span>{product.seller.email}</span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-semibold text-gray-600">Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={user._id === product.seller._id}
                  className="w-40"
                >
                  New Bid
                </Button>
              </div>
              {product.showBidsOnProductPage && 
                product.bids.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-3 rounded bg-[#C0DEFF] font-sans mt-5">
                      <div className="flex justify-between text-gray-700">
                        <span>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount</span>
                        <span>₹ {bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Placed On</span>
                        <span>
                          {moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {showAddNewBid && (
          <BidModal
            product={product}
            reloadData={getData}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
          />
        )}
      </div>
    )
  );
};

export default ProductInfo;
