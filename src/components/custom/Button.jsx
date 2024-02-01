import PropTypes from "prop-types";

export default function Button({ btnText, onClick }) {
  return (
    <button
      className="bg-primary border border-gray-400 rounded px-10 uppercase text-white mt-3 tracking-wider text-[0.9em]"
      onClick={onClick}
    >
      {btnText}
    </button>
  );
}

Button.propTypes = {
  btnText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
