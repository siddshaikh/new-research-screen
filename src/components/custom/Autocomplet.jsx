import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const CustomAutocomplete = ({ company, companies, setCompanies }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isListOpen, setListOpen] = useState(false);
  const componentRef = useRef();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const filteredSuggestions = company.filter((suggestion) =>
      suggestion.companyname
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
    setListOpen(!!e.target.value.trim());
  };

  const handleInputClick = () => {
    if (!isListOpen) {
      setFilteredSuggestions(company);
      setListOpen(true);
    }
  };
  const selectedCompaniesString =
    companies.length > 0
      ? `${
          company.find((suggestion) => suggestion.companyid === companies[0])
            .companyname
        }${companies.length > 1 ? "..." : ""}`
      : "";

  const handleSuggestionClick = (suggestion) => {
    const isAlreadySelected = companies.includes(suggestion.companyid);

    if (isAlreadySelected) {
      const updatedItems = companies.filter(
        (item) => item !== suggestion.companyid
      );
      setCompanies(updatedItems);
    } else {
      setCompanies([...companies, suggestion.companyid]);
    }

    setInputValue("");
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = companies.filter(
      (item) => item !== itemToRemove.companyid
    );
    setCompanies(updatedItems);
  };

  const handleOutsideClick = (e) => {
    if (componentRef.current && !componentRef.current.contains(e.target)) {
      // Click occurred outside the component, close the list
      setListOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace" && inputValue === "") {
        e.preventDefault();

        // Check if the Backspace event occurs inside the input field
        const isInputFocused =
          document.activeElement ===
          componentRef.current.querySelector("input");

        if (isInputFocused) {
          setCompanies([]);
        }
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        companies.length > 0
      ) {
        e.preventDefault();
        const lastItem = companies[companies.length - 1];
        handleRemoveItem(lastItem);
      }
    };

    const inputElement = componentRef.current.querySelector("input");
    inputElement.addEventListener("keydown", handleKeyDown);

    return () => {
      inputElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, companies]);

  return (
    <div ref={componentRef} className="relative mt-1">
      <input
        type="text"
        value={selectedCompaniesString || inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        aria-label="Companies"
        placeholder="Companies"
        className="border-2 border-gray-400 mt-2 focus:outline-none h-[25px] text-[0.8em] w-[200px] text-center placeholder-style bg-secondory hover:border-black"
        style={{ borderRadius: "3px" }}
      />
      <div
        className="absolute right-6 top-3 text-[#555] text[0.8em] cursor-pointer"
        onClick={() => setListOpen(!isListOpen)}
      >
        {isListOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
      </div>
      {isListOpen && (
        <ul className="absolute top-10 left-0 bg-white border border-gray-300 rounded-md z-50 w-[200px] h-[200px] overflow-scroll text-[0.8em]">
          <li
            aria-disabled
            className="p-2 px-4 text-gray-500"
            onClick={() => setCompanies([])}
          >
            Companies
          </li>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.companyid}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`cursor-pointer p-2 px-4 ${
                companies.includes(suggestion.companyid) ? "bg-secondory" : ""
              }`}
            >
              {suggestion.companyname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomAutocomplete.propTypes = {
  company: PropTypes.arrayOf(
    PropTypes.shape({
      companyid: PropTypes.string.isRequired,
      companyname: PropTypes.string.isRequired,
    })
  ).isRequired,
  companies: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCompanies: PropTypes.func.isRequired,
};

export default CustomAutocomplete;
