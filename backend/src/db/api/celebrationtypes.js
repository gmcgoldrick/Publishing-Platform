const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CelebrationtypesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const celebrationtypes = await db.celebrationtypes.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        description: data.description || null,
        Price: data.Price || null,
        wordcount: data.wordcount || null,
        imagecount: data.imagecount || null,
        featured: data.featured || false,

        featureddays: data.featureddays || null,
        listingdays: data.listingdays || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.celebrationtypes.getTableName(),
        belongsToColumn: 'image',
        belongsToId: celebrationtypes.id,
      },
      data.image,
      options,
    );

    return celebrationtypes;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const celebrationtypes = await db.celebrationtypes.findByPk(id, {
      transaction,
    });

    await celebrationtypes.update(
      {
        name: data.name || null,
        description: data.description || null,
        Price: data.Price || null,
        wordcount: data.wordcount || null,
        imagecount: data.imagecount || null,
        featured: data.featured || false,

        featureddays: data.featureddays || null,
        listingdays: data.listingdays || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.celebrationtypes.getTableName(),
        belongsToColumn: 'image',
        belongsToId: celebrationtypes.id,
      },
      data.image,
      options,
    );

    return celebrationtypes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const celebrationtypes = await db.celebrationtypes.findByPk(id, options);

    await celebrationtypes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await celebrationtypes.destroy({
      transaction,
    });

    return celebrationtypes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const celebrationtypes = await db.celebrationtypes.findOne(
      { where },
      { transaction },
    );

    if (!celebrationtypes) {
      return celebrationtypes;
    }

    const output = celebrationtypes.get({ plain: true });

    output.image = await celebrationtypes.getImage({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.file,
        as: 'image',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('celebrationtypes', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'celebrationtypes',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.PriceRange) {
        const [start, end] = filter.PriceRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            Price: {
              ...where.Price,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            Price: {
              ...where.Price,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.wordcountRange) {
        const [start, end] = filter.wordcountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            wordcount: {
              ...where.wordcount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            wordcount: {
              ...where.wordcount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.imagecountRange) {
        const [start, end] = filter.imagecountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            imagecount: {
              ...where.imagecount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            imagecount: {
              ...where.imagecount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.featureddaysRange) {
        const [start, end] = filter.featureddaysRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            featureddays: {
              ...where.featureddays,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            featureddays: {
              ...where.featureddays,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.listingdaysRange) {
        const [start, end] = filter.listingdaysRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            listingdays: {
              ...where.listingdays,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            listingdays: {
              ...where.listingdays,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.featured) {
        where = {
          ...where,
          featured: filter.featured,
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.celebrationtypes.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('celebrationtypes', 'id', query),
        ],
      };
    }

    const records = await db.celebrationtypes.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
