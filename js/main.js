// ==========================================================
// 各種初期化
// ==========================================================
// aceEditor
const editor = ace.edit("editor");
editor.setTheme("ace/theme/xcode");
editor.session.setMode("ace/mode/python");
const nowUrl = new URL(location.href);
const params = nowUrl.searchParams;

if (params.get("code")) {
  const paramCode = params.get("code");
  editor.setValue(decodeURIComponent(escape(atob(paramCode))));
} else {
  editor.setValue(`def setup():
    createCanvas(500, 500)

def draw():
    diameter = sin(frameCount / 60) * 50 + 50
    fill("blue")
    ellipse(100, 100, diameter, diameter)`);
}

document.addEventListener("DOMContentLoaded", function () { 
  const executeBtn = document.getElementById("excute-btn");
  const clearBtn = document.getElementById("clear-btn");
  const shareBtn = document.getElementById("share-btn");
  //// Event functions
  function runCode() {
    document.getElementById("sketch-holder").innerHTML = "";
    const userCode = editor.getValue();

    // from pyp5js
    window.runSketchCode(userCode);
  }

  executeBtn.addEventListener("click", () => {
    if (window.instance) {
      try {
        runCode();
        document.getElementById("console-holder").innerText = window.STD_OUT.join(`\n`);
      } catch(err) {
        var e = err.toString().split('"<exec>",')[1];
        window.STD_ERR.push(`<エラーメッセージ>
${ e }`);
        document.getElementById("console-holder").innerText = window.STD_ERR;
      }
      } else {
        window.alert(
          "Pyodide is still loading.\nPlease, wait a few seconds and try to run it again."
        );
      }
      console.log("execute");
  });
  clearBtn.addEventListener("click", () => {
    if (window.instance) {
      document.getElementById("sketch-holder").innerHTML = "";
      window.instance.remove();
    }
  });
  shareBtn.addEventListener("click", () => {
    console.log("do it")
    if (window.instance) {
      const baseUrl = this.location.host;
      const code = editor.getValue();
      const encodedCode = btoa(unescape(encodeURIComponent(code)));
      let url = `${ baseUrl }/py-draw?code=${ encodedCode }`;
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(url).then(function() {
          alert("URLをクリップボードにコピーしました");
        });
      } 
    }
  });
});

function toggleDisplayOutputSpace() {
  const toggler = document.getElementById("toggler");
  const sketchContainer = document.getElementById("sketch-container");
  const consoleContainer = document.getElementById("console-container");
  if (toggler.checked) {
    sketchContainer.classList.add("hidden");
    consoleContainer.classList.remove("hidden");
  } else {
    sketchContainer.classList.remove("hidden");
    consoleContainer.classList.add("hidden");
  }
}

function clearConsole() {
  document.getElementById("console-holder").innerHTML = "";
}