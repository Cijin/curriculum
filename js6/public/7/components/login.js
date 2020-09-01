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

const loadPokemon = async (pokemon) => {
  return await sendQuery(
    `{ getPokemon (str: "${pokemon}") { name, image }}`
  ).then((data) => data.getPokemon);
};

function Login(props) {
  const inputEl = useRef(null);
  const [suggestions, setSuggestions] = useState('');
  const [pokemon, setPokemon] = useState({ name: '', image: '' });
  const redirectPath = useHistory();
  const [getPokemon, { loading, data }] = useLazyQuery(Queries.GET_POKEMON);

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13 && e.target.value) {
      const pokeObject = await loadPokemon(e.target.value);
      setPokemon({
        name: pokeObject.name,
        image: pokeObject.image,
      });
      setSuggestions('');
      inputEl.current.value = '';
    }
    return;
  };

  const handleChange = debounce(() => {
    const str = inputEl.current.value;
    sendQuery(`{ search(str: "${str}") { name } }`).then((data) => {
      const results = data.search || [];

      const names = results.map((pokemon, idx) => {
        const handleClick = async () => {
          getPokemon({ variables: { name: pokemon.name } });
          setPokemon({
            name: data.name,
            image: data.image,
          });
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
      setSuggestions(names);
    });
  }, 400);

  const login = () => {
    if (pokemon.name) {
      sendQuery(
        `{ login (pokemon: "${pokemon.name}") {name, image, lessons { title }} }`
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
      <div className="suggestions">{suggestions}</div>
      <div>
        <h3>{pokemon.name}</h3>
        <img src={pokemon.image} />
        {pokemon.name && (
          <button className="loginButton" onClick={login}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
