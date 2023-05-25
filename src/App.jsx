import styled from "@emotion/styled";
import { useState, useEffect } from "react";
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
import { SearchMemo } from "./context/SearchMemo";
import { ShowSidebar } from "./context/ShowSidebar";
import { IsDark } from "./context/IsDark";

function App() {
  const [user, setUser] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [activeDetail, setActiveDetail] = useState("");
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  const [searchMemo, setSearchMemo] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDark, setIsDark] = useState(window.localStorage.getItem("theme") === "dark" ? true : false);
  console.log(user);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    window.localStorage.setItem("user", JSON.stringify(user));
  }, []);

  return (
    <Router>
      <IsDark.Provider value={{ isDark, setIsDark }}>
        <UserContext.Provider value={{ user }}>
          <AddContext.Provider value={{ addModal, setAddModal }}>
            <ActiveDetailContext.Provider value={{ activeDetail, setActiveDetail }}>
              <CategoryContext.Provider value={{ category, setCategory }}>
                <FilterCategory.Provider value={{ filterCategory, setFilterCategory }}>
                  <SearchMemo.Provider value={{ searchMemo, setSearchMemo }}>
                    <ShowSidebar.Provider value={{ showSidebar, setShowSidebar }}>
                      <Base>
                        <ResetStyle />
                        <GlobalStyle />
                        {user ? <Layout user={user} /> : <Login></Login>}
                        <Routes></Routes>
                      </Base>
                    </ShowSidebar.Provider>
                  </SearchMemo.Provider>
                </FilterCategory.Provider>
              </CategoryContext.Provider>
            </ActiveDetailContext.Provider>
          </AddContext.Provider>
        </UserContext.Provider>
      </IsDark.Provider>
    </Router>
  );
}

const Base = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
