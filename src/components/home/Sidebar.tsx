import React from "react";
import styled from "@emotion/styled";
import { FaCube } from "react-icons/fa";
import Search from "./Search";
import { signOut } from "../../service/firbase";

const Sidebar = ({ user }: any) => {
  const [showLogout, setShowLogout] = React.useState<boolean>(false);
  const handleLogout = (e: React.MouseEvent) => {
    setShowLogout(!showLogout);
  };
  return (
    <Base>
      <Container>
        <Title>
          <FaCube />
          Memorganized
        </Title>
        <Search />
      </Container>
      <Footer>
        <Profile src={user.photoURL} alt="" onClick={handleLogout} />
        <Button onClick={signOut}>로그아웃</Button>
      </Footer>
    </Base>
  );
};

const Base = styled.div`
  order: -1;
  height: 100%;
  position: sticky;
  top: 0;

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
