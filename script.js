const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = null;

// IMAGE UPLOAD (COLOR IMAGE ONLY)
imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = function () {
        canvas.width = 128;
        canvas.height = 128;

        // draw color image
        ctx.drawImage(img, 0, 0, 128, 128);

        // store original image
        originalImage = ctx.getImageData(0, 0, 128, 128);
    };

    img.src = URL.createObjectURL(file);
});

// CONVERT TO GRAYSCALE FUNCTION
function convertToGrayscale() {
    let imageData = ctx.getImageData(0, 0, 128, 128);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);
}

// HIDE CHARACTER
document.getElementById("hideBtn").addEventListener("click", function () {
    const ch = document.getElementById("charInput").value;

    if (ch.length !== 1) {
        alert("Please enter exactly ONE character");
        return;
    }

    if (!originalImage) {
        alert("Please upload an image first");
        return;
    }

    // convert to grayscale ONLY NOW
    convertToGrayscale();

    let binary = ch.charCodeAt(0).toString(2).padStart(8, '0');
    let imageData = ctx.getImageData(0, 0, 128, 128);
    let data = imageData.data;

    for (let i = 0; i < 8; i++) {
        data[i * 4] = (data[i * 4] & 254) | binary[i];
    }

    ctx.putImageData(imageData, 0, 0);
    alert("Character hidden successfully (Image converted to B&W)");
});

// REVEAL + SPEAK
document.getElementById("revealBtn").addEventListener("click", function () {
    let imageData = ctx.getImageData(0, 0, 128, 128);
    let data = imageData.data;

    let binary = "";
    for (let i = 0; i < 8; i++) {
        binary += (data[i * 4] & 1);
    }

    let hiddenChar = String.fromCharCode(parseInt(binary, 2));
    document.getElementById("outputChar").innerText = hiddenChar;

    let utterance = new SpeechSynthesisUtterance(hiddenChar);
    speechSynthesis.speak(utterance);
});
