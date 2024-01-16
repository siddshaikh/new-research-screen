import { useContext } from "react";
import Navigation from "../components/Navigation";
import { ResearchContext } from "../context/ContextProvider";
import ResearchScreen from "./ResearchScreen";
import Qc2Print from "./Qc2Print";

const Home = () => {
  const { qc2Open } = useContext(ResearchContext);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-4">
        <Navigation />
      </div>
      <ResearchScreen />
      {qc2Open && <Qc2Print />}
    </div>
  );
};

export default Home;
