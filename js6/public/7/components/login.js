import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import sendQuery from './sendQuery';

function Login(props) {
  return (
    <div>
      <h1>Pokemon Search</h1>
      <input className="searcBox" />
    </div>
  );
}
