function goHome() {
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.add("show");
});
let history = [];
let redoStack = [];

function saveState() {
  const resumeContent = document.getElementById("resume").cloneNode(true);
  history.push(resumeContent);
  redoStack = [];
}
function undo() {
  if (history.length > 0) {
    const lastState = history.pop();
    redoStack.push(document.getElementById("resume").cloneNode(true));
    restoreState(lastState);
  }
}

// Redo the last undone action
function redo() {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    history.push(document.getElementById("resume").cloneNode(true));
    restoreState(nextState);
  }
}

// Restore a saved state
function restoreState(state) {
  const resumeContainer = document.getElementById("resume");
  resumeContainer.replaceWith(state);
  state.id = "resume";
  addEventListeners();
}
// Handle the Add Link button click
let selectedRange = null;
let mainContent = document.querySelector(".main-content")
document.getElementById("addlink").addEventListener("click", function () {
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;

    if (
      parentElement &&
      parentElement.getAttribute("contenteditable") === "true"
    ) {
      selectedRange = range;
      document.getElementById("selected-text").textContent =
        selection.toString();
      const popup = document.getElementById("link-popup");
      popup.style.display = "block";
     
      mainContent.style.cssText = "filter: blur(5px); background-color: rgba(91, 88, 91, 0.77);";

     
    } else {
      alert("Enable edit mode to add a link.");
    }
  } else {
    alert("Please select some text to add a link.");
  }
});

document.getElementById("ok-button").onclick = function () {
  const linkURL = document.getElementById("link-input").value;

  if (linkURL && selectedRange) {
    const anchor = document.createElement("a");
    anchor.href = linkURL;
    anchor.target = "_blank";
    anchor.textContent = selectedRange.toString();
    selectedRange.deleteContents();
    selectedRange.insertNode(anchor);

    selectedRange = null;
    document.getElementById("link-popup").style.display = "none";
    document.getElementById("link-input").value = "";
    mainContent.style.cssText = "";
  } else {
    document.getElementById("link-input").placeholder =
      "Please enter a valid URL";
  }
};

document.getElementById("cancel-button").onclick = function () {
  document.getElementById("link-popup").style.display = "none";
  document.getElementById("link-input").value = "";
  mainContent.style.cssText = "";
  selectedRange = null;
};

function addEventListeners() {
  document
    .querySelectorAll(".delete-btn")
    .forEach((btn) => btn.addEventListener("click", () => deleteText(btn)));
  document
    .querySelectorAll(".add-btn")
    .forEach((btn) => btn.addEventListener("click", () => addBullet(btn)));
}

// Delete a section
function deleteText(button) {
  const section = button.parentElement.parentElement;
  section.remove();
}
// Delete a specific text
function deleteSection(button) {
  const listItem = button.closest("li");
  if (listItem) {
    listItem.remove();
  } else {
    button.parentElement.remove();
  }
}
let editBtn = document.querySelector(".edit-btn");
let isEditing = false;
let originalColor = editBtn.style.backgroundColor;

editBtn.addEventListener("click", function () {
  const editingContents = document.querySelectorAll(".editing-content");
  const resume = document.querySelector(".a4");
  if (!isEditing) {
    editingContents.forEach((content) => {
      content.contentEditable = "true";
    });
    isEditing = true;
    editBtn.style.backgroundColor = "red";
    resume.style.border = "1px dashed red";
  } else {
    editingContents.forEach((content) => {
      content.contentEditable = "false";
    });
    isEditing = false;
    editBtn.style.backgroundColor = originalColor;
    resume.style.border = "";
  }
});

function editText(button) {
  const li = button.closest("li");
  const editingContent = li.querySelector(".editing-content");
  editingContent.contentEditable = true;
  editingContent.focus();
}

function getMaxHeight() {
  if (window.innerWidth <= 768) {
    return 450 * 3.77937;
  } else {
    return 325 * 3.77937;
  }
}

function canAddNewItem() {
  const resume = document.getElementById("resume");
  const maxHeight = getMaxHeight();
  const totalHeight = resume.scrollHeight;
  return totalHeight < maxHeight;
}

