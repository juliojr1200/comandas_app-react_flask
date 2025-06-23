// frontend/src/pages/ClienteList.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Toolbar,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getClientes, deleteCliente } from '../services/clienteService';

function ClienteList() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar lista de clientes ao montar
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(data || []);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      alert('Não foi possível obter a lista de clientes.');
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um cliente
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await deleteCliente(id);
      alert('Cliente excluído com sucesso!');
      fetchClientes(); // recarrega lista
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir cliente. Veja o console.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar sx={{ mb: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6">Lista de Clientes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={() => navigate('/cliente')}
        >
          Novo Cliente
        </Button>
      </Toolbar>

      {loading ? (
        <Typography>Carregando clientes...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>CPF</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum cliente cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente || cliente.id || cliente.idCliente}>
                    <TableCell>{cliente.id_cliente || cliente.id || cliente.idCliente}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell align="center">
                      {/* Visualizar */}
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/cliente/view/${cliente.id_cliente || cliente.id || cliente.idCliente}`)}
                      >
                        <Visibility />
                      </IconButton>

                      {/* Editar */}
                      <IconButton
                        color="secondary"
                        onClick={() => navigate(`/cliente/edit/${cliente.id_cliente || cliente.id || cliente.idCliente}`)}
                      >
                        <Edit />
                      </IconButton>

                      {/* Deletar */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(cliente.id_cliente || cliente.id || cliente.idCliente)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ClienteList;
