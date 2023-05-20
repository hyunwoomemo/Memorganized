import styled from "@emotion/styled";
import { signInGoogle } from "../../service/firbase";
import { FcGoogle } from "react-icons/fc";
import { FaCube } from "react-icons/fa";

const Login = () => {
  return (
    <Base>
      <Title>
        <FaCube />
        Memorganize
      </Title>
      <Button onClick={signInGoogle}>
        <FcGoogle />
        Sign in with google
      </Button>
    </Base>
  );
};

const Base = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 60px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 5rem;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  color: var(--main-text);
  border: 0;
  gap: 1rem;
  font-size: 20px;
  cursor: pointer;
  border: 1px solid #fff;
  padding: 1rem;
`;

export default Login;