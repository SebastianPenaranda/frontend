import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PanelLector.css';

const PanelLector = ({ user, logout }) => {
  // Referencias
  const inputRef = useRef(null);
  
  // Estados locales del PanelLector
  const [busquedaCarnet, setBusquedaCarnet] = useState("");
  const [personaEncontrada, setPersonaEncontrada] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [ultimoAcceso, setUltimoAcceso] = useState(null);
  const [tipoAcceso, setTipoAcceso] = useState(null);
  const [horaAcceso, setHoraAcceso] = useState(null);
  const [showVisitanteForm, setShowVisitanteForm] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [lectorPassword, setLectorPassword] = useState("");
  const [buscandoCarnet, setBuscandoCarnet] = useState(false);
  const [visitanteForm, setVisitanteForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    razonVisita: "",
    numeroTarjeta: ""
  });

  // Función para normalizar la clase del rol
  const normalizarRolClase = (rol) => {
    return rol ? rol.toLowerCase().replace(/\s+/g, '-') : '';
  };

  // Función para buscar por carnet
  const buscarPorCarnet = async () => {
    try {
      if (!busquedaCarnet) {
        toast.error("Por favor, ingrese un número de carnet");
        setTipoAcceso(null);
        setHoraAcceso(null);
        return;
      }

      setBuscandoCarnet(true);
      setMensajeError("");
      setPersonaEncontrada(null);
      setTipoAcceso(null);
      setHoraAcceso(null);

      // Primero buscar la persona
      const personaResp = await axios.get(`https://backend-coral-theta-21.vercel.app/api/buscar-carnet/${busquedaCarnet}`);
      setPersonaEncontrada(personaResp.data.persona);
      
      // Luego registrar el acceso
      try {
        const accesoResp = await axios.post("https://backend-coral-theta-21.vercel.app/api/registrar-acceso", {
          carnet: busquedaCarnet
        });
        
        if (accesoResp.data.success) {
          setTipoAcceso(accesoResp.data.tipo);
          setHoraAcceso(accesoResp.data.tipo === "entrada" ? accesoResp.data.acceso.horaEntrada : accesoResp.data.acceso.horaSalida);
          setUltimoAcceso(accesoResp.data.acceso);
          
          toast.success(`${accesoResp.data.tipo} registrada exitosamente`);
        }
      } catch (accesoError) {
        console.error("Error al registrar acceso:", accesoError);
        if (accesoError.response?.status === 404) {
          setTipoAcceso(null);
          setHoraAcceso(null);
          toast.error("Persona no encontrada para registro de acceso");
        } else {
          toast.error("Error al registrar el acceso");
        }
      }
    } catch (error) {
      console.error("Error al buscar carnet:", error);
      setPersonaEncontrada(null);
      setTipoAcceso(null);
      setHoraAcceso(null);
      if (error.response?.status === 404) {
        setMensajeError("Persona no encontrada");
        toast.error("Persona no encontrada");
      } else {
        setMensajeError("Error al buscar la persona");
        toast.error("Error al buscar la persona");
      }
    } finally {
      setBuscandoCarnet(false);
      // Mantener el foco en el input para continuar escaneando
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // Función para registrar visitante
  const registrarVisitante = async () => {
    try {
      if (!visitanteForm.nombre || !visitanteForm.apellido || !visitanteForm.cedula || 
          !visitanteForm.razonVisita || !visitanteForm.numeroTarjeta) {
        toast.error("Por favor, complete todos los campos");
        return;
      }
      
      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/registrar-visitante", visitanteForm);
      
      if (response.data.success) {
        toast.success("Visitante registrado exitosamente");
        setVisitanteForm({
          nombre: "",
          apellido: "",
          cedula: "",
          razonVisita: "",
          numeroTarjeta: ""
        });
        setShowVisitanteForm(false);
        setPasswordVerified(false);
      } else {
        toast.error("Error al registrar visitante");
      }
    } catch (error) {
      console.error("Error al registrar visitante:", error);
      toast.error("Error al registrar visitante");
    }
  };

  return (
    <div className="contenedor_lector">
      <h1 className="lector-titulo">Panel de Lector</h1>
      <div className="lector-busqueda-box">
        <div className="lector-busqueda-barra">
          <input
            ref={inputRef}
            type="password"
            value={busquedaCarnet}
            onChange={(e) => setBusquedaCarnet(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                buscarPorCarnet();
                setBusquedaCarnet("");
              }
            }}
            placeholder="Escanee el carnet"
            className="lector-busqueda-input"
            disabled={buscandoCarnet}
            autoFocus
          />
          <div className="lector-busqueda-icon">
            {buscandoCarnet ? (
              <div className="lector-loading-spinner"></div>
            ) : (
              '🔍'
            )}
          </div>
          <button 
            onClick={() => setShowVisitanteForm(true)}
            className="visitante-btn"
            disabled={buscandoCarnet}
          >
            Registrar Visitante
          </button>
        </div>
        {buscandoCarnet && (
          <div className="lector-loading-msg">
            Buscando en la base de datos...
          </div>
        )}
        {mensajeError && !buscandoCarnet && (
          <div className="lector-error-msg">
            {mensajeError}
          </div>
        )}
        {personaEncontrada && (
          <div className="lector-persona-info">
            <h2 className="lector-persona-titulo">Información de la Persona</h2>
            <div className="lector-persona-grid">
              <div className="lector-persona-row">
                <strong>Nombre:</strong>
                <span>{personaEncontrada.nombre} {personaEncontrada.apellido}</span>
              </div>
              <div className="lector-persona-row">
                <strong>ID Institucional:</strong>
                <span>{personaEncontrada.idInstitucional}</span>
              </div>
              <div className="lector-persona-row">
                <strong>Rol:</strong>
                <span className={`rol-badge rol-${normalizarRolClase(personaEncontrada.rolUniversidad)}`}>
                  {personaEncontrada.rolUniversidad}
                </span>
              </div>
              {ultimoAcceso && (
                <>
                  <div className="lector-persona-row">
                    <strong>Hora de entrada:</strong>
                    <span>{ultimoAcceso.horaEntrada || '-'}</span>
                  </div>
                  <div className="lector-persona-row">
                    <strong>Hora de salida:</strong>
                    <span>{ultimoAcceso.horaSalida || '-'}</span>
                  </div>
                </>
              )}
              {personaEncontrada.imagen && (
                <div className="lector-persona-img">
                  <img
                    src={`https://backend-coral-theta-21.vercel.app/api/huellas/${personaEncontrada._id}/imagen`}
                    alt="Foto de la persona"
                  />
                </div>
              )}
            </div>
            {tipoAcceso && horaAcceso && (
              <div className={`acceso-aviso acceso-${tipoAcceso}`}>
                {tipoAcceso === 'entrada' ? 'Entrada registrada a las ' : 'Salida registrada a las '}
                <strong>{horaAcceso}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de verificación de contraseña */}
      {showVisitanteForm && !passwordVerified && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box">
            <h2 className="modal-confirm-title">Verificación de Contraseña</h2>
            <p className="modal-confirm-msg">Por favor ingrese su contraseña para acceder al formulario de registro de visitantes</p>
            <input
              type="password"
              value={lectorPassword}
              onChange={(e) => setLectorPassword(e.target.value)}
              placeholder="Contraseña"
              className="visitante-campos input"
            />
            <div className="modal-confirm-btns">
              <button 
                className="modal-confirm-cancel"
                onClick={() => {
                  setShowVisitanteForm(false);
                  setLectorPassword("");
                }}
              >
                Cancelar
              </button>
              <button 
                className="modal-confirm-delete"
                onClick={async () => {
                  try {
                    const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/verify-password", {
                      correoInstitucional: user.correoInstitucional,
                      password: lectorPassword
                    });
                    if (response.data.verified) {
                      setPasswordVerified(true);
                      setLectorPassword("");
                    } else {
                      toast.error("Contraseña incorrecta");
                    }
                  } catch (error) {
                    toast.error("Error al verificar la contraseña");
                  }
                }}
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario flotante de registro de visitante */}
      {showVisitanteForm && passwordVerified && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box visitante-form-modal">
            <h2 className="visitante-titulo">Registro de Visitante</h2>
            <div className="visitante-campos">
              <input
                type="text"
                placeholder="Nombre"
                value={visitanteForm.nombre}
                onChange={(e) => setVisitanteForm({...visitanteForm, nombre: e.target.value})}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={visitanteForm.apellido}
                onChange={(e) => setVisitanteForm({...visitanteForm, apellido: e.target.value})}
              />
              <input
                type="text"
                placeholder="Cédula"
                value={visitanteForm.cedula}
                onChange={(e) => setVisitanteForm({...visitanteForm, cedula: e.target.value})}
              />
              <input
                type="text"
                placeholder="Razón de visita"
                value={visitanteForm.razonVisita}
                onChange={(e) => setVisitanteForm({...visitanteForm, razonVisita: e.target.value})}
              />
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={visitanteForm.numeroTarjeta}
                onChange={(e) => setVisitanteForm({...visitanteForm, numeroTarjeta: e.target.value})}
              />
              <div className="modal-confirm-btns">
                <button 
                  className="modal-confirm-cancel"
                  onClick={() => {
                    setShowVisitanteForm(false);
                    setPasswordVerified(false);
                    setVisitanteForm({
                      nombre: "",
                      apellido: "",
                      cedula: "",
                      razonVisita: "",
                      numeroTarjeta: ""
                    });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  className="modal-confirm-delete"
                  onClick={registrarVisitante}
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={logout}
        className="lector-logout-btn"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default PanelLector;
