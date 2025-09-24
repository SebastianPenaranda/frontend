<<<<<<< HEAD
import React from 'react';
=======

>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
