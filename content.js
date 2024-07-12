chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.message);
  if (request.message == "extract") {
    sendTextToApi();
  }
});

function sendTextToApi() {
  const content = extractText();
  if (content == null) return null;
  showLoader();
  fetch("http://127.0.0.1:8000/api/fact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ article: content }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data length: " + data[0].data);
      hideLoader();
      
      if (data.length > 0) {
        findNMarkP(data);
        document.body.style.background = "red";
      }
    })
    .catch((error) => console.error("Error:", error));
}

function extractText() {
  const paragraphs = document.getElementsByTagName("p");
  let content = "";
  for (let i = 0; i < paragraphs.length; i++) {
    content += paragraphs[i].innerText + "\n";
  }
  if (content.length > 1) {
    console.log(content);
    return content;
  } else {
    console.log(null);
    return null;
  }
}

function findNMarkP(jsonData) {
  // Get all paragraph elements on the page
  const paragraphs = document.querySelectorAll("p");
  for (i = 0; i < jsonData.length; i++) {
    var source = jsonData[i].source;
    if (!source.startsWith("http")) source = "https://" + source;
    paragraphs.forEach((paragraph) => {
      // Check if the paragraph contains the text we're looking for
      if (paragraph.textContent.includes(jsonData[i].data)) {
        // Create a new span element
        var link = document.createElement("a");
        link.classList.add("highlight-red");
        link.textContent = jsonData[i].data;
        link.setAttribute("href", source);
        link.setAttribute("target", "_blank");
        // Find the position of the text within the paragraph
        var index = paragraph.textContent.indexOf(jsonData[i].data);
        var beforeText = paragraph.textContent.slice(0, index);
        var afterText = paragraph.textContent.slice(
          index + jsonData[i].data.length
        );

        // Clear the paragraph's existing content
        paragraph.textContent = "";

        // Append the parts before, the span, and the parts after the text
        paragraph.appendChild(document.createTextNode(beforeText));
        paragraph.appendChild(link);
        paragraph.appendChild(document.createTextNode(afterText));

        link.setAttribute("data-source", source);
      }
    });
  }
}

/** Loader while user waits for server response */

function showLoader() {
  // Create a loader element
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.id = "custom-loader"; // Set an ID for easy removal
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById("custom-loader");
  if (loader) {
    loader.remove();
  }
}

/** Tooltip  */

/*  Global text search through the whole document, not just the paragraphs,
 **  not used right now cause extractText function collects onyly paragraphs now
 **  Change later ? */

function highlightTextDoc(textToFind) {
  // Function to create and return a span element with the specified text and styling
  function createHighlightSpan(text) {
    const span = document.createElement("span");
    span.style.color = "red";
    span.textContent = text;
    return span;
  }

  // Function to walk through the DOM tree and process text nodes
  function walkTree(node) {
    // If the node is a text node and contains the text to find
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue.includes(textToFind)
    ) {
      // Split the text node into three parts: before, the text to find, and after
      const index = node.nodeValue.indexOf(textToFind);
      const beforeText = node.nodeValue.slice(0, index);
      const matchText = node.nodeValue.slice(index, index + textToFind.length);
      const afterText = node.nodeValue.slice(index + textToFind.length);

      // Create a document fragment to hold the new nodes
      const fragment = document.createDocumentFragment();

      // Create and append the text nodes and the highlighted span
      if (beforeText) fragment.appendChild(document.createTextNode(beforeText));
      fragment.appendChild(createHighlightSpan(matchText));
      if (afterText) fragment.appendChild(document.createTextNode(afterText));

      // Replace the original text node with the new fragment
      node.parentNode.replaceChild(fragment, node);
    } else {
      // If the node is not a text node, recursively walk its children
      for (let i = 0; i < node.childNodes.length; i++) {
        walkTree(node.childNodes[i]);
      }
    }
  }

  // Start walking the DOM tree from the document body
  walkTree(document.body);
}
