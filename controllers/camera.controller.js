const { ReE, ReS, to, asyncForEach }         = require('../services/UtilService');
const axios = require('axios');

/**
 * Create new Camera
 */
const create = async function(req, res){
	// File Database
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	// Validate body
	const body = req.body;
	if (!body.address || !body.type || !body.section)
		return ReE(res, { message: 'INVALID_DATA' });

	// Check if that section exists
	var section = db.get('sections').find({ id: parseInt(body.section) }).value();
	if (!section) return ReE(res, { message: 'SECTION_NOT_FOUND' });

	try {
		db.get('cameras').push({
			id: parseInt(parseInt(db.get('cameras').size().value()) + 1),
			...body
		}).write();
	} catch (e) {
		return ReE(res, { message: 'ERROR_INSERT' });
	}
	return ReS(res, {message: 'Created Camera'});
};
module.exports.create = create;


/**
 * Get Cameras
 */
const get = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	return ReS(res, {cameras: db.get('cameras').value()});
};
module.exports.get = get;


/**
 * Get Camera by id
 */
const getById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	var camera = db.get('cameras').find({ id: parseInt(req.params.id) }).value();
	return ReS(res, {camera});
}
module.exports.getById = getById;

/**
 * Update Camera by id
 */
const updateById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	const body = req.body;
	if (!body.address || !body.type || !body.section)
		return ReE(res, { message: 'INVALID_DATA' });

	try {
		db.get('cameras')
			.find({ id: parseInt(req.params.id) })
			.assign(body)
			.write()
	} catch (e) {
		return ReE(res, { message: 'ERROR_UPDATE' });
	}
	return ReS(res, {message: 'Successfully Updated'});
}
module.exports.updateById = updateById;


/**
 * Delete Camera by id
 */
const deleteById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	try {
		db.get('cameras').remove({ id: parseInt(req.params.id) }).write()
	} catch (e) {
		return ReE(res, { message: 'ERROR_DELETE' });
	}
	return ReS(res, {message: 'Successfully Deleted'});
}
module.exports.deleteById = deleteById;
