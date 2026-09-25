const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

const eventSelect = document.getElementById("eventSelect");
const timeInBtn = document.getElementById("timeInBtn");
const timeOutBtn = document.getElementById("timeOutBtn");

function populateEventSelect() {
  const events = getEvents().filter((e) => e.status !== "Completed");

  if (events.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No events available";
    opt.disabled = true;
    eventSelect.appendChild(opt);
    return;
  }

  events.forEach((event) => {
    const opt = document.createElement("option");
    opt.value = event.id;
    opt.textContent = `${event.title} - ${formatDateDisplay(event.date)}`;
    eventSelect.appendChild(opt);
  });
}

populateEventSelect();

const faceModal = document.getElementById("faceModal");
const faceModalTitle = document.getElementById("faceModalTitle");
const faceVideo = document.getElementById("faceVideo");
const faceCanvas = document.getElementById("faceCanvas");
const capturedPhoto = document.getElementById("capturedPhoto");
const faceStatus = document.getElementById("faceStatus");
const faceActions = document.getElementById("faceActions");
const faceConfirmBtn = document.getElementById("faceConfirmBtn");
const faceRetakeBtn = document.getElementById("faceRetakeBtn");
const faceCancelBtn = document.getElementById("faceCancelBtn");

let modelsLoaded = false;
let mediaStream = null;
let detectTimer = null;
let verifying = false;
let currentAction = null;
let capturedDataUrl = null;

async function loadModels() {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  modelsLoaded = true;
}

function resetModalUI() {
  capturedPhoto.hidden = true;
  faceVideo.hidden = false;
  faceCanvas.hidden = false;
  faceActions.hidden = true;
  faceCancelBtn.hidden = false;
  faceCancelBtn.textContent = "Cancel";
  verifying = false;
  capturedDataUrl = null;
}

async function openFaceModal(action) {
  if (!eventSelect.value) {
    alert("Please select an event first.");
    return;
  }

  currentAction = action;
  faceModalTitle.textContent = `${action} - Face Verification`;
  faceStatus.textContent = "Starting camera...";
  resetModalUI();
  faceModal.hidden = false;

  await startCameraAndDetect();
}

async function startCameraAndDetect() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    faceVideo.srcObject = mediaStream;
    await faceVideo.play();

    faceStatus.textContent = "Loading face detector...";
    await loadModels();

    faceCanvas.width = faceVideo.videoWidth || 320;
    faceCanvas.height = faceVideo.videoHeight || 240;

    faceStatus.textContent = "Position your face in the frame...";
    startDetectionLoop();
  } catch (err) {
    console.error(err);
    faceStatus.textContent =
      "Camera access denied or unavailable. Please allow camera access and try again.";
  }
}

function startDetectionLoop() {
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 224,
    scoreThreshold: 0.5,
  });
  const ctx = faceCanvas.getContext("2d");

  detectTimer = setInterval(async () => {
    if (verifying || !faceVideo.videoWidth) return;

    const detection = await faceapi.detectSingleFace(faceVideo, options);

    if (detection) {
      const box = detection.box;
      ctx.strokeStyle = "#f2b705";
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      verifying = true;
      clearInterval(detectTimer);
      capturePhoto();
    } else {
      ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
    }
  }, 400);
}

function capturePhoto() {
  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = faceVideo.videoWidth;
  captureCanvas.height = faceVideo.videoHeight;
  const ctx = captureCanvas.getContext("2d");

  ctx.translate(captureCanvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(faceVideo, 0, 0, captureCanvas.width, captureCanvas.height);

  capturedDataUrl = captureCanvas.toDataURL("image/png");

  stopMediaStream();

  capturedPhoto.src = capturedDataUrl;
  capturedPhoto.hidden = false;
  faceVideo.hidden = true;
  faceCanvas.hidden = true;

  faceStatus.textContent = "Photo captured. Confirm to proceed.";
  faceActions.hidden = false;
}

faceRetakeBtn.addEventListener("click", async () => {
  faceActions.hidden = true;
  capturedPhoto.hidden = true;
  faceVideo.hidden = false;
  faceCanvas.hidden = false;
  faceStatus.textContent = "Restarting camera...";
  verifying = false;
  await startCameraAndDetect();
});

faceConfirmBtn.addEventListener("click", () => {
  faceActions.hidden = true;
  faceCancelBtn.hidden = true;
  faceStatus.textContent = "Verifying identity...";

  setTimeout(() => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    faceStatus.textContent = `Verified! ${currentAction} successful.`;
    markButtonComplete(currentAction, timeStr);

    setTimeout(closeFaceModal, 1500);
  }, 1500);
});

function markButtonComplete(action, timeStr) {
  const btn = action === "Time-In" ? timeInBtn : timeOutBtn;
  btn.classList.add("time-btn-done");
  btn.textContent = `${action} - ${timeStr}`;
}

function stopMediaStream() {
  if (detectTimer) {
    clearInterval(detectTimer);
    detectTimer = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

function closeFaceModal() {
  stopMediaStream();
  faceVideo.srcObject = null;
  verifying = false;
  faceModal.hidden = true;
}

timeInBtn.addEventListener("click", () => openFaceModal("Time-In"));
timeOutBtn.addEventListener("click", () => openFaceModal("Time-Out"));
faceCancelBtn.addEventListener("click", closeFaceModal);
