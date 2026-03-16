const propertyModel = require('../models/property.model');
const { success, error, notFound, forbidden } = require('../utils/apiResponse');

async function list(req, res) {
  try {
    const properties = await propertyModel.findByHostId(req.user.id);
    return success(res, properties);
  } catch (err) {
    console.error('properties.list error:', err);
    return error(res, 'Failed to fetch properties');
  }
}

async function create(req, res) {
  const { name, address, lat, lng, bedrooms, bathrooms, size, notes } = req.body;
  try {
    const property = await propertyModel.create({
      hostId: req.user.id,
      name,
      address,
      lat,
      lng,
      bedrooms,
      bathrooms,
      size,
      notes,
    });
    return success(res, property, 201);
  } catch (err) {
    console.error('properties.create error:', err);
    return error(res, 'Failed to create property');
  }
}

async function getOne(req, res) {
  try {
    const property = await propertyModel.findById(req.params.id);
    if (!property) return notFound(res, 'Property not found');
    return success(res, property);
  } catch (err) {
    return error(res, 'Failed to fetch property');
  }
}

async function update(req, res) {
  try {
    const property = await propertyModel.findById(req.params.id);
    if (!property) return notFound(res, 'Property not found');
    if (property.host_id !== req.user.id) return forbidden(res);

    const updated = await propertyModel.update(req.params.id, req.body);
    return success(res, updated);
  } catch (err) {
    return error(res, 'Failed to update property');
  }
}

async function remove(req, res) {
  try {
    const property = await propertyModel.findById(req.params.id);
    if (!property) return notFound(res, 'Property not found');
    if (property.host_id !== req.user.id) return forbidden(res);

    await propertyModel.remove(req.params.id);
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, 'Failed to delete property');
  }
}

module.exports = { list, create, getOne, update, remove };
