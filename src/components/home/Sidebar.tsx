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

  const { showSidebar } = useContext(ShowSidebar);

  const [hideCategory, setHideCategory] = useState(true);
  const handleCategory = () => {
    setHideCategory(!hideCategory);
  };

  return (
    <Base screenWidth={screenWidth} showSidebar={showSidebar}>
      <Container>
        <Title>
          <FaCube />
          Memorganized
        </Title>
        <Search loc="sidebar" />
        <Category onClick={handleCategory}>📚 Category</Category>
        <CategoryWrapper hideCategory={hideCategory}>
          <CategoryItem
            active={active === "전체" && !searchMemo}
            onClick={() => {
              setFilterCategory("전체");
              setSearchMemo("");
            }}
          >{`전체 (${categoryNameArray.length})`}</CategoryItem>
          {uniqueCategory.map((item: string) => {
            return (
              <CategoryItem
                style={{ paddingLeft: "10px" }}
                active={active === item && !searchMemo}
                onClick={(e) => {
                  setFilterCategory(item);
                  setSearchMemo("");
                }}
                key={item}
              >{`${item === "" ? "미분류" : item} (${categoryNameArray.filter((v: any) => v === item).length})`}</CategoryItem>
            );
          })}
        </CategoryWrapper>
      </Container>
      <Footer onClick={handleLogout}>
        <span hidden={showLogout}>🔥 welcome,</span>
        <Profile src={user.photoURL} alt="" />
        {showLogout && <Button onClick={signOut}>로그아웃</Button>}
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
  transition: all 0.3s;
  border-right: 1px solid #ffffff2b;
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
`;

const Category = styled.div`
  cursor: pointer;
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

const Footer = styled.div`
  position: absolute;
  padding: 1rem;
  bottom: 0;
  width: 100%;
  display: flex;
  border-top: 1px solid #ffffff2b;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
`;

const Profile = styled.img`
  border-radius: 50%;
  width: 30px;
  align-self: center;
`;

const Button = styled.button`
  border: 0;
  background-color: var(--sub-bgc);
  color: var(--main-text);
  padding: 3px 5px;
  border-radius: 5px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: var(--danger-color);
  }
`;

export default Sidebar;
