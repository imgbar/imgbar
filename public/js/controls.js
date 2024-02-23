"use strict";

function setDownloadLink() {
  function downloadMeme() {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.innerHTML = "Download";
    link.id = "download-btn";
    link.click();
  }

  document
    .getElementById("download-btn")
    .addEventListener("click", downloadMeme);
}

export { setDownloadLink };
