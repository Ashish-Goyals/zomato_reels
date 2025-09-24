const ImageKit = require ('imagekit');
const {imageKits} = require ('../config/config');
const imagekit = new ImageKit ({
  publicKey: imageKits.publicKey,
  privateKey: imageKits.privateKey,
  urlEndpoint: imageKits.urlEndpoint,
});

async function uploadFile (file, fileName) {
  const result = await imagekit.upload ({
    file: file, //required
    fileName: fileName, //required
  });
  return result;
}

module.exports = {
  uploadFile,
};
