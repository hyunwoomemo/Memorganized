import React, { useContext } from "react";
import styled from "@emotion/styled";
import MemoWrapper from "../memo/MemoWrapper";
import { FaCube } from "react-icons/fa";
import { ShowSidebar } from "../../context/ShowSidebar";
import { css } from "@emotion/react";
import { IoIosAddCircle } from "react-icons/io";
import { AddContext } from "../../context/AddContext";

const Memo = () => {
  const { showSidebar, setShowSidebar } = useContext(ShowSidebar);
  const { setAddModal } = useContext(AddContext);
  const handleClick = () => {
    setShowSidebar(true);
  };
  return (
    <>
      <Overlay showSidebar={showSidebar} onClick={() => setShowSidebar(false)}></Overlay>
      <Base showSidebar={showSidebar}>
        <Title onClick={handleClick}>
          <FaCube />
          Memorganized
        </Title>
        <MemoWrapper />
        <CallToAction>
          <InstallBtn>앱 설치하기</InstallBtn>
          <AddBtn onClick={() => setAddModal(true)}>
            <IoIosAddCircle />
          </AddBtn>
        </CallToAction>
      </Base>
    </>
  );
};

const Overlay = styled.div<{ showSidebar: boolean }>`
  width: 100vw;
  height: 100vh;
  background-color: #00000047;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  ${({ showSidebar }) =>
    showSidebar
      ? css`
          pointer-events: all;
          display: block;
        `
      : css`
          pointer-events: none;
          display: none;
        `}
`;

const Base = styled.div<{ showSidebar: boolean }>`
  padding: 2rem;
  flex: 1 1 auto;
  position: relative;

  ${({ showSidebar }) =>
    showSidebar
      ? css`
          pointer-events: none;
        `
      : css``}
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CallToAction = styled.div`
  position: fixed;
  bottom: 2rem;
  display: flex;
  width: 100%;
  align-items: center;
`;

const InstallBtn = styled.div`
  display: flex;
  background-color: #1c1c1c;
  padding: 1rem 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  color: var(--primary-color);
  cursor: pointer;

  &:hover {
    background-color: #2d2d2d;
  }
`;

const AddBtn = styled.div`
  position: fixed;
  right: 1rem;
  cursor: pointer;
  font-size: 60px;
  color: #3e3e3e;
  backdrop-filter: blur(3px);

  &:hover {
    color: var(--primary-color);
  }
`;

export default Memo;
