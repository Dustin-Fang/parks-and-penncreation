import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import HomePage from './components/HomePage';
import ParksPage from './components/ParksPage';
import SpeciesPage from './components/SpeciesPage';
import 'antd/dist/antd.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/parks"
							render={() => (
								<ParksPage />
							)}/>
        <Route exact
							path="/species"
							render={() => (
								<SpeciesPage />
							)}/>
      </Switch>
    </Router>
    </ChakraProvider>
    </React.StrictMode>
);