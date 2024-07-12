document.addEventListener("DOMContentLoaded", init);

function init() {
  const btn = document.getElementById("checkBtn");
  btn.addEventListener("click", extractSignal);
}

function extractSignal() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "extract" });
  });
}





/** HELLO **/
function extractAndSendSelectedText() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    fetch("http://localhost:8000/api/fact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article: selectedText }),
    })
      .then((response) => response.json())
      .then((data) => {
        chrome.runtime.sendMessage({ action: "alert", message: data.status }); // Send a message to content.js
      })
      .catch((error) => console.error("Error:", error));
  } else {
    alert("Please select some text to fact-check.");
  }
}
