const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AnnouncementtypesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const announcementtypes = await db.announcementtypes.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        price: data.price || null,
        wordcount: data.wordcount || null,
        imagecount: data.imagecount || null,
        featured: data.featured || false,

        featureddays: data.featureddays || null,
        description: data.description || null,
        listingdays: data.listingdays || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.announcementtypes.getTableName(),
        belongsToColumn: 'image',
        belongsToId: announcementtypes.id,
      },
      data.image,
      options,
    );

    return announcementtypes;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const announcementtypes = await db.announcementtypes.findByPk(id, {
      transaction,
    });

    await announcementtypes.update(
      {
        name: data.name || null,
        price: data.price || null,
        wordcount: data.wordcount || null,
        imagecount: data.imagecount || null,
        featured: data.featured || false,

        featureddays: data.featureddays || null,
        description: data.description || null,
        listingdays: data.listingdays || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.announcementtypes.getTableName(),
        belongsToColumn: 'image',
        belongsToId: announcementtypes.id,
      },
      data.image,
      options,
    );

    return announcementtypes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const announcementtypes = await db.announcementtypes.findByPk(id, options);

    await announcementtypes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await announcementtypes.destroy({
      transaction,
    });

    return announcementtypes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const announcementtypes = await db.announcementtypes.findOne(
      { where },
      { transaction },
    );

    if (!announcementtypes) {
      return announcementtypes;
    }

    const output = announcementtypes.get({ plain: true });

    output.image = await announcementtypes.getImage({
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
          [Op.and]: Utils.ilike('announcementtypes', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'announcementtypes',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.priceRange) {
        const [start, end] = filter.priceRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            price: {
              ...where.price,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            price: {
              ...where.price,
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

    let { rows, count } = await db.announcementtypes.findAndCountAll({
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
          Utils.ilike('announcementtypes', 'id', query),
        ],
      };
    }

    const records = await db.announcementtypes.findAll({
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
