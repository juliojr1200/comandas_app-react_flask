import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IMaskInputWrapper from '../components/IMaskInputWrapper'; // Importa o wrapper

const ProdutoForm = () => {
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();
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
                <Controller
                    name="preco"
                    control={control}
                    rules={{
                        required: 'Preço é obrigatório',
                        validate: (value) => {
                            const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
                            return numericValue >= 0 || 'Preço deve ser positivo';
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Preço *"
                            fullWidth
                            margin="normal"
                            error={!!errors.preco}
                            helperText={errors.preco?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: 'R$ num',
                                    blocks: {
                                        num: {
                                            mask: Number,
                                            thousandsSeparator: '.',
                                            radix: ',',
                                            scale: 2,
                                            signed: false,
                                            normalizeZeros: true,
                                            padFractionalZeros: true,
                                        }
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: '#1976d2' },
                                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                                }
                            }}
                        />
                    )}
                />
                <Controller
                    name="estoque"
                    control={control}
                    rules={{
                        required: 'Estoque é obrigatório',
                        validate: (value) => {
                            const numericValue = parseInt(value, 10);
                            return numericValue >= 0 || 'Estoque deve ser positivo';
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Estoque *"
                            fullWidth
                            margin="normal"
                            error={!!errors.estoque}
                            helperText={errors.estoque?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: Number,
                                    scale: 0, // Inteiros, sem decimais
                                    signed: false, // Não permite números negativos
                                    thousandsSeparator: '',
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: '#1976d2' },
                                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                                }
                            }}
                        />
                    )}
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