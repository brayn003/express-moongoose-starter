const { Router } = require('express');
const apiRoutes = require('./api');

const router = Router();

router.get('/', (req, res) => res.send(`${process.env.APP_NAME} is running`));

router.use('/api', apiRoutes);

module.exports = router;
