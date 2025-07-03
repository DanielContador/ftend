// Define your actions here

// Acción para cambiar el actualComponent
export const setActualComponent = (componentName) => ({
  type: "SET_ACTUAL_COMPONENT",
  payload: componentName,
});

// Acción para obtener el actualComponent (solo para claridad, pero en Redux se accede vía useSelector)
export const getActualComponent = () => ({
  type: "GET_ACTUAL_COMPONENT",
});

// FloatingError global actions
export const showFloatingError = (message) => ({
  type: "SHOW_FLOATING_ERROR",
  payload: message,
});

export const hideFloatingError = () => ({
  type: "HIDE_FLOATING_ERROR",
});

// FloatingSuccess global actions
export const showFloatingSuccess = (message) => ({
  type: "SHOW_FLOATING_SUCCESS",
  payload: message,
});

export const hideFloatingSuccess = () => ({
  type: "HIDE_FLOATING_SUCCESS",
});
