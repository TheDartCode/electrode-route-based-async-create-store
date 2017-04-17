import React from 'react';
import {Route} from 'react-router';
import Home from './components/home';
import Async from './components/async';
import Static from './components/static';

export const routes = [
  <Route path="/" component={Home}/>,
  <Route path="/async(/:option)" component={Async} />,
  <Route path="/static" component={Static}/>
];
