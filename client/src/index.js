import React from 'react'
import ReactDOM from 'react-dom';
import {ApolloProvider} from '@apollo/react-hooks'
import ApolloClient from 'apollo-client' 
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import App from './App'

//Apollo serevr uri
const httpLink=createHttpLink({
  uri:'http://localhost:5000'
});

//create httpLink and inMemoryCache
const client=new ApolloClient({
  link:httpLink,
  cache:new InMemoryCache()
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

