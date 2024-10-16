/**
 * @file Sets up the environment for running Lite XL.
 * @author takase1121
 */

import { mkdirp, uploadFiles, downloadFiles } from "./fs.js";

Module["thisProgram"] = "/usr/bin/lite-xl";

/**
 * Shows one of the overlays.
 * @param {string} overlayName
 */
function showOverlay(overlayName) {
  document
    .querySelectorAll("#overlay div")
    .forEach(
      (el) => (el.style.display = el.id === overlayName ? "block" : "none"),
    );
  document.getElementById("overlay").style.display = "block";
  document.getElementById("canvas").style.display = "none";
}

/**
 * Hides all overlays.
 */
function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("canvas").style.display = "block";
}

let storageReady, runtimeReady, started;
/**
 * Starts Lite XL.
 */
function start() {
  if (runtimeReady && storageReady && !started) {
    started = true;
    console.log("Starting Lite XL...");
    FS.chdir("/home/web_user");

    // disable canvas context menu
    Module["canvas"].oncontextmenu = (e) => e.preventDefault();
    hideOverlay();
    callMain(Module["arguments"]);
  }
}

// export functions accessed by C
Module["uploadFiles"] = uploadFiles;
Module["downloadFiles"] = downloadFiles;

Module["preRun"].push(() => {
  ENV["LITE_SCALE"] = window.devicePixelRatio.toString();
  // ENV["LITE_XL_RUNTIME"] = "core.wasm_core";

  // mount IDBFS in home folder
  mkdirp("/home/web_user");
  FS.mount(IDBFS, { autoPersist: true }, "/home/web_user");
  FS.syncfs(true, (e) => {
    if (e) {
      console.error("syncfs(true) failed: ", e);
    } else {
      storageReady = true;
      start();
    }
  });
});
Module["onExit"] = (status) => {
  if (status === 0) {
    showOverlay("exit");
  } else {
    document.getElementById("exit_status").textContent =
      `Program exited with status ${status}`;
    showOverlay("exit_error");
  }
};
Module["onRuntimeInitialized"] = () => {
  runtimeReady = true;
  start();
};

/**
 * Writes a string as a series of keyboard events.
 * @param {InputEvent|CompositionEvent} e
 */
function addInput(e) {
  if (e.data) {
    // emulate keypress events
    for (const char of [...e.data]) {
      window.dispatchEvent(
        new KeyboardEvent("keypress", {
          key: char,
          isComposing: e.isComposing,
          charCode: char.charCodeAt(char.length - 1),
        }),
      );
    }
  }
}

// attach canvas to module
window.addEventListener("load", () => {
  showOverlay("loading");

  const status = document.getElementById("status");
  Module["canvas"] = document.getElementById("canvas");
  Module["setStatus"] = (s) => {
    status.textContent = s === "" ? "Initializing..." : s;
  };

  // hook up our text input
  const textInput = document.getElementById("textinput");

  // ignore composition text, only get end result
  textInput.addEventListener("compositionend", addInput);
  textInput.addEventListener("input", (e) => {
    if (e.inputType == "deleteContentBackward") {
      const ev = {
        isComposing: e.isComposing,
        code: "Backspace",
      };
      // keypress does not send backspace events
      window.dispatchEvent(new KeyboardEvent("keydown", ev));
      window.dispatchEvent(new KeyboardEvent("keyup", ev));
    } else if (!e.isComposing) addInput(e);
  });
});

function handleError(e) {
  if (started) {
    document.getElementById("exit_status").textContent = e.message;
    showOverlay("exit_error");
  } else {
    Module["setStatus"](e.message || e.reason);
    showOverlay("loading");
  }
  console.error(e.error || e.reason);
}

window.addEventListener("error", handleError);
window.addEventListener("unhandledrejection", handleError);
