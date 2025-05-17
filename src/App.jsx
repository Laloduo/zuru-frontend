import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "./assets/NuevoLogoZuru.png";

const API_URL = "https://zuru.onrender.com/classify";

export default function App() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState("");
  const [error, setError] = useState("");

  const listasDisponibles = [
    "Mercancías Zuru Max",
    "Mercancías HDI Global",
    "Mercancías Chubb Carga"
  ];

  const handleClassify = async () => {
    if (input.length < 3 || !listaSeleccionada) {
      setError("Debes seleccionar un producto y escribir una descripción válida.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: input, lista: listaSeleccionada }),
      });
      const data = await response.json();
      setSuggestion(data.categoria || "Sin coincidencias claras");
      setError("");
    } catch (err) {
      setSuggestion("");
      setError("Error al clasificar o conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleListaChange = (e) => {
    setListaSeleccionada(e.target.value);
    setSuggestion("");
    setError("");
  };

  const reiniciarSeleccion = () => {
    setListaSeleccionada("");
    setInput("");
    setSuggestion("");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: "220px", marginBottom: "1rem" }}
      />
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Clasificador de mercancías (IA)
      </h1>

      {!listaSeleccionada ? (
        <>
          <label style={{ marginBottom: "0.5rem" }}>
            Selecciona tu producto:
          </label>
          <select
            onChange={handleListaChange}
            defaultValue=""
            style={{
              width: "100%",
              maxWidth: "500px",
              marginBottom: "1rem",
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="" disabled>-- Elegir producto --</option>
            {listasDisponibles.map((lista, index) => (
              <option key={index} value={lista}>{lista}</option>
            ))}
          </select>
        </>
      ) : (
        <>
          <p><strong>Producto seleccionado:</strong> {listaSeleccionada}</p>
          <button
            onClick={reiniciarSeleccion}
            style={{
              marginBottom: "1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Cambiar producto
          </button>

          <input
            type="text"
            placeholder="Describe tu mercancía..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "500px",
              marginBottom: "1rem",
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleClassify}
            disabled={loading || input.length < 3}
            style={{
              background: "linear-gradient(90deg, rgb(0, 190, 127) 0%, rgb(0, 144, 177) 50%, rgb(0, 89, 223) 100%)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginBottom: "1rem",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Clasificando..." : "Clasificar con IA"}
          </button>

          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                width: "100%",
                maxWidth: "500px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Respuesta de la IA:
              </p>
              <p style={{ fontSize: "1.125rem", fontWeight: "600" }}>{suggestion}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                width: "100%",
                maxWidth: "500px",
                backgroundColor: "#fee2e2",
                borderRadius: "12px",
                padding: "1rem",
                marginTop: "1rem",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#b91c1c" }}>{error}</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
