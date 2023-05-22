import Layout from "../common/Layout";

type HomeProps = {
  user: any;
};

const Home: React.FC<HomeProps> = ({ user }) => {
  return <Layout user={user}></Layout>;
};

export default Home;
