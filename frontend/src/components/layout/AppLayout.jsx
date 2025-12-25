import { Layout, ConfigProvider } from "antd";
import Navbar from "../layout/Navbar";

const { Content } = Layout;

const AppLayout = ({ children }) => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
