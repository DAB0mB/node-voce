const Del = require("del");
const Fs = require("fs");
const Path = require("path");
const Request = require("request");
const Tmp = require("tmp");
const Unzipper = require("unzipper");
const Pack = require("../package.json");

let CPPPacksDir = Path.resolve(__dirname, "../cpp_modules");

function main(argv) {
  if (argv.indexOf("install") != -1) {
    console.log("Node.JS Voce");
    console.log("------------");
    console.log("Installing C++ packages...")

    installCPPPacks()
      .then(() => {
        console.log("\n  🌟 All C++ packages have been successfully installed 🌟\n");
      }, (error) => {
        console.error(error);
        process.exit(1);
      });
  }
}

function installCPPPacks() {
  return Promise.resolve()
    .then(createCPPPacksTempDir)
    .then(removeCPPPacks)
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

function removeCPPPacks(results) {
  let patterns = [
    CPPPacksDir + "/**",
    "!" + CPPPacksDir,
    "!" + CPPPacksDir + "/headers",
    "!" + CPPPacksDir + "/headers/**"
  ];

  return Del(patterns).then(() => results);
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
