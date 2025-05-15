import { Request, Response } from 'express';
import pool from '../config/database';
import { Usuario } from '../types';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtener información básica del usuario
    const [userRows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    const usuarios = userRows as Usuario[];

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = usuarios[0];

    // Obtener préstamos activos
    const [prestamosActivos] = await pool.query(
      `SELECT p.*, l.titulo as LibroNombre, l.autor 
       FROM prestamos p 
       JOIN libros l ON p.libroId = l.id 
       WHERE p.usuarioId = ? AND p.estado = 'ACTIVO'`,
      [id]
    );

    // Obtener historial de préstamos
    const [historialPrestamos] = await pool.query(
      `SELECT p.*, l.titulo as LibroNombre, l.autor 
       FROM prestamos p 
       JOIN libros l ON p.libroId = l.id 
       WHERE p.usuarioId = ? AND p.estado != 'ACTIVO'`,
      [id]
    );

    // Combinar toda la información
    const usuarioCompleto: Usuario = {
      ...usuario,
      prestamosActivos: prestamosActivos as any[],
      historialPrestamos: historialPrestamos as any[]
    };

    res.json(usuarioCompleto);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 