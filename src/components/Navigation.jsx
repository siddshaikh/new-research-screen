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
      <ul className="flex border-b border-gray-200 justify-evenly">
        <h1 className="px-4 text-xl font-bold text-gray-500 uppercase border-transparent ">
          Research
        </h1>
        <li className="mr-1 -mb-px">
          <NavLink to={"/"}>
            <button
              className="inline-block px-4 tracking-wider text-gray-200 uppercase bg-transparent border-b-2 border-transparent hover:text-slate-500 hover:border-gray-500 focus:outline-none"
              onClick={handleResearchScreenClick}
            >
              Online
            </button>
          </NavLink>
        </li>
        <li className="mr-1 -mb-px">
          <button
            className="inline-block px-4 tracking-wider text-gray-200 uppercase bg-transparent border-b-2 border-transparent cursor-not-allowed hover:text-slate-500 hover:border-gray-500 focus:outline-none"
            onClick={handleQc2PrintClick}
            disabled
          >
            Print
          </button>
        </li>
        <li className="-mb-px">
          <button
            className="inline-block px-4 tracking-wider text-gray-200 uppercase bg-transparent border-b-2 border-transparent hover:text-slate-500 hover:border-gray-500 focus:outline-none"
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
