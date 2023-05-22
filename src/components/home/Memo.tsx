import React, { useContext } from "react";
import styled from "@emotion/styled";
import MemoWrapper from "../memo/MemoWrapper";
import { FaCube } from "react-icons/fa";
import { ShowSidebar } from "../../context/ShowSidebar";
import { css } from "@emotion/react";
import { AddContext } from "../../context/AddContext";
import Search from "./Search";
import { toast } from "react-hot-toast";

const Memo = () => {
  const { showSidebar, setShowSidebar } = useContext(ShowSidebar);
  const { setAddModal } = useContext(AddContext);
  const handleClick = () => {
    setShowSidebar(true);
  };

  let deferredPrompt: any;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  const installApp = () => {
    if (!deferredPrompt) {
      alert("이미 앱이 설치되어 있거나 앱을 설치할 수 없는 환경입니다");
      return;
    }

    deferredPrompt.prompt();
  };

  React.useEffect(() => {
    toast(
      (t) => (
        <span>
          Custom and <b>bold</b>
          <button onClick={installApp}>설치</button>
          <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
        </span>
      ),
      {
        duration: 10000,
      }
    );
  }, []);

  return (
    <>
      <Overlay showSidebar={showSidebar} onClick={() => setShowSidebar(false)}></Overlay>
      <Base showSidebar={showSidebar}>
        <MainHeader>
          <Title onClick={handleClick}>
            <FaCube />
            Memorganized
          </Title>
          <Search loc="main" />
        </MainHeader>
        <Header>
          <Btn>
            <InstallBtn onClick={() => installApp()}>앱 설치하기</InstallBtn>
            <AddBtn onClick={() => setAddModal(true)}>메모 추가하기</AddBtn>
          </Btn>
        </Header>
        <MemoWrapper />
      </Base>
    </>
  );
};

const Overlay = styled.div<{ showSidebar: boolean }>`
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
  position: absolute;
  z-index: 4;
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

const MainHeader = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: #000;
  z-index: 3;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0;
  @media (min-width: 768px) {
    display: none;
  }
`;

const Btn = styled.div`
  display: flex;
  gap: 1rem;
  @media (min-width: 768px) {
    margin-left: auto;
  }
  > div {
    padding: 10px 20px;
    border-radius: 25px;
    background-color: #1c1c1c;
    color: var(--primary-color);
    cursor: pointer;
    &:hover {
      background-color: #2d2d2d;
    }
    @media (max-width: 768px) {
      padding: 8px 14px;
      border-radius: 25px;
    }
  }
`;

const InstallBtn = styled.div``;

const AddBtn = styled.div``;

export default Memo;
