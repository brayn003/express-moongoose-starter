const moduleAlias = require('module-alias');
const express = require('express');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const path = require('path');

const runServer = () => {
  const { PORT } = process.env;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(require('~routes'));
  app.use(require('~middlewares/catch-error'));

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      resolve();
    });
  });
};

const setMongooseConfig = () => {
  mongoose.set('useCreateIndex', true);
  mongoose.set('toJSON', { virtuals: true });
  mongoose.set('useFindAndModify', false);
};

const loadMongoosePlugins = () => {
  mongoose.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt: true,
    deletedBy: true,
  });

  mongoose.plugin((schema) => {
    const condition = typeof schema.options.userAudits === 'undefined' || schema.options.userAudits;
    if (condition) {
      schema.add({
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
      });
    }
  });

  mongoose.plugin((schema) => {
    schema.set('timestamps', true);
  });
};

const connectMongoose = () => {
  const { MONGODB_URL } = process.env;
  return mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};

const mongooseInit = async () => {
  setMongooseConfig();
  loadMongoosePlugins();
  return connectMongoose();
};

const appInit = async () => {
  moduleAlias(path.resolve(__dirname, '..', '..', 'package.json'));
  await mongooseInit();
  await runServer();
  const { PORT, APP_NAME } = process.env;
  console.log(chalk`{green {bold ${APP_NAME}} is running on {bold ${PORT}}}`);
};

module.exports = {
  mongooseInit,
  appInit,
};
