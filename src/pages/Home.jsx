import { useContext, useEffect } from "react";
import Navigation from "../components/Navigation";
import { ResearchContext } from "../context/ContextProvider";
import ResearchScreen from "./ResearchScreen";
import Qc2Print from "./Qc2Print";

const Home = () => {
  const { qc2Open } = useContext(ResearchContext);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Make sure You're saving latest changes.Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <div className="h-4">
        <Navigation />
      </div>
      <ResearchScreen />
      {qc2Open && <Qc2Print />}
    </div>
  );
};

export default Home;
