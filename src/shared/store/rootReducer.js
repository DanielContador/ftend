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

// FloatingError global state
const initialFloatingErrorState = {
  show: false,
  message: "",
};

function floatingErrorReducer(state = initialFloatingErrorState, action) {
  switch (action.type) {
    case "SHOW_FLOATING_ERROR":
      return { show: true, message: action.payload };
    case "HIDE_FLOATING_ERROR":
      return { show: false, message: "" };
    default:
      return state;
  }
}

// FloatingSuccess global state
const initialFloatingSuccessState = {
  show: false,
  message: "",
};

function floatingSuccessReducer(state = initialFloatingSuccessState, action) {
  switch (action.type) {
    case "SHOW_FLOATING_SUCCESS":
      return { show: true, message: action.payload };
    case "HIDE_FLOATING_SUCCESS":
      return { show: false, message: "" };
    default:
      return state;
  }
}

// Nuevo estado global para tipo de edición (material/curso)
const initialEditTypeState = {
  editType: null,
};

function editTypeReducer(state = initialEditTypeState, action) {
  switch (action.type) {
    case "SET_EDIT_TYPE":
      return { ...state, editType: action.payload };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  component: componentReducer,
  floatingError: floatingErrorReducer,
  floatingSuccess: floatingSuccessReducer,
  editType: editTypeReducer, // <-- agregar aquí
  // Add your reducers here
});

export default rootReducer;
