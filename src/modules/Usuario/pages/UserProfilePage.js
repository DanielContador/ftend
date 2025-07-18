import React, { useCallback } from "react";
import UserProfileForm from "../components/UserProfileForm";
import { useAuth } from "../../../shared/utils/authProvider";
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  showFloatingError,
  showFloatingSuccess,
  showLoading,
  hideLoading,
} from "../../../shared/store/rootActions";

const UserProfilePage = () => {
  const { user, initSession } = useAuth();
  const dispatch = useDispatch();

  const handleUpdateUser = async (formData) => {
    const userDTO = {
      id: user.id,
      firstname: formData.firstName,
      lastname: formData.lastName,
    };
    dispatch(showLoading());
    try {
      const updatedUser = await userService.update(user.id, userDTO);
      const token = Cookies.get("authToken");
      if (token && updatedUser && updatedUser.data) {
        const updatedSessionUser = {
          id: updatedUser.data.user.id,
          username: updatedUser.data.user.userName,
          email: updatedUser.data.user.email,
          firstname: updatedUser.data.user.firstname,
          lastname: updatedUser.data.user.lastname,
        };
        initSession(token, updatedSessionUser);
      }
      dispatch(showFloatingSuccess("¡Perfil actualizado con éxito!"));
    } catch (error) {
      dispatch(showFloatingError("Hubo un error al actualizar el perfil."));
    } finally {
      dispatch(hideLoading());
    }
  };

  return <UserProfileForm user={user} onSave={handleUpdateUser} />;
};

export default UserProfilePage;
