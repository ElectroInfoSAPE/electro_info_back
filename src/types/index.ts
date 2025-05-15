// Estado del préstamo
export enum PrestamoEstado {
  ACTIVO = 'ACTIVO',
  DEVUELTO = 'DEVUELTO',
  VENCIDO = 'VENCIDO'
}

// Ubicación física del libro
export enum LibroUbicacion {
  GRADO = "grado",
  CIENCIAS_BIOMEDICAS = "ciencias_biomedicas"
}

// Modelo de Libro
export interface Libro {
  codigo: string;
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  disponible: boolean;
  editorial?: string;
  anioPublicacion?: number;
  genero?: string;
  disponibles: number;
  imagen?: string;
  descripcion?: string;
  ubicacion: LibroUbicacion;
}

// Modelo de Préstamo
export interface Prestamo {
  id: string;
  libroId: string;
  usuarioId: string;
  usuarioNombre: string;
  fechaPrestamo: string;
  LibroNombre: string;
  fechaDevolucionPrevista: string;
  fechaDevolucionReal?: string;
  estado: PrestamoEstado;
  renovaciones_hechas: number;
  diasRetraso?: number;
  notas?: string;
  autor: string;
}

// Roles de usuario
export enum UsuarioRol {
  ESTUDIANTE = "estudiante",
  PROFESOR = "profesor",
  BIBLIOTECARIO = "bibliotecario"
}

// Estado de la cuenta de usuario
export enum UsuarioEstado {
  ACTIVO = "activo",
  SUSPENDIDO = "suspendido",
  INACTIVO = "inactivo"
}

// Modelo de Usuario
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  idTarjetaAustral: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  fechaRegistro: string;
  carrera?: string;
  departamento?: string;
  prestamosActivos?: Prestamo[];
  historialPrestamos?: Prestamo[];
  limitePrestamos: number;
}

// Información adicional que se obtendrá de otros endpoints
export interface InfoAdicionalPrestamo {
  libro: string;
  autor: string;
  usuario: string;
}

export interface Paginacion {
  paginaActual: number;
  totalPaginas: number;
  totalLibros: number;
  librosPorPagina: number;
}

export interface LibrosResponse {
  libros: Libro[];
  paginacion: Paginacion;
}

// Interfaces para las respuestas de la API
export interface MakeLoanRequest {
  libroId: string;
  usuarioId: string;
  duracionDias: number;
  barcode?: string;
}

export interface MakeLoanResponse {
  success: boolean;
  message: string;
  libro: Libro;
  usuarioId: string;
  duracionDias: number;
  barcode?: string;
  fecha: string;
}

export interface ReturnLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

export interface RenewLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

export interface GetBookByCodeResponse {
  success: boolean;
  message: string;
  libro?: Libro;
} 