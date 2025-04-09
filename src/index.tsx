import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider
    theme={{
      components: {
        Input: {
          activeBg: "rgb(36, 36, 36)",
          activeBorderColor: "rgb(255, 255, 255)",
          borderRadius: 100,
          colorBgContainer: "rgb(15, 15, 15)",
          colorBorder: "transparent",
          colorText: "rgb(255, 255, 255)",
          colorTextPlaceholder: "rgb(158, 158, 158)",
          hoverBg: "rgb(31, 31, 31)",
          hoverBorderColor: "rgb(46, 46, 46)",
        },
        Radio: {
          buttonBg: "rgb(15, 15, 15)",
          buttonColor: "rgb(158, 158, 158)",
          buttonSolidCheckedBg: "rgb(36, 36, 36)",
          buttonSolidCheckedColor: "rgb(255, 255, 255)",
          buttonSolidCheckedHoverBg: "rgb(46, 46, 46)",
          colorBorder: "transparent",
          colorPrimaryActive: "rgb(36, 36, 36)",
          borderRadius: 100,
        },
        Message: {
          contentBg: 'rgb(15, 15, 15)',
          colorText: 'rgb(255, 255, 255)'
        }
      },
    }}
  >
    <App />
  </ConfigProvider>
);
