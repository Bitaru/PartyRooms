export default (state, { type, data, key }) => {
  switch (type) {
    case 'update':
      return { ...state, ...data };
    case 'insert':
      return { ...state, [key]: data };
    default:
      return state;
  }
};
