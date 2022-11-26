const fs = require("fs");
const path = require("path");

const { Deta } = require("deta");
const { zip, COMPRESSION_LEVEL } = require("zip-a-folder");
const extract = require("extract-zip");

const { DETA_PROJ_KEY } = require("../config.js");

let whatsDB = null;
if (DETA_PROJ_KEY) {
  const deta = Deta(DETA_PROJ_KEY);
  whatsDB = deta.Drive("WhatsCyber");
}


const storeSession = async (isnew) => {
  if (!whatsDB) return;
  if (!(isnew || !(await whatsDB.list()).names.includes("whatscybersession"))) return;
  if (fs.existsSync("./WhatsCyber")) {
    try {
      console.log("\nDatabase'den istifade edilir...");
      if (fs.existsSync("./WhatsCyber.zip")) fs.unlink("./WhatsCyber.zip", (err) => { if (err) console.log(err); });
      await zip("./WhatsCyber", "./WhatsCyber.zip", {
        compression: COMPRESSION_LEVEL.high,
      });
      await whatsDB.put("whatscybersession", { path: "./WhatsCyber.zip" });
      await new Promise(resolve => setTimeout(resolve, 2 * 1000));
      fs.unlink("./WhatsCyber.zip", (err) => { if (err) console.log(err); });
      console.log("Database'de saxlanildi giris.");
    } catch (err) {
      console.log("Error: " + err);
    }
  }
};

const checkSessionAndLoad = async () => {
  if (!fs.existsSync("./WhatsCyber")) {
    console.log("Session fayli tapilmadi.");
    if (!whatsDB) return false;
    console.log("Database'e baglaniram...");
    try {
      const get_s = await whatsDB.get("whatscybersession");
      if (get_s) {
        const buffer = await get_s.arrayBuffer();
        fs.writeFileSync("./WhatsCyber.zip", Buffer.from(buffer));
        await extract("./WhatsCyber.zip", {
          dir: path.resolve("./") + "/WhatsCyber",
        });
        fs.unlinkSync("./WhatsCyber.zip");
        console.log("Restored database.");
        return true;
      } else {
        console.log("Session does not exit database.");
        return false;
      }
    } catch (err) {
      console.log("Error loading session from db");
      console.error(err);
      return false;
    }
  } else {
    console.log("Local session exists!");
    return true;
  }
};

module.exports = { checkSessionAndLoad, storeSession };
