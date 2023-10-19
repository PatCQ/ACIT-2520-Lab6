const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const fs = require("fs").promises

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => fs.mkdir(pathProcessed))
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((image) => IOhandler.grayScale(image, pathProcessed))
  .catch(err => console.error(err))

