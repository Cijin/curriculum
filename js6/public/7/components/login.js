import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { useQuery, useLazyQuery } from '@apollo/client';

import sendQuery from './sendQuery';
import Queries from './gql-queries';

const debounce = (fn, time) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

function Login(props) {
  const inputEl = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const redirectPath = useHistory();
  const [getPokemon, { loading, data }] = useLazyQuery(Queries.GET_POKEMON);

  let suggestionsList = [];

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      getPokemon({ variables: { name: e.target.value } });
      setSuggestions('');
      inputEl.current.value = '';
    }
    return;
  };

  const handleChange = debounce(() => {
    const str = inputEl.current.value;
    sendQuery(`{ search(str: "${str}") { name } }`).then((data) => {
      setSuggestions(data.search);
    });
  }, 400);

  if (suggestions.length) {
    const str = inputEl.current.value;
    suggestionsList = suggestions.map((pokemon, idx) => {
      const handleClick = () => {
        getPokemon({ variables: { name: pokemon.name } });
        setSuggestions('');
        inputEl.current.value = '';
      };

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
  }

  const login = () => {
    if (data.getPokemon.name) {
      sendQuery(
        `{ login (pokemon: "${data.getPokemon.name}") {name} }`
      ).then((data) => redirectPath.push('/classroom'));
    }
  };

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        ref={inputEl}
        className="searchBox"
      />
      <div className="suggestions">{suggestionsList}</div>
      {data && (
        <div>
          <h3>{data.getPokemon.name}</h3>
          <img src={data.getPokemon.image} />
          <button className="loginButton" onClick={login}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
