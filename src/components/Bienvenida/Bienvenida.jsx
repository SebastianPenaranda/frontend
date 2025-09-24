import React from 'react';
import './Bienvenida.css';

const Bienvenida = ({ onMenuChange }) => {
  return (
    <div className="contenedor_bienvenida">
      <h1>Bienvenido al registro de personas de la Unicatolica</h1>
      <h1 className="pance">Sede Pance</h1>
      <p>Seleccione una opción:</p>
      <button onClick={() => onMenuChange("login")}>Iniciar Sesión</button>
    </div>
  );
};

export default Bienvenida;
