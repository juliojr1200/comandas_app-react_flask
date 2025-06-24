import React from "react";
import { Button, Box, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Relatorios = () => {
  const { user } = useAuth();
  const BASE_URL = import.meta.env.VITE_PROXY_BASE_URL + "funcionario";

  const gerar = (url) => {
    fetch(url, { credentials: "include" })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = url.split("/").pop();
        link.click();
      });
  };

  return (
    <Box
      sx={{ backgroundColor: "#ADD8E6", padding: 1, borderRadius: 1, mt: 2 }}
    >
      <Toolbar
        sx={{
          backgroundColor: "#ADD8E6",
          padding: 1,
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" color="primary">
          Relatórios
        </Typography>
      </Toolbar>
      <Box
        sx={{ backgroundColor: "white", padding: 2, borderRadius: 3, mb: 2 }}
      >
        <Button
          variant="contained"
          onClick={() => gerar(`${BASE_URL}/relatorio`)}
          sx={{ mr: 2 }}
        >
          Completo
        </Button>
        <Button
          variant="contained"
          onClick={() => gerar(`${BASE_URL}/${user?.id || 1}/ficha`)}
          sx={{ mr: 2 }}
        >
          Ficha Usuário
        </Button>
        <Button
          variant="contained"
          onClick={() => gerar(`${BASE_URL}/grupo/Admin/relatorio`)}
        >
          Por Grupo
        </Button>
      </Box>
    </Box>
  );
};

export default Relatorios;
