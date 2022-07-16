module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'announcements',
        'useridId',
        {
          type: Sequelize.DataTypes.UUID,

          references: {
            model: 'users',
            key: 'id',
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'announcements',
        'announcementtypeidId',
        {
          type: Sequelize.DataTypes.UUID,

          references: {
            model: 'announcementtypes',
            key: 'id',
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'announcements',
        'creationdate',
        {
          type: Sequelize.DataTypes.DATE,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('announcements', 'creationdate', {
        transaction,
      });

      await queryInterface.removeColumn(
        'announcements',
        'announcementtypeidId',
        { transaction },
      );

      await queryInterface.removeColumn('announcements', 'useridId', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
