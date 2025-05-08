import React from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Toolbar } from "@mui/material";
import { toast } from "react-toastify"; // Importa o toast do React Toastify

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();

    const onSubmit = (data) => {
        const { username, password } = data;
        const success = login(username, password); // Usa o retorno da função login
        if (success) {
            toast.success("Login realizado com sucesso!"); // Notificação de sucesso
        } else {
            toast.error("Usuário ou senha inválidos!"); // Notificação de erro
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Login</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <TextField 
                    label="Usuário" 
                    fullWidth 
                    margin="normal" 
                    {...register('username', { required: 'Usuário é obrigatório' })} 
                    error={!!errors.username} 
                    helperText={errors.username?.message}
                />
                <TextField 
                    label="Senha" 
                    type="password" 
                    fullWidth 
                    margin="normal" 
                    {...register('password', {
                        required: 'Senha é obrigatória',
                        minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                    })} 
                    error={!!errors.password} 
                    helperText={errors.password?.message}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    color="primary"
                >
                    Entrar
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;