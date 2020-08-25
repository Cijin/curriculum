import React, { useRef } from 'react';

const debounce = (fn, time) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

function Search (props) {
  const inputEl = userRef(null);

  const handleChange = debounce (() => {
    const str = inputEl.current.value;
    props.handleChange(str);
  });

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      props.loadPokemon(e.target.value);
    }
  };

  return (
    <div> 
      <h1>Pokemon Search</h1>
      <input className="searchBox"
        type="text"
        ref={inputEl}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      </input>
   </div>
  )
};

export default Search;
