import React from "react";
import { Global, css } from "@emotion/react";

const defaultStyle = css`
  @font-face {
    font-family: "LINESeedKR-Bd";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Bd.woff2") format("woff2");
    font-weight: 100, 400, 700;
    font-style: normal;
  }

  :root {
    --radius-sm: 5px;
    --radius-md: 10px;
    --radius-large: 15px;
    --radius-xlarge: 20px;
    --pd-10-20: 10px 20px;
    --pd-8-14: 8px 14px;
    body {
      --main-bgc: #0a0a0a;
      --main-color: #fff;
      --sub-bgc: #1d1d1d;
      --primary-color: #f1c959;
      --danger-color: #f15972;
      --text-color: #c3c3c3;
      --wrapper-title-bgc: #3d3d3d;
      --overlay-bgc: #5d5d5d;
      --btn1-bgc: #1c1c1c;
      --btn1-hover: #2d2d2d;
      --submit-btn-bgc: #5991f1;
      --memo-viewer-bgc: #1f1f1f;
      --border1-color: #fff;
      --border2-color: #1d1d1d;
      --theme-btn-bgc: #737e31;
      --theme-bgc: #1d1d1d;
    }

    body[data-theme="light"] {
      --main-bgc: #f0f0f0;
      --main-color: #000;
      --sub-bgc: #f0f0f0;
      --primary-color: #599df1;
      --danger-color: #f15972;
      --text-color: #2e2e2e;
      --wrapper-title-bgc: #d3d3d3;
      --overlay-bgc: #000;
      --btn1-bgc: #d3d3d3;
      --btn1-hover: #d7d7d7;
      --submit-btn-bgc: #5991f1;
      --memo-viewer-bgc: #fbfbfb;
      --border1-color: #000;
      --border2-color: #c6c6c6;
      --theme-btn-bgc: #c0b4c1;
      --theme-bgc: #e4e4e4;
    }
  }

  * {
    box-sizing: border-box;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    -webkit-tap-highlight-color: transparent;

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  html,
  body {
    font-family: "LINESeedKR-Bd";
    background-color: var(--main-bgc);
    color: var(--main-color);
    overscroll-behavior-y: none;
    user-select: none;

    p {
      color: var(--text-color) !important;
    }
  }
`;

const GlobalStyle = () => {
  return <Global styles={defaultStyle}></Global>;
};

export default GlobalStyle;
