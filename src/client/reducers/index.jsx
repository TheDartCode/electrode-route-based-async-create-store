import {combineReducers} from 'redux';

const checkBox = (store, action) => {
  if (action.type === 'TOGGLE_CHECK') {
    return {
      checked: !store.checked
    };
  }

  return store || {};
};

const number = (store, action) => {
  if (action.type === 'INC_NUMBER') {
    return {
      value: store.value + 1
    };
  } else if (action.type === 'DEC_NUMBER') {
    return {
      value: store.value - 1
    };
  }

  return store || {};
};

const asyncData = (store, action) => {
  switch (action.type) {
    case 'REQUEST_DATA':
      return {data: '<requesting>', option: action.data};
    case 'RECEIVE_DATA':
      return {data: action.data, option: store.option};
    default:
      return store || {data: '', option: ''};
  }
};

const staticData = (store) => {
  return store || '';
};

export default combineReducers({
  checkBox,
  number,
  asyncData,
  staticData
});
