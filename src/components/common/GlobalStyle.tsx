import React from "react";
import { Global, css } from "@emotion/react";

const defaultStyle = css`
  :root {
    --main-bgc: #000;
    --main-color: #fff;
    --sub-bgc: #1d1d1d;
    --primary-color: #f1c959;
    --danger-color: #f15972;
    --text-color: #c3c3c3;
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
