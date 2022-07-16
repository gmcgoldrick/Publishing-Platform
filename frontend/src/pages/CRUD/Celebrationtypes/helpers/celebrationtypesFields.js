const celebrationtypesFields = {
  id: { type: 'id', label: 'ID' },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  description: {
    type: 'string',
    label: 'Description',

    options: [{ value: 'value', label: 'value' }],
  },

  image: {
    type: 'images',
    label: 'Image',

    options: [{ value: 'value', label: 'value' }],
  },

  Price: {
    type: 'decimal',
    label: 'Price',

    options: [{ value: 'value', label: 'value' }],
  },

  wordcount: {
    type: 'int',
    label: 'Word Count',

    options: [{ value: 'value', label: 'value' }],
  },

  imagecount: {
    type: 'int',
    label: 'Image Count',

    options: [{ value: 'value', label: 'value' }],
  },

  featured: {
    type: 'boolean',
    label: 'Featured',

    options: [{ value: 'value', label: 'value' }],
  },

  featureddays: {
    type: 'int',
    label: 'Featured Days',

    options: [{ value: 'value', label: 'value' }],
  },

  listingdays: {
    type: 'int',
    label: 'Listing Days',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default celebrationtypesFields;
