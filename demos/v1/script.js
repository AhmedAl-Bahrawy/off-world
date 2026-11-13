const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const rail = $("#railProgress");
const railCurrent = $("#railCurrent");
const scenes = $$(".scene");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? scrollY / max : 0;
  rail.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
  let active = 0;
  scenes.forEach((scene, i) => {
    if (scene.getBoundingClientRect().top < innerHeight * 0.55) active = i;
  });
  railCurrent.textContent = String(active).padStart(2, "0");
}
addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

$("#beginBtn").addEventListener("click", () =>
  $("#collapse").scrollIntoView({ behavior: "smooth" }),
);
$("#contrastToggle").addEventListener("click", () =>
  document.body.classList.toggle("high-contrast"),
);
document.addEventListener("pointermove", (e) => {
  const glow = $(".cursor-glow");
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

let selectedChoice = null;
$$(".choice-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (selectedChoice) return;
    selectedChoice = btn.dataset.choice;
    const result = $("#decisionResult");
    const eastStatus = $("#eastStatus");
    const delay = $("#transmissionDelay");
    if (selectedChoice === "cooperate") {
      eastStatus.textContent = "● AUTHORIZATION GRANTED";
      eastStatus.classList.remove("warning");
      delay.textContent = "DELAY: 00 YEARS";
      result.innerHTML = `<span class="result-tag">OUTCOME A / COOPERATION</span><strong>The two fragments are joined.</strong> The signal is transmitted without political delay. For one brief moment, the rival blocs choose a shared future. The message leaves Earth in 2231.`;
    } else {
      eastStatus.textContent = "● KEY ACQUIRED / COERCION";
      delay.textContent = "DELAY: 10 YEARS";
      result.innerHTML = `<span class="result-tag">OUTCOME B / COERCION</span><strong>The key is taken by force.</strong> A Western operative inside the Eastern bloc secures the missing fragment. The signal is finally transmitted — ten years later. The delay becomes part of the message's history.`;
    }
    result.hidden = false;
    $$(".choice-btn").forEach((b) => {
      b.disabled = true;
      b.style.opacity = b.dataset.choice === selectedChoice ? "1" : ".35";
      b.style.cursor = "default";
    });
  }),
);

const phrase = ["WE", "NEED", "HELP", "BEFORE", "WE", "DIE"];
let chosen = [];
function renderSlots() {
  const slots = $("#sentenceSlots");
  slots.innerHTML = "";
  if (!chosen.length) {
    const placeholder = document.createElement("span");
    placeholder.className = "slot-placeholder";
    placeholder.textContent = "SELECT WORD FRAGMENTS ABOVE";
    slots.append(placeholder);
  } else {
    chosen.forEach((word, i) => {
      const chip = document.createElement("button");
      chip.textContent = word;
      chip.title = "Remove this fragment";
      chip.addEventListener("click", () => {
        chosen.splice(i, 1);
        renderSlots();
      });
      slots.append(chip);
    });
  }
  $("#decodeHint").textContent =
    `LINGUISTIC CONFIDENCE: ${Math.round(12.4 + (chosen.length / 6) * 87.6)}%`;
  $("#decodeSuccess").hidden = chosen.join(" ") !== phrase.join(" ");
}
function resetPuzzle() {
  chosen = [];
  $$("#wordBank button").forEach((b) => b.classList.remove("used"));
  renderSlots();
}
$$("#wordBank button").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (btn.classList.contains("used") || chosen.length >= 6) return;
    chosen.push(btn.dataset.word);
    btn.classList.add("used");
    renderSlots();
  }),
);
$("#decodeReset").addEventListener("click", resetPuzzle);
renderSlots();

$("#restartBtn").addEventListener("click", () => {
  selectedChoice = null;
  $("#decisionResult").hidden = true;
  $$(".choice-btn").forEach((b) => {
    b.disabled = false;
    b.style.opacity = "1";
    b.style.cursor = "pointer";
  });
  $("#eastStatus").textContent = "● AUTHORIZATION PENDING";
  $("#eastStatus").classList.add("warning");
  $("#transmissionDelay").textContent = "DELAY: 00 YEARS";
  resetPuzzle();
  $("#opening").scrollIntoView({ behavior: "smooth" });
});

// Gentle reveal as chapters enter the viewport.
const revealTargets = $$(
  ".chapter-head, .split-layout, .key-console, .choice-panel, .signal-layout, .message-card, .decode-console, .journey-heading, .ship-scene, .arrival-visual, .final-reveal",
);
revealTargets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealTargets.forEach((el) => observer.observe(el));
