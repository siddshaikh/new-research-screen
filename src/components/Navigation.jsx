import { useContext } from "react";
import { Link } from "react-router-dom";
import { ResearchContext } from "../context/ContextProvider";

const Navigation = () => {
  const { researchOpen, setResearchOpen, qc2Open, setQc2Open, handleLogout } =
    useContext(ResearchContext);

  const handleResearchScreenClick = () => {
    if (!researchOpen) {
      setResearchOpen(true);
      setQc2Open(false);
    }
  };

  const handleQc2PrintClick = () => {
    if (!qc2Open) {
      setQc2Open(true);
      setResearchOpen(false);
    }
  };

  return (
    <div
      className="rounded-lg shadow-md"
      style={{ backgroundColor: "#150734" }}
    >
      <ul className="flex justify-evenly border-b border-gray-200">
        <li className="-mb-px mr-1">
          <Link to={"/"}>
            <button className="bg-transparent inline-block py-2 px-4 text-slate-100 hover:text-slate-200 border-b-2 border-transparent hover:border-gray-500 focus:outline-none uppercase font-bold text-xl">
              Research
            </button>
          </Link>
        </li>
        <li className="-mb-px mr-1">
          <Link to={"/"}>
            <button
              className="bg-transparent inline-block py-2 px-4 text-slate-100 hover:text-slate-200 border-b-2 border-transparent hover:border-gray-500 focus:outline-none tracking-wider uppercase"
              onClick={handleResearchScreenClick}
            >
              Online
            </button>
          </Link>
        </li>
        <li className="-mb-px mr-1">
          <button
            className="bg-transparent inline-block py-2 px-4 text-slate-100 hover:text-slate-200 border-b-2 border-transparent hover:border-gray-500 focus:outline-none uppercase tracking-wider"
            onClick={handleQc2PrintClick}
          >
            Print
          </button>
        </li>
        <li className="-mb-px">
          <button
            className="bg-transparent inline-block py-2 px-4 text-slate-100 hover:text-slate-200 border-b-2 border-transparent hover:border-gray-500 focus:outline-none uppercase tracking-wider"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
