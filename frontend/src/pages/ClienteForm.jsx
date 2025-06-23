// frontend/src/pages/ClienteForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Toolbar,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import {
  getClienteById,
  createCliente,
  updateCliente,
  verificarCpf
} from '../services/clienteService';
import { ArrowBack } from '@mui/icons-material';

const ClienteForm = () => {
  const { opr, id } = useParams(); // opr = "view" | "edit" ou undefined para "new"
  const isViewMode = opr === 'view';
  const isEditMode = opr === 'edit';
  const isNewMode = !opr; // rota "/cliente" sem params => criar novo
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      telefone: ''
    }
  });

  const nomeRef = useRef(null);

  // Foca no campo nome ao montar (se não for view mode)
  useEffect(() => {
    if (!isViewMode) nomeRef.current?.focus();
  }, [isViewMode]);

  // Se o parâmetro "id" existir (edit ou view), carregar dados do cliente
  useEffect(() => {
    if ((isEditMode || isViewMode) && id) {
      setLoading(true);
      getClienteById(id)
        .then((cliente) => {
          // popula os campos
          setValue('nome', cliente.nome);
          setValue('cpf', cliente.cpf);
          setValue('telefone', cliente.telefone);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, isViewMode, setValue]);

  // Função chamada ao submeter o formulário
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Antes de criar/editar, opcionalmente validamos CPF
      // const cpfExists = await verificarCpf(data.cpf);
      // if (cpfExists && (isNewMode || cpfExists.id_cliente !== Number(id))) {
      //   alert('Este CPF já está cadastrado!');
      //   setLoading(false);
      //   return;
      // }

      if (isEditMode) {
        await updateCliente(id, data);
        alert('Cliente atualizado com sucesso!');
      } else {
        await createCliente(data);
        alert('Cliente cadastrado com sucesso!');
      }
      navigate('/clientes');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cliente. Veja o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {isViewMode
            ? `Visualizar Cliente`
            : isEditMode
            ? `Editar Cliente`
            : `Novo Cliente`}
        </Typography>
      </Toolbar>

      {/* Exibe “Carregando...” enquanto busca dados no modo edit/view */}
      {loading ? (
        <Typography>Carregando dados...</Typography>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          {/* NOME */}
          <Controller
            name="nome"
            control={control}
            rules={{
              required: 'Nome é obrigatório',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome"
                inputRef={nomeRef}
                error={!!errors.nome}
                helperText={errors.nome ? errors.nome.message : ''}
                disabled={isViewMode}
                fullWidth
              />
            )}
          />

          {/* CPF (com máscara) */}
          <Controller
            name="cpf"
            control={control}
            rules={{
              required: 'CPF é obrigatório',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
                message: 'Formato inválido (ex: 000.000.000-00)'
              }
            }}
            render={({ field }) => (
              <IMaskInputWrapper
                {...field}
                mask="000.000.000-00"
                label="CPF"
                disabled={isViewMode}
                error={!!errors.cpf}
                helperText={errors.cpf ? errors.cpf.message : ''}
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
              />
            )}
          />

          {/* TELEFONE (com máscara) */}
          <Controller
            name="telefone"
            control={control}
            rules={{
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^\(\d{2}\)\s\d{4,5}\-\d{4}$/,
                message: 'Formato inválido (ex: (11) 98765-4321)'
              }
            }}
            render={({ field }) => (
              <IMaskInputWrapper
                {...field}
                mask="(00) 00000-0000"
                label="Telefone"
                disabled={isViewMode}
                error={!!errors.telefone}
                helperText={errors.telefone ? errors.telefone.message : ''}
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
              />
            )}
          />

          {/* Botão de Salvar (oculto em modo view) */}
          {!isViewMode && (
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ px: 4 }}
              >
                {isEditMode ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ClienteForm;
