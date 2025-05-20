let uploadedFile;

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("upload");
const statusText = document.getElementById("status");

// Open file dialog on click
dropZone.addEventListener("click", () => fileInput.click());

// Handle file input change
fileInput.addEventListener("change", (event) => {
  handleFile(event.target.files[0]);
});

// Handle drag & drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.background = "rgba(255, 255, 255, 0.15)";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.background = "rgba(255, 255, 255, 0.05)";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.background = "rgba(255, 255, 255, 0.05)";
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// Set uploaded file
function handleFile(file) {
  if (file && file.name.endsWith(".docx")) {
    uploadedFile = file;
    statusText.innerText = `Selected: ${file.name}`;
  } else {
    alert("Please upload a valid .docx file.");
  }
}

async function convertToPDF() {
  if (!uploadedFile) {
    alert("Please select a .docx file first.");
    return;
  }

  statusText.innerText = "Converting...";

  const reader = new FileReader();
  reader.onload = async function (event) {
    const arrayBuffer = event.target.result;

    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      const text = result.value.replace(/<[^>]+>/g, ""); // Strip HTML

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(text, 180);
      pdf.text(lines, 10, 10);
      pdf.save(uploadedFile.name.replace(".docx", "") + ".pdf");

      statusText.innerText = "Conversion complete!";
    } catch (error) {
      console.error("Conversion failed:", error);
      statusText.innerText = "Failed to convert.";
    }
  };

  reader.readAsArrayBuffer(uploadedFile);
}
