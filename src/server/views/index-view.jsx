//
// This is the server side entry point for the React app.
//

import ReduxRouterEngine from 'electrode-redux-router-engine';
import {routes} from '../../client/routes';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../../client/reducers';
import thunk from 'redux-thunk';
import {ssrFetch} from 'electrode-hybrid-fetch';

const Promise = require('bluebird');
import {isFunction} from 'lodash';

const thunkMiddleware = thunk.withExtraArgument(ssrFetch);

const createStorePromise = (initialState = {}) => {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
  return Promise.resolve(store);
};

const noopAction = () => () => {
  return Promise.resolve(true);
};

function createReduxStore(req, match) { // eslint-disable-line
  const route = match.renderProps.routes[0];
  const params = match.renderProps.params;

  let initialState = route.initialState;
  let initialStateLoader = noopAction;

  if (isFunction(initialState)) {
    initialStateLoader = initialState;
    initialState = {};
  }

  const storePromise = createStorePromise(initialState);

  return storePromise
    .then(store =>
      store.dispatch(initialStateLoader(params))
      .then(() => store)
    );
}

//
// This function is exported as the content for the webapp plugin.
//
// See config/default.json under plugins.webapp on specifying the content.
//
// When the Web server hits the routes handler installed by the webapp plugin, it
// will call this function to retrieve the content for SSR if it's enabled.
//
//

module.exports = (req) => {
  const app = req.server && req.server.app || req.app;
  if (!app.routesEngine) {
    app.routesEngine = new ReduxRouterEngine({routes, createReduxStore});
  }

  return app.routesEngine.render(req);
};
