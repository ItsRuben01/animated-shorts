import { Config } from "@remotion/cli/config";
import fs from "node:fs";
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(1);

// Cloud sessions can't download Remotion's headless shell: use the preinstalled one when present.
const CLOUD_SHELL = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (process.env.REMOTION_BROWSER || fs.existsSync(CLOUD_SHELL)) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER || CLOUD_SHELL);
}
