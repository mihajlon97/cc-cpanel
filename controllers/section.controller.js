const { ReE, ReS, to, asyncForEach }         = require('../services/UtilService');
const axios = require('axios');

/**
 * Create new Section
 */
const create = async function(req, res){
	// File Database
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	const body = req.body;
	if (!body.address) return ReE(res, { message: 'INVALID_DATA' });

	try {
		db.get('sections').push({
			id: parseInt(parseInt(db.get('sections').size().value()) + 1),
			...body
		}).write();
	} catch (e) {
		return ReE(res, { message: 'ERROR_INSERT' });
	}
	return ReS(res, {message: 'Created Section'});
};
module.exports.create = create;


/**
 * Get Sections
 */
const get = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	return ReS(res, {sections: db.get('sections').value()});
};
module.exports.get = get;


/**
 * Get Section by id
 */
const getById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	var section = db.get('sections').find({ id: parseInt(req.params.id) }).value();
	return ReS(res, {section});
}
module.exports.getById = getById;

/**
 * Update Section by id
 */
const updateById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	const body = req.body;
	if (!body.address) return ReE(res, { message: 'INVALID_DATA' });

	try {
		db.get('sections')
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
 * Delete Section by id
 */
const deleteById = async function(req, res){
	const low = require('lowdb')
	const FileSync = require('lowdb/adapters/FileSync')
	const adapter = new FileSync('db.json')
	const db = low(adapter)

	try {
		db.get('sections').remove({ id: parseInt(req.params.id) }).write()
	} catch (e) {
		return ReE(res, { message: 'ERROR_DELETE' });
	}
	return ReS(res, {message: 'Successfully Deleted'});
}
module.exports.deleteById = deleteById;
