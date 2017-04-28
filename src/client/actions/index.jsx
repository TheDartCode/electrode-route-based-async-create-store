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

export const getData = (params) => {
  return (dispatch, getState, fetch) => {
    dispatch(requestData(params.option));
    return fetch('/custom-data')
      .then((data) => data.json)
      .then((data) => {
        dispatch(receiveData(data));
      });
  };
};
