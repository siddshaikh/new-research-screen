import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const CustomAutocomplete = ({ company, companies, setCompanies }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isListOpen, setListOpen] = useState(false);
  const [selectAllFlag, setSelectAllFlag] = useState(false);
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
  const handleArrowClick = () => {
    setListOpen(!isListOpen);
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
        // eslint-disable-next-line no-dupe-else-if
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
  const handleClickAll = () => {
    const allCompanyIds = company.map((suggestion) => suggestion.companyid);
    setCompanies(allCompanyIds);
    setSelectAllFlag(true);
  };

  const handleDisselectAll = () => {
    setCompanies([]);
    setSelectAllFlag(false);
  };

  return (
    <div ref={componentRef} className="relative mt-1">
      <input
        type="text"
        value={selectedCompaniesString || inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        aria-label="Companies"
        placeholder="Companies"
        className="border border-gray-400 mt-2 focus:outline-none h-[25px] text-[0.8em] w-[200px] text-left px-4 placeholder-style bg-secondory hover:border-black"
        style={{ borderRadius: "3px" }}
      />
      <div
        role="button"
        className="absolute right-4 top-3 text-[#555] text-[0.8em] cursor-pointer bg-secondory px-3"
        onClick={handleArrowClick}
      >
        {isListOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
      </div>
      {isListOpen && (
        <ul className="absolute top-10 left-0 bg-white border border-gray-300 rounded-md z-50 w-[200px] h-[200px] overflow-scroll text-[0.8em]">
          {/* Select All and Deselect All buttons */}
          <li className="p-2 px-4 text-gray-500 flex items-center gap-4">
            <button
              onClick={handleClickAll}
              disabled={selectAllFlag}
              className={`${selectAllFlag && "cursor-not-allowed"}`}
              aria-disabled={selectAllFlag}
            >
              Select All
            </button>
            <button
              onClick={handleDisselectAll}
              disabled={!selectAllFlag}
              className={`${!selectAllFlag && "cursor-not-allowed"}`}
              aria-disabled={!selectAllFlag}
            >
              Deselect All
            </button>
          </li>

          {/* Display selected items at the top */}
          {companies.map((selectedCompanyId) => {
            const selectedSuggestion = company.find(
              (suggestion) => suggestion.companyid === selectedCompanyId
            );

            return (
              <li
                key={selectedSuggestion.companyid}
                onClick={() => handleSuggestionClick(selectedSuggestion)}
                className={`cursor-pointer p-2 px-4 bg-secondory`}
              >
                {selectedSuggestion.companyname}
              </li>
            );
          })}

          {/* Display unselected items */}
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.companyid}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`cursor-pointer p-2 px-4 ${
                companies.includes(suggestion.companyid) ? "hidden" : ""
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
