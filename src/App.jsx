import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import GlobalStyle from "./components/common/GlobalStyle";
import { ResetStyle } from "./components/common/ResetStyle";
import Layout from "./components/common/Layout";
import { auth } from "./service/firbase";
import Login from "./components/home/Login";
import { UserContext } from "./context/UserContext";

function App() {
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      <Base>
        <ResetStyle />
        <GlobalStyle />
        {user ? <Layout user={user} /> : <Login></Login>}
      </Base>
    </UserContext.Provider>
  );
}

const Base = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
