// src/features/redux/someReducer.js

// Define el estado inicial
const initialState = {
    data: [],  // Este es solo un ejemplo, puede ser lo que necesites
    loading: false,
    error: null
  };
  
  // Crea el reducer
  const someReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_DATA_REQUEST':
        return {
          ...state,
          loading: true
        };
      case 'FETCH_DATA_SUCCESS':
        return {
          ...state,
          loading: false,
          data: action.payload
        };
      case 'FETCH_DATA_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default someReducer;
  