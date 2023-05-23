import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import MemoWrapper from "../memo/MemoWrapper";
import { FaCube } from "react-icons/fa";
import { ShowSidebar } from "../../context/ShowSidebar";
import { css } from "@emotion/react";
import { AddContext } from "../../context/AddContext";
import Search from "./Search";
import { toast } from "react-hot-toast";
import logo from "./logo192.png";
import { BsFillGridFill } from "react-icons/bs";

interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

const Memo = () => {
  const { showSidebar, setShowSidebar } = useContext(ShowSidebar);
  const { setAddModal } = useContext(AddContext);
  const handleClick = () => {
    setShowSidebar(true);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const handleBeforeInstallPrompt = (event: any) => {
    event.preventDefault();

    setDeferredPrompt(event);
  };

  useEffect(() => {
    if (deferredPrompt) {
      toast(
        (t) => (
          <InstallToast>
            <img src={logo}></img>
            <span>앱을 설치해주세요</span>
            <button onClick={() => handleInstall()}>설치</button>
            <button onClick={() => toast.dismiss(t.id)}>취소</button>
          </InstallToast>
        ),
        {
          duration: 30000,
        }
      );
    }
  }, [deferredPrompt]);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("사용자가 앱 설치를 동의했습니다.");
        } else {
          console.log("사용자가 앱 설치를 동의하지 않았습니다.");
        }

        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Container>
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
          <ContaierTitle>
            <BsFillGridFill />
            Memo
          </ContaierTitle>
          <Btn>
            {deferredPrompt && <InstallBtn onClick={() => handleInstall()}>앱 설치하기</InstallBtn>}
            <AddBtn onClick={() => setAddModal(true)}>메모 추가하기</AddBtn>
          </Btn>
        </Header>

        <MemoWrapper />
      </Base>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContaierTitle = styled.span`
  background-color: #3d3d3d;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border-radius: 10px;
  justify-content: flex-start;

  > svg {
    color: #fff;
    transform: rotate(45deg);
  }
`;

const Overlay = styled.div<{ showSidebar: boolean }>`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
  width: 100%;
  height: 100%;
  position: relative;

  ${({ showSidebar }) =>
    showSidebar
      ? css`
          pointer-events: none;
        `
      : css``}
`;

const MainHeader = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  top: 0;
  background-color: var(--main-bgc);
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

const InstallToast = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  > img {
    width: 30px;
    background-color: var(--sub-bgc);
    border-radius: 50%;
  }

  > button {
    border: 0;
    background-color: #f5dfe3;
    padding: 5px 10px;
    border-radius: 5px;
  }
`;

const InstallBtn = styled.div``;

const AddBtn = styled.div``;

export default Memo;
