import { useContext, useEffect } from "react";
import Navigation from "../components/Navigation";
import { ResearchContext } from "../context/ContextProvider";
import ResearchScreen from "./ResearchScreen";
import Qc2Print from "./Qc2Print";

const Home = () => {
  const { researchOpen, qc2Open } = useContext(ResearchContext);
  function handleBeforeunLoad(event) {
    event.preventDefault();
    return (event.returnValue = "");
  }
  useEffect(() => {
    if (researchOpen) {
      window.addEventListener("beforeunload", handleBeforeunLoad, {
        capture: true,
      });
      return () => {
        window.removeEventListener("beforeunload", handleBeforeunLoad, {
          capture: true,
        });
      };
    }
  }, [researchOpen]);
  return (
    <div className="h-screen flex flex-col">
      <div className="h-4">
        <Navigation />
      </div>
      {!researchOpen && !qc2Open && (
        <p className="text-xl mt-4 text-center">Choose the Tab</p>
      )}
      {researchOpen && <ResearchScreen />}
      {qc2Open && <Qc2Print />}
    </div>
  );
};

export default Home;
