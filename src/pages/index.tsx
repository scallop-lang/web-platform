import Header from "~/components/header";
import Playground from "~/components/playground";
import ScallopHead from "~/components/scallop-head";

const Root = () => {
  return (
    <>
      <ScallopHead />
      <div className="min-h-screen">
        <Header />
        <Playground />
      </div>
    </>
  );
};

export default Root;
