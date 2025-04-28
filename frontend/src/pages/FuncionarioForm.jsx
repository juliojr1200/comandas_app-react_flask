import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Toolbar
} from '@mui/material';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';

const FuncionarioForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const nomeRef = useRef(null);

    // Foco inicial no campo nome
    useEffect(() => {
        nomeRef.current?.focus();
    }, []);

    // Monitorar campos para habilitar/desabilitar o botão de submit
    const formValues = watch();
    const isFormValid = formValues.nome && formValues.cpf && formValues.matricula && formValues.telefone && formValues.senha && formValues.grupo;

    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
        navigate('/funcionarios');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2 }}>
                <Typography variant="h5" color="primary">Cadastro de Funcionário</Typography>
            </Toolbar>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
                <TextField
                    inputRef={nomeRef}
                    label="Nome *"
                    fullWidth
                    margin="normal"
                    {...register('nome', { 
                        required: 'Nome é obrigatório', 
                        maxLength: { value: 100, message: 'Máximo 100 caracteres' } 
                    })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <TextField
                    label="CPF *"
                    fullWidth
                    margin="normal"
                    {...register('cpf', { 
                        required: 'CPF é obrigatório', 
                        maxLength: { value: 14, message: 'Máximo 14 caracteres' } 
                    })}
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <TextField
                    label="Matrícula *"
                    fullWidth
                    margin="normal"
                    {...register('matricula', { 
                        required: 'Matrícula é obrigatória', 
                        maxLength: { value: 50, message: 'Máximo 50 caracteres' } 
                    })}
                    error={!!errors.matricula}
                    helperText={errors.matricula?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <InputMask
                    mask="(99) 99999-9999"
                    {...register('telefone', { 
                        required: 'Telefone é obrigatório', 
                        pattern: { 
                            value: /^\(\d{2}\) \d{5}-\d{4}$/, 
                            message: 'Telefone deve ter 11 dígitos (ex.: (99) 99999-9999)' 
                        } 
                    })}
                >
                    {() => (
                        <TextField
                            label="Telefone *"
                            fullWidth
                            margin="normal"
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: '#1976d2' },
                                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                                }
                            }}
                        />
                    )}
                </InputMask>
                <TextField
                    label="Senha *"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('senha', { 
                        required: 'Senha é obrigatória', 
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                        maxLength: { value: 100, message: 'Máximo 100 caracteres' } 
                    })}
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="grupo-label">Grupo *</InputLabel>
                    <Select
                        labelId="grupo-label"
                        label="Grupo *"
                        {...register('grupo', { required: 'Grupo é obrigatório' })}
                        error={!!errors.grupo}
                        sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' },
                        }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="gerente">Gerente</MenuItem>
                        <MenuItem value="funcionario">Funcionário</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        sx={{ mr: 2 }} 
                        onClick={() => navigate('/funcionarios')}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={!isFormValid}
                        sx={{ px: 4 }}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;