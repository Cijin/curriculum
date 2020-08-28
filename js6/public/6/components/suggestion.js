import React from 'react';
import reactStringReplace from 'react-string-replace';
function Suggestion(props) {
  const handleClick = () => {
    props.handleClick(props.name);
  };

  return (
    <div>
      <h3 onClick={handleClick}>
        {reactStringReplace(props.name, props.replaceStr, (match, i) => (
          <span className="match" key={i}>
            {match}
          </span>
        ))}
      </h3>
    </div>
  );
}

export default Suggestion;
