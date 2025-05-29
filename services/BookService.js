const BaseService = require('./BaseService');
const db = require('../models');

class BookService extends BaseService {
    constructor() {
        super(db.Book);
    }

    // Métodos específicos para libros
    async findByISBN(isbn) {
        return await this.model.findOne({ where: { isbn } });
    }

    async findAvailableBooks() {
        return await this.model.findAll({
            where: {
                available: true
            }
        });
    }

    // Puedes agregar más métodos específicos para libros aquí
}

module.exports = BookService; 