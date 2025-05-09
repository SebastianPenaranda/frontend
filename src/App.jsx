import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Constantes para roles y campos dinámicos
const ROLES_UNIVERSIDAD = [
  "Estudiante",
  "Profesor / Docente",
  "Personal Administrativo",
  "Egresado",
  "Visitante",
  "Colaborador Externo",
  "Personal de Servicios",
  "Becario / Pasante"
];

const CARRERAS_PREGRADO = [
  // Carreras de Pregrado - Universitario
  "Administración de Empresas",
  "Banca y Finanzas",
  "Comunicación Social – Periodismo",
  "Contaduría Pública",
  "Derecho",
  "Estudios Políticos",
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Licenciatura en Ciencias Sociales",
  "Licenciatura en Educación Artística",
  "Licenciatura en Filosofía",
  "Licenciatura en Informática",
  "Mercadeo",
  "Psicología",
  "Teología",
  "Trabajo Social",
  // Carreras de Pregrado - Tecnológico
  "Tecnología en Desarrollo de Software",
  "Tecnología en Gestión de Logística Empresarial",
  "Tecnología en Gestión de Mercadeo"
];

const CARRERAS_POSTGRADO = [
  "Educación en Derechos Humanos",
  "Educación y Sagrada Escritura",
  "Gerencia Estratégica",
  "Gerencia de Proyectos",
  "Gerencia del Talento Humano",
  "Informática Educativa"
];

const DEPARTAMENTOS = [
  "Ingeniería",
  "Ciencias Básicas",
  "Humanidades",
  "Administración",
  "Derecho",
  "Medicina",
  "Psicología",
  "Arquitectura"
];

const DEPENDENCIAS = [
  "Admisiones",
  "Finanzas",
  "Recursos Humanos",
  "Biblioteca",
  "Secretaría Académica",
  "Bienestar Universitario",
  "Investigaciones",
  "Extensión"
];

const GRUPOS_INVESTIGACION = [
  "AI & ML",
  "Redes y Telecomunicaciones",
  "Biotecnología",
  "Sostenibilidad",
  "Energías Renovables",
  "Materiales Avanzados",
  "Salud Pública",
  "Educación"
];

const PROYECTOS = [
  "Proyecto A",
  "Proyecto B",
  "Proyecto C",
  "Proyecto D",
  "Proyecto E"
];

const AREAS_SERVICIOS = [
  "Mantenimiento",
  "Limpieza",
  "Seguridad",
  "Cafetería",
  "Transporte"
];

const PROGRAMAS_BECA = [
  "Bienestar Universitario",
  "Investigaciones",
  "Extensión",
  "Deportes",
  "Cultura"
];

