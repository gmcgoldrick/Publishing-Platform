const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const celebrationtypes = sequelize.define(
    'celebrationtypes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      Price: {
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

  celebrationtypes.associate = (db) => {
    db.celebrationtypes.hasMany(db.file, {
      as: 'image',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.celebrationtypes.getTableName(),
        belongsToColumn: 'image',
      },
    });

    db.celebrationtypes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.celebrationtypes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return celebrationtypes;
};
