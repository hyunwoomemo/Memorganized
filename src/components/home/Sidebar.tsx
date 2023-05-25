import React, { useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { FaCube } from "react-icons/fa";
import Search from "./Search";
import { signOut } from "../../service/firbase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../service/firbase";
import { CategoryContext } from "../../context/CategoryContext";
import { FilterCategory } from "../../context/FilterCategory";
import { css } from "@emotion/react";
import { SearchMemo } from "../../context/SearchMemo";
import { ShowSidebar } from "../../context/ShowSidebar";
import { CgArrowUpO } from "react-icons/cg";
import { BiCategoryAlt } from "react-icons/bi";
import { FiMoon, FiSun } from "react-icons/fi";
import { IsDark } from "../../context/IsDark";
import { toast } from "react-hot-toast";
const { throttle } = require("lodash");

const Sidebar = ({ user }: any) => {
  const [showLogout, setShowLogout] = React.useState<boolean>(false);
  const handleLogout = (e: React.MouseEvent) => {
    setShowLogout(!showLogout);
  };

  const { category, setCategory } = useContext(CategoryContext);

  useEffect(() => {
    const q = query(collection(db, "memos"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().category,
      }));
      setCategory(categories);
    });

    return () => unsubscribe();
  }, []);

  const categoryNameArray = category.map((v: any) => v.name);
  const uniqueCategory = category.map((v: any) => v.name).filter((v1: never, i: number, arr: []) => arr.indexOf(v1) === i);
  const { filterCategory, setFilterCategory } = useContext(FilterCategory);
  const { searchMemo, setSearchMemo } = useContext(SearchMemo);
  const [active, setActive] = useState("전체");

  console.log(uniqueCategory, categoryNameArray);

  type Array = {
    v: string;
    i: number;
    arr: [];
  };

  // 카테고리들을 [카테고리이름, 카테고리 길이] 로 바꿔 변수에 할당
  const categoryWithLength = uniqueCategory.map((v: string, i: number, arr: []) => [v, categoryNameArray.filter((v1: string, i1: number, arr1: []) => v1 === v).length]);

  // 카테고리 정렬

  const sortedCategory = categoryWithLength.sort((a: any, b: any) => b[1] - a[1]).map((v: string, i: number, arr: []) => v[0]);

  console.log(sortedCategory);

  useEffect(() => {
    setActive(filterCategory);
  }, [filterCategory]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleResize = throttle(() => {
    setScreenWidth(window.innerWidth);
  }, 200);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 모바일 화면에서 sidebar 노출 옵션

  const { showSidebar, setShowSidebar } = useContext(ShowSidebar);

  const [hideCategory, setHideCategory] = useState(true);
  const handleCategory = () => {
    setHideCategory(!hideCategory);
  };

  // Theme 설정

  const { isDark, setIsDark } = useContext(IsDark);

  const handleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const el = document.querySelector(".toastui-editor-defaultUI");
    console.log(el);
    if (isDark) {
      document.querySelector("body")?.setAttribute("data-theme", "dark");
      el?.classList.add("toastui-editor-dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.querySelector("body")?.setAttribute("data-theme", "light");
      el?.classList.remove("toastui-editor-dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // 로그아웃 토스트

  const handleLogoutToast = () => {
    toast(
      (t) => (
        <LogoutToast>
          <span>정말 로그아웃 하시겠습니까?</span>
          <button
            onClick={() => {
              signOut();
              toast.dismiss(t.id);
            }}
          >
            확인
          </button>
          <button onClick={() => toast.dismiss(t.id)}>취소</button>
        </LogoutToast>
      ),
      {
        icon: "💤",
        /*         style: {
          background: "var(--danger-color)",
          color: "#fff",
        }, */
      }
    );
  };

  return (
    <Base screenWidth={screenWidth} showSidebar={showSidebar}>
      <Container>
        <Title>
          <FaCube />
          간편한 메모
        </Title>
        <Search loc="sidebar" />
        <Category onClick={handleCategory}>
          <span>
            <BiCategoryAlt /> Category
          </span>
          <Arrow hideCategory={hideCategory}>
            <CgArrowUpO />
          </Arrow>
        </Category>
        <CategoryWrapper hideCategory={hideCategory}>
          <CategoryItem
            active={active === "전체" && !searchMemo}
            onClick={() => {
              setFilterCategory("전체");
              setSearchMemo("");
              setShowSidebar(false);
            }}
          >{`전체 (${categoryNameArray.length})`}</CategoryItem>
          {sortedCategory.map((item: string) => {
            return (
              <CategoryItem
                style={{ paddingLeft: "10px" }}
                active={active === item && !searchMemo}
                onClick={(e) => {
                  setFilterCategory(item);
                  setSearchMemo("");
                  setShowSidebar(false);
                }}
                key={item}
              >{`${item === "" ? "미분류" : item} (${categoryNameArray.filter((v: any) => v === item).length})`}</CategoryItem>
            );
          })}
        </CategoryWrapper>
      </Container>
      <Footer>
        <Setting isDark={isDark} onClick={() => handleTheme()}>
          <FiSun />
          <FiMoon />
        </Setting>
        <div onClick={handleLogout}>
          <span hidden={showLogout}>🔥 welcome,</span>
          <Profile src={user.photoURL} alt="" />
          {showLogout && <Button onClick={() => handleLogoutToast()}>로그아웃</Button>}
        </div>
      </Footer>
    </Base>
  );
};

const Base = styled.div<{ screenWidth: number; showSidebar: boolean }>`
  order: -1;
  height: 100%;

  ${({ screenWidth }) =>
    screenWidth > 768
      ? css`
          position: sticky;
          transform: translateX(0);
        `
      : css`
          position: absolute;
          transform: translateX(-100%);
        `}

  ${({ showSidebar }) =>
    showSidebar
      ? css`
          transform: translateX(0);
        `
      : css``}
  top: 0;
  z-index: 5;
  background-color: var(--main-bgc);
  transition: transform 0.3s;
  border-right: 1px solid var(--border2-color);
  min-width: 250px;
`;

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  padding-bottom: 65px;
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 1rem 0;
`;

const Category = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  > span {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Arrow = styled.span<{ hideCategory: boolean }>`
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 20px;
  ${({ hideCategory }) =>
    hideCategory
      ? css`
          transform: rotate(180deg);
        `
      : css`
          transform: rotate(0);
        `}
`;

const CategoryWrapper = styled.div<{ hideCategory: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
  overflow-y: scroll;
  word-break: break-all;
  transform-origin: 0 0;
  transition: transform 0.3s;

  ${({ hideCategory }) =>
    hideCategory
      ? css`
          transform: scaleY(0);
        `
      : css`
          transform: scaleY(1);
        `}
`;

const CategoryItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  &:hover {
    color: var(--primary-color);
  }

  ${({ active }) =>
    active
      ? css`
          color: var(--primary-color);
        `
      : undefined}
`;

const Setting = styled.div<{ isDark: boolean }>`
  display: flex;
  padding: 10px 10px;
  background-color: var(--theme-bgc);
  gap: 5rem;
  border-radius: 25px;
  font-size: 20px;
  position: relative;
  &:after {
    transition: all 0.3s;
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    background-color: var(--theme-btn-bgc);
    height: 100%;
    border-radius: 50%;
    z-index: 2;

    ${({ isDark }) =>
      isDark
        ? css`
            transform: translateX(0);
          `
        : css`
            transform: translateX(-250%);
          `}
  }

  svg {
    z-index: 3;
  }
`;

const Footer = styled.div`
  position: absolute;
  padding: 1rem;
  bottom: 0;
  width: 100%;
  display: flex;
  border-top: 1px solid var(--border2-color);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  gap: 2rem;

  > div:last-of-type {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Profile = styled.img`
  border-radius: 50%;
  width: 30px;
  align-self: center;
`;

const Button = styled.button`
  border: 0;
  background-color: var(--border2-color);
  color: var(--main-text);
  padding: 3px 5px;
  border-radius: 5px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: var(--danger-color);
  }
`;

const LogoutToast = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  > button {
    border: 0;
    background: #ececec;
    color: #000;
    padding: 3px 6px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #d4d4d4;
    }
  }
`;

export default Sidebar;
