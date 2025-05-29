const BaseService = require('./BaseService');
const db = require('../models');

class LoanService extends BaseService {
    constructor() {
        super(db.Loan);
    }

    async createLoan(borrowerId, bookId, dueDate) {
        // Verificar disponibilidad del libro
        const book = await db.Book.findByPk(bookId);
        if (!book || !book.available) {
            throw new Error('Book is not available for loan');
        }

        // Crear el préstamo usando una transacción
        const result = await db.sequelize.transaction(async (t) => {
            // Crear el préstamo
            const loan = await this.model.create({
                borrowerId,
                bookId,
                dueDate,
                status: 'ACTIVE'
            }, { transaction: t });

            // Actualizar el estado del libro
            await book.update({ available: false }, { transaction: t });

            return loan;
        });

        return result;
    }

    async returnLoan(loanId) {
        const loan = await this.findById(loanId);
        if (!loan || loan.status !== 'ACTIVE') {
            throw new Error('Invalid loan or already returned');
        }

        const result = await db.sequelize.transaction(async (t) => {
            // Actualizar el préstamo
            await loan.update({
                status: 'RETURNED',
                returnDate: new Date()
            }, { transaction: t });

            // Actualizar el estado del libro
            await db.Book.update(
                { available: true },
                { 
                    where: { id: loan.bookId },
                    transaction: t 
                }
            );

            return loan;
        });

        return result;
    }

    async getActiveLoansByBorrower(borrowerId) {
        return await this.model.findAll({
            where: {
                borrowerId,
                status: 'ACTIVE'
            },
            include: [
                { model: db.Book },
                { model: db.Borrower }
            ]
        });
    }
}

module.exports = LoanService; 