import React, { useState, useRef } from 'react';
import Suggestion from './suggestion';

const debounce = (fn, time) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

function Search (props) {
  const [suggestions, setSuggestions] = useState([]);
  const inputEl = userRef(null);

  const handleChange = debounce (() => {
    const str = inputEl.current.value;
    sendQuery(`{search(str: "${str}"){name}}`)
      .then((data) => {
        const result = data.search || [];
        const names = results.reduce((acc, pokemon) => {
          return acc.concat(pokemon.name);
        }, []);
        setSuggestions(names);
      }})
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
        <div className="suggestions">
          {
            suggestions.map((pokemon, idx) => {
              return <Suggestion name={pokemon}
                replaceStr={inputEl.current.value}
                handleClick={loadPokemon}
                key={idx}
              />
          })
          }
        </div>
   </div>
  )
};

export default Search;
