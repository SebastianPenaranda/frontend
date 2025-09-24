import React from 'react';
import './PanelAdmin.css';

const PanelAdmin = ({ 
  adminView, 
  setAdminView, 
  user, 
  handleAuthChange, 
  register, 
  logout, 
  fetchHuellas, 
  ROLES_REGISTRO_USUARIOS, 
  ROLES_REGISTRO_PERSONAS, 
  DEPARTAMENTOS, 
  FACULTADES,
  DEPENDENCIAS, 
  CARRERAS_PREGRADO, 
  CARRERAS_POSTGRADO, 
  GRUPOS_INVESTIGACION, 
  PROYECTOS, 
  AREAS_SERVICIOS, 
  PROGRAMAS_BECA,
  formData,
  handleChange,
  handleProyectosChange,
  handleFileChange,
  imagePreview,
  registroEditando,
  handleSubmit,
  handleUpdate,
  huellas,
  registrosLoading,
  tipoFiltro,
  setTipoFiltro,
  valorBusqueda,
  setValorBusqueda,
  filtrarRegistros,
  obtenerPlaceholder,
  registrosPorPagina,
  setRegistrosPorPagina,
  paginaActual,
  setPaginaActual,
  handleEdit,
  handleDelete,
  setRegistroDetalle,
  registroDetalle,
  normalizarRolClase,
  formatearCampo,
  adminHistorialTab,
  setAdminHistorialTab,
  accesosFiltros,
  handleAccesosFiltroChange,
  fetchAccesos,
  setTipoExportacion,
  setMostrarModalExportar,
  accesosLoading,
  accesos,
  accesosTotal,
  accesosPage,
  setAccesosPage,
  accesosLimit,
  setAccesosLimit,
  personasFiltros,
  handlePersonasFiltroChange,
  fetchPersonas,
  setTipoExportacionPersonas,
  setMostrarModalImportar,
  personasLoading,
  personas,
  personasTotal,
  personasPage,
  setPersonasPage,
  personasLimit,
  setPersonasLimit,
  mostrarModalExportar,
  tipoExportacion,
  handleExportar,
  exportando,
  tipoExportacionPersonas,
  handleExportarPersonas,
  mostrarModalImportar,
  archivoExcel,
  setArchivoExcel,
  procesarImportacion,
  importando,
  mostrarModalConfirmacion,
  registroAEliminar,
  confirmarEliminacion,
  setMostrarModalConfirmacion,
  setRegistroAEliminar,
  registroEliminado,
  deshacerEliminacion,
  setRegistroEliminado,
  edicionDesdeDetalle,
  setEdicionDesdeDetalle,
  errores,
  handleBlur,
  mostrarErrores,
  erroresUsuario,
  handleAuthBlur,
  mostrarErroresUsuario
}) => {
  
  // Función para renderizar mensajes de error
  const renderError = (nombreCampo) => {
    if (errores[nombreCampo] && (mostrarErrores || errores[nombreCampo])) {
      return (
        <div className="error-message" style={{
          color: '#e74c3c',
          fontSize: '12px',
          marginTop: '2px',
          marginBottom: '8px',
          display: 'block'
        }}>
          {errores[nombreCampo]}
        </div>
      );
    }
    return null;
  };

  // Función para renderizar mensajes de error de usuario
  const renderErrorUsuario = (nombreCampo) => {
    if (erroresUsuario[nombreCampo] && (mostrarErroresUsuario || erroresUsuario[nombreCampo])) {
      return (
        <div className="error-message" style={{
          color: '#e74c3c',
          fontSize: '12px',
          marginTop: '2px',
          marginBottom: '8px',
          display: 'block'
        }}>
          {erroresUsuario[nombreCampo]}
        </div>
      );
    }
    return null;
  };
  
  // Calcular índices para paginación
  const indexUltimoRegistro = paginaActual * registrosPorPagina;
  const indexPrimerRegistro = indexUltimoRegistro - registrosPorPagina;
  const registrosFiltrados = filtrarRegistros(huellas);
  const registrosActuales = registrosFiltrados.slice(indexPrimerRegistro, indexUltimoRegistro);
  const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
  
  return (
    <div className="contenedor_admin">
      {adminView === "menu" && (
        <>
        <div className="panelAdministradorCuadro">
            <h1>Panel de Administrador</h1>
            <div className="admin-menu-btns">
              <button onClick={() => setAdminView("registro")} className="admin-menu-btn">
                <span></span> Registro de Personas
              </button>
              <button onClick={() => {
                setAdminView("ver_registros");
                fetchHuellas();
              }} className="admin-menu-btn">
                <span></span> Ver Registros
              </button>
              <button onClick={() => setAdminView("historial")} className="admin-menu-btn">
                <span></span> Historial
              </button>
              <button onClick={() => setAdminView("registrar_usuario")} className="admin-menu-btn">
                <span></span> Registrar Usuario
              </button>
              <button onClick={logout} className="admin-menu-btn admin-menu-btn-logout">
                <span></span> Cerrar Sesión
              </button>
            </div>
        </div>
        </>
      )}

      {adminView === "registrar_usuario" && (
        <div className="panelRegistroCuadro">
          <h1>Registro de Usuario</h1>
          <div className="admin-form">
            <div className="form-section">
              <h2>Información Personal</h2>
              <label>Nombre:</label>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Ingrese el nombre" 
                value={user.nombre} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.nombre ? { borderColor: '#e74c3c' } : {}}
              />
              {renderErrorUsuario('nombre')}
              <label>Apellido:</label>
              <input 
                type="text" 
                name="apellido" 
                placeholder="Ingrese el apellido" 
                value={user.apellido} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.apellido ? { borderColor: '#e74c3c' } : {}}
              />
              {renderErrorUsuario('apellido')}
              <label>Fecha de Nacimiento:</label>
              <input 
                type="date" 
                name="fechaNacimiento" 
                value={user.fechaNacimiento} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.fechaNacimiento ? { borderColor: '#e74c3c' } : {}}
              />
              {renderErrorUsuario('fechaNacimiento')}
              <label>ID Institucional:</label>
              <input 
                type="text" 
                name="idInstitucional" 
                placeholder="Ingrese el ID institucional" 
                value={user.idInstitucional} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                pattern="\\d*" 
                inputMode="numeric" 
                required 
                style={erroresUsuario.idInstitucional ? { borderColor: '#e74c3c' } : {}}
              />
              {renderErrorUsuario('idInstitucional')}
              <label>Cédula:</label>
              <input 
                type="text" 
                name="cedula" 
                placeholder="Ingrese el número de cédula" 
                value={user.cedula} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                pattern="\\d*" 
                inputMode="numeric" 
                required 
                style={erroresUsuario.cedula ? { borderColor: '#e74c3c' } : {}}
              />
              {renderErrorUsuario('cedula')}
              <label>Rol en la Universidad:</label>
              <select 
                name="rolUniversidad" 
                value={user.rolUniversidad} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required
                style={erroresUsuario.rolUniversidad ? { borderColor: '#e74c3c' } : {}}
              >
                <option value="">Seleccione un rol</option>
                {ROLES_REGISTRO_USUARIOS.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              {renderErrorUsuario('rolUniversidad')}
              <label>Correo Personal:</label>
              <input 
                type="email" 
                name="correoPersonal" 
                placeholder="Ingrese el correo personal" 
                value={user.correoPersonal} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.correoPersonal ? { borderColor: '#e74c3c' } : {}}
<<<<<<< HEAD
                autoComplete="email"
                data-form-type="user-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              {renderErrorUsuario('correoPersonal')}
              <label>Correo Institucional:</label>
              <input 
                type="email" 
                name="correoInstitucional" 
                placeholder="Ingrese el correo institucional" 
                value={user.correoInstitucional} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.correoInstitucional ? { borderColor: '#e74c3c' } : {}}
