import styled from "@emotion/styled";
import React from "react";
import GlobalStyle from "./components/common/GlobalStyle";
import { ResetStyle } from "./components/common/ResetStyle";
import Layout from "./components/common/Layout";

function App() {
  return (
    <Base>
      <ResetStyle />
      <GlobalStyle />
      <Layout />
    </Base>
  );
}

const Base = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
