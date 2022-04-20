import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './components/HomePage';
import ParksPage from './components/ParksPage';
import SpeciesPage from './components/SpeciesPage';

ReactDOM.render(
  <div>
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
  </div>,
  document.getElementById('root')
);