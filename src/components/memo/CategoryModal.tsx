import styled from "@emotion/styled";
import React, { useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { css } from "@emotion/react";

const CategoryModal = ({ categoryInputRef, setShowCategoryModal, categorySearch, setCategorySearch }: any) => {
  const { category } = useContext(CategoryContext);
  const uniqueCategory = category
    .map((v: any) => v.name)
    .filter((v1: never, i: number, arr: []) => arr.indexOf(v1) === i)
    .filter((v2: any) => v2.indexOf(categorySearch) > -1);

  const handleClick = (item: string) => {
    if (categoryInputRef.current) {
      categoryInputRef.current.value = item;
    }

    setShowCategoryModal(false);
    setCategorySearch("");
  };

  return (
    <Base categoryLength={uniqueCategory.length}>
      <CategoryWrapper>
        {uniqueCategory
          .filter((item: string) => item !== "")
          .map((item: string) => {
            return (
              <CategoryItem key={item} onClick={() => handleClick(item)}>
                {item}
              </CategoryItem>
            );
          })}
      </CategoryWrapper>
    </Base>
  );
};

const Base = styled.div<{ categoryLength: number }>`
  position: absolute;
  background-color: var(--sub-bgc);
  z-index: 999;
  width: 100%;
  left: 0;
  ${({ categoryLength }) =>
    categoryLength > 0
      ? css`
          padding: 2rem 0;
        `
      : css`
          padding: 0;
        `}
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  padding: 1rem;
  margin-left: 1rem;
  border-radius: 5px;
  background-color: var(--main-bgc);

  &:hover {
    color: var(--primary-color);
  }
`;

export default CategoryModal;
