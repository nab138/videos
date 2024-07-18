import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";

const videos = ["pathfinding-pt-1"];

const browser = await puppeteer.launch({ headless: false });
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

videos.forEach((videoPath) => {
  const fullPath = path.resolve(__dirname, "../", videoPath);
  // Run npm install
  exec(`cd ${fullPath} && npm install`, (installErr) => {
    if (installErr) {
      console.error(`npm install failed for ${videoPath}:`, installErr);
      return;
    }
    console.log(`npm install completed for ${videoPath}`);

    const npmStart = exec(
      `cd ${fullPath} && npm start -- --strictPort --port 9000`
    );

    npmStart.stdout.on("data", async (data) => {
      console.log(data);
      // Check for a specific output indicating the server has started
      if (data.includes("ready in")) {
        console.log(`Vite server started for ${videoPath}`);
        await renderVideo(fullPath);
        // kill npm start process
        npmStart.kill();
      }
    });

    npmStart.stderr.on("data", (data) => {
      console.error(`Error starting Vite server for ${videoPath}:`, data);
    });
  });
});

async function renderVideo(videoPath) {
  const page = await browser.newPage();
  await page.goto("http://localhost:9000", {
    waitUntil: "load",
  });
  await page.setViewport({ width: 1920, height: 1080 });
  await delay(5000);
  // find element with id render
  await page.click("#render");
  await holdBeforeFileExists(
    path.resolve(videoPath, "output/project.mp4"),
    20000
  );
  console.log("File exists, waiting for it to stop being changed...");

  await holdUnitlFolderStopsBeingChanged(
    path.resolve(videoPath, "output"),
    7200000
  );
  console.log("RENDER COMPLETE");
  fs.renameSync(
    path.resolve(videoPath, "output/project.mp4"),
    path.resolve(__dirname, `../pathfindingpt1.mp4`)
  );
  browser.close();
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

/**
 *
 * @param {String} filePath
 * @param {Number} timeout
 * @returns {Promise<Boolean>}
 */
const holdBeforeFileExists = async (filePath, timeout) => {
  timeout = timeout < 1000 ? 1000 : timeout;
  try {
    let nom = 0;
    return new Promise((resolve) => {
      const inter = setInterval(() => {
        nom = nom + 500;
        if (nom >= timeout) {
          clearInterval(inter);
          resolve(false);
        }

        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          clearInterval(inter);
          resolve(true);
        }
      }, 500);
    });
  } catch (error) {
    return false;
  }
};

const holdUnitlFolderStopsBeingChanged = async (folderPath, timeout) => {
  // Use fs.watch, when there are no changes for 5 seconds, resolve
  return new Promise((resolve) => {
    let lastChange = Date.now();
    fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
      console.log("Change detected, still rendering...");
      console.log("changes were a " + eventType + " in " + filename);
      lastChange = Date.now();
    });

    let nom = 0;
    const interval = setInterval(() => {
      nom = nom + 500;
      if (nom >= timeout) {
        clearInterval(interval);
        resolve(false);
      }
      if (Date.now() - lastChange > 45000) {
        clearInterval(interval);
        resolve(true);
      }
    }, 500);
  });
};
