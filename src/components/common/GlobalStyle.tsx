import React from "react";
import { Global, css } from "@emotion/react";

const defaultStyle = css`
  :root {
    --main-bgc: #000;
    --main-color: #fff;
    --sub-bgc: #121212;
    --primary-color: #f1c959;
    --danger-color: #f15972;
  }

  * {
    box-sizing: border-box;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  html,
  body {
    background-color: var(--main-bgc);
    color: var(--main-color);
  }
`;

const GlobalStyle = () => {
  return <Global styles={defaultStyle}></Global>;
};

export default GlobalStyle;
