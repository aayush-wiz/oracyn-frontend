const LuminousText = ({ text }) => (
  <span className="luminous-text">
    {text.split("").map((char, index) => (
      <span key={index} style={{ animationDelay: `${index * 50}ms` }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>
);

export default LuminousText;