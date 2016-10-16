const initialState = {
  volume: 1,
  status: void 0,
};

export default (state = initialState, { type, data, key }) => {
  switch (type) {
    case 'update':
      return { ...state, ...data };
    case 'insert':
      return { ...state, [key]: data };
    default:
      return state;
  }
};
