import { useContext } from "react";
import { NavLink } from "react-router-dom";
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
    <div className="rounded-lg shadow-md bg-primary">
      <ul className="flex justify-evenly border-b border-gray-200">
        <h1 className=" px-4 text-gray-500 border-transparent uppercase font-bold text-xl">
          Research
        </h1>
        <li className="-mb-px mr-1">
          <NavLink to={"/"}>
            <button
              className="bg-transparent inline-block px-4 text-gray-200 hover:text-slate-500 border-b-2 border-transparent hover:border-gray-500 focus:outline-none tracking-wider uppercase"
              onClick={handleResearchScreenClick}
            >
              Online
            </button>
          </NavLink>
        </li>
        <li className="-mb-px mr-1">
          <button
            className="bg-transparent inline-block px-4 text-gray-200 hover:text-slate-500 border-b-2 border-transparent hover:border-gray-500 focus:outline-none uppercase tracking-wider cursor-not-allowed"
            onClick={handleQc2PrintClick}
            disabled
          >
            Print
          </button>
        </li>
        <li className="-mb-px">
          <button
            className="bg-transparent inline-block px-4 text-gray-200 hover:text-slate-500 border-b-2 border-transparent hover:border-gray-500 focus:outline-none uppercase tracking-wider"
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