function addBullet(button) {
  const ul = button.parentElement;

  if (!canAddNewItem()) {
    alert("Page is full. Cannot add more items.");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML =
    '<span class="editing-content">Add new items</span><span class="date"><span class="editing-content">2024-2025</span><span class="controls"><button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span></span><span class="controls"> <button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span>';

  if (ul.id === "education") {
    li.classList.add("margin-bottom");
    li.innerHTML =
      '<span class="editing-content"><b>Graduation</b></span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span><span class="date"><span class="editing-content">July 2023</span><span class="controls"><button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span></span><br /><span><span class="editing-content">ABC college - Patna<br />CGPA: 9.08 or 83.33%</span><span class="controls"><button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span>';

    li.style.marginTop = "10px";
  }
  if (ul.id === "skills") {
    li.innerHTML =
      '<span class="editing-content">Add new skills</span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  if (ul.id === "certifications") {
    li.innerHTML =
      '<span class="editing-content">Add new Certification</span><span class="date"><span class="editing-content">July 2023</span><span class="controls"><button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span></span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  if (ul.id === "hobbies") {
    li.innerHTML =
      '<span class="editing-content">Add new hobbies</span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  if (ul.id === "experiences") {
    li.innerHTML =
      '<span class="editing-content">Add new experience</span><span class="date"><span class="editing-content">July 2023</span><span class="controls"><button class="delete-btn" onclick="deleteText(this)"><i class="fa-solid fa-trash"></i></button></span></span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  if (ul.id === "projects") {
    li.innerHTML =
      '<span class="editing-content">Add new projects</span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  if (ul.id === "languages") {
    li.innerHTML =
      '<span class="editing-content">Add new languages</span><span class="controls"><button class="delete-btn" onclick="deleteSection(this)"><i class="fa-solid fa-trash"></i></button></span>';
  }
  ul.insertBefore(li, button);

  if (isEditing) {
    const newEditingContents = li.querySelectorAll(".editing-content");
    newEditingContents.forEach((content) => {
      content.contentEditable = "true";
    });
  }
  saveState();
}
// Generate PDF while hiding controls

document.getElementById("downloadBtn").addEventListener("click", function () {
  if (!navigator.onLine) {
    alert("Please connect to the internet before downloading.");
    return;
  }

  const a4Size = document.getElementById("resume");
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const addButtons = document.querySelectorAll(".add-btn");

  // Switch to PDF mode
  a4Size.classList.remove("editing-on");
  a4Size.classList.add("fixed-height");
  hideControls(deleteButtons, addButtons);

  const { jsPDF } = window.jspdf;

  // Create a jsPDF instance
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const resume = document.getElementById("resume");

  // Convert HTML to PDF using jsPDF
  pdf.html(resume, {
    callback: function (pdfInstance) {
      // Add clickable links
      const links = resume.getElementsByTagName("a");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];

        // Get link position
        const rect = link.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        const width = rect.width;
        const height = rect.height;

        // Convert coordinates to PDF units
        const pdfX =
          (x * pdf.internal.pageSize.getWidth()) / resume.offsetWidth;
        const pdfY =
          (y * pdf.internal.pageSize.getHeight()) / resume.offsetHeight;

        // Add link to PDF
        pdfInstance.link(pdfX, pdfY, width, height, {
          url: link.href,
          tooltip: link.textContent,
        });
      }

      pdfInstance.save("resume.pdf");

      // Restore editing mode
      resume.classList.remove("fixed-height");
      resume.classList.add("editing-on");
      showControls(deleteButtons, addButtons);
    },
    x: 0.5,
    y: 7,
    html2canvas: {
      scale: 0.25,
      useCORS: true,
    },
  });
});

// Helper function to hide controls
function hideControls(deleteButtons, addButtons) {
  const controlSpans = document.querySelectorAll(".controls");
  controlSpans.forEach((span) => {
    span.style.display = "none";
    resume.style.border = "none";
  });
  for (let btn of deleteButtons) btn.style.display = "none";
  for (let btn of addButtons) btn.style.display = "none";
}

// Helper function to show controls
function showControls(deleteButtons, addButtons) {
  const controlSpans = document.querySelectorAll(".controls");
  controlSpans.forEach((span) => {
    span.style.display = "";
  });
  // Show buttons again
  for (let btn of deleteButtons) btn.style.display = "";
  for (let btn of addButtons) btn.style.display = "";
  resume.style.border = "";
}

saveState();

//bold text
function makeTextBold() {
  document.execCommand("bold");
}

let currentFontSize = 16;

function updateFontSizeDisplay(fontSize) {
  document.getElementById("currentFontSize").textContent = `${fontSize}px`;
}

function changeFontSize(delta) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const parentElement = range.startContainer.parentNode;
      const computedStyle = window.getComputedStyle(parentElement);
      const currentSize = parseInt(computedStyle.fontSize);
      let newSize = currentSize + delta;
      if (newSize < 12) newSize = 12;
      if (newSize > 40) newSize = 40;
      parentElement.style.fontSize = newSize + "px";
      currentFontSize = newSize;
      updateFontSizeDisplay(currentFontSize);
    }
  }
}

// Function to update the displayed font size based on the selected text
function updateSelectedFontSize() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const parentElement = range.startContainer.parentNode;
      const computedStyle = window.getComputedStyle(parentElement);
      const selectedSize = parseInt(computedStyle.fontSize);
      updateFontSizeDisplay(selectedSize);
    }
  }
}

// Function to set the initial font size based on selected text
function setInitialFontSize() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const parentElement = range.startContainer.parentNode;
      const computedStyle = window.getComputedStyle(parentElement);
      currentFontSize = parseInt(computedStyle.fontSize);
      updateFontSizeDisplay(currentFontSize);
    } else {
      updateFontSizeDisplay(currentFontSize);
    }
  } else {
    updateFontSizeDisplay(currentFontSize);
  }
}
document.addEventListener("selectionchange", updateSelectedFontSize);
document.querySelectorAll('[contentEditable="true"]').forEach((element) => {
  element.addEventListener("focus", () => {
    setInitialFontSize();
  });
});
window.onload = setInitialFontSize;
