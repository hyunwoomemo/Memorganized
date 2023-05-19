import React from "react";
import styled from "@emotion/styled";
import Search from "../home/Search";
import Sidebar from "../home/Sidebar";
import Memo from "../home/Memo";

const Layout = () => {
  return (
    <Base>
      <Sidebar />
      <Memo />
    </Base>
  );
};

const Base = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
  gap: 2rem;
`;

export default Layout;
