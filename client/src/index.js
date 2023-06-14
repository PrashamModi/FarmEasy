import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConfigProvider } from "antd";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "red",
            colorPrimaryHover: "black",
            borderRadius: "15px",
            colorBgContainer:"#ACBCFF",
          },
        },
        token: {
          borderRadius: "20px",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
