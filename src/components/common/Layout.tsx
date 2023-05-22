import styled from "@emotion/styled";
import Sidebar from "../home/Sidebar";
import Memo from "../home/Memo";
import { Toaster } from "react-hot-toast";

const Layout = ({ user }: any) => {
  return (
    <Base>
      <Toaster containerStyle={{ zIndex: 999 }}></Toaster>
      <Sidebar user={user} />
      <Memo />
    </Base>
  );
};

const Base = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
`;

export default Layout;
