import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import GlobalStyle from "./components/common/GlobalStyle";
import { ResetStyle } from "./components/common/ResetStyle";
import Layout from "./components/common/Layout";
import { auth } from "./service/firbase";
import Login from "./components/home/Login";
import { UserContext } from "./context/UserContext";
import { AddContext } from "./context/AddContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMemo from "./components/memo/AddMemo";
import { ActiveDetailContext } from "./context/ActiveDetailContext";
import { CategoryContext } from "./context/CategoryContext";
import { FilterCategory } from "./context/FilterCategory";

function App() {
  const [user, setUser] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [activeDetail, setActiveDetail] = useState("");
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  console.log(user);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ user }}>
        <AddContext.Provider value={{ addModal, setAddModal }}>
          <ActiveDetailContext.Provider value={{ activeDetail, setActiveDetail }}>
            <CategoryContext.Provider value={{ category, setCategory }}>
              <FilterCategory.Provider value={{ filterCategory, setFilterCategory }}>
                <Base>
                  <ResetStyle />
                  <GlobalStyle />
                  {user ? <Layout user={user} /> : <Login></Login>}
                  <Routes>
                    <Route path="add-memo" element={<AddMemo />} />
                  </Routes>
                </Base>
              </FilterCategory.Provider>
            </CategoryContext.Provider>
          </ActiveDetailContext.Provider>
        </AddContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

const Base = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
