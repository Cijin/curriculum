import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import Classroom from './classroom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function Routes() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact={true} path="/" component={() => <Login />} />
        <Route path="/classroom" component={() => <Classroom />} />
      </Router>
    </ApolloProvider>
  );
}

ReactDOM.render(<Routes />, document.getElementById('root'));
