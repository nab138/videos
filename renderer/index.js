import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";

const videos = ["pathfinding-pt-1"];

const browser = await puppeteer.launch();
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
        process.exit();
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
  console.log("Render started, waiting to complete...");

  await holdUnitlFolderStopsBeingChanged(
    path.resolve(videoPath, "output"),
    7200000
  );
  console.log("RENDER COMPLETE!");
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

const fileInterval = 500;

async function holdBeforeFileExists(filePath, timeout) {
  try {
    let time = 0;
    return new Promise((resolve) => {
      const inter = setInterval(() => {
        time += fileInterval;
        if (time >= timeout) {
          clearInterval(inter);
          resolve(false);
        }

        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          clearInterval(inter);
          resolve(true);
        }
      }, fileInterval);
    });
  } catch (error) {
    return false;
  }
}

async function holdUnitlFolderStopsBeingChanged(folderPath, timeout) {
  return new Promise((resolve) => {
    let startTime = Date.now();
    let lastChange = Date.now();
    let watcher = fs.watch(folderPath, { recursive: true }, (e, f) => {
      lastChange = Date.now();
      let currentDuration = (Date.now() - startTime) / 1000;

      console.log(
        `[${currentDuration.toFixed(
          1
        )}s] Change detected (${e} in ${f}), still rendering...`
      );
    });

    let time = 0;
    const interval = setInterval(() => {
      time += fileInterval;
      if (time >= timeout) {
        console.log("Exceeded Timeout.");
        clearInterval(interval);
        watcher.close();
        resolve(false);
      }
      if (Date.now() - lastChange > 10 * 60 * 1000) {
        console.log(`[${((Date.now() - startTime) / 1000).toFixed(
          1
        )}s] No Changes detected for 10 minutes.`);
        clearInterval(interval);
        watcher.close();
        resolve(true);
      }
    }, fileInterval);
  });
}
