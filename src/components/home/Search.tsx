import React from "react";
import styled from "@emotion/styled";

const Search = () => {
  return (
    <Base>
      <input type="text" placeholder="검색어를 입력하세요" />
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