<<<<<<< HEAD
                autoComplete="work-email"
                data-form-type="user-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              {renderErrorUsuario('correoInstitucional')}
              <label>Contraseña:</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Ingrese la contraseña" 
                value={user.password} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required 
                style={erroresUsuario.password ? { borderColor: '#e74c3c' } : {}}
<<<<<<< HEAD
                autoComplete="new-password"
                data-form-type="user-registration"
=======
>>>>>>> 42be63683b4a48f9200536eaf767bb48b9b04df1
              />
              {renderErrorUsuario('password')}
              <label>Rol en la Aplicación:</label>
              <select 
                name="role" 
                value={user.role} 
                onChange={handleAuthChange} 
                onBlur={handleAuthBlur}
                required
                style={erroresUsuario.role ? { borderColor: '#e74c3c' } : {}}
              >
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="lector">Lector</option>
              </select>
              {renderErrorUsuario('role')}

              {/* Campos específicos según el rol */}
              {user.rolUniversidad === 'Profesor / Docente' && (
                <>
                  <label>Departamento / Facultad:</label>
                  <select 
                    name="departamento" 
                    value={user.departamento} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.departamento ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione un departamento</option>
                    {DEPARTAMENTOS.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                  {renderErrorUsuario('departamento')}
                  <label>Categoría Académica:</label>
                  <select 
                    name="categoriaAcademica" 
                    value={user.categoriaAcademica} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.categoriaAcademica ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Asistente">Asistente</option>
                    <option value="Asociado">Asociado</option>
                    <option value="Titular">Titular</option>
                  </select>
                  {renderErrorUsuario('categoriaAcademica')}
                  <label>Horario de Atención:</label>
                  <select 
                    name="horarioAtencion" 
                    value={user.horarioAtencion} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.horarioAtencion ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione un horario</option>
                    <option value="Mañana (8:00–12:00)">Mañana (8:00–12:00)</option>
                    <option value="Tarde (13:00–17:00)">Tarde (13:00–17:00)</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                  {renderErrorUsuario('horarioAtencion')}
                </>
              )}

              {user.rolUniversidad === 'Personal Administrativo' && (
                <>
                  <label>Dependencia:</label>
                  <select 
                    name="dependencia" 
                    value={user.dependencia} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.dependencia ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione una dependencia</option>
                    {DEPENDENCIAS.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                  {renderErrorUsuario('dependencia')}
                  <label>Cargo / Título del Puesto:</label>
                  <input 
                    type="text" 
                    name="cargo" 
                    placeholder="Ingrese el cargo" 
                    value={user.cargo} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required 
                    style={erroresUsuario.cargo ? { borderColor: '#e74c3c' } : {}}
                  />
                  {renderErrorUsuario('cargo')}
                  <label>Teléfono Interno:</label>
                  <input 
                    type="text" 
                    name="telefonoInterno" 
                    placeholder="Ingrese el teléfono interno" 
                    value={user.telefonoInterno} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    pattern="\\d*" 
                    inputMode="numeric" 
                    required 
                    style={erroresUsuario.telefonoInterno ? { borderColor: '#e74c3c' } : {}}
                  />
                  {renderErrorUsuario('telefonoInterno')}
                  <label>Turno Laboral:</label>
                  <select 
                    name="turnoLaboral" 
                    value={user.turnoLaboral} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.turnoLaboral ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Jornada completa">Jornada completa</option>
                  </select>
                  {renderErrorUsuario('turnoLaboral')}
                </>
              )}

              {user.rolUniversidad === 'Seguridad' && (
                <>
                  <label>Área:</label>
                  <select 
                    name="area" 
                    value={user.area} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.area ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione un área</option>
                    <option value="Entrada Principal">Entrada Principal</option>
                    <option value="Salida Principal">Salida Principal</option>
                    <option value="Estacionamiento">Estacionamiento</option>
                    <option value="Patrullaje">Patrullaje</option>
                  </select>
                  {renderErrorUsuario('area')}
                  <label>Turno:</label>
                  <select 
                    name="turno" 
                    value={user.turno} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    required
                    style={erroresUsuario.turno ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                  {renderErrorUsuario('turno')}
                  <label>Número de Empleado:</label>
                  <input 
                    type="text" 
                    name="numeroEmpleado" 
                    placeholder="Ingrese el número de empleado" 
                    value={user.numeroEmpleado} 
                    onChange={handleAuthChange} 
                    onBlur={handleAuthBlur}
                    pattern="\\d*" 
                    inputMode="numeric" 
                    required 
                    style={erroresUsuario.numeroEmpleado ? { borderColor: '#e74c3c' } : {}}
                  />
                  {renderErrorUsuario('numeroEmpleado')}
                </>
              )}
            </div>

            <div className="form-buttons">
              <button onClick={register} className="admin-btn-guardar">
                <span></span> Registrar Usuario
              </button>
              <button onClick={() => setAdminView("menu")} className="admin-btn-volver">
                <span>←</span> Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Registro de Personas */}
      {adminView === "registro" && (
        <div className="panelRegistroCuadro">
          <h1>{registroEditando ? "Editar Registro" : "Registro de Personas"}</h1>
          <div className="admin-form">
            {/* Campos base */}
            <div className="form-section">
              <h2>Información Personal</h2>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingrese el nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={errores.nombre ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('nombre')}
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                placeholder="Ingrese el apellido"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={errores.apellido ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('apellido')}
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={errores.fechaNacimiento ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('fechaNacimiento')}
              <label>ID Institucional:</label>
              <input
                type="text"
                name="idInstitucional"
                placeholder="Ingrese el ID institucional"
                value={formData.idInstitucional}
                onChange={handleChange}
                onBlur={handleBlur}
                pattern="\\d*"
                inputMode="numeric"
                required
                style={errores.idInstitucional ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('idInstitucional')}
              <label>Cédula:</label>
              <input
                type="text"
                name="cedula"
                placeholder="Ingrese la cédula"
                value={formData.cedula}
                onChange={handleChange}
                onBlur={handleBlur}
                pattern="\\d*"
                inputMode="numeric"
                required
                style={errores.cedula ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('cedula')}
              <label>Rol en la Universidad:</label>
              <select 
                name="rolUniversidad" 
                value={formData.rolUniversidad} 
                onChange={handleChange} 
                onBlur={handleBlur}
                required
                style={errores.rolUniversidad ? { borderColor: '#e74c3c' } : {}}
              >
                <option value="">Seleccione un rol</option>
                {ROLES_REGISTRO_PERSONAS.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              {renderError('rolUniversidad')}
              <label>Correo Personal:</label>
              <input
                type="email"
                name="correoPersonal"
                placeholder="Ingrese el correo personal"
                value={formData.correoPersonal}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={errores.correoPersonal ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('correoPersonal')}
              {/* Solo mostrar campos de correo institucional para ciertos roles */}
              {['Estudiante', 'Profesor / Docente', 'Personal Administrativo', 'Egresado', 'Personal de Servicios', 'Becario / Pasante'].includes(formData.rolUniversidad) && (
                <>
                  <label>¿Tiene correo institucional?</label>
                  <select 
                    name="tieneCorreoInstitucional" 
                    value={formData.tieneCorreoInstitucional} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required
                    style={errores.tieneCorreoInstitucional ? { borderColor: '#e74c3c' } : {}}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                  {renderError('tieneCorreoInstitucional')}
                  {formData.tieneCorreoInstitucional === 'si' && (
                    <>
                      <label>Correo Institucional:</label>
                      <input
                        type="email"
                        name="correoInstitucional"
                        placeholder="correo@unicatolica.edu.co"
                        value={formData.correoInstitucional}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        style={errores.correoInstitucional ? { borderColor: '#e74c3c' } : {}}
                      />
                      {renderError('correoInstitucional')}
                    </>
                  )}
                </>
              )}
              <label>Carnet:</label>
              <input
                type="text"
                name="carnet"
                placeholder="Ingrese el número de carnet"
                value={formData.carnet}
                onChange={handleChange}
                onBlur={handleBlur}
                pattern="\\d*"
                inputMode="numeric"
                required
                style={errores.carnet ? { borderColor: '#e74c3c' } : {}}
              />
              {renderError('carnet')}
              <label>Imagen:</label>
              <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>

            {/* Campos dinámicos según el rol */}
            {formData.rolUniversidad && (
              <div className="form-section">
                <h2>Información Específica</h2>
                
                {/* Campos para Estudiante */}
                {formData.rolUniversidad === 'Estudiante' && (
                  <>
                    <label>Carrera:</label>
                    <select name="carrera" value={formData.carrera || ''} onChange={handleChange} required>
                      <option value="">Seleccione una carrera</option>
                      <optgroup label="Pregrado - Tecnológico">
                        <option value="Tecnología en Desarrollo de Software">Tecnología en Desarrollo de Software</option>
                        <option value="Tecnología en Gestión de Logística Empresarial">Tecnología en Gestión de Logística Empresarial</option>
                        <option value="Tecnología en Gestión de Mercadeo">Tecnología en Gestión de Mercadeo</option>
                      </optgroup>
                      <optgroup label="Pregrado - Profesional">
                        <option value="Administración de Empresas">Administración de Empresas</option>
                        <option value="Banca y Finanzas">Banca y Finanzas</option>
                        <option value="Comunicación Social - Periodismo">Comunicación Social - Periodismo</option>
                        <option value="Contaduría Pública">Contaduría Pública</option>
                        <option value="Derecho">Derecho</option>
                        <option value="Estudios Políticos">Estudios Políticos</option>
                        <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                        <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                        <option value="Licenciatura en Ciencias Sociales">Licenciatura en Ciencias Sociales</option>
                        <option value="Licenciatura en Educación Artística">Licenciatura en Educación Artística</option>
                        <option value="Licenciatura en Filosofía">Licenciatura en Filosofía</option>
                        <option value="Licenciatura en Informática">Licenciatura en Informática</option>
                        <option value="Mercadeo">Mercadeo</option>
                        <option value="Psicología">Psicología</option>
                        <option value="Teología">Teología</option>
                        <option value="Trabajo Social">Trabajo Social</option>
                      </optgroup>
                      <optgroup label="Postgrado - Especializaciones">
                        {CARRERAS_POSTGRADO.map(carrera => (
                          <option key={carrera} value={carrera}>{carrera}</option>
                        ))}
                      </optgroup>
                    </select>
                    <label>Semestre:</label>
                    <input
                      type="text"
                      name="semestre"
                      placeholder="Ingrese el semestre (ej: 5, 10)"
                      value={formData.semestre || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                      style={errores.semestre ? { borderColor: '#e74c3c' } : {}}
                    />
                    {renderError('semestre')}
                    <label>Estado Académico:</label>
                    <select name="estadoAcademico" value={formData.estadoAcademico || ''} onChange={handleChange} required>
                      <option value="">Seleccione el estado</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Graduado">Graduado</option>
                      <option value="Retirado">Retirado</option>
                    </select>
                    <label>¿Pertenece a un semillero de investigación?</label>
                    <select 
                      name="perteneceSemillero" 
                      value={formData.perteneceSemillero || ''} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required
                      style={errores.perteneceSemillero ? { borderColor: '#e74c3c' } : {}}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                    {renderError('perteneceSemillero')}
                    {formData.perteneceSemillero === 'si' && (
                      <>
                        <label>Nombre del Semillero:</label>
                        <input
                          type="text"
                          name="nombreSemillero"
                          placeholder="Ingrese el nombre del semillero"
                          value={formData.nombreSemillero || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          style={errores.nombreSemillero ? { borderColor: '#e74c3c' } : {}}
                        />
                        {renderError('nombreSemillero')}
                      </>
                    )}
                  </>
                )}

                {/* Campos para Profesor / Docente */}
                {formData.rolUniversidad === 'Profesor / Docente' && (
                  <>
                    <label>Departamento Académico:</label>
                    <select name="departamento" value={formData.departamento || ''} onChange={handleChange} required>
                      <option value="">Seleccione un departamento académico</option>
                      {DEPARTAMENTOS.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <label>Categoría Académica:</label>
                    <select name="categoriaAcademica" value={formData.categoriaAcademica || ''} onChange={handleChange} required>
                      <option value="">Seleccione una categoría</option>
                      <option value="Asistente">Asistente</option>
                      <option value="Asociado">Asociado</option>
                      <option value="Titular">Titular</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Profesor Catedrático">Profesor Catedrático</option>
                    </select>
                    <label>Tipo de Vinculación:</label>
                    <select name="tipoVinculacion" value={formData.tipoVinculacion || ''} onChange={handleChange} required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Tiempo Completo">Tiempo Completo</option>
                      <option value="Medio Tiempo">Medio Tiempo</option>
                      <option value="Cátedra">Cátedra</option>
                    </select>
                    <label>Horario de Atención:</label>
                    <select name="horarioAtencion" value={formData.horarioAtencion || ''} onChange={handleChange} required>
                      <option value="">Seleccione un horario</option>
                      <option value="Mañana (8:00–12:00)">Mañana (8:00–12:00)</option>
                      <option value="Tarde (13:00–17:00)">Tarde (13:00–17:00)</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                    <label>Grupo de Investigación:</label>
                    <input
                      type="text"
                      name="grupoInvestigacion"
                      placeholder="Ingrese el grupo de investigación (opcional)"
                      value={formData.grupoInvestigacion || ''}
                      onChange={handleChange}
                    />
                    <label>¿Pertenece a un semillero de investigación?</label>
                    <select 
                      name="perteneceSemilleroProfesor" 
                      value={formData.perteneceSemilleroProfesor || ''} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required
                      style={errores.perteneceSemilleroProfesor ? { borderColor: '#e74c3c' } : {}}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                    {renderError('perteneceSemilleroProfesor')}
                    {formData.perteneceSemilleroProfesor === 'si' && (
                      <>
                        <label>Nombre del Semillero:</label>
                        <input
                          type="text"
                          name="nombreSemilleroProfesor"
                          placeholder="Ingrese el nombre del semillero"
                          value={formData.nombreSemilleroProfesor || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          style={errores.nombreSemilleroProfesor ? { borderColor: '#e74c3c' } : {}}
                        />
                        {renderError('nombreSemilleroProfesor')}
                      </>
                    )}
                  </>
                )}

                {/* Campos para Personal Administrativo */}
                {formData.rolUniversidad === 'Personal Administrativo' && (
                  <>
                    <label>Dependencia:</label>
                    <select name="dependencia" value={formData.dependencia || ''} onChange={handleChange} required>
                      <option value="">Seleccione una dependencia</option>
                      {DEPENDENCIAS.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <label>Cargo / Título del Puesto:</label>
                    <input
                      type="text"
                      name="cargo"
                      placeholder="Ingrese el cargo"
                      value={formData.cargo || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Teléfono Interno:</label>
                    <input
                      type="text"
                      name="telefonoInterno"
                      placeholder="Ingrese el teléfono interno"
                      value={formData.telefonoInterno || ''}
                      onChange={handleChange}
                      pattern="\\d*"
                      inputMode="numeric"
                    />
                    <label>Turno Laboral:</label>
                    <select name="turnoLaboral" value={formData.turnoLaboral || ''} onChange={handleChange} required>
                      <option value="">Seleccione un turno</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Jornada completa">Jornada completa</option>
                    </select>
                    <label>Nivel Jerárquico:</label>
                    <select name="nivelJerarquico" value={formData.nivelJerarquico || ''} onChange={handleChange} required>
                      <option value="">Seleccione el nivel</option>
                      <option value="Directivo">Directivo</option>
                      <option value="Coordinador">Coordinador</option>
                      <option value="Analista">Analista</option>
                      <option value="Asistente">Asistente</option>
                      <option value="Auxiliar">Auxiliar</option>
                    </select>
                  </>
                )}

                {/* Campos para Egresado */}
                {formData.rolUniversidad === 'Egresado' && (
                  <>
                    <label>Carrera de Egreso:</label>
                    <select name="carreraEgreso" value={formData.carreraEgreso || ''} onChange={handleChange} required>
                      <option value="">Seleccione la carrera de egreso</option>
                      <optgroup label="Pregrado - Tecnológico">
                        <option value="Tecnología en Desarrollo de Software">Tecnología en Desarrollo de Software</option>
                        <option value="Tecnología en Gestión de Logística Empresarial">Tecnología en Gestión de Logística Empresarial</option>
                        <option value="Tecnología en Gestión de Mercadeo">Tecnología en Gestión de Mercadeo</option>
                      </optgroup>
                      <optgroup label="Pregrado - Profesional">
                        <option value="Administración de Empresas">Administración de Empresas</option>
                        <option value="Banca y Finanzas">Banca y Finanzas</option>
                        <option value="Comunicación Social - Periodismo">Comunicación Social - Periodismo</option>
                        <option value="Contaduría Pública">Contaduría Pública</option>
                        <option value="Derecho">Derecho</option>
                        <option value="Estudios Políticos">Estudios Políticos</option>
                        <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                        <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                        <option value="Licenciatura en Ciencias Sociales">Licenciatura en Ciencias Sociales</option>
                        <option value="Licenciatura en Educación Artística">Licenciatura en Educación Artística</option>
                        <option value="Licenciatura en Filosofía">Licenciatura en Filosofía</option>
                        <option value="Licenciatura en Informática">Licenciatura en Informática</option>
                        <option value="Mercadeo">Mercadeo</option>
                        <option value="Psicología">Psicología</option>
                        <option value="Teología">Teología</option>
                        <option value="Trabajo Social">Trabajo Social</option>
                      </optgroup>
                      <optgroup label="Postgrado - Especializaciones">
                        {CARRERAS_POSTGRADO.map(carrera => (
                          <option key={carrera} value={carrera}>{carrera}</option>
                        ))}
                      </optgroup>
                    </select>
                    <label>Año de Egreso:</label>
                    <input
                      type="number"
                      name="anoEgreso"
                      placeholder="Ej: 2023"
                      value={formData.anoEgreso || ''}
                      onChange={handleChange}
                      min="1990"
                      max={new Date().getFullYear()}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                    />
                    <label>Título Obtenido:</label>
                    <input
                      type="text"
                      name="tituloObtenido"
                      placeholder="Ej: Ingeniero de Sistemas"
                      value={formData.tituloObtenido || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Empresa Actual:</label>
                    <input
                      type="text"
                      name="empresaActual"
                      placeholder="Empresa donde trabaja actualmente"
                      value={formData.empresaActual || ''}
                      onChange={handleChange}
                    />
                    <label>Cargo Actual:</label>
                    <input
                      type="text"
                      name="cargoActual"
                      placeholder="Cargo actual en la empresa"
                      value={formData.cargoActual || ''}
                      onChange={handleChange}
                    />
                  </>
                )}

                {/* Campos para Personal de Servicios */}
                {formData.rolUniversidad === 'Personal de Servicios' && (
                  <>
                    <label>Área de Servicios:</label>
                    <select name="areaServicios" value={formData.areaServicios || ''} onChange={handleChange} required>
                      <option value="">Seleccione un área</option>
                      {AREAS_SERVICIOS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <label>Tipo de Servicio:</label>
                    <select name="tipoServicio" value={formData.tipoServicio || ''} onChange={handleChange} required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Limpieza">Limpieza</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Cafetería">Cafetería</option>
                      <option value="Jardinería">Jardinería</option>
                      <option value="Transporte">Transporte</option>
                    </select>
                    <label>Turno:</label>
                    <select name="turno" value={formData.turno || ''} onChange={handleChange} required>
                      <option value="">Seleccione un turno</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noche">Noche</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                    <label>Empresa Contratista:</label>
                    <input
                      type="text"
                      name="empresaContratista"
                      placeholder="Empresa a la que pertenece"
                      value={formData.empresaContratista || ''}
                      onChange={handleChange}
                    />
                  </>
                )}

                {/* Campos para Becario / Pasante */}
                {formData.rolUniversidad === 'Becario / Pasante' && (
                  <>
                    <label>Tipo de Programa:</label>
                    <select name="tipoPrograma" value={formData.tipoPrograma || ''} onChange={handleChange} required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Beca de Investigación">Beca de Investigación</option>
                      <option value="Beca Académica">Beca Académica</option>
                      <option value="Pasantía Profesional">Pasantía Profesional</option>
                      <option value="Práctica Académica">Práctica Académica</option>
                    </select>
                    <label>Programa de Beca:</label>
                    <select name="programaBeca" value={formData.programaBeca || ''} onChange={handleChange} required>
                      <option value="">Seleccione el programa</option>
                      {PROGRAMAS_BECA.map(programa => (
                        <option key={programa} value={programa}>{programa}</option>
                      ))}
                    </select>
                    <label>Institución de Origen:</label>
                    <input
                      type="text"
                      name="institucionOrigen"
                      placeholder="Universidad o institución de origen"
                      value={formData.institucionOrigen || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Proyecto Asignado:</label>
                    <select name="proyectoAsignado" value={formData.proyectoAsignado || ''} onChange={handleChange}>
                      <option value="">Seleccione un proyecto (opcional)</option>
                      {PROYECTOS.map(proyecto => (
                        <option key={proyecto} value={proyecto}>{proyecto}</option>
                      ))}
                    </select>
                    <label>Supervisor:</label>
                    <input
                      type="text"
                      name="supervisor"
                      placeholder="Nombre del supervisor"
                      value={formData.supervisor || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Fecha de Inicio:</label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Fecha de Finalización:</label>
                    <input
                      type="date"
                      name="fechaFinalizacion"
                      value={formData.fechaFinalizacion || ''}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}

                {/* Campos para Colaborador Externo */}
                {formData.rolUniversidad === 'Colaborador Externo' && (
                  <>
                    <label>Tipo de Colaboración:</label>
                    <select name="tipoColaboracion" value={formData.tipoColaboracion || ''} onChange={handleChange} required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Investigación">Investigación</option>
                      <option value="Consultoría">Consultoría</option>
                      <option value="Docencia">Docencia</option>
                      <option value="Extensión">Extensión</option>
                      <option value="Servicios Técnicos">Servicios Técnicos</option>
                    </select>
                    <label>Organización:</label>
                    <input
                      type="text"
                      name="organizacion"
                      placeholder="Organización de procedencia"
                      value={formData.organizacion || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Cargo en la Organización:</label>
                    <input
                      type="text"
                      name="cargoOrganizacion"
                      placeholder="Cargo que ocupa en su organización"
                      value={formData.cargoOrganizacion || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Área de Colaboración:</label>
                    <select name="areaColaboracion" value={formData.areaColaboracion || ''} onChange={handleChange} required>
                      <option value="">Seleccione el área</option>
                      {DEPARTAMENTOS.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <label>Contacto de Referencia:</label>
                    <input
                      type="text"
                      name="contactoReferencia"
                      placeholder="Persona de contacto en la universidad"
                      value={formData.contactoReferencia || ''}
                      onChange={handleChange}
                      required
                    />
                    <label>Duración del Proyecto:</label>
                    <input
                      type="text"
                      name="duracionProyecto"
                      placeholder="Ej: 6 meses, 1 año"
                      value={formData.duracionProyecto || ''}
                      onChange={handleChange}
                    />
                  </>
                )}
              </div>
            )}

            <div className="form-buttons">
              <button
                onClick={registroEditando ? handleUpdate : handleSubmit}
                className="admin-btn-guardar"
                disabled={
                  !formData.nombre || 
                  !formData.apellido || 
                  !formData.rolUniversidad ||
                  !formData.idInstitucional ||
                  !formData.cedula ||
                  // Validación de correo institucional solo para roles que lo requieren
                  (['Estudiante', 'Profesor / Docente', 'Personal Administrativo', 'Egresado', 'Personal de Servicios', 'Becario / Pasante'].includes(formData.rolUniversidad) && 
                    (!formData.tieneCorreoInstitucional || (formData.tieneCorreoInstitucional === 'si' && !formData.correoInstitucional))) ||
                  (formData.rolUniversidad === 'Estudiante' && (!formData.carrera || !formData.semestre)) ||
                  (formData.rolUniversidad === 'Profesor / Docente' && (!formData.departamento || !formData.categoriaAcademica)) ||
                  (formData.rolUniversidad === 'Personal Administrativo' && (!formData.dependencia || !formData.cargo)) ||
                  (formData.rolUniversidad === 'Egresado' && (!formData.carreraEgreso || !formData.anoEgreso)) ||
                  (formData.rolUniversidad === 'Personal de Servicios' && (!formData.areaServicios || !formData.tipoServicio)) ||
                  (formData.rolUniversidad === 'Becario / Pasante' && (!formData.tipoPrograma || !formData.programaBeca)) ||
                  (formData.rolUniversidad === 'Colaborador Externo' && (!formData.tipoColaboracion || !formData.organizacion))
                }
              >
                {registroEditando ? "Actualizar" : "Registrar"}
              </button>
              <button
                onClick={() => {
                  if (edicionDesdeDetalle) {
                    setRegistroDetalle(registroEditando);
                    setAdminView("ver_registros");
                    setEdicionDesdeDetalle(false);
                  } else {
                    setAdminView("menu");
                  }
                }}
                className="admin-btn-volver"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Ver Registros */}
      {adminView === "ver_registros" && !registroDetalle && (
        <div className="panelVerRegistroCuadro">
          <div className="admin-registros-header">
            <h1 className="admin-registros-titulo">Registros de Personas</h1>
            
            <div className="filtros-y-paginacion">
              <div className="filtros-busqueda">
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="filtro-select"
                >
                  <option value="todos">Todos los campos</option>
                  <option value="idInstitucional">ID Institucional</option>
                  <option value="cedula">Cédula</option>
                  <option value="nombre">Nombre</option>
                  <option value="apellido">Apellido</option>
                  <option value="semestre">Semestre</option>
                  <option value="rolUniversidad">Rol Universidad</option>
                  <option value="carrera">Carrera</option>
                </select>
                
                {tipoFiltro === "rolUniversidad" ? (
                  <select
                    value={valorBusqueda}
                    onChange={(e) => setValorBusqueda(e.target.value)}
                    className="busqueda-input"
                    placeholder="Buscar en todos los campos"
                  >
                    <option value="">Seleccione un rol...</option>
                    {ROLES_REGISTRO_PERSONAS.map(rol => (
                      <option key={rol} value={rol}>{rol}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Buscar en todos los campos"
                    value={valorBusqueda}
                    onChange={(e) => setValorBusqueda(e.target.value)}
                    className="busqueda-input"
                  />
                )}
              </div>
              
              <div className="registros-por-pagina">
                <label>Registros por página:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50"
                  value={registrosPorPagina} 
                  onChange={(e) => setRegistrosPorPagina(Math.max(1, parseInt(e.target.value) || 5))}
                  className="pagina-input"
                />
              </div>
            </div>
          </div>

          <div className="resultados-info">
            <span>{registrosFiltrados.length} resultado(s) encontrado(s)</span>
            <span>Mostrando página {paginaActual} de {totalPaginas}</span>
          </div>

          <div className="registros-grid">
            {registrosLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Cargando registros de personas...</p>
                <p className="loading-subtext">Por favor espere mientras se cargan los datos</p>
              </div>
            ) : registrosActuales.length > 0 ? (
              registrosActuales.map((registro) => (
                <div key={registro._id} className="registro-card">
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(registro)}
                      className="btn-card btn-editar"
                    >
                      <span>✏️</span> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(registro)}
                      className="btn-card btn-eliminar"
                    >
                      <span>🗑️</span> Eliminar
                    </button>
                    <button
                      onClick={() => setRegistroDetalle(registro)}
                      className="btn-card btn-ver-info"
                    >
                      <span>👁️</span> Ver Información
                    </button>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-field">
                      <span className="field-label">ID Institucional:</span>
                      <span className="field-value">{registro.idInstitucional}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Nombre:</span>
                      <span className="field-value">{registro.nombre} {registro.apellido}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Carrera:</span>
                      <span className="field-value">{registro.carrera || 'undefined'}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Rol Universitario:</span>
                      <span className="field-value">{registro.rolUniversidad}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Semestre:</span>
                      <span className="field-value">{registro.semestre || 'undefined'}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Correo Institucional:</span>
                      <span className="field-value">{registro.correoInstitucional}</span>
                    </div>
                  </div>
                  
                  <div className="card-image">
                    {registro.imagen ? (
                      <img 
                        src={`https://backend-coral-theta-21.vercel.app/api/huellas/${registro._id}/imagen`}
                        alt="Imagen de la persona" 
                        className="registro-imagen"
                      />
                    ) : (
                      <div className="placeholder-image">
                        <span>📊</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-registros">
                <p>No se encontraron registros</p>
              </div>
            )}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="paginacion-btn"
              >
                <span>←</span> Anterior
              </button>
              
              <span className="paginacion-info">
                Página {paginaActual} de {totalPaginas}
              </span>
              
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="paginacion-btn"
              >
                Siguiente <span>→</span>
              </button>
            </div>
          )}

          <div className="volver-menu-container">
            <button 
              onClick={() => setAdminView("menu")}
              className="admin-volver-btn"
            >
              <span>←</span> Volver al Menú
            </button>
          </div>
        </div>
      )}

      {/* Vista de detalle de registro */}
      {adminView === "ver_registros" && registroDetalle && (
        <div className="panelVerRegistroCuadro">
          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50', fontWeight: 700}}>Información Completa de la Persona</h2>
          <div className="detalle-persona-grid">
            {Object.entries(registroDetalle).map(([key, value]) => (
              key !== "_id" && key !== "__v" && (
                <div key={key} className="detalle-persona-row">
                  <strong className="detalle-campo-label">{formatearCampo(key)}:</strong> 
                  <span className="detalle-campo-valor">
                    {key === 'imagen' && value ? (
                      <img 
                        src={`https://backend-coral-theta-21.vercel.app/api/huellas/${registroDetalle._id}/imagen`}
                        alt="Foto de la persona" 
                        className="detalle-imagen"
                      />
                    ) : key === 'rolUniversidad' ? (
                      <span className={`rol-badge rol-${normalizarRolClase(value)}`}>
                        {value}
                      </span>
                    ) : (
                      value || '-'
                    )}
                  </span>
                </div>
              )
            ))}
          </div>
          <div className="detalle-acciones">
            <button 
              onClick={() => {
                handleEdit(registroDetalle);
                setEdicionDesdeDetalle(true);
              }}
              className="admin-btn-editar"
            >
              Editar Registro
            </button>
            <button 
              onClick={() => setRegistroDetalle(null)}
              className="admin-btn-volver"
            >
              <span>←</span> Volver a Registros
            </button>
          </div>
        </div>
      )}
      
      {/* Vista de Historial */}
      {adminView === "historial" && (
        <div className="panelVerRegistroCuadro">
          <h1 className="historial-titulo">Historial</h1>
          
          <div className="historial-tabs">
            <button 
              className={`historial-tab ${adminHistorialTab === 'accesos' ? 'historial-tab-active' : ''}`} 
              onClick={() => setAdminHistorialTab('accesos')}
            >
              Accesos
            </button>
            <button 
              className={`historial-tab ${adminHistorialTab === 'personas' ? 'historial-tab-active' : ''}`} 
              onClick={() => setAdminHistorialTab('personas')}
            >
              Personas
            </button>
          </div>
          
          <div className="historial-content">
            {adminHistorialTab === 'accesos' && (
              <div>
                <div className="historial-filtros-container">
                  {/* Primera fila de filtros */}
                  <div className="filtros-fila">
                    <input 
                      name="nombre" 
                      value={accesosFiltros.nombre} 
                      onChange={handleAccesosFiltroChange} 
                      placeholder="Nombre" 
                      className="historial-input"
                    />
                    <select 
                      name="rolUniversidad" 
                      value={accesosFiltros.rolUniversidad} 
                      onChange={handleAccesosFiltroChange}
                      className="historial-select"
                    >
                      <option value="">Seleccione un rol</option>
                      {ROLES_REGISTRO_PERSONAS.map(rol => (
                        <option key={rol} value={rol}>{rol}</option>
                      ))}
                    </select>
                    <input 
                      name="carnet" 
                      value={accesosFiltros.carnet} 
                      onChange={handleAccesosFiltroChange} 
                      placeholder="Carnet" 
                      className="historial-input"
                    />
                  </div>
                  
                  {/* Segunda fila de filtros */}
                  <div className="filtros-fila">
                    <input 
                      name="numeroTarjeta" 
                      value={accesosFiltros.numeroTarjeta} 
                      onChange={handleAccesosFiltroChange} 
                      placeholder="N° Tarjeta" 
                      className="historial-input"
                    />
                    <input 
                      name="fecha" 
                      type="date" 
                      value={accesosFiltros.fecha} 
                      onChange={handleAccesosFiltroChange} 
                      className="historial-input historial-date"
                    />
                    <select 
                      name="tipo" 
                      value={accesosFiltros.tipo} 
                      onChange={handleAccesosFiltroChange}
                      className="historial-select"
                    >
                      <option value="">Tipo</option>
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                    <button onClick={fetchAccesos} className="btn-buscar">
                      Buscar
                    </button>
                  </div>
                  
                  {/* Botones de exportación */}
                  <div className="historial-export-buttons">
                    <button 
                      onClick={() => { setTipoExportacion('excel'); setMostrarModalExportar(true); }} 
                      className="btn-export btn-excel"
                    >
                      Exportar Excel
                    </button>
                    <button 
                      onClick={() => { setTipoExportacion('pdf'); setMostrarModalExportar(true); }} 
                      className="btn-export btn-pdf"
                    >
                      Exportar PDF
                    </button>
                  </div>
                </div>
                <div className="historial-tabla-container">
                  {accesosLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Cargando historial de accesos...</p>
                      <p className="loading-subtext">Por favor espere mientras se cargan los datos</p>
                    </div>
                  ) : (
                    <table className="historial-tabla">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Rol</th>
                          <th>Carnet</th>
                          <th>N° Tarjeta</th>
                          <th>Fecha</th>
                          <th>Hora Entrada</th>
                          <th>Hora Salida</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accesos.length === 0 ? (
                          <tr><td colSpan={7}>No hay registros</td></tr>
                        ) : (
                          accesos.map((a) => (
                            <tr key={a._id}>
                              <td>{a.nombre}</td>
                              <td>{a.rolUniversidad}</td>
                              <td>{a.carnet}</td>
                              <td>{a.numeroTarjeta}</td>
                              <td>{a.fecha}</td>
                              <td>{a.horaEntrada || '-'}</td>
                              <td>{a.horaSalida || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="historial-paginacion">
                  <button onClick={() => setAccesosPage(p => Math.max(1, p - 1))} disabled={accesosPage === 1}>Anterior</button>
                  <span>Página {accesosPage} de {Math.ceil(accesosTotal / accesosLimit) || 1}</span>
                  <button onClick={() => setAccesosPage(p => p + 1)} disabled={accesosPage >= Math.ceil(accesosTotal / accesosLimit)}>Siguiente</button>
                  <select value={accesosLimit} onChange={e => { setAccesosLimit(Number(e.target.value)); setAccesosPage(1); }}>
                    {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} por página</option>)}
                  </select>
                </div>
              </div>
            )}
            {adminHistorialTab === 'personas' && (
              <div>
                <div className="historial-filtros-container">
                  <div className="historial-filtros-grid">
                    <input 
                      name="nombre" 
                      value={personasFiltros.nombre} 
                      onChange={handlePersonasFiltroChange} 
                      placeholder="Nombre" 
                      className="historial-input"
                    />
                    <input 
                      name="apellido" 
                      value={personasFiltros.apellido} 
                      onChange={handlePersonasFiltroChange} 
                      placeholder="Apellido" 
                      className="historial-input"
                    />
                    <select 
                      name="rolUniversidad" 
                      value={personasFiltros.rolUniversidad} 
                      onChange={handlePersonasFiltroChange}
                      className="historial-select"
                    >
                      <option value="">Seleccione un rol</option>
                      {ROLES_REGISTRO_PERSONAS.map(rol => (
                        <option key={rol} value={rol}>{rol}</option>
                      ))}
                    </select>
                    <input 
                      name="cedula" 
                      value={personasFiltros.cedula} 
                      onChange={handlePersonasFiltroChange} 
                      placeholder="Cédula" 
                      className="historial-input"
                    />
                    <input 
                      name="idInstitucional" 
                      value={personasFiltros.idInstitucional} 
                      onChange={handlePersonasFiltroChange} 
                      placeholder="ID Institucional" 
                      className="historial-input"
                    />
                    <input 
                      name="correoInstitucional" 
                      value={personasFiltros.correoInstitucional} 
                      onChange={handlePersonasFiltroChange} 
                      placeholder="Correo Institucional" 
                      className="historial-input"
                    />
                  </div>
                  
                  <div className="historial-acciones">
                    <button onClick={fetchPersonas} className="btn-buscar">
                      Buscar
                    </button>
                    <div className="historial-export-buttons">
                      <button 
                        onClick={() => { setTipoExportacionPersonas('excel'); setMostrarModalExportar(true); }} 
                        className="btn-export btn-excel"
                      >
                        Exportar Excel
                      </button>
                      <button 
                        onClick={() => { setTipoExportacionPersonas('pdf'); setMostrarModalExportar(true); }} 
                        className="btn-export btn-pdf"
                      >
                        Exportar PDF
                      </button>
                      <button 
                        onClick={() => setMostrarModalImportar(true)} 
                        className="btn-export btn-import"
                      >
                        Importar Excel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="historial-tabla-container">
                  {personasLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Cargando historial de personas...</p>
                      <p className="loading-subtext">Por favor espere mientras se cargan los datos</p>
                    </div>
                  ) : (
                    <table className="historial-tabla">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Apellido</th>
                          <th>Cédula</th>
                          <th>ID Institucional</th>
                          <th>Rol en la Universidad</th>
                          <th>Correo Institucional</th>
                          <th>Carnet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personas.length === 0 ? (
                          <tr><td colSpan={7}>No hay registros</td></tr>
                        ) : (
                          personas.map((p, idx) => (
                            <tr key={p._id || idx}>
                              <td>{p.nombre || '-'}</td>
                              <td>{p.apellido || '-'}</td>
                              <td>{p.cedula || '-'}</td>
                              <td>{p.idInstitucional || '-'}</td>
                              <td>{p.rolUniversidad || '-'}</td>
                              <td>{p.correoInstitucional || '-'}</td>
                              <td>{p.carnet || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="historial-paginacion">
                  <button onClick={() => setPersonasPage(p => Math.max(1, p - 1))} disabled={personasPage === 1}>Anterior</button>
                  <span>Página {personasPage} de {Math.ceil(personasTotal / personasLimit) || 1}</span>
                  <button onClick={() => setPersonasPage(p => p + 1)} disabled={personasPage >= Math.ceil(personasTotal / personasLimit)}>Siguiente</button>
                  <select value={personasLimit} onChange={e => { setPersonasLimit(Number(e.target.value)); setPersonasPage(1); }}>
                    {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} por página</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="volver-menu-container">
            <button 
              onClick={() => setAdminView("menu")}
              className="admin-volver-btn"
            >
              <span>←</span> Volver al Menú
            </button>
          </div>
        </div>
      )}

      {/* Modales de exportación e importación */}
      {mostrarModalExportar && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box">
            <h3 className="modal-confirm-title">¿Qué desea exportar?</h3>
            <p className="modal-confirm-msg">Seleccione si desea exportar solo la página actual o todos los resultados filtrados.</p>
            <div className="modal-confirm-btns">
              {tipoExportacion === 'excel' && (
                <button
                  onClick={() => handleExportar('pagina')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Página actual (accesos)
                </button>
              )}
              {tipoExportacion === 'excel' && (
                <button
                  onClick={() => handleExportar('todos')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Todos los resultados filtrados (accesos)
                </button>
              )}
              {tipoExportacion === 'pdf' && (
                <button
                  onClick={() => handleExportar('pagina')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Página actual (accesos)
                </button>
              )}
              {tipoExportacion === 'pdf' && (
                <button
                  onClick={() => handleExportar('todos')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Todos los resultados filtrados (accesos)
                </button>
              )}
              {tipoExportacionPersonas === 'excel' && (
                <button
                  onClick={() => handleExportarPersonas('pagina')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Página actual (personas)
                </button>
              )}
              {tipoExportacionPersonas === 'excel' && (
                <button
                  onClick={() => handleExportarPersonas('todos')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Todos los resultados filtrados (personas)
                </button>
              )}
              {tipoExportacionPersonas === 'pdf' && (
                <button
                  onClick={() => handleExportarPersonas('pagina')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Página actual (personas)
                </button>
              )}
              {tipoExportacionPersonas === 'pdf' && (
                <button
                  onClick={() => handleExportarPersonas('todos')}
                  className="modal-confirm-delete"
                  disabled={exportando}
                >
                  Todos los resultados filtrados (personas)
                </button>
              )}
              <button 
                onClick={() => setMostrarModalExportar(false)}
                className="modal-confirm-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de importación */}
      {mostrarModalImportar && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box">
            <h3 className="modal-confirm-title">Importar Personas desde Excel</h3>
            <p className="modal-confirm-msg">Seleccione un archivo Excel con la información de las personas.</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setArchivoExcel(e.target.files[0])}
              style={{ margin: '1rem 0' }}
            />
            <div className="modal-confirm-btns">
              <button
                onClick={procesarImportacion}
                className="modal-confirm-delete"
                disabled={!archivoExcel || importando}
              >
                {importando ? 'Importando...' : 'Importar'}
              </button>
              <button 
                onClick={() => {
                  setMostrarModalImportar(false);
                  setArchivoExcel(null);
                }}
                className="modal-confirm-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {mostrarModalConfirmacion && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box">
            <h3 className="modal-confirm-title">Confirmar eliminación</h3>
            <p className="modal-confirm-msg">
              ¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.
            </p>
            <div className="modal-confirm-btns">
              <button 
                onClick={() => { setMostrarModalConfirmacion(false); setRegistroAEliminar(null); }}
                className="modal-confirm-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                className="modal-confirm-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {registroEliminado && (
        <div className="modal-confirm-bg">
          <div className="modal-confirm-box">
            <h3 className="modal-confirm-title">Registro eliminado</h3>
            <p className="modal-confirm-msg">
              El registro ha sido eliminado exitosamente.
            </p>
            <div className="modal-confirm-btns">
              <button 
                onClick={() => deshacerEliminacion(registroEliminado)}
                className="modal-confirm-cancel"
              >
                Deshacer
              </button>
              <button 
                onClick={() => setRegistroEliminado(null)}
                className="modal-confirm-delete"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdmin;
