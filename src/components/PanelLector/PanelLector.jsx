<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
=======
import React, { useState, useRef } from 'react';
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
  const [historialAccesos, setHistorialAccesos] = useState([]);
  const [historialDiario, setHistorialDiario] = useState({}); // Objeto que contendrá historial por carnet
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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

<<<<<<< HEAD
  // useEffect para resetear registros de acceso a medianoche
  useEffect(() => {
    const resetearAMedianoche = () => {
      const ahora = new Date();
      const mañana = new Date(ahora);
      mañana.setDate(ahora.getDate() + 1);
      mañana.setHours(0, 0, 0, 0); // Configurar a 00:00:00.000
      
      const tiempoHastaMedianoche = mañana.getTime() - ahora.getTime();
      
      const timeout = setTimeout(() => {
        // Limpiar registros de acceso al llegar medianoche
        setTipoAcceso(null);
        setHoraAcceso(null);
        setUltimoAcceso(null);
        setPersonaEncontrada(null);
        setHistorialAccesos([]);
        setHistorialDiario({}); // Limpiar historial diario completo
        setBusquedaCarnet("");
        setMensajeError("");
        
        // Programar el siguiente reset para la próxima medianoche
        resetearAMedianoche();
        
        // Notificación opcional (comentada para no molestar de noche)
        // toast.info("Registros de acceso reiniciados para el nuevo día");
      }, tiempoHastaMedianoche);
      
      return timeout;
    };
    
    const timeoutId = resetearAMedianoche();
    
    // Cleanup del timeout cuando el componente se desmonte
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Función helper para obtener fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const ahora = new Date();
    return ahora.toISOString().split('T')[0];
  };

  // Función helper para obtener hora actual en formato HH:MM
  const obtenerHoraActual = () => {
    const ahora = new Date();
    return ahora.toTimeString().split(' ')[0].substring(0, 5);
  };

=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
      
<<<<<<< HEAD
      // Intentar obtener historial de accesos del backend (opcional)
      try {
        const historialResp = await axios.get(`https://backend-coral-theta-21.vercel.app/api/historial-accesos/${busquedaCarnet}`);
        if (historialResp.data.historial || historialResp.data) {
          // Si viene del backend, mostrar solo los del día actual
          const historialBackend = historialResp.data.historial || historialResp.data || [];
          const fechaHoy = obtenerFechaActual();
          const historialHoy = historialBackend.filter(acceso => acceso.fecha === fechaHoy);
          setHistorialAccesos(historialHoy);
        }
      } catch (historialError) {
        // Si no existe la ruta, usar historial local del día
        const historialPersona = historialDiario[busquedaCarnet] || [];
        setHistorialAccesos(historialPersona);
      }
      
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
      // Luego registrar el acceso
      try {
        const accesoResp = await axios.post("https://backend-coral-theta-21.vercel.app/api/registrar-acceso", {
          carnet: busquedaCarnet
        });
        
<<<<<<< HEAD
        // Compatibilidad con ambas estructuras de respuesta:
        // Backend actual Vercel: {message, tipo, acceso}
        // Backend local/futuro: {success, tipo, acceso}
        const isSuccess = accesoResp.data.success || accesoResp.data.tipo;
        
        if (isSuccess && accesoResp.data.tipo) {
          setTipoAcceso(accesoResp.data.tipo);
          
          // Obtener fecha y hora actuales
          const fechaActual = obtenerFechaActual();
          const horaActual = obtenerHoraActual();
          
          // Usar hora del backend si está disponible, sino usar hora actual
          const horaParaMostrar = accesoResp.data.acceso 
            ? (accesoResp.data.tipo === "entrada" ? accesoResp.data.acceso.horaEntrada : accesoResp.data.acceso.horaSalida)
            : horaActual;
            
          setHoraAcceso(horaParaMostrar);
          setUltimoAcceso(accesoResp.data.acceso || {
            fecha: fechaActual,
            horaEntrada: accesoResp.data.tipo === "entrada" ? horaActual : null,
            horaSalida: accesoResp.data.tipo === "salida" ? horaActual : null
          });
          
          // Crear el nuevo acceso
          const nuevoAcceso = {
            tipo: accesoResp.data.tipo,
            fecha: fechaActual,
            hora: horaParaMostrar,
            timestamp: new Date()
          };
          
          // Actualizar historial diario por persona
          setHistorialDiario(prevHistorialDiario => {
            const historialPersona = prevHistorialDiario[busquedaCarnet] || [];
            const nuevoHistorialPersona = [...historialPersona, nuevoAcceso];
            
            return {
              ...prevHistorialDiario,
              [busquedaCarnet]: nuevoHistorialPersona
            };
          });
          
          // Actualizar historial mostrado (todos los accesos del día de esta persona)
          setHistorialAccesos(prevHistorial => {
            // Agregar el nuevo acceso al historial actual
            const nuevoHistorial = [...prevHistorial, nuevoAcceso];
            // Ordenar por timestamp (más reciente primero)
            return nuevoHistorial.sort((a, b) => b.timestamp - a.timestamp);
          });
          
          toast.success(`${accesoResp.data.tipo.toUpperCase()} registrada exitosamente`);
=======
        if (accesoResp.data.success) {
          setTipoAcceso(accesoResp.data.tipo);
          setHoraAcceso(accesoResp.data.tipo === "entrada" ? accesoResp.data.acceso.horaEntrada : accesoResp.data.acceso.horaSalida);
          setUltimoAcceso(accesoResp.data.acceso);
          
          toast.success(`${accesoResp.data.tipo} registrada exitosamente`);
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
      setHistorialAccesos([]); // Limpiar historial en caso de error
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
      
<<<<<<< HEAD
      console.log("Respuesta completa del servidor:", response.data);
      
      // Verificar éxito por success=true O por mensaje exitoso O por status 200
      if (response.data.success || response.data.message?.includes('exitosamente') || response.status === 200) {
=======
      if (response.data.success) {
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
        // Limpiar también el campo de búsqueda para evitar búsquedas accidentales
        setBusquedaCarnet("");
        // Asegurar que el foco regrese al input sin ejecutar búsqueda
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      } else {
        console.log("Respuesta sin success=true:", response.data);
=======
      } else {
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
        toast.error("Error al registrar visitante");
      }
    } catch (error) {
      console.error("Error al registrar visitante:", error);
<<<<<<< HEAD
      console.error("Detalles del error:", error.response?.data);
      
      // Si es un error de tarjeta duplicada, mostrar mensaje específico
      if (error.response?.status === 400 && error.response?.data?.existingUser) {
        const existingUser = error.response.data.existingUser;
        toast.error(
          `Ya existe una persona registrada con ese número de tarjeta: ${existingUser.nombre} ${existingUser.apellido} (${existingUser.rol})`,
          { autoClose: 5000 }
        );
      } else if (error.response?.data?.error) {
        // Mostrar el mensaje de error específico del servidor
        toast.error(error.response.data.error);
      } else {
        // Error genérico
        toast.error("Error al registrar visitante");
      }
=======
      toast.error("Error al registrar visitante");
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
              {/* Mostrar razón de visita solo si es visitante */}
              {personaEncontrada.rolUniversidad === "Visitante" && personaEncontrada.razonVisita && (
                <div className="lector-persona-row">
                  <strong>Razón de visita:</strong>
                  <span className="razon-visita">{personaEncontrada.razonVisita}</span>
                </div>
              )}
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
            
            {tipoAcceso && horaAcceso && (
              <div className={`acceso-aviso acceso-${tipoAcceso}`}>
                {tipoAcceso === 'entrada' ? 'ENTRADA registrada a las ' : 'SALIDA registrada a las '}
                <strong>{horaAcceso}</strong>
              </div>
            )}
            
            {/* Mostrar mensaje alternativo si hay problemas */}
            {tipoAcceso && !horaAcceso && (
              <div className={`acceso-aviso acceso-${tipoAcceso}`}>
                {tipoAcceso === 'entrada' ? 'ENTRADA registrada' : 'SALIDA registrada'}
              </div>
            )}
            
            {/* Historial de accesos del día */}
            {historialAccesos.length > 0 && (
              <div className="historial-accesos">
                <h3 className="historial-titulo">
                  Historial del Día ({obtenerFechaActual()})
                  <span className="historial-contador">
                    {historialAccesos.filter(a => a.tipo === 'entrada').length} entradas, {historialAccesos.filter(a => a.tipo === 'salida').length} salidas
                  </span>
                </h3>
                <div className="historial-lista">
                  {historialAccesos.map((acceso, index) => (
                    <div key={`${acceso.timestamp}-${index}`} className={`historial-item historial-${acceso.tipo}`}>
                      <div className="historial-info">
                        <div className="historial-tipo">
                          {acceso.tipo === 'entrada' ? '🟢 ENTRADA' : '🔴 SALIDA'}
                        </div>
                        <div className="historial-tiempo">
                          {acceso.hora}
                        </div>
                      </div>
                      <div className="historial-numero">
                        #{historialAccesos.length - index}
                      </div>
                    </div>
                  ))}
                  {historialAccesos.length === 0 && (
                    <div className="historial-vacio">
                      No hay registros para el día de hoy
                    </div>
                  )}
                </div>
              </div>
            )}
=======
            {tipoAcceso && horaAcceso && (
              <div className={`acceso-aviso acceso-${tipoAcceso}`}>
                {tipoAcceso === 'entrada' ? 'Entrada registrada a las ' : 'Salida registrada a las '}
                <strong>{horaAcceso}</strong>
              </div>
            )}
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
              autoComplete="current-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
<<<<<<< HEAD
                autoComplete="given-name"
                data-form-type="visitor-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              <input
                type="text"
                placeholder="Apellido"
                value={visitanteForm.apellido}
                onChange={(e) => setVisitanteForm({...visitanteForm, apellido: e.target.value})}
<<<<<<< HEAD
                autoComplete="family-name"
                data-form-type="visitor-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              <input
                type="text"
                placeholder="Cédula"
                value={visitanteForm.cedula}
                onChange={(e) => setVisitanteForm({...visitanteForm, cedula: e.target.value})}
<<<<<<< HEAD
                autoComplete="off"
                data-form-type="visitor-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              <input
                type="text"
                placeholder="Razón de visita"
                value={visitanteForm.razonVisita}
                onChange={(e) => setVisitanteForm({...visitanteForm, razonVisita: e.target.value})}
<<<<<<< HEAD
                autoComplete="off"
                data-form-type="visitor-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={visitanteForm.numeroTarjeta}
                onChange={(e) => setVisitanteForm({...visitanteForm, numeroTarjeta: e.target.value})}
<<<<<<< HEAD
                autoComplete="off"
                data-form-type="visitor-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
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
