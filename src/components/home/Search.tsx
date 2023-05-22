import React, { useContext } from "react";
import styled from "@emotion/styled";
import { SearchMemo } from "../../context/SearchMemo";

const Search = () => {
  const { searchMemo, setSearchMemo } = useContext(SearchMemo);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMemo(e.target.value);
  };
  return (
    <Base>
      <input id="search" type="text" placeholder="검색어를 입력하세요" value={searchMemo} onChange={(e) => handleChange(e)} />
    </Base>
  );
};

const Base = styled.div`
  padding: 1rem 0;

  > input {
    background: none;
    border: 2px solid #ffffff;
    outline: none;
    border-radius: 10px;
    color: var(--main-color);
    padding: 1rem;

    &:focus {
      border: 2px solid var(--primary-color);
    }
  }
`;

export default Search;
