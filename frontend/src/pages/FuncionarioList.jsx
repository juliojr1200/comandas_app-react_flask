import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function FuncionarioList() {
    const navigate = useNavigate();

    // Dados mockados para simular a lista de funcionários
    const funcionarios = [
        { id: 1, nome: 'João Silva', cpf: '123.456.789-00', matricula: 'MAT001', telefone: '(11) 98765-4321', grupo: 'admin' },
        { id: 2, nome: 'Maria Oliveira', cpf: '987.654.321-00', matricula: 'MAT002', telefone: '(21) 91234-5678', grupo: 'gerente' },
        { id: 3, nome: 'Carlos Souza', cpf: '456.789.123-00', matricula: 'MAT003', telefone: '(31) 99876-5432', grupo: 'funcionario' },
    ];

    return (
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Funcionários</Typography>
                <Button color="primary" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Telefone</TableCell>
                        <TableCell>Grupo</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id}>
                            <TableCell>{funcionario.id}</TableCell>
                            <TableCell>{funcionario.nome}</TableCell>
                            <TableCell>{funcionario.cpf}</TableCell>
                            <TableCell>{funcionario.matricula}</TableCell>
                            <TableCell>{funcionario.telefone}</TableCell>
                            <TableCell>{funcionario.grupo}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => navigate(`/funcionario/${funcionario.id}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/funcionario/${funcionario.id}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => alert(`Deletar funcionário ${funcionario.id}`)}>
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

export default FuncionarioList;