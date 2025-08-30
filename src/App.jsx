import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Bienvenida from "./components/Bienvenida/Bienvenida";
import Login from "./components/Login/Login";
import PanelAdmin from "./components/PanelAdmin/PanelAdmin";
import PanelLector from "./components/PanelLector/PanelLector";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Constantes para roles y campos dinámicos
const ROLES_UNIVERSIDAD = [
  "Profesor / Docente",
  "Personal Administrativo",
  "Seguridad"
];

const CARRERAS_PREGRADO = [
  // Carreras Tecnológicas
  "Tecnología en Desarrollo de Software",
  "Tecnología en Gestión de Logística Empresarial",
  "Tecnología en Gestión de Mercadeo",
  
  // Carreras Profesionales
  "Administración de Empresas",
  "Banca y Finanzas",
  "Comunicación Social - Periodismo",
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
  "Trabajo Social"
];

const CARRERAS_POSTGRADO = [
  // Especializaciones
  "Educación en Derechos Humanos",
  "Educación y Sagrada Escritura",
  "Gerencia Estratégica",
  "Gerencia de Proyectos",
  "Gerencia del Talento Humano",
  "Informática Educativa",
  "Gerencia de la Innovación Organizacional"
];

const FACULTADES = [
  "Ciencias Administrativas",
  "Educación, Ciencias Sociales, Humanas y Derecho",
  "Ingeniería"
];

