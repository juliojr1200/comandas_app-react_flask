import React, { useEffect, useRef } from 'react';
   import { useForm } from 'react-hook-form';
   import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
   import { IMaskInput } from 'react-imask'; // Substituímos react-input-mask por react-imask
   import { useNavigate } from 'react-router-dom';

   const ClienteForm = () => {
       const { register, handleSubmit, watch, formState: { errors } } = useForm();
       const navigate = useNavigate();
       const nomeRef = useRef(null);

       useEffect(() => {
           nomeRef.current?.focus();
       }, []);

       const formValues = watch();
       const isFormValid = formValues.nome && formValues.cpf && formValues.telefone && formValues.email && 
                           formValues.cep && formValues.endereco && formValues.bairro && formValues.cidade;

       const onSubmit = (data) => {
           console.log("Dados do cliente:", data);
           navigate('/clientes');
       };

       return (
           <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
               <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2 }}>
                   <Typography variant="h5" color="primary">Cadastro de Cliente</Typography>
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
                       label="Telefone *"
                       fullWidth
                       margin="normal"
                       {...register('telefone', { 
                           required: 'Telefone é obrigatório', 
                           pattern: { 
                               value: /^\(\d{2}\) \d{5}-\d{4}$/, 
                               message: 'Telefone deve ter 11 dígitos (ex.: (99) 99999-9999)' 
                           } 
                       })}
                       error={!!errors.telefone}
                       helperText={errors.telefone?.message}
                       InputProps={{
                           inputComponent: IMaskInput,
                           inputProps: {
                               mask: '(00) 00000-0000',
                           },
                       }}
                       sx={{
                           '& .MuiOutlinedInput-root': {
                               '&:hover fieldset': { borderColor: '#1976d2' },
                               '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                           }
                       }}
                   />
                   <TextField
                       label="E-mail *"
                       fullWidth
                       margin="normal"
                       {...register('email', { 
                           required: 'E-mail é obrigatório', 
                           pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' },
                           maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                       })}
                       error={!!errors.email}
                       helperText={errors.email?.message}
                       sx={{
                           '& .MuiOutlinedInput-root': {
                               '&:hover fieldset': { borderColor: '#1976d2' },
                               '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                           }
                       }}
                   />
                   <TextField
                       label="CEP *"
                       fullWidth
                       margin="normal"
                       {...register('cep', { 
                           required: 'CEP é obrigatório', 
                           pattern: { 
                               value: /^\d{5}-\d{3}$/, 
                               message: 'CEP deve ter 8 dígitos (ex.: 99999-999)' 
                           } 
                       })}
                       error={!!errors.cep}
                       helperText={errors.cep?.message}
                       InputProps={{
                           inputComponent: IMaskInput,
                           inputProps: {
                               mask: '00000-000',
                           },
                       }}
                       sx={{
                           '& .MuiOutlinedInput-root': {
                               '&:hover fieldset': { borderColor: '#1976d2' },
                               '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                           }
                       }}
                   />
                   <TextField
                       label="Endereço *"
                       fullWidth
                       margin="normal"
                       {...register('endereco', { 
                           required: 'Endereço é obrigatório', 
                           maxLength: { value: 150, message: 'Máximo 150 caracteres' } 
                       })}
                       error={!!errors.endereco}
                       helperText={errors.endereco?.message}
                       sx={{
                           '& .MuiOutlinedInput-root': {
                               '&:hover fieldset': { borderColor: '#1976d2' },
                               '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                           }
                       }}
                   />
                   <TextField
                       label="Bairro *"
                       fullWidth
                       margin="normal"
                       {...register('bairro', { 
                           required: 'Bairro é obrigatório', 
                           maxLength: { value: 50, message: 'Máximo 50 caracteres' } 
                       })}
                       error={!!errors.bairro}
                       helperText={errors.bairro?.message}
                       sx={{
                           '& .MuiOutlinedInput-root': {
                               '&:hover fieldset': { borderColor: '#1976d2' },
                               '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                           }
                       }}
                   />
                   <TextField
                       label="Cidade *"
                       fullWidth
                       margin="normal"
                       {...register('cidade', { 
                           required: 'Cidade é obrigatória', 
                           maxLength: { value: 50, message: 'Máximo 50 caracteres' } 
                       })}
                       error={!!errors.cidade}
                       helperText={errors.cidade?.message}
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
                           onClick={() => navigate('/clientes')}
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

   export default ClienteForm;