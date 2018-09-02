// sets user status into store state
const forexDataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_FOREX_DATA':
      return action.payload;
    case 'SET_FOREX_DATA':
      return action.payload;
    default:
      return state;
  }
};

export default forexDataReducer;
