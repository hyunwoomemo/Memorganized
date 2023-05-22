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
const { throttle } = require("lodash");

type Category = {
  name: string;
  id: string;
};

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
  const { setSearchMemo } = useContext(SearchMemo);
  const [active, setActive] = useState("전체");

  useEffect(() => {
    setActive(filterCategory);
  }, [filterCategory]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleResize = throttle(() => {
    setScreenWidth(window.innerWidth);
  }, 200);
  console.log(screenWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Base screenWidth={screenWidth}>
      <Container>
        <Title>
          <FaCube />
          Memorganized
        </Title>
        <Search />
        <CategoryWrapper>
          <CategoryItem active={active === "전체"} onClick={() => setFilterCategory("전체")}>{`전체 (${categoryNameArray.length})`}</CategoryItem>
          {uniqueCategory.map((item: string) => {
            return (
              <CategoryItem
                active={active === item}
                onClick={() => {
                  setFilterCategory(item);
                  setSearchMemo("");
                }}
                key={item}
              >{`${item === "" ? "미분류" : item} (${categoryNameArray.filter((v: any) => v === item).length})`}</CategoryItem>
            );
          })}
        </CategoryWrapper>
      </Container>
      <Footer>
        <Profile src={user.photoURL} alt="" onClick={handleLogout} />
        <Button onClick={signOut}>로그아웃</Button>
      </Footer>
    </Base>
  );
};

const Base = styled.div<{ screenWidth: number }>`
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
  top: 0;
  z-index: 9998;
  background-color: var(--main-bgc);
  transition: all 0.3s;

  border-right: 1px solid #ffffff2b;
`;

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: scroll;
  max-height: 300px;
`;

const CategoryItem = styled.div<{ active: boolean }>`
  padding: 1rem;
  background-color: var(--sub-bgc);
  border-radius: 5px;
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
  background-color: var(--sub-bgc);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Profile = styled.img`
  border-radius: 50%;
  width: 40px;
  align-self: center;
`;

const Button = styled.button`
  color: var(--main-text);
  background: none;
  border: 0;
  position: absolute;
  top: 5px;
  right: 5px;
  color: #d0d0d0;
  cursor: pointer;

  &:hover {
    color: var(--primary-color);
  }
`;

export default Sidebar;
