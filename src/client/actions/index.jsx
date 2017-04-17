import {delay} from 'lodash';

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
  const promise = new Promise((resolve) => {
    delay(resolve, 2500, 'Async Data has been fetched! Yay!');
  });
  return promise;
};

export const getData = (params) => {
  return (dispatch) => {
    dispatch(requestData(params.option));
    return fetchData()
      .then((data) => {
        dispatch(receiveData({data, option: params.option}));
      });
  };
};
