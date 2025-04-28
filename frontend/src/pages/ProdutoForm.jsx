import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProdutoForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const nomeRef = useRef(null);

    // Foco inicial no campo nome
    useEffect(() => {
        nomeRef.current?.focus();
    }, []);

    // Monitorar campos para habilitar/desabilitar o botão de submit
    const formValues = watch();
    const isFormValid = formValues.nome && formValues.preco && formValues.estoque;

    const onSubmit = (data) => {
        console.log("Dados do produto:", data);
        navigate('/produtos');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2 }}>
                <Typography variant="h5" color="primary">Cadastro de Produto</Typography>
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
                    label="Descrição"
                    fullWidth
                    margin="normal"
                    {...register('descricao', { 
                        maxLength: { value: 200, message: 'Máximo 200 caracteres' } 
                    })}
                    error={!!errors.descricao}
                    helperText={errors.descricao?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <TextField
                    label="Preço *"
                    type="number"
                    fullWidth
                    margin="normal"
                    {...register('preco', { 
                        required: 'Preço é obrigatório', 
                        min: { value: 0, message: 'Preço deve ser positivo' } 
                    })}
                    error={!!errors.preco}
                    helperText={errors.preco?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <TextField
                    label="Estoque *"
                    type="number"
                    fullWidth
                    margin="normal"
                    {...register('estoque', { 
                        required: 'Estoque é obrigatório', 
                        min: { value: 0, message: 'Estoque deve ser positivo' } 
                    })}
                    error={!!errors.estoque}
                    helperText={errors.estoque?.message}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                        }
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        sx={{ mr: 2 }} 
                        onClick={() => navigate('/produtos')}
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

export default ProdutoForm;