import React from 'react';

function Suggestion (props) {
  const str = props.name.replace(props.replace, 
    `<span class='match'>${props.replace}</span>`);

  return (
    <div>
      <h3 onClick={props.handleClick}>
        {
          props.name.replace(props.replaceStr,
            <span className="match">{props.replace}</span>
          )
        }
      </h3>
    </div>
  )
};

export default Suggestion;