const App = () => {
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5); // Establecer valor inicial
  const [paginaActual, setPaginaActual] = useState(1); // Página inicial
  const [menu, setMenu] = useState("inicio");
  const [adminView, setAdminView] = useState("menu"); // Nuevo estado para controlar la vista del administrador
  const [user, setUser] = useState({ 
    nombre: "", 
    apellido: "", 
    fechaNacimiento: "", 
    idInstitucional: "", 
    cedula: "", 
    rolUniversidad: "", 
    correoPersonal: "", 
    correoInstitucional: "", 
    password: "", 
    role: "lector" 
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    apellido: "", 
    fechaNacimiento: "", 
    idInstitucional: "", 
    cedula: "", 
    rolUniversidad: "", 
    correoPersonal: "", 
    tieneCorreoInstitucional: "",
    correoInstitucional: "", 
    fecha: "", 
    hora: "", 
    imagen: null,
    carnet: "",
    
    // Campos dinámicos
    // Estudiante
    carrera: "",
    semestre: "",
    tipoMatricula: "",
    programa: "",
    
    // Profesor
    departamento: "",
    categoriaAcademica: "",
    horarioAtencion: "",
    
    // Personal Administrativo
    dependencia: "",
    cargo: "",
    telefonoInterno: "",
    turnoLaboral: "",
    
    // Investigador
    grupoInvestigacion: "",
    orcid: "",
    proyectosActivos: [],
    
    // Egresado
    anioGraduacion: "",
    programaGrado: "",
    tituloObtenido: "",
    correoEgresado: "",
    
    // Visitante
    institucionProcedencia: "",
    propositoVisita: "",
    fechaInicioVisita: "",
    fechaFinVisita: "",
    
    // Colaborador Externo
    empresaOrganizacion: "",
    tipoColaboracion: "",
    fechaInicioContrato: "",
    fechaFinContrato: "",
    
    // Personal de Servicios
    area: "",
    turno: "",
    numeroEmpleado: "",
    
    // Becario / Pasante
    programaBeca: "",
    fechaInicioBeca: "",
    fechaFinBeca: "",
    dependenciaAsignada: "",
    perteneceSemillero: "",
    nombreSemillero: "",
    tieneProyectoActivo: "",
    nombreProyecto: ""
  });
  const [huellas, setHuellas] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [busquedaCarnet, setBusquedaCarnet] = useState("");
  const [personaEncontrada, setPersonaEncontrada] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [registroEliminado, setRegistroEliminado] = useState(null);
  const [registroDetalle, setRegistroDetalle] = useState(null);

  // Agregar estado para el formulario de visitante
  const [visitanteForm, setVisitanteForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    razonVisita: "",
    numeroTarjeta: ""
  });

  const [showVisitanteForm, setShowVisitanteForm] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [lectorPassword, setLectorPassword] = useState("");
  const [ultimoAcceso, setUltimoAcceso] = useState(null);
  const [tipoAcceso, setTipoAcceso] = useState(null);
  const [horaAcceso, setHoraAcceso] = useState(null);
  const [edicionDesdeDetalle, setEdicionDesdeDetalle] = useState(false);
  const [adminHistorialTab, setAdminHistorialTab] = useState('accesos');

  const [accesos, setAccesos] = useState([]);
  const [accesosTotal, setAccesosTotal] = useState(0);
  const [accesosPage, setAccesosPage] = useState(1);
  const [accesosLimit, setAccesosLimit] = useState(10);
  const [accesosFiltros, setAccesosFiltros] = useState({ nombre: '', rolUniversidad: '', carnet: '', numeroTarjeta: '', fecha: '', tipo: '' });
  const [accesosLoading, setAccesosLoading] = useState(false);

  // Estado para el modal de exportación
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);
  const [tipoExportacion, setTipoExportacion] = useState(null); // 'excel' o 'pdf'
  const [exportando, setExportando] = useState(false);

  // Estado para historial de personas
  const [personas, setPersonas] = useState([]);
  const [personasTotal, setPersonasTotal] = useState(0);
  const [personasPage, setPersonasPage] = useState(1);
  const [personasLimit, setPersonasLimit] = useState(10);
  const [personasFiltros, setPersonasFiltros] = useState({ nombre: '', apellido: '', cedula: '', idInstitucional: '', rolUniversidad: '', carrera: '', correoInstitucional: '' });
  const [personasLoading, setPersonasLoading] = useState(false);
  const [tipoExportacionPersonas, setTipoExportacionPersonas] = useState(null);

  useEffect(() => {
    if (role === "lector") {
      fetchHuellas();
    }
  }, [role]);

  useEffect(() => {
    if (adminView === "historial" && adminHistorialTab === "accesos") {
      fetchAccesos();
    }
    // eslint-disable-next-line
  }, [adminView, adminHistorialTab, accesosPage, accesosLimit]);

  useEffect(() => {
    if (adminView === "historial" && adminHistorialTab === "personas") {
      fetchPersonas();
    }
  }, [adminView, adminHistorialTab, personasPage, personasLimit]);

  const handleMenuChange = (newMenu) => {
    setMenu(newMenu);
  };

  // Función para validar el correo institucional
  const validarCorreoInstitucional = (correo) => {
    return correo.endsWith('@unicatolica.edu.co');
  };

  // Función para validar la fecha de nacimiento
  const validarFechaNacimiento = (fecha) => {
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    return fechaNac <= hoy;
  };

  // Función para validar campos requeridos
  const validarCamposRequeridos = () => {
    const camposBase = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaNacimiento: formData.fechaNacimiento,
      idInstitucional: formData.idInstitucional,
      cedula: formData.cedula,
      rolUniversidad: formData.rolUniversidad,
      correoPersonal: formData.correoPersonal,
      carnet: formData.carnet
    };

    // Validar campos base
    for (const [campo, valor] of Object.entries(camposBase)) {
      if (!valor) {
        toast.error(`El campo ${campo} es requerido`);
        return false;
      }
    }

    // Validar fecha de nacimiento
    if (!validarFechaNacimiento(formData.fechaNacimiento)) {
      toast.error('La fecha de nacimiento no puede ser posterior a la fecha actual');
      return false;
    }

    // Validar correo institucional según el rol y la selección
    const rolesConCorreoInstitucional = [
      'Estudiante',
      'Profesor / Docente',
      'Personal Administrativo',
      'Egresado',
      'Personal de Servicios',
      'Becario / Pasante'
    ];

    if (rolesConCorreoInstitucional.includes(formData.rolUniversidad)) {
      if (!formData.tieneCorreoInstitucional) {
        toast.error('Por favor indique si tiene correo institucional');
        return false;
      }
      if (formData.tieneCorreoInstitucional === 'si' && !formData.correoInstitucional) {
        toast.error('El correo institucional es requerido');
        return false;
      }
      if (formData.tieneCorreoInstitucional === 'si' && !validarCorreoInstitucional(formData.correoInstitucional)) {
        toast.error('El correo institucional debe ser @unicatolica.edu.co');
        return false;
      }
    }

    // Validar campos según el rol
    switch (formData.rolUniversidad) {
      case 'Estudiante':
        if (!formData.carrera || !formData.semestre || !formData.tipoMatricula || !formData.programa) {
          toast.error('Por favor complete todos los campos del estudiante');
          return false;
        }
        // Validar campos adicionales solo si la respuesta es "sí"
        if (formData.perteneceSemillero === 'si' && !formData.nombreSemillero) {
          toast.error('Por favor ingrese el nombre del semillero');
          return false;
        }
        if (formData.tieneProyectoActivo === 'si' && !formData.nombreProyecto) {
          toast.error('Por favor ingrese el nombre del proyecto');
          return false;
        }
        break;
      case 'Profesor / Docente':
        if (!formData.departamento || !formData.categoriaAcademica || !formData.horarioAtencion) {
          toast.error('Por favor complete todos los campos del profesor');
          return false;
        }
        // Validar campos adicionales solo si la respuesta es "sí"
        if (formData.perteneceSemillero === 'si' && !formData.nombreSemillero) {
          toast.error('Por favor ingrese el nombre del semillero');
          return false;
        }
        break;
      case 'Personal Administrativo':
        if (!formData.dependencia || !formData.cargo || !formData.telefonoInterno || !formData.turnoLaboral) {
          toast.error('Por favor complete todos los campos del personal administrativo');
          return false;
        }
        break;
      case 'Egresado':
        if (!formData.anioGraduacion || !formData.programaGrado || !formData.tituloObtenido || !formData.correoEgresado) {
          toast.error('Por favor complete todos los campos del egresado');
          return false;
        }
        break;
      case 'Personal de Servicios':
        if (!formData.area || !formData.turno || !formData.numeroEmpleado) {
          toast.error('Por favor complete todos los campos del personal de servicios');
          return false;
        }
        break;
      case 'Becario / Pasante':
        if (!formData.programaBeca || !formData.fechaInicioBeca || 
            !formData.fechaFinBeca || !formData.dependenciaAsignada) {
          toast.error('Por favor complete todos los campos del becario/pasante');
          return false;
        }
        break;
    }

    return true;
  };

  // Función para limpiar campos dinámicos al cambiar de rol
  const limpiarCamposDinamicos = () => {
    const camposDinamicos = {
      carrera: "",
      semestre: "",
      tipoMatricula: "",
      programa: "",
      departamento: "",
      categoriaAcademica: "",
      horarioAtencion: "",
      dependencia: "",
      cargo: "",
      telefonoInterno: "",
      turnoLaboral: "",
      grupoInvestigacion: "",
      orcid: "",
      proyectosActivos: [],
      anioGraduacion: "",
      programaGrado: "",
      tituloObtenido: "",
      correoEgresado: "",
      institucionProcedencia: "",
      propositoVisita: "",
      fechaInicioVisita: "",
      fechaFinVisita: "",
      empresaOrganizacion: "",
      tipoColaboracion: "",
      fechaInicioContrato: "",
      fechaFinContrato: "",
      area: "",
      turno: "",
      numeroEmpleado: "",
      programaBeca: "",
      fechaInicioBeca: "",
      fechaFinBeca: "",
      dependenciaAsignada: "",
      perteneceSemillero: "",
      nombreSemillero: "",
      tieneProyectoActivo: "",
      nombreProyecto: ""
    };

    setFormData(prev => ({
      ...prev,
      ...camposDinamicos
    }));
  };

  // Modificar handleChange para manejar campos dinámicos
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el campo rolUniversidad, limpiar campos dinámicos
    if (name === 'rolUniversidad') {
      limpiarCamposDinamicos();
    }
    
    // Validación para campos numéricos
    if (['carnet', 'cedula', 'semestre', 'idInstitucional'].includes(name)) {
      // Solo permite números
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Función para manejar cambios en proyectos activos (multi-select)
  const handleProyectosChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, proyectosActivos: selectedValues }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    
    // Validación para campos numéricos
    if (['carnet', 'cedula', 'semestre', 'idInstitucional'].includes(name)) {
      // Solo permite números
      if (value === '' || /^\d+$/.test(value)) {
        setUser({ ...user, [name]: value });
      }
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const register = async () => {
    try {
      await axios.post("https://backend-coral-theta-21.vercel.app/api/register", user);
      toast.success("Usuario registrado");
      setUser({ 
        nombre: "", 
        apellido: "", 
        fechaNacimiento: "", 
        idInstitucional: "", 
        cedula: "", 
        rolUniversidad: "", 
        correoPersonal: "", 
        correoInstitucional: "", 
        password: "", 
        role: "lector" 
      });
      handleMenuChange("inicio");
    } catch {
      toast.error("Error en el registro");
    }
  };

  const login = async () => {
    try {
      console.log("Intentando login con:", {
        correoInstitucional: user.correoInstitucional,
        password: user.password,
        role: user.role
      });
      
      if (!user.correoInstitucional || !user.password || !user.role) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/login", {
        correoInstitucional: user.correoInstitucional,
        password: user.password,
        role: user.role
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data) {
        setLoggedIn(true);
        setRole(response.data.role);
        toast.success(`Sesión iniciada como ${response.data.role}`);
        if (response.data.role === 'admin') {
          setAdminView('menu'); // Siempre mostrar menú principal al iniciar sesión como admin
        }
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Error en el inicio de sesión");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setRole(null);
    setAdminView("menu");
    setUser({ 
      nombre: "", 
      apellido: "", 
      fechaNacimiento: "", 
      idInstitucional: "", 
      cedula: "", 
      rolUniversidad: "", 
      correoPersonal: "", 
      correoInstitucional: "", 
      password: "", 
      role: "lector" 
    });
    setFormData({ 
      nombre: "", 
      apellido: "", 
      fechaNacimiento: "", 
      idInstitucional: "", 
      cedula: "", 
      rolUniversidad: "", 
      correoPersonal: "", 
      tieneCorreoInstitucional: "",
      correoInstitucional: "", 
      fecha: "", 
      hora: "", 
      imagen: null,
      carnet: "",
      carrera: "",
      semestre: "",
      tipoMatricula: "",
      programa: "",
      departamento: "",
      categoriaAcademica: "",
      horarioAtencion: "",
      dependencia: "",
      cargo: "",
      telefonoInterno: "",
      turnoLaboral: "",
      grupoInvestigacion: "",
      orcid: "",
      proyectosActivos: [],
      anioGraduacion: "",
      programaGrado: "",
      tituloObtenido: "",
      correoEgresado: "",
      institucionProcedencia: "",
      propositoVisita: "",
      fechaInicioVisita: "",
      fechaFinVisita: "",
      empresaOrganizacion: "",
      tipoColaboracion: "",
      fechaInicioContrato: "",
      fechaFinContrato: "",
      area: "",
      turno: "",
      numeroEmpleado: "",
      programaBeca: "",
      fechaInicioBeca: "",
      fechaFinBeca: "",
      dependenciaAsignada: "",
      perteneceSemillero: "",
      nombreSemillero: "",
      tieneProyectoActivo: "",
      nombreProyecto: ""
    });
    setBusquedaCarnet("");
    setPersonaEncontrada(null);
    setMensajeError("");
    setImagePreview(null);
    handleMenuChange("inicio");
  };

  const handleSubmit = async () => {
    try {
      if (!validarCamposRequeridos()) {
        return;
      }

      const formDataToSend = new FormData();
  
      // Agregar todos los campos base
      const camposBase = [
        'nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
        'cedula', 'rolUniversidad', 'correoPersonal', 'carnet'
      ];

      camposBase.forEach(campo => {
        formDataToSend.append(campo, formData[campo] || '');
      });

      // Agregar campos condicionales
      if (formData.tieneCorreoInstitucional === 'si') {
        formDataToSend.append('correoInstitucional', formData.correoInstitucional);
      }
      formDataToSend.append('tieneCorreoInstitucional', formData.tieneCorreoInstitucional);

      // Agregar campos específicos según el rol
      switch (formData.rolUniversidad) {
        case 'Estudiante':
          ['carrera', 'semestre', 'tipoMatricula', 'programa'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          formDataToSend.append('perteneceSemillero', formData.perteneceSemillero);
          if (formData.perteneceSemillero === 'si') {
            formDataToSend.append('nombreSemillero', formData.nombreSemillero);
          }
          formDataToSend.append('tieneProyectoActivo', formData.tieneProyectoActivo);
          if (formData.tieneProyectoActivo === 'si') {
            formDataToSend.append('nombreProyecto', formData.nombreProyecto);
          }
          break;

        case 'Profesor / Docente':
          ['departamento', 'categoriaAcademica', 'horarioAtencion'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          formDataToSend.append('perteneceSemillero', formData.perteneceSemillero);
          if (formData.perteneceSemillero === 'si') {
            formDataToSend.append('nombreSemillero', formData.nombreSemillero);
          }
          break;

        case 'Personal Administrativo':
          ['dependencia', 'cargo', 'telefonoInterno', 'turnoLaboral'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          break;

        case 'Egresado':
          ['anioGraduacion', 'programaGrado', 'tituloObtenido', 'correoEgresado'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          break;

        case 'Personal de Servicios':
          ['area', 'turno', 'numeroEmpleado'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          break;

        case 'Becario / Pasante':
          ['programaBeca', 'fechaInicioBeca', 'fechaFinBeca', 'dependenciaAsignada'].forEach(campo => {
            formDataToSend.append(campo, formData[campo]);
          });
          break;
      }

      // Agregar la imagen si existe
      if (formData.imagen instanceof File) {
        formDataToSend.append('imagen', formData.imagen);
      }
  
      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/save", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.message) {
        toast.success("Datos guardados correctamente");
        limpiarCamposDinamicos();
          setFormData({
            nombre: "",
            apellido: "",
            fechaNacimiento: "",
            idInstitucional: "",
            cedula: "",
            rolUniversidad: "",
            correoPersonal: "",
          tieneCorreoInstitucional: "",
            correoInstitucional: "",
            fecha: "",
            hora: "",
            imagen: null,
            carnet: "",
          ...Object.fromEntries(
            Object.keys(formData)
              .filter(key => !['nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
                             'cedula', 'rolUniversidad', 'correoPersonal', 'correoInstitucional',
                             'fecha', 'hora', 'imagen', 'carnet'].includes(key))
              .map(key => [key, ""])
          )
          });
          setImagePreview(null);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(error.response?.data?.error || "Error al guardar los datos");
    }
  };

  const fetchHuellas = async () => {
    try {
      const response = await axios.get("https://backend-coral-theta-21.vercel.app/api/huellas");
      setHuellas(response.data);
    } catch {
      toast.error("Error al obtener los datos");
    }
  };

  const indexUltimoRegistro = paginaActual * registrosPorPagina;
  const indexPrimerRegistro = indexUltimoRegistro - registrosPorPagina;

  const handleDelete = async (id) => {
    setRegistroAEliminar(id);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
      console.log("Iniciando eliminación del registro:", registroAEliminar);
      const registro = huellas.find(h => h._id === registroAEliminar);
      console.log("Registro a eliminar:", registro);

      // Primero guardamos el registro que vamos a eliminar
      setRegistroEliminado(registro);
      
      // Luego eliminamos
      await axios.delete(`https://backend-coral-theta-21.vercel.app/api/huellas/${registroAEliminar}`);
      
      toast(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
              <p style={{ margin: 0, fontSize: '16px' }}>Registro eliminado correctamente</p>
              <button 
                onClick={() => {
                  console.log("Botón deshacer clickeado, registro guardado:", registro);
                  deshacerEliminacion(registro);
                }}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                Deshacer
              </button>
            </div>,
            {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '16px',
                minWidth: '300px',
                marginTop: '90px' // <-- Aquí ajustas según la altura de tu header
              }
            }
          );

      fetchHuellas();
      setRegistroDetalle(null); // Volver a la vista general después de eliminar
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el registro");
    } finally {
      setMostrarModalConfirmacion(false);
      setRegistroAEliminar(null);
    }
  };

  const deshacerEliminacion = async (registro) => {
    try {
      console.log("Iniciando proceso de deshacer con registro:", registro);
      if (!registro) {
        console.log("No hay registro para deshacer");
        return;
      }
      
      // Crear un nuevo FormData para enviar los datos
      const formDataToSend = new FormData();
      
      // Agregar todos los campos necesarios al FormData
      const camposRequeridos = [
        'nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
        'cedula', 'rolUniversidad', 'correoPersonal', 'correoInstitucional',
        'fecha', 'hora', 'carnet', 'carrera', 'semestre'
      ];
      
      camposRequeridos.forEach(campo => {
        if (registro[campo]) {
          formDataToSend.append(campo, registro[campo]);
          console.log(`Agregando campo ${campo}:`, registro[campo]);
        }
      });
      
      // Si hay una imagen, necesitamos obtenerla del servidor
      if (registro.imagen) {
        try {
          console.log("Obteniendo imagen del servidor:", registro.imagen);
          const response = await fetch(`https://app-back-seven.vercel.app${registro.imagen}`);
          const blob = await response.blob();
          const file = new File([blob], 'imagen.jpg', { type: 'image/jpeg' });
          formDataToSend.append('imagen', file);
          console.log("Imagen agregada al FormData");
        } catch (error) {
          console.error("Error al obtener la imagen:", error);
        }
      }
      
      console.log("Enviando datos al servidor...");
      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/save", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data) {
        toast.success("Registro restaurado correctamente", {
          position: "top-right",
          autoClose: 5000,
          style: {
            background: '#4CAF50',
            color: 'white',
            fontSize: '16px',
            padding: '16px'
          }
        });
        setRegistroEliminado(null);
        fetchHuellas();
        toast.dismiss(); // Cerrar el toast anterior
      }
    } catch (error) {
      console.error("Error al restaurar:", error);
      toast.error("Error al restaurar el registro", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#f44336',
          color: 'white',
          fontSize: '16px',
          padding: '16px'
        }
      });
    }
  };

  const handleEdit = (huella) => {
    setRegistroEditando(huella);
    setFormData({
      nombre: huella.nombre,
      apellido: huella.apellido,
      fechaNacimiento: huella.fechaNacimiento,
      idInstitucional: huella.idInstitucional,
      cedula: huella.cedula,
      rolUniversidad: huella.rolUniversidad,
      correoPersonal: huella.correoPersonal,
      tieneCorreoInstitucional: huella.tieneCorreoInstitucional,
      correoInstitucional: huella.correoInstitucional,
      fecha: huella.fecha,
      hora: huella.hora,
      carnet: huella.carnet,
      carrera: huella.carrera,
      semestre: huella.semestre,
      imagen: null
    });
    setAdminView("registro");
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
    
      Object.keys(formData).forEach((key) => {
        if (key !== "imagen") {
          formDataToSend.append(key, formData[key]);
        }
      });
    
      if (formData.imagen instanceof File) {
        formDataToSend.append("imagen", formData.imagen);
      }
    
      const response = await axios.put(`https://backend-coral-theta-21.vercel.app/api/huellas/${registroEditando._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      if (response.data.message) {
        toast.success("Registro actualizado correctamente");
        setRegistroEditando(null);
        setFormData({
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          idInstitucional: "",
          cedula: "",
          rolUniversidad: "",
          correoPersonal: "",
          tieneCorreoInstitucional: "",
          correoInstitucional: "",
          fecha: "",
          hora: "",
          imagen: null,
          carnet: "",
          carrera: "",
          semestre: "",
          tipoMatricula: "",
          programa: "",
          departamento: "",
          categoriaAcademica: "",
          horarioAtencion: "",
          dependencia: "",
          cargo: "",
          telefonoInterno: "",
          turnoLaboral: "",
          grupoInvestigacion: "",
          orcid: "",
          proyectosActivos: [],
          anioGraduacion: "",
          programaGrado: "",
          tituloObtenido: "",
          correoEgresado: "",
          institucionProcedencia: "",
          propositoVisita: "",
          fechaInicioVisita: "",
          fechaFinVisita: "",
          empresaOrganizacion: "",
          tipoColaboracion: "",
          fechaInicioContrato: "",
          fechaFinContrato: "",
          area: "",
          turno: "",
          numeroEmpleado: "",
          programaBeca: "",
          fechaInicioBeca: "",
          fechaFinBeca: "",
          dependenciaAsignada: "",
          perteneceSemillero: "",
          nombreSemillero: "",
          tieneProyectoActivo: "",
          nombreProyecto: ""
        });
        setImagePreview(null);
        setAdminView("ver_registros");
        fetchHuellas();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el registro");
    }
  };

  const filtrarRegistros = (registros) => {
    return registros.filter(registro => {
      const valor = valorBusqueda.toLowerCase();
      
      switch (tipoFiltro) {
        case "todos":
          return (
            (registro.idInstitucional || "").toLowerCase().includes(valor) ||
            (registro.cedula || "").toLowerCase().includes(valor) ||
            (registro.nombre || "").toLowerCase().includes(valor) ||
            (registro.apellido || "").toLowerCase().includes(valor) ||
            (registro.semestre || "").toString().toLowerCase().includes(valor) ||
            (registro.rolUniversidad || "").toLowerCase().includes(valor) ||
            (registro.carrera || "").toLowerCase().includes(valor)
          );
        case "idInstitucional":
          return (registro.idInstitucional || "").toLowerCase().includes(valor);
        case "cedula":
          return (registro.cedula || "").toLowerCase().includes(valor);
        case "nombre":
          return (registro.nombre || "").toLowerCase().includes(valor);
        case "apellido":
          return (registro.apellido || "").toLowerCase().includes(valor);
        case "semestre":
          return (registro.semestre || "").toString().toLowerCase().includes(valor);
        case "rolUniversidad":
          return (registro.rolUniversidad || "").toLowerCase().includes(valor);
        case "carrera":
          return (registro.carrera || "").toLowerCase().includes(valor);
        default:
          return true;
      }
    });
  };

  const obtenerPlaceholder = () => {
    switch (tipoFiltro) {
      case "todos":
        return "Buscar en todos los campos...";
      case "idInstitucional":
        return "Buscar por ID Institucional...";
      case "cedula":
        return "Buscar por Cédula...";
      case "nombre":
        return "Buscar por Nombre...";
      case "apellido":
        return "Buscar por Apellido...";
      case "semestre":
        return "Buscar por Semestre...";
      case "rolUniversidad":
        return "Buscar por Rol...";
      case "carrera":
        return "Buscar por Carrera...";
      default:
        return "Buscar...";
    }
  };

  const buscarPorCarnet = async () => {
    try {
      if (!busquedaCarnet.trim()) {
        setMensajeError("Por favor ingrese un número de carnet");
        setPersonaEncontrada(null);
        setUltimoAcceso(null);
        setTipoAcceso(null);
        setHoraAcceso(null);
        return;
      }

      const response = await axios.get(`https://backend-coral-theta-21.vercel.app/api/buscar-carnet/${busquedaCarnet}`);
      
      if (response.data.persona) {
        setPersonaEncontrada(response.data.persona);
        setMensajeError("");
        // Llamar a registrar-acceso automáticamente
        try {
          const accesoResp = await axios.post("https://backend-coral-theta-21.vercel.app/api/registrar-acceso", {
            carnet: busquedaCarnet
          });
          setTipoAcceso(accesoResp.data.tipo);
          setHoraAcceso(accesoResp.data.tipo === "entrada" ? accesoResp.data.acceso.horaEntrada : accesoResp.data.acceso.horaSalida);
          setUltimoAcceso(accesoResp.data.acceso);
          if (accesoResp.data.tipo === "entrada") {
            toast.success("Entrada registrada: " + response.data.persona.nombre + " " + response.data.persona.apellido);
          } else if (accesoResp.data.tipo === "salida") {
            toast.info("Salida registrada: " + response.data.persona.nombre + " " + response.data.persona.apellido);
          }
        } catch (errAcceso) {
          toast.error(errAcceso.response?.data?.error || "Error al registrar acceso");
          setUltimoAcceso(null);
          setTipoAcceso(null);
          setHoraAcceso(null);
        }
      } else {
        setPersonaEncontrada(null);
        setUltimoAcceso(null);
        setTipoAcceso(null);
        setHoraAcceso(null);
        setMensajeError("Persona no encontrada en la base de datos");
      }
      setBusquedaCarnet("");
    } catch (error) {
      console.error("Error al buscar:", error);
      setPersonaEncontrada(null);
      setUltimoAcceso(null);
      setTipoAcceso(null);
      setHoraAcceso(null);
      setMensajeError("Error al buscar en la base de datos");
      setBusquedaCarnet("");
    }
  };

  // Agregar función para manejar el registro de visitante
  const registrarVisitante = async () => {
    try {
      if (!visitanteForm.nombre || !visitanteForm.apellido || !visitanteForm.cedula || 
          !visitanteForm.razonVisita || !visitanteForm.numeroTarjeta) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/registrar-visitante", visitanteForm);
      toast.success("Visitante registrado exitosamente");
      setVisitanteForm({
        nombre: "",
        apellido: "",
        cedula: "",
        razonVisita: "",
        numeroTarjeta: ""
      });
    } catch (error) {
      console.error("Error al registrar visitante:", error);
      toast.error("Error al registrar visitante");
    }
  };

  // Función para normalizar el nombre del rol para la clase CSS
  const normalizarRolClase = (rol) => {
    if (!rol) return '';
    return rol
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .replace(/[^a-z0-9]+/g, '-') // Reemplaza cualquier cosa que no sea letra o número por guion
      .replace(/(^-|-$)/g, ''); // Elimina guiones al inicio o final
  };

  // Función para formatear el nombre del campo
  const formatearCampo = (campo) => {
    // Reemplaza guiones bajos y mayúsculas, y pone la primera letra en mayúscula
    return campo
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  const fetchAccesos = async () => {
    setAccesosLoading(true);
    try {
      const params = {
        page: accesosPage,
        limit: accesosLimit,
        ...accesosFiltros
      };
      const res = await axios.get("https://backend-coral-theta-21.vercel.app/api/accesos", { params });
      setAccesos(res.data.accesos);
      setAccesosTotal(res.data.total);
    } catch (error) {
      setAccesos([]);
      setAccesosTotal(0);
    } finally {
      setAccesosLoading(false);
    }
  };

  const handleAccesosFiltroChange = (e) => {
    setAccesosFiltros({ ...accesosFiltros, [e.target.name]: e.target.value });
    setAccesosPage(1);
  };

  // Función para obtener todos los accesos filtrados (sin paginación)
  const obtenerTodosAccesosFiltrados = async () => {
    setExportando(true);
    try {
      const params = { ...accesosFiltros, page: 1, limit: 10000 };
      const res = await axios.get("https://backend-coral-theta-21.vercel.app/api/accesos", { params });
      return res.data.accesos;
    } catch {
      toast.error("Error al obtener todos los accesos");
      return [];
    } finally {
      setExportando(false);
    }
  };

  // Función para exportar accesos a Excel (recibe los datos a exportar)
  const exportarAccesosExcel = (datosExportar) => {
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [["Historial de Accesos"]], { origin: "A1" });
    const fecha = new Date().toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    XLSX.utils.sheet_add_aoa(ws, [[`Generado el: ${fecha}`]], { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [[" "]], { origin: "A3" });
    const headers = ["Nombre", "Rol", "Carnet", "N° Tarjeta", "Fecha", "Hora Entrada", "Hora Salida"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });
    const data = datosExportar.map(a => [
      a.nombre,
      a.rolUniversidad,
      a.carnet,
      a.numeroTarjeta,
      a.fecha,
      a.horaEntrada || '-',
      a.horaSalida || '-'
    ]);
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A5" });
    ws['!cols'] = [
      { wch: 30 }, { wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accesos");
    XLSX.writeFile(wb, "Historial_Accesos.xlsx");
    toast.success("Exportación a Excel exitosa");
  };

  // Función para exportar accesos a PDF (recibe los datos a exportar)
  const exportarAccesosPDF = (datosExportar) => {
    const doc = new jsPDF();
    doc.text("Historial de Accesos", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Nombre", "Rol", "Carnet", "N° Tarjeta", "Fecha", "Hora Entrada", "Hora Salida"]],
      body: datosExportar.map(a => [
        a.nombre,
        a.rolUniversidad,
        a.carnet,
        a.numeroTarjeta,
        a.fecha,
        a.horaEntrada || '-',
        a.horaSalida || '-'
      ]),
      styles: { fontSize: 9 }
    });
    doc.save("Historial_Accesos.pdf");
    toast.success("Exportación a PDF exitosa");
  };

  // Handler para exportar según la opción elegida
  const handleExportar = async (opcion) => {
    setMostrarModalExportar(false);
    let datosExportar = [];
    if (opcion === 'pagina') {
      datosExportar = accesos;
    } else if (opcion === 'todos') {
      datosExportar = await obtenerTodosAccesosFiltrados();
    }
    if (tipoExportacion === 'excel') {
      exportarAccesosExcel(datosExportar);
    } else if (tipoExportacion === 'pdf') {
      exportarAccesosPDF(datosExportar);
    }
    setTipoExportacion(null);
  };

  // Obtener personas con filtros y paginación
  const fetchPersonas = async () => {
    setPersonasLoading(true);
    try {
      const params = { ...personasFiltros, page: personasPage, limit: personasLimit };
      const res = await axios.get("https://backend-coral-theta-21.vercel.app/api/personas", { params });
      setPersonas(res.data.personas);
      setPersonasTotal(res.data.total);
    } catch (error) {
      setPersonas([]);
      setPersonasTotal(0);
    } finally {
      setPersonasLoading(false);
    }
  };

  // Filtros de personas
  const handlePersonasFiltroChange = (e) => {
    setPersonasFiltros({ ...personasFiltros, [e.target.name]: e.target.value });
    setPersonasPage(1);
  };

  // Obtener todas las personas filtradas (sin paginación)
  const obtenerTodasPersonasFiltradas = async () => {
    setExportando(true);
    try {
      const params = { ...personasFiltros, page: 1, limit: 10000 };
      const res = await axios.get("https://backend-coral-theta-21.vercel.app/api/personas", { params });
      return res.data.personas;
    } catch {
      toast.error("Error al obtener todas las personas");
      return [];
    } finally {
      setExportando(false);
    }
  };

  // Exportar personas a Excel (todos los campos, ajustando sí/no)
  const exportarPersonasExcel = (datosExportar) => {
    if (!datosExportar || datosExportar.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    // Campos de sí/no y sus desgloses
    const camposSiNo = [
      { pregunta: 'perteneceSemillero', detalle: 'nombreSemillero', label: 'Semillero' },
      { pregunta: 'tieneProyectoActivo', detalle: 'nombreProyecto', label: 'Proyecto Activo' }
    ];
    // Obtener todos los campos únicos presentes en los objetos, excluyendo los de sí/no
    let campos = Array.from(new Set(datosExportar.flatMap(obj => Object.keys(obj)))).filter(k => k !== "__v" && k !== "_id" && !camposSiNo.some(c => c.pregunta === k));
    // Insertar los labels de los campos desglosados en el lugar de la pregunta
    camposSiNo.forEach(({ pregunta, label }, idx) => {
      const index = Array.from(new Set(datosExportar.flatMap(obj => Object.keys(obj)))).indexOf(pregunta);
      if (index !== -1) {
        campos.splice(index + idx, 0, label);
      }
    });
    // Encabezados legibles
    const headers = campos.map(formatearCampo);
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [["Historial de Personas"]], { origin: "A1" });
    const fecha = new Date().toLocaleString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    XLSX.utils.sheet_add_aoa(ws, [[`Generado el: ${fecha}`]], { origin: "A2" });
    XLSX.utils.sheet_add_aoa(ws, [[" "]], { origin: "A3" });
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });
    const data = datosExportar.map(p => {
      let fila = [];
      campos.forEach(campo => {
        const siNo = camposSiNo.find(c => c.label === campo);
        if (siNo) {
          if (p[siNo.pregunta] === 'si') {
            fila.push(p[siNo.detalle] || '');
          } else {
            fila.push('');
          }
        } else {
          fila.push(p[campo] || '');
        }
      });
      return fila;
    });
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A5" });
    ws['!cols'] = campos.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personas");
    XLSX.writeFile(wb, "Historial_Personas.xlsx");
    toast.success("Exportación a Excel exitosa");
  };

  // Exportar personas a PDF (todos los campos, ajustando sí/no)
  const exportarPersonasPDF = (datosExportar) => {
    if (!datosExportar || datosExportar.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    const camposSiNo = [
      { pregunta: 'perteneceSemillero', detalle: 'nombreSemillero', label: 'Semillero' },
      { pregunta: 'tieneProyectoActivo', detalle: 'nombreProyecto', label: 'Proyecto Activo' }
    ];
    let campos = Array.from(new Set(datosExportar.flatMap(obj => Object.keys(obj)))).filter(k => k !== "__v" && k !== "_id" && !camposSiNo.some(c => c.pregunta === k));
    camposSiNo.forEach(({ pregunta, label }, idx) => {
      const index = Array.from(new Set(datosExportar.flatMap(obj => Object.keys(obj)))).indexOf(pregunta);
      if (index !== -1) {
        campos.splice(index + idx, 0, label);
      }
    });
    const headers = campos.map(formatearCampo);
    const doc = new jsPDF();
    doc.text("Historial de Personas", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [headers],
      body: datosExportar.map(p => {
        let fila = [];
        campos.forEach(campo => {
          const siNo = camposSiNo.find(c => c.label === campo);
          if (siNo) {
            if (p[siNo.pregunta] === 'si') {
              fila.push(p[siNo.detalle] || '');
            } else {
              fila.push('');
            }
          } else {
            fila.push(p[campo] || '');
          }
        });
        return fila;
      }),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 86, 198] },
      margin: { left: 8, right: 8 }
    });
    doc.save("Historial_Personas.pdf");
    toast.success("Exportación a PDF exitosa");
  };

  // Handler para exportar personas
  const handleExportarPersonas = async (opcion) => {
    setMostrarModalExportar(false);
    let datosExportar = [];
    if (opcion === 'pagina') {
      // Página actual: personas filtradas y paginadas
      datosExportar = personas;
    } else if (opcion === 'todos') {
      datosExportar = await obtenerTodasPersonasFiltradas();
    }
    if (tipoExportacionPersonas === 'excel') {
      exportarPersonasExcel(datosExportar);
    } else if (tipoExportacionPersonas === 'pdf') {
      exportarPersonasPDF(datosExportar);
    }
    setTipoExportacionPersonas(null);
  };

  return (
    <div className="app-container">
      {loggedIn && <Header className="app-header"/>}
      <div className={`app-content ${!loggedIn ? 'no-header' : ''}`}>
        <ToastContainer 
          position={loggedIn ? "top-right" : "top-right"}
          style={{
            top: loggedIn ? '90px' : '1rem' // Ajusta este valor según la altura de tu header
          }}
        />

        {menu === "inicio" && !loggedIn && (
          <div className="contenedor_bienvenida">
            <h1>Bienvenido al registro de personas de Unicatolica</h1>
            <h1 className="pance">Sede Pance</h1>
            <p>Seleccione una opción:</p>
            <button onClick={() => setMenu("login")}>Iniciar Sesión</button>
            
          </div>
        )}

        {menu === "register" && !loggedIn && (
          <div className="contenedor_registro">
            <h1>Registro</h1>
            <label>Nombre:</label>
            <input type="text" name="nombre" placeholder="Ingrese su nombre" value={user.nombre} onChange={handleAuthChange} /><br />
            <label>Apellido:</label>
            <input type="text" name="apellido" placeholder="Ingrese su apellido" value={user.apellido} onChange={handleAuthChange} /><br />
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" value={user.fechaNacimiento} onChange={handleAuthChange} /><br />
            <label>ID Institucional:</label>
            <input type="text" name="idInstitucional" placeholder="Ingrese su ID institucional" value={user.idInstitucional} onChange={handleAuthChange} pattern="\d*" inputMode="numeric" /><br />
            <label>Cédula:</label>
            <input type="text" name="cedula" placeholder="Ingrese su número de cédula" value={user.cedula} onChange={handleAuthChange} pattern="\d*" inputMode="numeric" /><br />
            <label>Rol en la Universidad:</label>
            <input type="text" name="rolUniversidad" placeholder="Ingrese su rol en la universidad" value={user.rolUniversidad} onChange={handleAuthChange} /><br />
            <label>Correo Personal:</label>
            <input type="email" name="correoPersonal" placeholder="Ingrese su correo personal" value={user.correoPersonal} onChange={handleAuthChange} /><br />
            <label>Correo Institucional:</label>
            <input type="email" name="correoInstitucional" placeholder="Ingrese su correo institucional" value={user.correoInstitucional} onChange={handleAuthChange} /><br />
            <label>Contraseña:</label>
            <input type="password" name="password" placeholder="Ingrese su contraseña" value={user.password} onChange={handleAuthChange} /><br />
            <label>Rol en la Aplicación:</label>
            <select name="role" value={user.role} onChange={handleAuthChange}>
              <option value="admin">Administrador</option>
              <option value="lector">Lector</option>
            </select><br />
            <button onClick={register}>Registrarse</button>
            <br />
            <button onClick={() => handleMenuChange("inicio")}>Volver</button>
          </div>
        )}

        {menu === "login" && !loggedIn && (
          <div className="contenedor_login">
            <h1>Iniciar Sesión</h1>
            <label>Correo Institucional:</label>
            <input type="email" name="correoInstitucional" placeholder="Ingrese su correo institucional" value={user.correoInstitucional} onChange={handleAuthChange} /><br />
            <label>Contraseña:</label>
            <input type="password" name="password" placeholder="Ingrese su contraseña" value={user.password} onChange={handleAuthChange} /><br />
            <label>Rol en la Aplicación:</label>
            <select 
              name="role" 
              value={user.role} 
              onChange={handleAuthChange}
              className="login-select"
            >
              <option value="admin">Administrador</option>
              <option value="lector">Lector</option>
            </select><br />
            <button onClick={login}>Entrar</button>
            <button onClick={() => handleMenuChange("inicio")}>Volver</button>
          </div>
        )}

        {loggedIn && role === "admin" && (
          <div className="contenedor_admin">
            {adminView === "menu" && (
              <>
              <div className="panelAdministradorCuadro">
                  <h1>Panel de Administrador</h1>
                  <div className="admin-menu-btns">
                    <button onClick={() => setAdminView("registro")}>Registro de Personas</button>
                    <button onClick={() => {
                      setAdminView("ver_registros");
                      fetchHuellas();
                    }}>Ver Registros</button>
                    <button onClick={() => setAdminView("historial")}>Historial</button>
                    <button onClick={logout}>Cerrar Sesión</button>
                  </div>
              </div>
              </>
            )}

            {adminView === "registro" && (
              <>
                <div className="panelRegistroCuadro">
                  <h1>{registroEditando ? "Editar Registro" : "Registro de Personas"}</h1>
                  <div className="admin-form">
                    {/* Campos base */}
                    <div className="form-section">
                      <h2>Información Personal</h2>
                    <label>Nombre:</label>
                      <input type="text" name="nombre" placeholder="Ingrese el nombre" value={formData.nombre} onChange={handleChange} required /><br />
                    <label>Apellido:</label>
                      <input type="text" name="apellido" placeholder="Ingrese el apellido" value={formData.apellido} onChange={handleChange} required /><br />
                    <label>Fecha de Nacimiento:</label>
                      <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required /><br />
                    <label>ID Institucional:</label>
                      <input type="text" name="idInstitucional" placeholder="Ingrese el ID institucional" value={formData.idInstitucional} onChange={handleChange} pattern="\d*" inputMode="numeric" required /><br />
                    <label>Cédula:</label>
                      <input type="text" name="cedula" placeholder="Ingrese el número de cédula" value={formData.cedula} onChange={handleChange} pattern="\d*" inputMode="numeric" required /><br />
                    <label>Rol en la Universidad:</label>
                      <select name="rolUniversidad" value={formData.rolUniversidad} onChange={handleChange} required>
                        <option value="">Seleccione un rol</option>
                        {ROLES_UNIVERSIDAD.map(rol => (
                          <option key={rol} value={rol}>{rol}</option>
                        ))}
                      </select><br />
                    <label>Correo Personal:</label>
                      <input type="email" name="correoPersonal" placeholder="Ingrese el correo personal" value={formData.correoPersonal} onChange={handleChange} required /><br />
                      
                      {/* Mostrar opción de correo institucional solo para roles específicos */}
                      {['Estudiante', 'Profesor / Docente', 'Personal Administrativo', 'Egresado', 'Personal de Servicios', 'Becario / Pasante'].includes(formData.rolUniversidad) && (
                        <>
                          <label>¿Tiene correo institucional?</label>
                          <select 
                            name="tieneCorreoInstitucional" 
                            value={formData.tieneCorreoInstitucional} 
                            onChange={handleChange} 
                            required
                          >
                            <option value="">Seleccione una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select><br />
                          
                          {formData.tieneCorreoInstitucional === 'si' && (
                            <>
                    <label>Correo Institucional:</label>
                              <input 
                                type="email" 
                                name="correoInstitucional" 
                                placeholder="Ingrese el correo institucional" 
                                value={formData.correoInstitucional} 
                                onChange={handleChange} 
                                required 
                              /><br />
                            </>
                          )}
                        </>
                      )}
                      
                      {/* Mostrar número de carnet antes de los campos específicos para roles que no son visitante ni colaborador externo */}
                      {!['Visitante', 'Colaborador Externo'].includes(formData.rolUniversidad) && (
                        <>
                          <label>Número de Carnet:</label>
                          <input 
                            type="password" 
                            name="carnet" 
                            placeholder="Ingrese el número de carnet" 
                            value={formData.carnet} 
                            onChange={handleChange} 
                            pattern="\d*" 
                            inputMode="numeric" 
                            required 
                          /><br />
                        </>
                      )}
                      
                      {/* Campos específicos según el rol */}
                      {formData.rolUniversidad === 'Estudiante' && (
                        <>
                          <label>Carrera:</label>
                          <select name="carrera" value={formData.carrera} onChange={handleChange} required>
                            <option value="">Seleccione una carrera</option>
                            {formData.programa === 'Pregrado' 
                              ? CARRERAS_PREGRADO.map(carrera => (
                                  <option key={carrera} value={carrera}>{carrera}</option>
                                ))
                              : formData.programa === 'Posgrado'
                              ? CARRERAS_POSTGRADO.map(carrera => (
                                  <option key={carrera} value={carrera}>{carrera}</option>
                                ))
                              : null
                            }
                          </select><br />
                    <label>Semestre:</label>
                          <select name="semestre" value={formData.semestre} onChange={handleChange} required>
                            <option value="">Seleccione un semestre</option>
                            {[...Array(12)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select><br />
                          <label>Tipo de Matrícula:</label>
                          <select name="tipoMatricula" value={formData.tipoMatricula} onChange={handleChange} required>
                            <option value="">Seleccione tipo de matrícula</option>
                            <option value="Matrícula Ordinaria">Matrícula Ordinaria</option>
                            <option value="Matrícula Extraordinaria">Matrícula Extraordinaria</option>
                            <option value="Matrícula Extemporánea">Matrícula Extemporánea</option>
                            <option value="Pago por ciclos">Pago por ciclos</option>
                            <option value="Media matrícula">Media matrícula</option>
                            <option value="Matrícula por créditos">Matrícula por créditos</option>
                            <option value="Créditos adicionales">Créditos adicionales</option>
                          </select><br />
                          <label>Programa:</label>
                          <select name="programa" value={formData.programa} onChange={handleChange} required>
                            <option value="">Seleccione un programa</option>
                            <option value="Pregrado">Pregrado</option>
                            <option value="Posgrado">Posgrado</option>
                          </select><br />
                          <label>¿Pertenece a algún semillero de investigación?</label>
                          <select name="perteneceSemillero" value={formData.perteneceSemillero} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select><br />
                          {formData.perteneceSemillero === 'si' && (
                            <>
                              <label>Nombre del Semillero:</label>
                              <input type="text" name="nombreSemillero" placeholder="Ingrese el nombre del semillero" value={formData.nombreSemillero} onChange={handleChange} required /><br />
                            </>
                          )}
                          <label>¿Tiene algún proyecto activo?</label>
                          <select name="tieneProyectoActivo" value={formData.tieneProyectoActivo} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select><br />
                          {formData.tieneProyectoActivo === 'si' && (
                            <>
                              <label>Nombre del Proyecto:</label>
                              <input type="text" name="nombreProyecto" placeholder="Ingrese el nombre del proyecto" value={formData.nombreProyecto} onChange={handleChange} required /><br />
                            </>
                          )}
                        </>
                      )}

                      {formData.rolUniversidad === 'Profesor / Docente' && (
                        <>
                          <label>Departamento / Facultad:</label>
                          <select name="departamento" value={formData.departamento} onChange={handleChange} required>
                            <option value="">Seleccione un departamento</option>
                            {DEPARTAMENTOS.map(dep => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </select><br />
                          <label>Categoría Académica:</label>
                          <select name="categoriaAcademica" value={formData.categoriaAcademica} onChange={handleChange} required>
                            <option value="">Seleccione una categoría</option>
                            <option value="Asistente">Asistente</option>
                            <option value="Asociado">Asociado</option>
                            <option value="Titular">Titular</option>
                          </select><br />
                          <label>Horario de Atención:</label>
                          <select name="horarioAtencion" value={formData.horarioAtencion} onChange={handleChange} required>
                            <option value="">Seleccione un horario</option>
                            <option value="Mañana (8:00–12:00)">Mañana (8:00–12:00)</option>
                            <option value="Tarde (13:00–17:00)">Tarde (13:00–17:00)</option>
                            <option value="Mixto">Mixto</option>
                          </select><br />
                          <label>¿Pertenece a algún semillero de investigación?</label>
                          <select name="perteneceSemillero" value={formData.perteneceSemillero} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select><br />
                          {formData.perteneceSemillero === 'si' && (
                            <>
                              <label>Nombre del Semillero:</label>
                              <input type="text" name="nombreSemillero" placeholder="Ingrese el nombre del semillero" value={formData.nombreSemillero} onChange={handleChange} required /><br />
                            </>
                          )}
                        </>
                      )}

                      {formData.rolUniversidad === 'Personal Administrativo' && (
                        <>
                          <label>Dependencia:</label>
                          <select name="dependencia" value={formData.dependencia} onChange={handleChange} required>
                            <option value="">Seleccione una dependencia</option>
                            {DEPENDENCIAS.map(dep => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </select><br />
                          <label>Cargo / Título del Puesto:</label>
                          <input type="text" name="cargo" placeholder="Ingrese el cargo" value={formData.cargo} onChange={handleChange} required /><br />
                          <label>Teléfono Interno:</label>
                          <input type="text" name="telefonoInterno" placeholder="Ingrese el teléfono interno" value={formData.telefonoInterno} onChange={handleChange} pattern="\d*" inputMode="numeric" required /><br />
                          <label>Turno Laboral:</label>
                          <select name="turnoLaboral" value={formData.turnoLaboral} onChange={handleChange} required>
                            <option value="">Seleccione un turno</option>
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Jornada completa">Jornada completa</option>
                          </select><br />
                        </>
                      )}

                      {formData.rolUniversidad === 'Egresado' && (
                        <>
                          <label>Año de Graduación:</label>
                          <select name="anioGraduacion" value={formData.anioGraduacion} onChange={handleChange} required>
                            <option value="">Seleccione un año</option>
                            {[...Array(11)].map((_, i) => (
                              <option key={2015 + i} value={2015 + i}>{2015 + i}</option>
                            ))}
                          </select><br />
                          <label>Programa de Grado:</label>
                          <select name="programaGrado" value={formData.programaGrado} onChange={handleChange} required>
                            <option value="">Seleccione un programa</option>
                            <option value="Pregrado">Pregrado</option>
                            <option value="Posgrado">Posgrado</option>
                          </select><br />
                          <label>Título Obtenido:</label>
                          <input type="text" name="tituloObtenido" placeholder="Ingrese el título obtenido" value={formData.tituloObtenido} onChange={handleChange} required /><br />
                          <label>Correo de Egresado:</label>
                          <input type="email" name="correoEgresado" placeholder="Ingrese el correo de egresado" value={formData.correoEgresado} onChange={handleChange} required /><br />
                        </>
                      )}

                      {formData.rolUniversidad === 'Personal de Servicios' && (
                        <>
                          <label>Área:</label>
                          <select name="area" value={formData.area} onChange={handleChange} required>
                            <option value="">Seleccione un área</option>
                            {AREAS_SERVICIOS.map(area => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </select><br />
                          <label>Turno:</label>
                          <select name="turno" value={formData.turno} onChange={handleChange} required>
                            <option value="">Seleccione un turno</option>
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noche">Noche</option>
                          </select><br />
                          <label>Número de Empleado:</label>
                          <input type="text" name="numeroEmpleado" placeholder="Ingrese el número de empleado" value={formData.numeroEmpleado} onChange={handleChange} pattern="\d*" inputMode="numeric" required /><br />
                        </>
                      )}

                      {formData.rolUniversidad === 'Becario / Pasante' && (
                        <>
                          <label>Programa de Beca:</label>
                          <select name="programaBeca" value={formData.programaBeca} onChange={handleChange} required>
                            <option value="">Seleccione un programa</option>
                            {PROGRAMAS_BECA.map(programa => (
                              <option key={programa} value={programa}>{programa}</option>
                            ))}
                          </select><br />
                          <label>Fecha Inicio de Beca:</label>
                          <input type="date" name="fechaInicioBeca" value={formData.fechaInicioBeca} onChange={handleChange} required /><br />
                          <label>Fecha Fin de Beca:</label>
                          <input type="date" name="fechaFinBeca" value={formData.fechaFinBeca} onChange={handleChange} required /><br />
                          <label>Dependencia Asignada:</label>
                          <select name="dependenciaAsignada" value={formData.dependenciaAsignada} onChange={handleChange} required>
                            <option value="">Seleccione una dependencia</option>
                            {DEPENDENCIAS.map(dep => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </select><br />
                        </>
                      )}

                      {/* Mostrar número de carnet justo antes de la imagen para visitante y colaborador externo */}
                      {['Visitante', 'Colaborador Externo'].includes(formData.rolUniversidad) && (
                        <>
                    <label>Número de Carnet:</label>
                          <input 
                            type="password" 
                            name="carnet" 
                            placeholder="Ingrese el número de carnet" 
                            value={formData.carnet} 
                            onChange={handleChange} 
                            pattern="\d*" 
                            inputMode="numeric" 
                            required 
                          /><br />
                        </>
                      )}

                    <label>Imagen Rostro:</label>
                      <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} required /><br />
                    {imagePreview && (
                      <div className="admin-img-preview">
                        <h4>Vista previa:</h4>
                        <img src={imagePreview} alt="Vista previa" />
                      </div>
                    )}
                    </div>

                    <div className="form-buttons">
                    <button onClick={registroEditando ? handleUpdate : handleSubmit}>
                      {registroEditando ? "Actualizar Registro" : "Guardar Datos"}
                    </button>
                    <button onClick={() => {
                      setRegistroEditando(null);
                      setFormData({
                        nombre: "",
                        apellido: "",
                        fechaNacimiento: "",
                        idInstitucional: "",
                        cedula: "",
                        rolUniversidad: "",
                        correoPersonal: "",
                          tieneCorreoInstitucional: "",
                        correoInstitucional: "",
                        fecha: "",
                        hora: "",
                        imagen: null,
                        carnet: "",
                          ...Object.fromEntries(
                            Object.keys(formData)
                              .filter(key => !['nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
                                             'cedula', 'rolUniversidad', 'correoPersonal', 'correoInstitucional',
                                             'fecha', 'hora', 'imagen', 'carnet'].includes(key))
                              .map(key => [key, ""])
                          )
                      });
                      setImagePreview(null);
                      if (edicionDesdeDetalle) {
                        setRegistroDetalle(registroEditando);
                        setAdminView("ver_registros");
                        setEdicionDesdeDetalle(false);
                      } else {
                        setAdminView("menu");
                      }
                    }}>Volver</button>
                    </div>
                  </div>
                </div>
              </>
            )}


              {adminView === "ver_registros" && !registroDetalle && (
                <>
                  <div className="panelVerRegistroCuadro">
                    <div className="admin-registros-barra">
                      <h1 className="admin-registros-titulo">Registros de Personas</h1>
                      <div className="filtros-container">
                        <div className="filtros-busqueda">
                          <div className="admin-barra-filtro">
                            <select
                              value={tipoFiltro}
                              onChange={(e) => {
                                setTipoFiltro(e.target.value);
                                setValorBusqueda("");
                                setPaginaActual(1);
                              }}
                              className="admin-filtro-select"
                            >
                              <option value="todos">Todos los campos</option>
                              <option value="idInstitucional">ID Institucional</option>
                              <option value="cedula">Cédula</option>
                              <option value="nombre">Nombre</option>
                              <option value="apellido">Apellido</option>
                              <option value="semestre">Semestre</option>
                              <option value="rolUniversidad">Rol</option>
                              <option value="carrera">Carrera</option>
                            </select>
                          </div>
                          <div className="admin-barra-input">
                            <input
                              type={tipoFiltro === "semestre" ? "number" : "text"}
                              value={valorBusqueda}
                              onChange={(e) => {
                                setValorBusqueda(e.target.value);
                                setPaginaActual(1);
                              }}
                              placeholder={obtenerPlaceholder()}
                              className="admin-busqueda-input"
                            />
                          </div>
                          {valorBusqueda && (
                            <button
                              onClick={() => {
                                setValorBusqueda("");
                                setPaginaActual(1);
                              }}
                              className="admin-busqueda-limpiar"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                        <div className="filtros-registros">
                          <label className="label-nowrap">Registros por página:</label>
                          <input
                            type="number"
                            min="1"
                            value={registrosPorPagina}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) {
                                setRegistrosPorPagina(value);
                                const maxPages = Math.ceil(filtrarRegistros(huellas).length / value);
                                if (paginaActual > maxPages) {
                                  setPaginaActual(maxPages);
                                }
                              }
                            }}
                            className="input-registros-pagina"
                          />
                        </div>
                      </div>
                      <div className="contador-container">
                        <span>
                          {filtrarRegistros(huellas).length} resultado(s) encontrado(s)
                        </span>
                        <span>
                          Mostrando página {paginaActual} de {Math.ceil(filtrarRegistros(huellas).length / registrosPorPagina)}
                        </span>
                      </div>
                    </div>

                    <div className="admin-registros-grid">
                      {huellas.length > 0 ? (
                        filtrarRegistros(huellas)
                          .slice(indexPrimerRegistro, indexUltimoRegistro)
                          .map((huella) => (
                          <div key={huella._id} className="admin-registro-card">
                            <div className="admin-card-btns">
                              <button 
                                onClick={() => handleEdit(huella)}
                                className="admin-btn-editar"
                              >
                                <span>✎</span> Editar
                              </button>
                              <button 
                                onClick={() => handleDelete(huella._id)}
                                className="admin-btn-eliminar"
                              >
                                <span>🗑</span> Eliminar
                              </button>
                              <button
                                onClick={() => setRegistroDetalle(huella)}
                                className="admin-btn-verinfo"
                              >
                                <span>🔍</span> Ver Información
                              </button>
                            </div>
                            <div className="admin-card-info">
                              <div className="admin-card-row">
                                <span className="admin-card-label">ID Institucional:</span>
                                <span>{huella.idInstitucional}</span>
                              </div>
                              <div className="admin-card-row">
                                <span className="admin-card-label">Nombre:</span>
                                <span>{huella.nombre} {huella.apellido}</span>
                              </div>
                              <div className="admin-card-row">
                                <span className="admin-card-label">Carrera:</span>
                                <span>{huella.carrera}</span>
                              </div>
                              <div className="admin-card-row">
                                <span className="admin-card-label">Rol Universitario:</span>
                                <span>{huella.rolUniversidad}</span>
                              </div>
                              <div className="admin-card-row">
                                <span className="admin-card-label">Semestre:</span>
                                <span>{huella.semestre}</span>
                              </div>
                              <div className="admin-card-row">
                                <span className="admin-card-label">Correo Institucional:</span>
                                <span>{huella.correoInstitucional}</span>
                              </div>
                              {huella.imagen && (
                                <div className="admin-card-img">
                                  <img 
                                    src={`https://backend-coral-theta-21.vercel.app/api/huellas/${huella._id}/imagen`} 
                                    alt="Imagen de perfil"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="admin-registros-vacio">
                          <p>No hay registros disponibles</p>
                        </div>
                      )}
                    </div>

                    {huellas.length > 0 && (
                      <div className="admin-paginacion">
                        <button
                          onClick={() => setPaginaActual(paginaActual > 1 ? paginaActual - 1 : 1)}
                          disabled={paginaActual === 1}
                          className="admin-paginacion-btn admin-paginacion-anterior"
                        >
                          <span>←</span> Anterior
                        </button>
                        <span className="admin-paginacion-info">
                          Página {paginaActual} de {Math.ceil(huellas.length / registrosPorPagina)}
                        </span>
                        <button
                          onClick={() => setPaginaActual(paginaActual < Math.ceil(huellas.length / registrosPorPagina) ? paginaActual + 1 : paginaActual)}
                          disabled={paginaActual === Math.ceil(huellas.length / registrosPorPagina)}
                          className="admin-paginacion-btn admin-paginacion-siguiente"
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
                  </>
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
                          {key === 'imagen' && value ? (
                            <img src={`https://backend-coral-theta-21.vercel.app/api/huellas/${registroDetalle._id}/imagen`} alt="Imagen de la persona" style={{maxWidth: '180px', maxHeight: '180px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', marginLeft: '10px'}} />
                          ) : (
                            <span className="detalle-campo-valor">{value || '-'}</span>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                  <div className="detalle-persona-btns">
                    <button onClick={() => setRegistroDetalle(null)} className="detalle-btn-volver">Volver</button>
                    <button onClick={() => handleDelete(registroDetalle._id)} className="detalle-btn-eliminar">Eliminar</button>
                    <button onClick={() => { setRegistroEditando(registroDetalle); setAdminView("registro"); setRegistroDetalle(null); setEdicionDesdeDetalle(true); }} className="detalle-btn-editar">Editar</button>
                  </div>
                </div>
              )}
            </div>
          )}

        {loggedIn && role === "lector" && (
          <div className="contenedor_lector">
            <h1 className="lector-titulo">Panel de Lector</h1>
            <div className="lector-busqueda-box">
              <div className="lector-busqueda-barra">
                <input
                  type="text"
                  value={busquedaCarnet}
                  onChange={(e) => setBusquedaCarnet(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      buscarPorCarnet();
                    }
                  }}
                  placeholder="Escanee el carnet"
                  className="lector-busqueda-input"
                />
                <div className="lector-busqueda-icon">🔍</div>
                <button 
                  onClick={() => setShowVisitanteForm(true)}
                  className="visitante-btn"
                >
                  Registrar Visitante
                </button>
              </div>
              {mensajeError && (
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
        )}

        {mostrarModalConfirmacion && (
          <div className="modal-confirm-bg">
            <div className="modal-confirm-box">
              <h3 className="modal-confirm-title">
                Confirmar Eliminación
              </h3>
              <p className="modal-confirm-msg">
                ¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.
              </p>
              <div className="modal-confirm-btns">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setRegistroAEliminar(null);
                  }}
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

        {/* Vista de Historial */}
        {adminView === "historial" && (
          <div className="panelVerRegistroCuadro">
            <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50', fontWeight: 700}}>Historial</h2>
            <div className="historial-tabs">
              <button className={adminHistorialTab === 'accesos' ? 'historial-tab-active' : ''} onClick={() => setAdminHistorialTab('accesos')}>Accesos</button>
              <button className={adminHistorialTab === 'personas' ? 'historial-tab-active' : ''} onClick={() => setAdminHistorialTab('personas')}>Personas</button>
            </div>
            <div className="historial-content">
              {adminHistorialTab === 'accesos' && (
                <div>
                  <div className="historial-filtros">
                    <input name="nombre" value={accesosFiltros.nombre} onChange={handleAccesosFiltroChange} placeholder="Nombre" />
                    <input name="rolUniversidad" value={accesosFiltros.rolUniversidad} onChange={handleAccesosFiltroChange} placeholder="Rol" />
                    <input name="carnet" value={accesosFiltros.carnet} onChange={handleAccesosFiltroChange} placeholder="Carnet" />
                    <input name="numeroTarjeta" value={accesosFiltros.numeroTarjeta} onChange={handleAccesosFiltroChange} placeholder="N° Tarjeta" />
                    <input name="fecha" type="date" value={accesosFiltros.fecha} onChange={handleAccesosFiltroChange} placeholder="Fecha" />
                    <select name="tipo" value={accesosFiltros.tipo} onChange={handleAccesosFiltroChange}>
                      <option value="">Tipo</option>
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                    <button onClick={fetchAccesos}>Buscar</button>
                    <button onClick={() => { setTipoExportacion('excel'); setMostrarModalExportar(true); }} style={{background:'#28a745'}}>Exportar Excel</button>
                    <button onClick={() => { setTipoExportacion('pdf'); setMostrarModalExportar(true); }} style={{background:'#dc3545'}}>Exportar PDF</button>
                  </div>
                  <div className="historial-tabla-container">
                    {accesosLoading ? (
                      <p>Cargando...</p>
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
                  <div className="historial-filtros">
                    <input name="nombre" value={personasFiltros.nombre} onChange={handlePersonasFiltroChange} placeholder="Nombre" />
                    <input name="apellido" value={personasFiltros.apellido} onChange={handlePersonasFiltroChange} placeholder="Apellido" />
                    <input name="cedula" value={personasFiltros.cedula} onChange={handlePersonasFiltroChange} placeholder="Cédula" />
                    <input name="idInstitucional" value={personasFiltros.idInstitucional} onChange={handlePersonasFiltroChange} placeholder="ID Institucional" />
                    <input name="rolUniversidad" value={personasFiltros.rolUniversidad} onChange={handlePersonasFiltroChange} placeholder="Rol" />
                    <input name="correoInstitucional" value={personasFiltros.correoInstitucional} onChange={handlePersonasFiltroChange} placeholder="Correo Institucional" />
                    <button onClick={fetchPersonas}>Buscar</button>
                    <button onClick={() => { setTipoExportacionPersonas('excel'); setMostrarModalExportar(true); }} style={{background:'#28a745'}}>Exportar Excel</button>
                    <button onClick={() => { setTipoExportacionPersonas('pdf'); setMostrarModalExportar(true); }} style={{background:'#dc3545'}}>Exportar PDF</button>
                  </div>
                  <div className="historial-tabla-container">
                    {personasLoading ? (
                      <p>Cargando...</p>
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

        {/* Modal para elegir tipo de exportación (accesos o personas) */}
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
                  onClick={() => { setMostrarModalExportar(false); setTipoExportacion(null); setTipoExportacionPersonas(null); }}
                  className="modal-confirm-cancel"
                  disabled={exportando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {loggedIn && <Footer />}
    </div>
  );
};

export default App;