import React, { useState, useRef } from 'react';
import sendQuery from './sendQuery';
import Suggestion from './suggestion';

function Login(props) {
  const [pokemonName, setPokemonName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const inputEl = useRef(null);

  const loadPokemon = (name) => {
    sendQuery(`{getPokemon(str:"${name}"){name, image}}`)
      .then((result) => {
        setPokemonName(result.getPokemon.name);
        setImage(result.getPokemon.image);
        setIsLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      loadPokemon(e.target.value);    
    }
    return;    
  };

  const debounce = (fn, time) => {
    let timeout;
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(fn, time);
    };
  };

  const handleChange = debounce(() => {
      const str = inputEl.current.value;
      sendQuery(`{search(str: "${str}"){name}}`)
        .then((data) => {
          const results = data.search || [];          
          const names = results.reduce((acc, pokemon) => {
            return acc.concat(pokemon.name);
          }, []);
          setSuggestions(names);
        });
    }, 500);

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input className="searchBox"
        type="text"
        ref={inputEl}
        onChange={handleChange}
        onKeyDown={handleKeyDown}>
      </input>
      <div className="suggestions">
        {
          suggestions.map((pokemon, idx) => {
            return <Suggestion name={pokemon}
              replaceStr={inputEl.current.value}
              handleClick={loadPokemon}
              key={idx} />
          })
        }
      </div>
      {
        isLoading ? <div></div> :
        <div>
          <h1>{pokemonName}</h1>
          <img src={image}></img>
          <button className="loginButton">Login</button>
        </div>
      }
    </div>
  )
};

export default Login;