import { combineReducers } from "redux";

// Reducer para manejar el componente actual
const initialComponentState = {
  actualComponent: null,
};

function componentReducer(state = initialComponentState, action) {
  switch (action.type) {
    case "SET_ACTUAL_COMPONENT":
      return { ...state, actualComponent: action.payload };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  component: componentReducer,
  // Add your reducers here
});

export default rootReducer;
