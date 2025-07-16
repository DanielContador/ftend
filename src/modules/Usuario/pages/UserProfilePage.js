import React from 'react';
import UserProfileForm from '../components/UserProfileForm';
import { useAuth } from '../../../shared/utils/authProvider';
import userService from '../services/userService';

const UserProfilePage = () => {
    const { user } = useAuth();

    const handleUpdateUser = async (formData) => {
        if (!user || !user.id) {
            alert("Error: No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.");
            return;
        }

        const userDTO = {
            id: user.id,
            firstname: formData.firstName,
            lastname: formData.lastName,
            roleId: user.roleId, // Mantener datos existentes
            receiveNews: user.receiveNews, // Mantener datos existentes
        };

        try {
            await userService.update(user.id, userDTO);
            alert("¡Perfil actualizado con éxito!");
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Hubo un error al actualizar el perfil.");
        }
    };

    return (
        <UserProfileForm onSave={handleUpdateUser} />
    );
};

export default UserProfilePage;
