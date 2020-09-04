import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { useQuery, useLazyQuery } from '@apollo/client';

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
  const redirectPath = useHistory();
  const [getPokemon, { loading, data }] = useLazyQuery(Queries.GET_POKEMON);
  const [searchPokemon, searchResults] = useLazyQuery(Queries.SEARCH_POKEMON);

  let suggestionsList = [];

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      getPokemon({ variables: { name: e.target.value } });
      inputEl.current.value = '';
    }
    return;
  };

  const handleChange = debounce(() => {
    const str = inputEl.current.value;
    searchPokemon({ variables: { name: str } });
  }, 400);

  if (searchResults.data && searchResults.data.search) {
    const str = inputEl.current.value;
    suggestionsList = searchResults.data.search.map((pokemon, idx) => {
      const handleClick = () => {
        getPokemon({ variables: { name: pokemon.name } });
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
