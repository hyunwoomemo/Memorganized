import React, { useContext } from "react";
import styled from "@emotion/styled";
import { SearchMemo } from "../../context/SearchMemo";
import { css } from "@emotion/react";

type SearchProps = {
  loc?: string;
};

const Search: React.FC<SearchProps> = ({ loc }) => {
  const { searchMemo, setSearchMemo } = useContext(SearchMemo);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMemo(e.target.value);
  };
  return (
    <Base loc={loc}>
      <input autoComplete="false" id="search" type="text" placeholder="검색어를 입력하세요" value={searchMemo} onChange={(e) => handleChange(e)} />
    </Base>
  );
};

const Base = styled.div<{ loc?: string }>`
  padding: 1rem 0;
  width: 100%;

  ${({ loc }) =>
    loc === "main"
      ? css`
          @media (min-width: 768px) {
            display: none;
          }
        `
      : css``}
  ${({ loc }) =>
    loc === "sidebar"
      ? css`
          @media (max-width: 768px) {
            display: none;
          }
        `
      : css``}

  > input {
    background: none;
    border: 2px solid #ffffff;
    outline: none;
    border-radius: 10px;
    color: var(--main-color);
    padding: 10px;
    width: 100%;

    &:focus {
      border: 2px solid var(--primary-color);
    }
  }
`;

export default Search;
