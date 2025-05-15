import { Request, Response } from 'express';
import pool from '../config/database';
import { Prestamo, PrestamoEstado, ReturnLoanResponse, RenewLoanResponse, MakeLoanRequest, MakeLoanResponse } from '../types';

export const getPrestamo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM prestamos WHERE id = ?', [id]);
    const prestamos = rows as Prestamo[];

    if (prestamos.length === 0) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    res.json(prestamos[0]);
  } catch (error) {
    console.error('Error al obtener préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const returnLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fechaDevolucion = new Date().toISOString().split('T')[0];

    const [prestamo] = await pool.query('SELECT * FROM prestamos WHERE id = ?', [id]) as [Prestamo[], any];

    if (!prestamo || prestamo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado'
      } as ReturnLoanResponse);
    }

    await pool.query(
      'UPDATE prestamos SET estado = ?, fechaDevolucionReal = ? WHERE id = ?',
      [PrestamoEstado.DEVUELTO, fechaDevolucion, id]
    );

    // Actualizar disponibilidad del libro
    await pool.query(
      'UPDATE libros SET disponibles = disponibles + 1 WHERE id = ?',
      [prestamo[0].libroId]
    );

    const response: ReturnLoanResponse = {
      success: true,
      message: 'Préstamo devuelto exitosamente',
      prestamo: {
        ...prestamo[0],
        estado: PrestamoEstado.DEVUELTO,
        fechaDevolucionReal: fechaDevolucion
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error al devolver préstamo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    } as ReturnLoanResponse);
  }
};

export const renewLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [prestamo] = await pool.query('SELECT * FROM prestamos WHERE id = ?', [id]) as [Prestamo[], any];

    if (!prestamo || prestamo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado'
      } as RenewLoanResponse);
    }

    if (prestamo[0].renovaciones_hechas >= 2) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden realizar más renovaciones para este préstamo'
      } as RenewLoanResponse);
    }

    // Calcular nueva fecha de devolución (30 días más)
    const nuevaFecha = new Date(prestamo[0].fechaDevolucionPrevista);
    nuevaFecha.setDate(nuevaFecha.getDate() + 30);
    const nuevaFechaStr = nuevaFecha.toISOString().split('T')[0];

    await pool.query(
      'UPDATE prestamos SET fechaDevolucionPrevista = ?, renovaciones_hechas = renovaciones_hechas + 1 WHERE id = ?',
      [nuevaFechaStr, id]
    );

    const response: RenewLoanResponse = {
      success: true,
      message: 'Préstamo renovado exitosamente',
      prestamo: {
        ...prestamo[0],
        fechaDevolucionPrevista: nuevaFechaStr,
        renovaciones_hechas: prestamo[0].renovaciones_hechas + 1
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error al renovar préstamo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    } as RenewLoanResponse);
  }
};

export const makeLoan = async (req: Request, res: Response) => {
  try {
    const { libroId, usuarioId, duracionDias }: MakeLoanRequest = req.body;

    // Verificar disponibilidad del libro
    const [libro] = await pool.query(
      'SELECT * FROM libros WHERE id = ? AND disponibles > 0',
      [libroId]
    );

    if (!libro || (libro as any[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Libro no disponible'
      } as MakeLoanResponse);
    }

    // Verificar límite de préstamos del usuario
    const [prestamosActivos] = await pool.query(
      'SELECT COUNT(*) as count FROM prestamos WHERE usuarioId = ? AND estado = ?',
      [usuarioId, PrestamoEstado.ACTIVO]
    );

    if ((prestamosActivos as any[])[0].count >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Usuario ha alcanzado el límite de préstamos'
      } as MakeLoanResponse);
    }

    const fechaPrestamo = new Date().toISOString().split('T')[0];
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + duracionDias);
    const fechaDevolucionStr = fechaDevolucion.toISOString().split('T')[0];

    // Crear préstamo
    const [result] = await pool.query(
      'INSERT INTO prestamos (libroId, usuarioId, fechaPrestamo, fechaDevolucionPrevista, estado, renovaciones_hechas) VALUES (?, ?, ?, ?, ?, ?)',
      [libroId, usuarioId, fechaPrestamo, fechaDevolucionStr, PrestamoEstado.ACTIVO, 0]
    );

    // Actualizar disponibilidad del libro
    await pool.query(
      'UPDATE libros SET disponibles = disponibles - 1 WHERE id = ?',
      [libroId]
    );

    const response: MakeLoanResponse = {
      success: true,
      message: 'Préstamo creado exitosamente',
      libro: (libro as any[])[0],
      usuarioId,
      duracionDias,
      fecha: fechaPrestamo
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    } as MakeLoanResponse);
  }
}; 