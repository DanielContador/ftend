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
