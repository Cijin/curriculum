import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import Classroom from './classroom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
function Routes() {
  return (
    <Router>
      <Route exact={true} path="/" component={Login} />
      <Route path="/classroom" component={Classroom} />
    </Router>
  );
}

ReactDOM.render(<Routes />, document.getElementById('root'));
