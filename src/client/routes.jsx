import React from 'react';
import {Route} from 'react-router';
import Home from './components/home';
import Async from './components/async';
import Static from './components/static';
import {getData} from './actions';

const homeInitialState = {
  checkBox: {checked: false},
  number: {value: 999}
};

const staticInitialState = {
  staticData: 'Some non-async data here'
};

export const routes = [
  <Route path="/" component={Home} initialState={homeInitialState} />,
  <Route path="/async(/:option)" component={Async} initialState={getData} />,
  <Route path="/static" component={Static} initialState={staticInitialState} />
];
