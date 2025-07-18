import React, { useState } from 'react';
import UserProfileForm from '../components/UserProfileForm';
import { useAuth } from '../../../shared/utils/authProvider';
import userService from '../services/userService';
import { useDispatch } from 'react-redux';
import { showFloatingError, showFloatingSuccess } from '../../../shared/store/rootActions';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

const UserProfilePage = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = async (formData) => {
        if (!user || !user.id) {
            dispatch(showFloatingError("Error: No se pudo identificar al usuario. Por favor, inicie sesión de nuevo."));
            return;
        }

        const userDTO = {
            id: user.id,
            firstname: formData.firstName,
            lastname: formData.lastName,
        };

        setIsLoading(true);
        try {
            await userService.update(user.id, userDTO);
            dispatch(showFloatingSuccess("¡Perfil actualizado con éxito!"));
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            dispatch(showFloatingError("Hubo un error al actualizar el perfil."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <UserProfileForm onSave={handleUpdateUser} />
        </>
    );
};

export default UserProfilePage;
