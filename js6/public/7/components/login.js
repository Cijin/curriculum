import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import sendQuery from './sendQuery';

const debounce = (fn, time) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  };
};

function Login(props) {
  return (
    <div>
      <h1>Pokemon Search</h1>
      <input className="searchBox" />
    </div>
  );
}

export default Login;
