const db = require('../db/models');
const CelebrationtypesDBApi = require('../db/api/celebrationtypes');

module.exports = class CelebrationtypesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await CelebrationtypesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let celebrationtypes = await CelebrationtypesDBApi.findBy(
        { id },
        { transaction },
      );

      if (!celebrationtypes) {
        throw new ValidationError('celebrationtypesNotFound');
      }

      await CelebrationtypesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return celebrationtypes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await CelebrationtypesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
