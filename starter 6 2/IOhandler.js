/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  {createReadStream, createWriteStream, readFiles} = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
  createReadStream(pathIn)
    .pipe(unzipper.Extract({path: pathOut}))
    .promise()
    .then( () => console.log('Extraction operation complete'), e => console.log('error', e))
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  const images = []
  return new Promise((res, rej) => {
    fs.readdir(dir)
      .then(content => {
        for (const file of content) {
          if (path.extname(file) === ".png")

            images.push(file)
        }
        res(images)
      })
      .catch(err => {
        rej(err)
      })
  })
}
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  for (const file of pathIn) {
    filePath = "unzipped/" + file
    createReadStream(filePath)
    .pipe(
      new PNG({
        filterType: 4,
      })
    )
    .on("parsed", function () {
      for (var i = 0; i < this.data.length; i += 4) {
        this.data[i] = (this.data[i] + this.data[i+1] + this.data[i+2])/3;
        this.data[i+1] = (this.data[i] + this.data[i+1] + this.data[i+2])/3;
        this.data[i+2] = (this.data[i] + this.data[i+1] + this.data[i+2])/3;
      }
      this.pack().pipe(createWriteStream(pathOut + "/" + file));
    })
  }
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};

unzip("myfile.zip", "unzipped")
  .then(() => readDir("unzipped"))
  .then((images) => grayScale(images, "imageGrey"))
  .catch(err => console.error(err))
