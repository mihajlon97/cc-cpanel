const CameraController = require('../controllers/camera.controller');
const SectionController = require('../controllers/section.controller');
const { ReE, ReS, to, asyncForEach }         = require('../services/UtilService');

module.exports = function (express) {
	const router = express.Router();

	// ----------- Routes -------------

	// ----------- Camera -------------
	router.post('/cameras',           CameraController.create);
	router.get('/cameras',            CameraController.get);
	router.get('/cameras/:id',        CameraController.getById);
	router.put('/cameras/:id',        CameraController.updateById);
	router.delete('/cameras/:id',     CameraController.deleteById);

	var proxy = require('http-proxy').createProxyServer({});
	
	proxy.on('proxyReq', (proxyReq, req) => {
		if (req.body) {
		const bodyData = JSON.stringify(req.body);
		// incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
		proxyReq.setHeader('Content-Type','application/json');
		proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
		// stream the content
		proxyReq.write(bodyData);
	}
});

	router.use('/cameras/:id/', (req, res, next) => {
		// File Database
		const low = require('lowdb')
		const FileSync = require('lowdb/adapters/FileSync')
		const adapter = new FileSync('db.json')
		const db = low(adapter)

		// Get Camera
		var camera = db.get('cameras').find({ id: parseInt(req.params.id) }).value();
		if (!camera) return ReE(res, { message: 'INVALID_ID' });

		proxy.web(req, res, { target: camera.address }, next);
	});

	// ----------- Section -------------
	router.post('/sections',          SectionController.create);
	router.get('/sections',           SectionController.get);
	router.get('/sections/:id',       SectionController.getById);
	router.put('/sections/:id',       SectionController.updateById);
	router.delete('/sections/:id',    SectionController.deleteById);

	router.use('/sections/:id/', (req, res, next) => {
		// File Database
		const low = require('lowdb')
		const FileSync = require('lowdb/adapters/FileSync')
		const adapter = new FileSync('db.json')
		const db = low(adapter)

		// Get Camera
		var section = db.get('sections').find({ id: parseInt(req.params.id) }).value();
	if (!section) return ReE(res, { message: 'INVALID_ID' });

	proxy.web(req, res, { target: section.address }, next);
});
	
	return router;
};
