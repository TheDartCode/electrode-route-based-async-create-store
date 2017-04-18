import {delay} from 'lodash';
import fetch from 'isomorphic-fetch';

export const toggleCheck = () => {
  return {
    type: 'TOGGLE_CHECK'
  };
};

export const incNumber = () => {
  return {
    type: 'INC_NUMBER'
  };
};

export const decNumber = () => {
  return {
    type: 'DEC_NUMBER'
  };
};

const receiveData = (data) => {
  return {
    type: 'RECEIVE_DATA',
    data
  };
};

const requestData = (option) => {
  return {
    type: 'REQUEST_DATA',
    data: option
  };
};

const fetchData = () => {
  return fetch('/custom-data');
};

export const getData = (params) => {
  return (dispatch) => {
    dispatch(requestData(params.option));
    return fetchData()
      .then(respBody => respBody.json())
      .then((data) => {
        dispatch(receiveData({data, option: params.option}));
      });
  };
};
