import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import sendQuery from './sendQuery';
import reactStringReplace from 'react-string-replace';

const debounce = (fn, time) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

function Login(props) {
  const inputEl = useRef(null);
  const [suggestions, setSuggestions] = useState('');

  const handleClick = () => {};

  const handleChange = debounce(() => {
    const str = inputEl.current.value;
    sendQuery(`{ search(str: "${str}") { name } }`).then((data) => {
      const results = data.search || [];
      const names = results.map((pokemon, idx) => {
        return (
          <h3 onClick={handleClick} key={pokemon.name + idx}>
            {reactStringReplace(pokemon.name, str, (match, idx) => (
              <span className="match" key={idx}>
                {match}
              </span>
            ))}
          </h3>
        );
      });
      setSuggestions(names);
    });
  }, 400);

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input onChange={handleChange} ref={inputEl} className="searchBox" />
      <div>{suggestions}</div>
    </div>
  );
}

export default Login;
