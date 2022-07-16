const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const announcementtypes = sequelize.define(
    'announcementtypes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      price: {
        type: DataTypes.DECIMAL,
      },

      wordcount: {
        type: DataTypes.INTEGER,
      },

      imagecount: {
        type: DataTypes.INTEGER,
      },

      featured: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
      },

      featureddays: {
        type: DataTypes.INTEGER,
      },

      description: {
        type: DataTypes.TEXT,
      },

      listingdays: {
        type: DataTypes.INTEGER,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  announcementtypes.associate = (db) => {
    db.announcementtypes.hasMany(db.file, {
      as: 'image',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.announcementtypes.getTableName(),
        belongsToColumn: 'image',
      },
    });

    db.announcementtypes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.announcementtypes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return announcementtypes;
};
