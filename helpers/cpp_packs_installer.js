const Fs = require("fs");
const Path = require("path");
const Request = require("request");
const Rimraf = require("rimraf");
const Tmp = require("tmp");
const Unzipper = require("unzipper");
const Pack = require("../package.json");

let CPPPacksDir = Path.resolve(__dirname, "../cpp_modules");

function main(argv) {
  if (argv.indexOf("install") != -1) {
    installCPPPacks()
      .then(() => {
        console.log("\n  🌟 All C++ packages have been successfully installed 🌟\n");
      }, (error) => {
        console.error(error);
        process.exit(0);
      });
  }
}

function installCPPPacks() {
  return Promise.resolve()
    .then(createCPPPacksTempDir)
    .then(removeCPPPacksDir)
    .then(createCPPPacksDir)
    .then(({ CPPPacksTempDir, removeCPPPacksTempDir }) => {
      let requests = Object.keys(Pack.cppDependencies).map((CPPPackName) => {
        let CPPPackURL = Pack.cppDependencies[CPPPackName];
        return installCPPPack(CPPPacksTempDir, CPPPackName, CPPPackURL);
      });

      return new Promise((resolve, reject) => {
        Promise.all(requests)
          .then(() => removeCPPPacksTempDir(), () => removeCPPPacksTempDir())
          .then(resolve, reject);
      });
    });
}

function createCPPPacksTempDir() {
  return new Promise((resolve, reject) => {
    Tmp.dir({ unsafeCleanup: true }, (error, CPPPacksTempDir, removeCPPPacksTempDir) => {
      if (error)
        reject(error);
      else
        resolve({ CPPPacksTempDir, removeCPPPacksTempDir });
    });
  });
}

function removeCPPPacksDir(results) {
  return new Promise((resolve, reject) => {
    Rimraf(CPPPacksDir, (error) => {
      if (error)
        reject(error);
      else
        resolve(results);
    });
  });
}

function createCPPPacksDir(results) {
  return new Promise((resolve, reject) => {
    Fs.mkdir(CPPPacksDir, (error) => {
      if (error)
        reject(error);
      else
        resolve(results);
    });
  });
}

function installCPPPack(CPPPacksTempDir, CPPPackName, CPPPackURL) {
  let CPPPackZipName = Path.basename(CPPPackURL);
  let CPPPackZip = Path.resolve(CPPPacksTempDir, CPPPackZipName);

  return new Promise((resolve, reject) => {
    Request
      .get(CPPPackURL)
      .on("end", (response) => {
        unpackCPPPack(CPPPackName, CPPPackZip).then(resolve, reject)
      })
      .on("error", (error) => {
        reject(error);
      })
      .pipe(Fs.createWriteStream(CPPPackZip));
  });
}

function unpackCPPPack(CPPPackName, CPPPackZip) {
  let CPPPackDir = Path.resolve(CPPPacksDir, CPPPackName);

  return new Promise((resolve, reject) => {
    Fs.createReadStream(CPPPackZip)
      .on("end", () => {
        removeCPPPackZip(CPPPackZip).then(resolve, reject);
      })
      .on("error", (error) => {
        reject(error);
      })
      .pipe(Unzipper.Extract({ path: CPPPackDir }));
  });
}

function removeCPPPackZip(CPPPackZip) {
  return new Promise((resolve, reject) => {
    Fs.unlink(CPPPackZip, (error) => {
      if (error)
        reject(error);
      else
        resolve();
    });
  });
}

if (require.main === module) main(process.argv.slice(2));

module.exports = {
  install: installCPPPacks
};
