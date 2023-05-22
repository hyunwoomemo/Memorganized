import React from "react";
import styled from "@emotion/styled";
import MemoWrapper from "../memo/MemoWrapper";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { AiOutlinePushpin } from "react-icons/ai";
import { FaCube } from "react-icons/fa";

const Memo = () => {
  return (
    <Base>
      <Title>
        <FaCube />
        Memorganized
      </Title>
      {/* <MemoHeader>
        <MHItem>
          <TiSortAlphabeticallyOutline />
        </MHItem>
        <MHItem>
          <AiOutlinePushpin />
        </MHItem>
      </MemoHeader> */}
      <MemoWrapper />
    </Base>
  );
};

const Base = styled.div`
  padding: 2rem;
  flex: 1 1 auto;
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MemoHeader = styled.div`
  margin: 1rem 0;
  padding: 10px;
  display: flex;
  gap: 3rem;
  border-radius: 5px;
`;

const MHItem = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 30px;
  }
`;

export default Memo;
