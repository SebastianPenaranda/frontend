import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginManager = ({ 
  user, 
  onAuthChange, 
  onLogin, 
  onMenuChange, 
  loginLoading
}) => {
  // Estados para recuperación de contraseña
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [mensajeReset, setMensajeReset] = useState("");

  const handleForgotPassword = async () => {
    try {
      if (!forgotPasswordEmail) {
        toast.error("Por favor ingrese su correo institucional");
        return;
      }

      if (!forgotPasswordEmail.includes('@')) {
        toast.error("Por favor ingrese un correo válido");
        return;
      }

      setIsSendingEmail(true);
      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/forgot-password", {
        correoInstitucional: forgotPasswordEmail
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        toast.success("Se ha enviado un token de verificación a su correo electrónico");
        setShowTokenInput(true);
        setForgotPasswordMessage("Por favor ingrese el token recibido en su correo electrónico");
      } else {
        toast.error(response.data.message || "No se pudo procesar la solicitud");
      }
    } catch (error) {
      console.error("Error en recuperación de contraseña:", error);
      if (error.response?.status === 404) {
        toast.error("El correo no está registrado en el sistema");
      } else if (error.response?.status === 500) {
        toast.error("Error en el servidor. Por favor intente más tarde");
      } else {
        toast.error("Error al procesar la solicitud. Por favor intente nuevamente");
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  const verifyTokenAndShowPasswordForm = async () => {
    try {
      if (!tokenInput) {
        toast.error("Por favor ingrese el token");
        return;
      }

      // Verificar token sin cambiar contraseña
      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/verify-token", {
        correoInstitucional: forgotPasswordEmail,
        token: tokenInput
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        setShowTokenInput(false);
        setShowResetPasswordForm(true);
        toast.success("Token verificado correctamente");
      } else {
        toast.error(response.data.message || "Token inválido");
      }
    } catch (error) {
      console.error("Error al verificar token:", error);
      if (error.response?.status === 400) {
        toast.error("Token inválido o expirado. Solicite uno nuevo.");
      } else if (error.response?.status === 500) {
        toast.error("Error en el servidor. Por favor intente más tarde");
      } else {
        toast.error("Error al verificar el token");
      }
    }
  };

  const verifyTokenAndChangePassword = async () => {
    try {
      if (!tokenInput) {
        toast.error("Por favor ingrese el token");
        return;
      }

      if (!newPassword) {
        toast.error("Por favor ingrese la nueva contraseña");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/reset-password", {
        correoInstitucional: forgotPasswordEmail,
        token: tokenInput,
        nuevaPassword: newPassword
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        toast.success("Contraseña restablecida correctamente. Ya puede iniciar sesión.");
        setMensajeReset("Contraseña restablecida correctamente");
        resetForgotPasswordForm();
      } else {
        toast.error(response.data.message || "Error al restablecer la contraseña");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      if (error.response?.status === 400) {
        toast.error("Token inválido o expirado. Solicite uno nuevo.");
      } else if (error.response?.status === 500) {
        toast.error("Error en el servidor. Por favor intente más tarde");
      } else {
        toast.error("Error al restablecer la contraseña");
      }
    }
  };

  const resetForgotPasswordForm = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
    setIsSendingEmail(false);
    setShowResetPasswordForm(false);
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setShowTokenInput(false);
    setTokenInput("");
    setMensajeReset("");
  };

  return (
    <>
      <div className="contenedor_login">
        <h1>Iniciar Sesión</h1>
        
        <label>Correo Institucional:</label>
        <input 
          type="email" 
          name="correoInstitucional" 
          placeholder="Ingrese su correo institucional"
          value={user.correoInstitucional} 
          onChange={onAuthChange}
          disabled={loginLoading}
        />
        
        <label>Contraseña:</label>
        <input 
          type="password" 
          name="password" 
          placeholder="Ingrese su contraseña"
          value={user.password} 
          onChange={onAuthChange}
          disabled={loginLoading}
        />
        
        <label>Rol en la Aplicación:</label>
        <select 
          name="role" 
          value={user.role} 
          onChange={onAuthChange}
          disabled={loginLoading}
        >
          <option value="lector">Lector</option>
          <option value="admin">Administrador</option>
        </select>
        
        <button 
          onClick={onLogin}
          disabled={loginLoading}
          className={`login-btn ${loginLoading ? 'loading' : ''}`}
        >
          {loginLoading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        
        <button 
          onClick={() => onMenuChange("inicio")}
          className="back-btn"
          disabled={loginLoading}
        >
          Volver
        </button>
        
        <p 
          className="forgot-password-link" 
          onClick={() => setShowForgotPassword(true)}
        >
          ¿Olvidó su contraseña?
        </p>
      </div>

      {/* Modal de recuperación de contraseña */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Recuperar Contraseña</h2>
              <button 
                className="modal-close" 
                onClick={resetForgotPasswordForm}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {!showTokenInput && !showResetPasswordForm && (
                <>
                  <p>Ingrese su correo institucional para recibir un token de verificación.</p>
                  <input
                    type="email"
                    placeholder="Correo institucional"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    disabled={isSendingEmail}
                  />
                  <div className="modal-buttons">
                    <button 
                      onClick={resetForgotPasswordForm}
                      className="btn-cancel"
                      disabled={isSendingEmail}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleForgotPassword}
                      disabled={isSendingEmail}
                      className="btn-primary"
                    >
                      {isSendingEmail ? 'Enviando...' : 'Enviar Token'}
                    </button>
                  </div>
                </>
              )}

              {showTokenInput && (
                <>
                  <p>Ingrese el token recibido en su correo electrónico.</p>
                  <input
                    type="text"
                    placeholder="Token de verificación"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                  />
                  <div className="modal-buttons">
                    <button 
                      onClick={resetForgotPasswordForm}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={verifyTokenAndShowPasswordForm}
                      className="btn-primary"
                    >
                      Verificar Token
                    </button>
                  </div>
                </>
              )}

              {showResetPasswordForm && (
                <>
                  <p>Ingrese su nueva contraseña.</p>
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="modal-buttons">
                    <button 
                      onClick={resetForgotPasswordForm}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={verifyTokenAndChangePassword}
                      className="btn-primary"
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                </>
              )}

              {mensajeReset && (
                <p className="reset-message">{mensajeReset}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginManager;