const DEPARTAMENTOS = [
  "Ciencias Básicas",
  "Comunicación y Lenguaje",
  "Humanidades"
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

const ROLES_REGISTRO_PERSONAS = [
  "Estudiante",
  "Profesor / Docente",
  "Personal Administrativo",
  "Egresado",
  "Personal de Servicios",
  "Becario / Pasante",
  "Colaborador Externo"
];

const ROLES_REGISTRO_USUARIOS = [
  "Profesor / Docente",
  "Personal Administrativo",
  "Seguridad"
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
    estadoAcademico: "",
    promedioAcademico: "",
    perteneceSemillero: "",
    nombreSemillero: "",
    
    // Profesor
    departamento: "",
    categoriaAcademica: "",
    horarioAtencion: "",
    tipoVinculacion: "",
    grupoInvestigacion: "",
    perteneceSemilleroProfesor: "",
    nombreSemilleroProfesor: "",
    
    // Personal Administrativo
    dependencia: "",
    cargo: "",
    telefonoInterno: "",
    turnoLaboral: "",
    nivelJerarquico: "",
    
    // Investigador
    orcid: "",
    proyectosActivos: [],
    
    // Egresado
    carreraEgreso: "",
    anoEgreso: "",
    tituloObtenido: "",
    empresaActual: "",
    cargoActual: "",
    
    // Visitante
    institucionProcedencia: "",
    propositoVisita: "",
    fechaInicioVisita: "",
    fechaFinVisita: "",
    
    // Colaborador Externo
    organizacion: "",
    cargoOrganizacion: "",
    tipoColaboracion: "",
    areaColaboracion: "",
    contactoReferencia: "",
    duracionProyecto: "",
    
    // Personal de Servicios
    areaServicios: "",
    tipoServicio: "",
    turno: "",
    empresaContratista: "",
    
    // Becario / Pasante
    tipoPrograma: "",
    programaBeca: "",
    institucionOrigen: "",
    proyectoAsignado: "",
    supervisor: "",
    fechaInicio: "",
    fechaFinalizacion: ""
  });
  const [huellas, setHuellas] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [registroEliminado, setRegistroEliminado] = useState(null);
  const [registroDetalle, setRegistroDetalle] = useState(null);

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
  const [mostrarModalImportar, setMostrarModalImportar] = useState(false);
  const [archivoExcel, setArchivoExcel] = useState(null);

  // Estado para errores de validación en tiempo real
  const [errores, setErrores] = useState({});
  const [mostrarErrores, setMostrarErrores] = useState(false);
  
  // Estado para errores de validación del formulario de usuario
  const [erroresUsuario, setErroresUsuario] = useState({});
  const [mostrarErroresUsuario, setMostrarErroresUsuario] = useState(false);
  
  const [importando, setImportando] = useState(false);

  // Estado para historial de personas
  const [personas, setPersonas] = useState([]);
  const [personasTotal, setPersonasTotal] = useState(0);
  const [personasPage, setPersonasPage] = useState(1);
  const [personasLimit, setPersonasLimit] = useState(10);
  const [personasFiltros, setPersonasFiltros] = useState({ nombre: '', apellido: '', cedula: '', idInstitucional: '', rolUniversidad: '', carrera: '', correoInstitucional: '' });
  const [personasLoading, setPersonasLoading] = useState(false);
  const [tipoExportacionPersonas, setTipoExportacionPersonas] = useState(null);
  
  // Estados de carga para operaciones de autenticación
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Estado de carga para registros de personas (vista principal)
  const [registrosLoading, setRegistrosLoading] = useState(false);

  useEffect(() => {
    if (role === "lector") {
      fetchHuellas();
    }
  }, [role]);

  useEffect(() => {
    if (adminView === "historial" && adminHistorialTab === "accesos") {
      const timer = setTimeout(() => {
        buscarEnHistorial('accesos', accesosFiltros, accesosPage, accesosLimit);
      }, 100); // Debounce de 100ms
      return () => clearTimeout(timer);
    }
  }, [adminView, adminHistorialTab, accesosPage, accesosLimit]);

  useEffect(() => {
    if (adminView === "historial" && adminHistorialTab === "personas") {
      const timer = setTimeout(() => {
        buscarEnHistorial('personas', personasFiltros, personasPage, personasLimit);
      }, 100); // Debounce de 100ms
      return () => clearTimeout(timer);
    }
  }, [adminView, adminHistorialTab, personasPage, personasLimit]);

  const limpiarTodosLosFormularios = () => {
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
      
      // Campos dinámicos actualizados
      // Estudiante
      carrera: "",
      semestre: "",
      tipoMatricula: "",
      programa: "",
      estadoAcademico: "",
      promedioAcademico: "",
      perteneceSemillero: "",
      nombreSemillero: "",
      
      // Profesor
      departamento: "",
      categoriaAcademica: "",
      horarioAtencion: "",
      tipoVinculacion: "",
      grupoInvestigacion: "",
      perteneceSemilleroProfesor: "",
      nombreSemilleroProfesor: "",
      
      // Personal Administrativo
      dependencia: "",
      cargo: "",
      telefonoInterno: "",
      turnoLaboral: "",
      nivelJerarquico: "",
      
      // Investigador
      orcid: "",
      proyectosActivos: [],
      
      // Egresado
      carreraEgreso: "",
      anoEgreso: "",
      tituloObtenido: "",
      empresaActual: "",
      cargoActual: "",
      
      // Visitante
      institucionProcedencia: "",
      propositoVisita: "",
      fechaInicioVisita: "",
      fechaFinVisita: "",
      
      // Colaborador Externo
      organizacion: "",
      cargoOrganizacion: "",
      tipoColaboracion: "",
      areaColaboracion: "",
      contactoReferencia: "",
      duracionProyecto: "",
      
      // Personal de Servicios
      areaServicios: "",
      tipoServicio: "",
      turno: "",
      empresaContratista: "",
      
      // Becario / Pasante
      tipoPrograma: "",
      programaBeca: "",
      institucionOrigen: "",
      proyectoAsignado: "",
      supervisor: "",
      fechaInicio: "",
      fechaFinalizacion: ""
    });
    setImagePreview(null);
    setRegistroEditando(null);
    setRegistroDetalle(null);
    setEdicionDesdeDetalle(false);
    
    // Limpiar errores de validación
    setErrores({});
    setMostrarErrores(false);
  };

  const handleMenuChange = (newMenu) => {
    setMenu(newMenu);
    limpiarTodosLosFormularios();
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

  // Función para validar entrada solo numérica
  const validarSoloNumeros = (valor) => {
    return /^\d*$/.test(valor);
  };

  // Función para validar números decimales (promedio académico)
  const validarNumerosDecimales = (valor) => {
    return /^\d*\.?\d*$/.test(valor);
  };

  // Campos que solo deben aceptar números
  const camposNumericos = [
    'idInstitucional', 
    'cedula', 
    'carnet', 
    'telefonoInterno', 
    'semestre', 
    'anoEgreso'
  ];

  // Campos que aceptan números decimales
  const camposDecimales = [
    // Array vacío ya que se eliminó promedioAcademico
  ];

  // Función para validar un campo específico
  const validarCampo = (nombre, valor, formData) => {
    let error = '';

    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          error = 'El nombre es obligatorio';
        } else if (valor.trim().length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          error = 'El nombre solo puede contener letras y espacios';
        }
        break;

      case 'apellido':
        if (!valor.trim()) {
          error = 'El apellido es obligatorio';
        } else if (valor.trim().length < 2) {
          error = 'El apellido debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          error = 'El apellido solo puede contener letras y espacios';
        }
        break;

      case 'fechaNacimiento':
        if (!valor) {
          error = 'La fecha de nacimiento es obligatoria';
        } else if (!validarFechaNacimiento(valor)) {
          error = 'La fecha de nacimiento no puede ser futura';
        } else {
          const hoy = new Date();
          const fechaNac = new Date(valor);
          let edad = hoy.getFullYear() - fechaNac.getFullYear();
          const mesActual = hoy.getMonth();
          const diaActual = hoy.getDate();
          const mesNacimiento = fechaNac.getMonth();
          const diaNacimiento = fechaNac.getDate();
          
          // Ajustar edad si aún no ha cumplido años este año
          if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
          }
          
          // Determinar edad mínima según el rol
          let edadMinima = 15; // Por defecto para estudiantes
          const rolesAdultos = [
            'Profesor / Docente',
            'Personal Administrativo', 
            'Personal de Servicios',
            'Colaborador Externo'
          ];
          
          if (rolesAdultos.includes(formData.rolUniversidad)) {
            edadMinima = 18;
          }
          
          if (edad < edadMinima) {
            if (edadMinima === 18) {
              error = `Para el rol seleccionado debe ser mayor de ${edadMinima} años`;
            } else {
              error = `Debe ser mayor de ${edadMinima} años`;
            }
          } else if (edad > 100) {
            error = 'Verifique la fecha de nacimiento';
          }
        }
        break;

      case 'idInstitucional':
        if (!valor.trim()) {
          error = 'El ID institucional es obligatorio';
        } else if (!validarSoloNumeros(valor)) {
          error = 'El ID institucional solo puede contener números';
        } else if (valor.length < 5 || valor.length > 15) {
          error = 'El ID institucional debe tener entre 5 y 15 dígitos';
        }
        break;

      case 'cedula':
        if (!valor.trim()) {
          error = 'La cédula es obligatoria';
        } else if (!validarSoloNumeros(valor)) {
          error = 'La cédula solo puede contener números';
        } else if (valor.length < 7 || valor.length > 12) {
          error = 'La cédula debe tener entre 7 y 12 dígitos';
        }
        break;

      case 'rolUniversidad':
        if (!valor.trim()) {
          error = 'Debe seleccionar un rol universitario';
        }
        break;

      case 'correoPersonal':
        if (!valor.trim()) {
          error = 'El correo personal es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
          error = 'Ingrese un correo electrónico válido';
        }
        break;

      case 'tieneCorreoInstitucional':
        if (!valor) {
          error = 'Debe indicar si tiene correo institucional';
        }
        break;

      case 'correoInstitucional':
        if (formData.tieneCorreoInstitucional === 'si') {
          if (!valor.trim()) {
            error = 'El correo institucional es obligatorio';
          } else if (!validarCorreoInstitucional(valor)) {
            error = 'El correo institucional debe terminar en @unicatolica.edu.co';
          }
        }
        break;

      case 'carnet':
        if (!valor.trim()) {
          error = 'El número de carnet es obligatorio';
        } else if (!validarSoloNumeros(valor)) {
          error = 'El carnet solo puede contener números';
        } else if (valor.length < 6 || valor.length > 12) {
          error = 'El carnet debe tener entre 6 y 12 dígitos';
        }
        break;

      case 'anoEgreso':
        if (formData.rolUniversidad === 'Egresado' && valor) {
          if (!validarSoloNumeros(valor)) {
            error = 'El año de egreso solo puede contener números';
          } else {
            const ano = parseInt(valor);
            const anoActual = new Date().getFullYear();
            if (ano < 1990 || ano > anoActual) {
              error = `El año debe estar entre 1990 y ${anoActual}`;
            }
          }
        }
        break;

      // Campos obligatorios por rol
      case 'carrera':
        if (formData.rolUniversidad === 'Estudiante' && !valor.trim()) {
          error = 'La carrera es obligatoria para estudiantes';
        }
        break;

      case 'semestre':
        if (formData.rolUniversidad === 'Estudiante' && !valor.trim()) {
          error = 'El semestre es obligatorio para estudiantes';
        } else if (valor && !validarSoloNumeros(valor)) {
          error = 'El semestre solo puede contener números';
        } else if (valor && (parseInt(valor) < 1 || parseInt(valor) > 12)) {
          error = 'El semestre debe estar entre 1 y 12';
        }
        break;

      case 'departamento':
        if (formData.rolUniversidad === 'Profesor / Docente' && !valor.trim()) {
          error = 'El departamento es obligatorio para profesores';
        }
        break;

      case 'dependencia':
        if (formData.rolUniversidad === 'Personal Administrativo' && !valor.trim()) {
          error = 'La dependencia es obligatoria para personal administrativo';
        }
        break;

      case 'carreraEgreso':
        if (formData.rolUniversidad === 'Egresado' && !valor.trim()) {
          error = 'La carrera de egreso es obligatoria para egresados';
        }
        break;

      case 'areaServicios':
        if (formData.rolUniversidad === 'Personal de Servicios' && !valor.trim()) {
          error = 'El área de servicios es obligatoria';
        }
        break;

      case 'tipoPrograma':
        if (formData.rolUniversidad === 'Becario / Pasante' && !valor.trim()) {
          error = 'El tipo de programa es obligatorio';
        }
        break;

      case 'organizacion':
        if (formData.rolUniversidad === 'Colaborador Externo' && !valor.trim()) {
          error = 'La organización es obligatoria';
        }
        break;

      case 'perteneceSemillero':
        if ((formData.rolUniversidad === 'Estudiante') && !valor) {
          error = 'Debe indicar si pertenece a un semillero';
        }
        break;

      case 'nombreSemillero':
        if (formData.rolUniversidad === 'Estudiante' && formData.perteneceSemillero === 'si' && !valor.trim()) {
          error = 'El nombre del semillero es obligatorio';
        }
        break;

      case 'perteneceSemilleroProfesor':
        if ((formData.rolUniversidad === 'Profesor / Docente') && !valor) {
          error = 'Debe indicar si pertenece a un semillero';
        }
        break;

      case 'nombreSemilleroProfesor':
        if (formData.rolUniversidad === 'Profesor / Docente' && formData.perteneceSemilleroProfesor === 'si' && !valor.trim()) {
          error = 'El nombre del semillero es obligatorio';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Función para validar todos los campos del formulario
  const validarFormulario = (formData) => {
    const nuevosErrores = {};

    // Campos básicos obligatorios
    const camposBasicos = [
      'nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
      'cedula', 'rolUniversidad', 'correoPersonal', 'tieneCorreoInstitucional', 'carnet'
    ];

    camposBasicos.forEach(campo => {
      const error = validarCampo(campo, formData[campo], formData);
      if (error) {
        nuevosErrores[campo] = error;
      }
    });

    // Validar correo institucional si es necesario
    if (formData.tieneCorreoInstitucional === 'si') {
      const error = validarCampo('correoInstitucional', formData.correoInstitucional, formData);
      if (error) {
        nuevosErrores.correoInstitucional = error;
      }
    }

    // Validar campos específicos por rol
    switch (formData.rolUniversidad) {
      case 'Estudiante':
        ['carrera', 'semestre', 'perteneceSemillero'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        
        // Validar nombre del semillero si pertenece a uno
        if (formData.perteneceSemillero === 'si') {
          const error = validarCampo('nombreSemillero', formData.nombreSemillero, formData);
          if (error) {
            nuevosErrores.nombreSemillero = error;
          }
        }
        break;

      case 'Profesor / Docente':
        ['departamento', 'perteneceSemilleroProfesor'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        
        // Validar nombre del semillero si pertenece a uno
        if (formData.perteneceSemilleroProfesor === 'si') {
          const error = validarCampo('nombreSemilleroProfesor', formData.nombreSemilleroProfesor, formData);
          if (error) {
            nuevosErrores.nombreSemilleroProfesor = error;
          }
        }
        break;

      case 'Personal Administrativo':
        ['dependencia'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        break;

      case 'Egresado':
        ['carreraEgreso', 'anoEgreso'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        break;

      case 'Personal de Servicios':
        ['areaServicios'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        break;

      case 'Becario / Pasante':
        ['tipoPrograma'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        break;

      case 'Colaborador Externo':
        ['organizacion'].forEach(campo => {
          const error = validarCampo(campo, formData[campo], formData);
          if (error) {
            nuevosErrores[campo] = error;
          }
        });
        break;
    }

    return nuevosErrores;
  };

  // Función para validar un campo específico del formulario de usuario
  const validarCampoUsuario = (nombre, valor, userData) => {
    let error = '';

    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          error = 'El nombre es obligatorio';
        } else if (valor.trim().length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          error = 'El nombre solo puede contener letras y espacios';
        }
        break;

      case 'apellido':
        if (!valor.trim()) {
          error = 'El apellido es obligatorio';
        } else if (valor.trim().length < 2) {
          error = 'El apellido debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
          error = 'El apellido solo puede contener letras y espacios';
        }
        break;

      case 'fechaNacimiento':
        if (!valor) {
          error = 'La fecha de nacimiento es obligatoria';
        } else if (!validarFechaNacimiento(valor)) {
          error = 'La fecha de nacimiento no puede ser futura';
        } else {
          const hoy = new Date();
          const fechaNac = new Date(valor);
          let edad = hoy.getFullYear() - fechaNac.getFullYear();
          const mesActual = hoy.getMonth();
          const diaActual = hoy.getDate();
          const mesNacimiento = fechaNac.getMonth();
          const diaNacimiento = fechaNac.getDate();
          
          if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
          }
          
          // Los usuarios del sistema deben ser mayores de 18 años
          if (edad < 18) {
            error = 'Los usuarios del sistema deben ser mayores de 18 años';
          } else if (edad > 100) {
            error = 'Verifique la fecha de nacimiento';
          }
        }
        break;

      case 'idInstitucional':
        if (!valor.trim()) {
          error = 'El ID institucional es obligatorio';
        } else if (!validarSoloNumeros(valor)) {
          error = 'El ID institucional solo puede contener números';
        } else if (valor.length < 5 || valor.length > 15) {
          error = 'El ID institucional debe tener entre 5 y 15 dígitos';
        }
        break;

      case 'cedula':
        if (!valor.trim()) {
          error = 'La cédula es obligatoria';
        } else if (!validarSoloNumeros(valor)) {
          error = 'La cédula solo puede contener números';
        } else if (valor.length < 7 || valor.length > 12) {
          error = 'La cédula debe tener entre 7 y 12 dígitos';
        }
        break;

      case 'rolUniversidad':
        if (!valor.trim()) {
          error = 'Debe seleccionar un rol universitario';
        }
        break;

      case 'correoPersonal':
        if (!valor.trim()) {
          error = 'El correo personal es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
          error = 'Ingrese un correo electrónico válido';
        }
        break;

      case 'correoInstitucional':
        if (!valor.trim()) {
          error = 'El correo institucional es obligatorio';
        } else if (!validarCorreoInstitucional(valor)) {
          error = 'El correo institucional debe terminar en @unicatolica.edu.co';
        }
        break;

      case 'password':
        if (!valor.trim()) {
          error = 'La contraseña es obligatoria';
        } else if (valor.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;

      case 'role':
        if (!valor.trim()) {
          error = 'Debe seleccionar un rol en la aplicación';
        }
        break;

      case 'departamento':
        if (userData.rolUniversidad === 'Profesor / Docente' && !valor.trim()) {
          error = 'El departamento es obligatorio para profesores';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Función para validar todo el formulario de usuario
  const validarFormularioUsuario = (userData) => {
    const nuevosErrores = {};

    // Campos básicos obligatorios para usuarios
    const camposBasicos = [
      'nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
      'cedula', 'rolUniversidad', 'correoPersonal', 'correoInstitucional', 
      'password', 'role'
    ];

    camposBasicos.forEach(campo => {
      const error = validarCampoUsuario(campo, userData[campo], userData);
      if (error) {
        nuevosErrores[campo] = error;
      }
    });

    // Validar campos específicos por rol universitario
    if (userData.rolUniversidad === 'Profesor / Docente') {
      const error = validarCampoUsuario('departamento', userData.departamento, userData);
      if (error) {
        nuevosErrores.departamento = error;
      }
    }

    return nuevosErrores;
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
        if (!formData.carrera || !formData.semestre || !formData.estadoAcademico) {
          toast.error('Por favor complete todos los campos del estudiante');
          return false;
        }
        break;
      case 'Profesor / Docente':
        if (!formData.departamento || !formData.categoriaAcademica || !formData.tipoVinculacion || !formData.horarioAtencion) {
          toast.error('Por favor complete todos los campos del profesor');
          return false;
        }
        break;
      case 'Personal Administrativo':
        if (!formData.dependencia || !formData.cargo || !formData.turnoLaboral || !formData.nivelJerarquico) {
          toast.error('Por favor complete todos los campos del personal administrativo');
          return false;
        }
        break;
      case 'Egresado':
        if (!formData.carreraEgreso || !formData.anoEgreso || !formData.tituloObtenido) {
          toast.error('Por favor complete todos los campos del egresado');
          return false;
        }
        break;
      case 'Personal de Servicios':
        if (!formData.areaServicios || !formData.tipoServicio || !formData.turno) {
          toast.error('Por favor complete todos los campos del personal de servicios');
          return false;
        }
        break;
      case 'Becario / Pasante':
        if (!formData.tipoPrograma || !formData.programaBeca || !formData.institucionOrigen || 
            !formData.supervisor || !formData.fechaInicio || !formData.fechaFinalizacion) {
          toast.error('Por favor complete todos los campos del becario/pasante');
          return false;
        }
        break;
      case 'Colaborador Externo':
        if (!formData.tipoColaboracion || !formData.organizacion || !formData.cargoOrganizacion || 
            !formData.areaColaboracion || !formData.contactoReferencia) {
          toast.error('Por favor complete todos los campos del colaborador externo');
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
      // Limpiar errores relacionados con campos dinámicos
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        // Limpiar errores de campos específicos de roles
        Object.keys(nuevosErrores).forEach(key => {
          if (!['nombre', 'apellido', 'fechaNacimiento', 'idInstitucional', 
               'cedula', 'rolUniversidad', 'correoPersonal', 'tieneCorreoInstitucional', 
               'correoInstitucional', 'carnet'].includes(key)) {
            delete nuevosErrores[key];
          }
        });
        return nuevosErrores;
      });
    }
    
    let nuevoValor = value;
    
    // Validación para campos numéricos enteros
    if (camposNumericos.includes(name)) {
      if (value !== '' && !validarSoloNumeros(value)) {
        return; // No actualizar si no es válido
      }
      nuevoValor = value;
    }
    // Validación para campos numéricos decimales
    else if (camposDecimales.includes(name)) {
      if (value !== '' && !validarNumerosDecimales(value)) {
        return; // No actualizar si no es válido
      }
      nuevoValor = value;
    }
    
    // Actualizar el valor en formData
    const nuevoFormData = { ...formData, [name]: nuevoValor };
    setFormData(nuevoFormData);
    
    // Validar el campo en tiempo real si mostrarErrores está activado
    if (mostrarErrores) {
      const error = validarCampo(name, nuevoValor, nuevoFormData);
      setErrores(prev => ({
        ...prev,
        [name]: error
      }));
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

  // Función para manejar validación cuando el usuario sale del campo (onBlur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validarCampo(name, value, formData);
    setErrores(prev => ({
      ...prev,
      [name]: error
    }));
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
    
    let nuevoValor = value;
    
    // Validación para campos numéricos
    if (['cedula', 'idInstitucional'].includes(name)) {
      // Solo permite números
      if (value !== '' && !/^\d+$/.test(value)) {
        return; // No actualizar si no es válido
      }
      nuevoValor = value;
    }
    
    // Actualizar el valor en user
    const nuevoUser = { ...user, [name]: nuevoValor };
    setUser(nuevoUser);
    
    // Validar el campo en tiempo real si mostrarErroresUsuario está activado
    if (mostrarErroresUsuario) {
      const error = validarCampoUsuario(name, nuevoValor, nuevoUser);
      setErroresUsuario(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Función para manejar validación cuando el usuario sale del campo en el formulario de usuario
  const handleAuthBlur = (e) => {
    const { name, value } = e.target;
    const error = validarCampoUsuario(name, value, user);
    setErroresUsuario(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const register = async () => {
    if (registerLoading) return; // Prevenir clicks múltiples
    
    // Activar la visualización de errores
    setMostrarErroresUsuario(true);
    
    // Validar todo el formulario
    const erroresValidacion = validarFormularioUsuario(user);
    setErroresUsuario(erroresValidacion);
    
    // Si hay errores, no enviar el formulario
    if (Object.keys(erroresValidacion).length > 0) {
      toast.error('Por favor, corrija los errores en el formulario antes de continuar');
      setRegisterLoading(false);
      return;
    }
    
    setRegisterLoading(true);
    try {
      toast.info("Registrando usuario...", { autoClose: 1000 });
      
      await axios.post("https://backend-coral-theta-21.vercel.app/api/register", user, {
        timeout: 10000 // Timeout de 10 segundos
      });
      
      toast.success("Usuario registrado exitosamente");
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
      
      // Limpiar errores del formulario de usuario
      setErroresUsuario({});
      setMostrarErroresUsuario(false);
      
      setAdminView("menu");
    } catch (error) {
      console.error("Error detallado en registro:", error);
      
      // Manejo específico de diferentes tipos de errores
      if (error.code === 'ECONNABORTED') {
        toast.error("Tiempo de espera agotado. Intente nuevamente.");
      } else if (error.response?.status === 500) {
        toast.error("Error del servidor. Por favor intente en unos momentos.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.error || "Datos inválidos. Verifique la información.");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (!navigator.onLine) {
        toast.error("Sin conexión a internet. Verifique su conexión.");
      } else {
        toast.error("Error de conexión. Verifique que el servidor esté disponible.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const login = async () => {
    if (loginLoading) return; // Prevenir clicks múltiples
    
    setLoginLoading(true);
    try {
      if (!user.correoInstitucional || !user.password || !user.role) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      // Mostrar indicador de carga
      toast.info("Iniciando sesión...", { autoClose: 1000 });

      const response = await axios.post("https://backend-coral-theta-21.vercel.app/api/login", {
        correoInstitucional: user.correoInstitucional,
        password: user.password,
        role: user.role
      }, {
        timeout: 10000 // Timeout de 10 segundos
      });
      
      if (response.data) {
        setLoggedIn(true);
        setRole(response.data.role);
        toast.success(`Sesión iniciada como ${response.data.role}`);
        if (response.data.role === 'admin') {
          setAdminView('menu');
        }
      }
    } catch (error) {
      console.error("Error detallado en login:", error);
      
      // Manejo específico de diferentes tipos de errores
      if (error.code === 'ECONNABORTED') {
        toast.error("Tiempo de espera agotado. Intente nuevamente.");
      } else if (error.response?.status === 500) {
        toast.error("Error del servidor. Por favor intente en unos momentos.");
      } else if (error.response?.status === 401) {
        toast.error("Credenciales incorrectas. Verifique su email y contraseña.");
      } else if (error.response?.status === 404) {
        toast.error("Usuario no encontrado.");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (!navigator.onLine) {
        toast.error("Sin conexión a internet. Verifique su conexión.");
      } else {
        toast.error("Error de conexión. Verifique que el servidor esté disponible.");
      }
    } finally {
      setLoginLoading(false);
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
    limpiarTodosLosFormularios();
    handleMenuChange("inicio");
  };

  const handleSubmit = async () => {
    try {
      // Activar la visualización de errores
      setMostrarErrores(true);
      
      // Validar todo el formulario
      const erroresValidacion = validarFormulario(formData);
      setErrores(erroresValidacion);
      
      // Si hay errores, no enviar el formulario
      if (Object.keys(erroresValidacion).length > 0) {
        toast.error('Por favor, corrija los errores en el formulario antes de continuar');
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
        limpiarTodosLosFormularios();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(error.response?.data?.error || "Error al guardar los datos");
    }
  };

  const fetchHuellas = async () => {
    try {
      setRegistrosLoading(true);
      const response = await axios.get("https://backend-coral-theta-21.vercel.app/api/huellas");
      setHuellas(response.data);
    } catch {
      toast.error("Error al obtener los datos");
    } finally {
      setRegistrosLoading(false);
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
        limpiarTodosLosFormularios();
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
        return "Seleccione un rol...";
      case "carrera":
        return "Buscar por Carrera...";
      default:
        return "Buscar...";
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
    const nuevosFiltros = { ...accesosFiltros, [e.target.name]: e.target.value };
    setAccesosFiltros(nuevosFiltros);
    setAccesosPage(1);
    buscarEnHistorial('accesos', nuevosFiltros, 1, accesosLimit);
  };

  // Función unificada de búsqueda para historial
  const buscarEnHistorial = async (tipo, filtros, pagina, limite) => {
    // Activar estado de carga según el tipo
    if (tipo === 'accesos') {
      setAccesosLoading(true);
    } else {
      setPersonasLoading(true);
    }

    try {
      const endpoint = tipo === 'accesos' ? '/api/accesos' : '/api/personas';
      const params = {
        page: pagina,
        limit: limite,
        ...filtros
      };

      const response = await axios.get(`https://backend-coral-theta-21.vercel.app${endpoint}`, { params });
      
      if (tipo === 'accesos') {
        setAccesos(response.data.accesos);
        setAccesosTotal(response.data.total);
      } else {
        setPersonas(response.data.personas);
        setPersonasTotal(response.data.total);
      }
    } catch (error) {
      console.error(`Error al buscar ${tipo}:`, error);
      if (tipo === 'accesos') {
        setAccesos([]);
        setAccesosTotal(0);
      } else {
        setPersonas([]);
        setPersonasTotal(0);
      }
      // Solo mostrar error si no es un error de cancelación o red
      if (!error.code?.includes('ERR_CANCELED') && !error.message?.includes('canceled')) {
        toast.error(`Error al buscar ${tipo}`);
      }
    } finally {
      // Desactivar estado de carga según el tipo
      if (tipo === 'accesos') {
        setAccesosLoading(false);
      } else {
        setPersonasLoading(false);
      }
    }
  };

  // Modificar las funciones de exportación para usar la nueva función
  const obtenerTodosAccesosFiltrados = async () => {
    setExportando(true);
    try {
      const response = await axios.get("https://backend-coral-theta-21.vercel.app/api/accesos", {
        params: { ...accesosFiltros, page: 1, limit: 10000 }
      });
      return response.data.accesos;
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

  const handlePersonasFiltroChange = (e) => {
    const nuevosFiltros = { ...personasFiltros, [e.target.name]: e.target.value };
    setPersonasFiltros(nuevosFiltros);
    setPersonasPage(1);
    buscarEnHistorial('personas', nuevosFiltros, 1, personasLimit);
  };

  // Obtener todas las personas filtradas (sin paginación)
  const obtenerTodasPersonasFiltradas = async () => {
    setExportando(true);
    try {
      const response = await axios.get("https://backend-coral-theta-21.vercel.app/api/personas", {
        params: { ...personasFiltros, page: 1, limit: 10000 }
      });
      return response.data.personas;
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
    // Definir las columnas clave
    const columnasClave = [
      { key: 'cedula', label: 'Cédula' },
      { key: 'idInstitucional', label: 'ID Institucional' },
      { key: 'rolUniversidad', label: 'Rol en la Universidad' },
      { key: 'correoInstitucional', label: 'Correo Institucional' }
    ];

    // Campos de sí/no y sus desgloses
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
    let headers, body, doc;
    // Si hay más de 6 columnas, solo exportar las claves
    if (campos.length > 6) {
      headers = columnasClave.map(c => c.label);
      body = datosExportar.map(p => columnasClave.map(c => p[c.key] || ''));
      doc = new jsPDF({ orientation: 'portrait' });
      doc.text("Historial de Personas", 14, 16);
      autoTable(doc, {
        startY: 22,
        head: [headers],
        body,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 86, 198] },
        margin: { left: 8, right: 8 }
      });
    } else {
      headers = campos.map(formatearCampo);
      body = datosExportar.map(p => {
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
      doc = new jsPDF({ orientation: 'landscape' });
      doc.text("Historial de Personas", 14, 16);
      autoTable(doc, {
        startY: 22,
        head: [headers],
        body,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [79, 86, 198] },
        margin: { left: 8, right: 8 }
      });
    }
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

  // Función para manejar la importación de Excel
  const handleImportarExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setArchivoExcel(file);
    setMostrarModalImportar(true);
  };

  // Función para procesar la importación
  const procesarImportacion = async () => {
    if (!archivoExcel) return;

    setImportando(true);
    try {
      const formData = new FormData();
      formData.append('file', archivoExcel);

      const response = await axios.post('https://backend-coral-theta-21.vercel.app/api/personas/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Importación exitosa');
        fetchPersonas(); // Actualizar la lista de personas
      } else {
        toast.error(response.data.error || 'Error en la importación');
      }
    } catch (error) {
      toast.error('Error al importar el archivo');
      console.error('Error:', error);
    } finally {
      setImportando(false);
      setMostrarModalImportar(false);
      setArchivoExcel(null);
    }
  };

  

  return (
    <div className="app-container">
      {loggedIn && <Header className="app-header" logout={logout}/>}
      <div className={`app-content ${!loggedIn ? 'no-header' : ''}`}>
        <ToastContainer 
          position={loggedIn ? "top-right" : "top-right"}
          style={{
            top: loggedIn ? '90px' : '1rem' // Ajusta este valor según la altura de tu header
          }}
        />

        {menu === "inicio" && !loggedIn && (
          <Bienvenida onMenuChange={handleMenuChange} />
        )}

        {menu === "login" && !loggedIn && (
          <Login 
            user={user}
            onAuthChange={handleAuthChange}
            onLogin={login}
            onMenuChange={handleMenuChange}
            loginLoading={loginLoading}
          />
        )}

        {loggedIn && role === "admin" && (
          <PanelAdmin 
            adminView={adminView}
            setAdminView={setAdminView}
            user={user}
            handleAuthChange={handleAuthChange}
            register={register}
            registerLoading={registerLoading}
            logout={logout}
            fetchHuellas={fetchHuellas}
            ROLES_REGISTRO_USUARIOS={ROLES_REGISTRO_USUARIOS}
            ROLES_REGISTRO_PERSONAS={ROLES_REGISTRO_PERSONAS}
            DEPARTAMENTOS={DEPARTAMENTOS}
            FACULTADES={FACULTADES}
            DEPENDENCIAS={DEPENDENCIAS}
            CARRERAS_PREGRADO={CARRERAS_PREGRADO}
            CARRERAS_POSTGRADO={CARRERAS_POSTGRADO}
            GRUPOS_INVESTIGACION={GRUPOS_INVESTIGACION}
            PROYECTOS={PROYECTOS}
            AREAS_SERVICIOS={AREAS_SERVICIOS}
            PROGRAMAS_BECA={PROGRAMAS_BECA}
            formData={formData}
            handleChange={handleChange}
            handleProyectosChange={handleProyectosChange}
            handleFileChange={handleFileChange}
            imagePreview={imagePreview}
            registroEditando={registroEditando}
            handleSubmit={handleSubmit}
            handleUpdate={handleUpdate}
            huellas={huellas}
            registrosLoading={registrosLoading}
            tipoFiltro={tipoFiltro}
            setTipoFiltro={setTipoFiltro}
            valorBusqueda={valorBusqueda}
            setValorBusqueda={setValorBusqueda}
            filtrarRegistros={filtrarRegistros}
            obtenerPlaceholder={obtenerPlaceholder}
            registrosPorPagina={registrosPorPagina}
            setRegistrosPorPagina={setRegistrosPorPagina}
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setRegistroDetalle={setRegistroDetalle}
            registroDetalle={registroDetalle}
            normalizarRolClase={normalizarRolClase}
            formatearCampo={formatearCampo}
            adminHistorialTab={adminHistorialTab}
            setAdminHistorialTab={setAdminHistorialTab}
            accesosFiltros={accesosFiltros}
            handleAccesosFiltroChange={handleAccesosFiltroChange}
            fetchAccesos={fetchAccesos}
            setTipoExportacion={setTipoExportacion}
            setMostrarModalExportar={setMostrarModalExportar}
            accesosLoading={accesosLoading}
            accesos={accesos}
            accesosTotal={accesosTotal}
            accesosPage={accesosPage}
            setAccesosPage={setAccesosPage}
            accesosLimit={accesosLimit}
            setAccesosLimit={setAccesosLimit}
            personasFiltros={personasFiltros}
            handlePersonasFiltroChange={handlePersonasFiltroChange}
            fetchPersonas={fetchPersonas}
            setTipoExportacionPersonas={setTipoExportacionPersonas}
            setMostrarModalImportar={setMostrarModalImportar}
            personasLoading={personasLoading}
            personas={personas}
            personasTotal={personasTotal}
            personasPage={personasPage}
            setPersonasPage={setPersonasPage}
            personasLimit={personasLimit}
            setPersonasLimit={setPersonasLimit}
            mostrarModalExportar={mostrarModalExportar}
            tipoExportacion={tipoExportacion}
            handleExportar={handleExportar}
            exportando={exportando}
            tipoExportacionPersonas={tipoExportacionPersonas}
            handleExportarPersonas={handleExportarPersonas}
            mostrarModalImportar={mostrarModalImportar}
            archivoExcel={archivoExcel}
            setArchivoExcel={setArchivoExcel}
            procesarImportacion={procesarImportacion}
            importando={importando}
            mostrarModalConfirmacion={mostrarModalConfirmacion}
            registroAEliminar={registroAEliminar}
            confirmarEliminacion={confirmarEliminacion}
            setMostrarModalConfirmacion={setMostrarModalConfirmacion}
            setRegistroAEliminar={setRegistroAEliminar}
            registroEliminado={registroEliminado}
            deshacerEliminacion={deshacerEliminacion}
            setRegistroEliminado={setRegistroEliminado}
            edicionDesdeDetalle={edicionDesdeDetalle}
            setEdicionDesdeDetalle={setEdicionDesdeDetalle}
            errores={errores}
            handleBlur={handleBlur}
            mostrarErrores={mostrarErrores}
            erroresUsuario={erroresUsuario}
            handleAuthBlur={handleAuthBlur}
            mostrarErroresUsuario={mostrarErroresUsuario}
          />
        )}

        {loggedIn && role === "lector" && (
          <PanelLector
            user={user}
            logout={logout}
          />
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


      </div>
      {loggedIn && <Footer />}
    </div>
  );
};

export default App;
