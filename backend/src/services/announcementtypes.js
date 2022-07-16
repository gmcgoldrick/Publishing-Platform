const db = require('../db/models');
const AnnouncementtypesDBApi = require('../db/api/announcementtypes');

module.exports = class AnnouncementtypesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await AnnouncementtypesDBApi.create(data, {
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
      let announcementtypes = await AnnouncementtypesDBApi.findBy(
        { id },
        { transaction },
      );

      if (!announcementtypes) {
        throw new ValidationError('announcementtypesNotFound');
      }

      await AnnouncementtypesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return announcementtypes;
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

      await AnnouncementtypesDBApi.remove(id, {
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
