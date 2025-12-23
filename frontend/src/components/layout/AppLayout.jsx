import Navbar from "./Navbar";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default AppLayout;
