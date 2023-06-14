import { Col, Form, Modal, Row, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { message } from "antd";
import { AddProduct, EditProduct } from "../../../api/products";
import Images from "./Images";
import "./products.css"

const additionalThings = [
  {
    label: "Bill Available",
    name: "billAvailable",
  },
  {
    label: "Warrenty Available",
    name: "warrentyAvailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label: "Packaging Available",
    name: "packagingAvailable",
  },
];

const rules = [
  {
    required: true,
    message: "required",
  },
];

const ProductsForm = ({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) => {
  const [selectedTab = "1", setSelectedTab] = useState("1");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values);
      }
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
        setShowProductForm(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  const formRef = useRef(null);
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);
  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => {
        formRef.current.submit();
      }}
      {...(selectedTab === "2" && { footer: false })}
    >
      <div>
        <h1 className="text-primary text-2xl text-center font-semibold uppercase">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)}
        >
          <Tabs.TabPane tab="General" key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
              <Form.Item label="Name" name="name" rules={rules}>
                <input type="text"/>
              </Form.Item>
              <Form.Item label="Description" name="description" rules={rules}>
                <textarea type="text" placeholder="Write Product Description.." />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item label="Price" name="price" rules={rules}>
                    <input type="number" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select>
                      <option value="">Select</option>
                      <option value="Fertilizers">Fertilizers</option>
                      <option value="WaterCans">WaterCans</option>
                      <option value="Pesticides">Pesticides</option>
                      <option value="Seeds">Seeds</option>
                      <option value="Tools">Tools</option>
                    </select>
        
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Age" name="age" rules={rules}>
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex gap-10">
                {additionalThings.map((item) => {
                  return (
                    <Form.Item label={item.label} name={item.name}>
                      <input
                        type="checkbox"
                        value={item.name}
                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            [item.name]: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldValue(item.name)}
                      />
                    </Form.Item>
                  );
                })}
              </div>

              <Form.Item
                label="Show Bids On Product Page"
                name="showBidsOnProductPage"
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    formRef.current.setFieldsValue({
                      showBidsOnProductPage: e.target.checked,
                    });
                  }}
                  checked={formRef.current?.getFieldValue(
                    `showBidsOnProductPage`
                  )}
                  style={{width:50 , marginLeft : 20}}
                />
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
            <Images
              selectedProduct={selectedProduct}
              getData={getData}
              setShowProductForm={setShowProductForm}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductsForm;
