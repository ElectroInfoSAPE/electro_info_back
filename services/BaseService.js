class BaseService {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const instance = await this.findById(id);
        if (!instance) {
            throw new Error('Record not found');
        }
        return await instance.update(data);
    }

    async delete(id) {
        const instance = await this.findById(id);
        if (!instance) {
            throw new Error('Record not found');
        }
        return await instance.destroy();
    }
}

module.exports = BaseService; 