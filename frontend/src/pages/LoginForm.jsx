import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const LoginForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const usernameRef = useRef(null);

    // Foco inicial no campo username
    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    // Monitorar campos para habilitar/desabilitar o botão de submit
    const formValues = watch();
    const isFormValid = formValues.username && formValues.password;

    const onSubmit = (data) => {
        const success = login(data.username, data.password);
        if (success) {
            navigate('/');
        } else {
            setError('Usuário ou senha inválidos');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" color="primary" gutterBottom>Login</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
                <TextField
                    inputRef={usernameRef}
                    label="Usuário *"
                    fullWidth
                    margin="normal"
                    {...register('username', { 
                        required: 'Usuário é obrigatório'
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <TextField
                    label="Senha *"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password', { 
                        required: 'Senha é obrigatória', 
                        maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    disabled={!isFormValid}
                    sx={{ mt: 2, py: 1.5 }}
                >
                    Entrar
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;