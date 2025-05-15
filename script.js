const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let fontMap = {};

canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseout", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function saveDrawing() {
  const char = document.getElementById("char").value;
  if (!char) return alert("Enter a character to save!");

  const image = canvas.toDataURL("image/png");
  fontMap[char] = image;
  clearCanvas();
  renderPreview();
}

function renderPreview() {
  const text = document.getElementById("previewText").value;
  const area = document.getElementById("previewArea");
  area.innerHTML = "";

  for (let char of text) {
    const img = document.createElement("img");
    img.className = "preview-char";
    img.src = fontMap[char] || "";
    area.appendChild(img);
  }
}

const glyphs = [];

function addCharacter(char, pathData) {
  glyphs.push(new opentype.Glyph({
    name: char,
    unicode: char.charCodeAt(0),
    advanceWidth: 600,
    path: opentype.Path.fromSVG(pathData)
  }));
}

function downloadFont() {
  if (Object.keys(fontMap).length === 0) return alert("No characters saved!");

  const zip = new JSZip();

  for (let char in fontMap) {
    const base64Data = fontMap[char].split(",")[1];
    const filename = `${char}.png`;
    zip.file(filename, base64Data, { base64: true });
  }

  zip.generateAsync({ type: "blob" }).then((blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "MyCustomFontImages.zip";
    link.click();
  });
}

