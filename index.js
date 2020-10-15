const chunk = require('lodash.chunk');
const fetch = require('node-fetch');
const { join: pathJoin } = require('path');
const fsExtra = require('fs-extra');

const { promises: fs } = require('fs');

require('dotenv').config();

const {
  API_URL,
  AUTH_TOKEN,
} = process.env;

const getFilesList = async () => (await fs.readdir('./source'))
  .filter(fileName => fileName.indexOf('.json') !== -1);

const uploadFile = async fileName => {
  const fileData = (await fs.readFile(pathJoin(`./source`, fileName))).toString();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      authtoken: AUTH_TOKEN,
      'Content-Type': "application/json",
    },
    body: fileData,
  });

  // update stats
  const resp = await response.json();

  return {
    fileName,
    ok: response.ok,
    response: resp,
  };
};

const updateStats = async ({ data, targetFileName }) => {
  let fileData;

  try {
    fileData = await fsExtra.readJSON(targetFileName);
  } catch (e) {
    fileData = [];
  }

  fileData = fileData.concat(data);

  return fsExtra.writeJSON(targetFileName, fileData);
};

const uploadFilesList = ({ fileList }) => Promise.all(fileList.map(fileLocation => uploadFile(fileLocation)));

const init = (async () => {
  const fileList = await getFilesList();

  for (const fileChunk of chunk(fileList, 4)) {
    let response;
    try {
      response = await uploadFilesList({ fileList: fileChunk });

      const errorList = response.filter(stat => !stat.ok)

      await updateStats({
        data: errorList,
        targetFileName: './stats/error.json'
      });
    } catch (e) {
      console.error(e);

      await updateStats({
        data: {
          response,
          error: e
        },
        targetFileName: './stats/report-error.json'
      });

      // process.exit(1);
    }
  }
})();
