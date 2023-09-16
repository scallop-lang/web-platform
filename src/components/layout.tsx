import Header from "./header";
import ScallopHead from "./scallop-head";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScallopHead />
      <Header />
      {children}
    </>
  );
};

export default Layout;
