import { useContext } from "react";
import Navigation from "../components/Navigation";
import { ResearchContext } from "../context/ContextProvider";
import ResearchScreen from "./ResearchScreen";
import Qc2Print from "./Qc2Print";

const Home = () => {
  const { researchOpen, qc2Open } = useContext(ResearchContext);
  return (
    <div className="h-screen">
      <Navigation />
      <p className="text-xl mt-4 text-center">
        {!researchOpen && !qc2Open && "Choose Any Tab"}
      </p>
      {researchOpen && <ResearchScreen />}
      {qc2Open && <Qc2Print />}
    </div>
  );
};

export default Home;
