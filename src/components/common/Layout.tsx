import styled from "@emotion/styled";
import Sidebar from "../home/Sidebar";
import Memo from "../home/Memo";

const Layout = ({ user }: any) => {
  return (
    <Base>
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
  box-sizing: border-box;
`;

export default Layout;
