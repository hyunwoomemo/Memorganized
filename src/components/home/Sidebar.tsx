import React from "react";
import styled from "@emotion/styled";
import { FaCube } from "react-icons/fa";
import Search from "./Search";

const Sidebar = () => {
  return (
    <Base>
      <Title>
        <FaCube />
        Memorganized
      </Title>
      <Search />
    </Base>
  );
};

const Base = styled.div`
  order: -1;
  height: 100%;
  padding: 2rem;
  position: sticky;
  top: 0;
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export default Sidebar;
