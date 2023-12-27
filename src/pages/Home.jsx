import { useContext } from "react";
import Navigation from "../components/Navigation";
import { ResearchContext } from "../context/ContextProvider";
import ResearchScreen from "./ResearchScreen";
import Qc2Print from "./Qc2Print";

const Home = () => {
  const { researchOpen, qc2Open } = useContext(ResearchContext);
  return (
    <div>
      <Navigation />
      {researchOpen && <ResearchScreen />}
      {qc2Open && <Qc2Print />}
    </div>
  );
};

export default Home;
