import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ClienteList() {
    const navigate = useNavigate();

    // Dados mockados para simular a lista de clientes
    const clientes = [
        { id: 1, nome: 'Ana Pereira', cpf: '111.222.333-44', telefone: '(11) 98765-4321', email: 'ana@example.com' },
        { id: 2, nome: 'Pedro Costa', cpf: '555.666.777-88', telefone: '(21) 91234-5678', email: 'pedro@example.com' },
        { id: 3, nome: 'Luiza Almeida', cpf: '999.888.777-66', telefone: '(31) 99876-5432', email: 'luiza@example.com' },
    ];

    return (
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Clientes</Typography>
                <Button color="primary" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Telefone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clientes.map((cliente) => (
                        <TableRow key={cliente.id}>
                            <TableCell>{cliente.id}</TableCell>
                            <TableCell>{cliente.nome}</TableCell>
                            <TableCell>{cliente.cpf}</TableCell>
                            <TableCell>{cliente.telefone}</TableCell>
                            <TableCell>{cliente.email}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => navigate(`/cliente/${cliente.id}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/cliente/${cliente.id}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => alert(`Deletar cliente ${cliente.id}`)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ClienteList;