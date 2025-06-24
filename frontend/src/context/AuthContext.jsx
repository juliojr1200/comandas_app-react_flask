import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importa o toast do React Toastify

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  // Inicializa o estado com base no valor do sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("loginRealizado") === "true";
  });
  const [user, setUser] = useState(() => {
    const data = sessionStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });
  const navigate = useNavigate();
  const LOGIN_URL = import.meta.env.VITE_PROXY_BASE_URL + "login";

  // Função para login
  const login = async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
        },
        credentials: "include",
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem("loginRealizado", "true");
        sessionStorage.setItem("user", JSON.stringify(data));
        setUser(data);

        setIsAuthenticated(true);
        navigate("/home");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  // Função para logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem("loginRealizado");
    sessionStorage.removeItem("user");
    navigate("/login");
    toast.info("Logout realizado com sucesso!"); // Notificação de logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);
