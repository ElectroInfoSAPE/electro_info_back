import { Request, Response } from 'express';
import { Op } from 'sequelize';
import models from '../models';
import { GetBookByCodeResponse } from '../types';

export const getAllBooks = async (_req: Request, res: Response) => {
  try {
    const libros = await models.Libro.findAll();
    res.json(libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getBookByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un código válido"
      } as GetBookByCodeResponse);
    }

    const libro = await models.Libro.findOne({
      where: {
        [Op.or]: [
          { codigo: code },
          { isbn: code },
          { id: code }
        ]
      }
    });

    if (libro) {
      return res.json({
        success: true,
        message: `Libro '${libro.titulo}' encontrado con éxito`,
        libro: libro.toJSON()
      } as GetBookByCodeResponse);
    }

    return res.status(404).json({
      success: false,
      message: `No se encontró ningún libro con el código '${code}'`
    } as GetBookByCodeResponse);

  } catch (error) {
    console.error('Error al buscar libro por código:', error);
    return res.status(500).json({
      success: false,
      message: "Error al buscar el libro"
    } as GetBookByCodeResponse);
  }
}; 