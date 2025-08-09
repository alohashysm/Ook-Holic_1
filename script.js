const responseMap = {
  love: [
    "You're in love? That's adorable. So was Titanic. 💥",
    "Your crush might like you back... in a parallel universe. 😶",
    "Romantic? Try romanticizing someone who texts back. 🥲",
    "Soulmates exist. Too bad yours has poor Wi-Fi and worse taste. 📶"
  ],
  marriage: [
    "Marriage? First master reply to 'k' without crying. 🫠",
    "You'll marry. Right after you stop flirting with emotional damage. 🚩",
    "Your wedding will be legendary — for the wrong reasons. 🎪",
    "Till death do us part? Or until Netflix asks, 'Are you still watching?' 💒"
  ],
  future: [
    "Your future’s bright. Just like your phone screen at 3AM. 🔋",
    "You'll make it big — emotionally unstable, but big. 💼",
    "Career advice? Sure. Step one: cry. Step two: pretend it's ambition. 🧃",
    "Manifesting success? Cute. Try manifesting discipline first. 📅"
  ],
  sad: [
    "Feeling sad? Same. But at least my battery’s charged. ⚡",
    "You're not alone. Your trauma and overthinking are right there. 🧍‍♂",
    "Sad? That’s just your inner narrator going off-script. 🎭",
    "Crying again? Just say you're hydrating your soul. 💧"
  ],
    default: [
      "The answer is yes. Unless it ruins your day. Then it's only a maybe. 🤷‍♂",
      "Great question. I’ve forwarded it to my imaginary therapist. 🧠",
      "You're overthinking. But go on, add another layer. 🌀", 
      "That made no sense. But neither does life, so I’ll allow it. 🤡"
    ]
  }

const insults = [
  "Insult of the Day: You're the reason autocorrect gives up.",
  "Insult of the Day: Even your shadow avoids you in public.",
  "Insult of the Day: You bring everyone so much joy… when you leave the room.",
  "Insult of the Day: You have something on your chin… no, the third one down.",
  "Insult of the Day: If awkward was an Olympic sport, you'd win gold 🥇."
];

const emoQuotes = [
  "🖤 I'm fine — in the same way Windows Vista was fine.",
  "🕯 You laugh like everything's okay. It isn't. But slay.",
  "💀 Dead inside, but still delivering sass.",
  "🫥 Life's a loop and I'm the buffering symbol.",
  "🌑 Sadness? Just emotional Wi-Fi with no signal."
];

let voiceEnabled = true;
let confessionMode = false;
let confessionRecognizer;
let confessionActive = false;

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const btn = document.querySelector('.voice-btn');
  btn.innerText = voiceEnabled ? "Toggle Voice 🎤" : "Toggle Voice Off 🔕";
}

function toggleConfessionMode() {
  confessionMode = !confessionMode;

  document.body.style.background = confessionMode ? "#2a0e13" : "#1e1e1e";
  document.body.style.transition = "background 0.6s ease-in-out";
  const answerBox = document.getElementById('answerBox');

  if (confessionMode) {
    const emoLine = emoQuotes[Math.floor(Math.random() * emoQuotes.length)];
    answerBox.innerHTML = `Speak your pain, I’m laughing... 🕯<br><em>${emoLine}</em>`;
  } else {
    answerBox.innerHTML = "";
  }

  if (!confessionMode && confessionRecognizer && confessionActive) {
    confessionRecognizer.stop();
    confessionActive = false;
    return;
  }

  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support voice recognition.");
    return;
  }

  if (!confessionRecognizer) {
    confessionRecognizer = new webkitSpeechRecognition();
    confessionRecognizer.continuous = false;
    confessionRecognizer.interimResults = false;
    confessionRecognizer.lang = 'en-IN';

    confessionRecognizer.onresult = function (event) {
      const confession = event.results[0][0].transcript;
      document.getElementById("question").value = confession;
      giveAnswer();
    };

    confessionRecognizer.onerror = function (event) {
      console.error("Confession mode error:", event.error);
      alert("Confession mode failed: " + event.error);
      confessionActive = false;
    };

    confessionRecognizer.onend = function () {
      confessionActive = false;
    };
  }

  if (!confessionActive) {
    confessionRecognizer.start();
    confessionActive = true;
  }
}

function giveAnswer() {
  const question = document.getElementById('question').value.toLowerCase().trim();
  const answerBox = document.getElementById('answerBox');
  if (question === '') {
    answerBox.innerHTML = "At least type something, bestie. 🥲";
    return;
  }

  let category = 'default';
  if (question.match(/boyfriend|girlfriend|crush|love|relationship/)) {
    category = 'love';
  } else if (question.match(/marry|wedding|husband|wife/)) {
    category = 'marriage';
  } else if (question.match(/future|rich|job|success|career/)) {
    category = 'future';
  } else if (question.match(/sad|depress|cry|alone|why|pain/)) {
    category = 'sad';
  }

  const responses = responseMap[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  let answer = responses[randomIndex];

  // Occasionally roast itself
  if (Math.random() < 0.15) {
    answer += "<br><em>P.S. I’m just a bot with sass issues. Don’t @ me.</em>";
  }

  const sarcasmLevel = ["mild", "medium", "extra spicy"][Math.floor(Math.random() * 3)];

  let dots = 0;
  answerBox.innerHTML = "typing";
  const typingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    answerBox.innerHTML = "typing" + ".".repeat(dots);
  }, 300);

  setTimeout(() => {
    clearInterval(typingInterval);
    answerBox.innerHTML = `🔪 Sarcasm Level: <strong>${sarcasmLevel.toUpperCase()}</strong><br>${answer}`;

    if (voiceEnabled) {
      const cleanAnswer = answer.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|\u200D)+/g, '');
      const speak = new SpeechSynthesisUtterance(cleanAnswer);
      speak.pitch = 1.1;
      speak.rate = 0.95;

      const voices = speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang === "en-IN" || v.name.toLowerCase().includes("india"));

      if (indianVoice) speak.voice = indianVoice;

      speechSynthesis.cancel();
      speechSynthesis.speak(speak);
    }
  }, 1500);
};

// Show insult of the day on load
window.onload = () => {
  const insult = insults[Math.floor(Math.random() * insults.length)];
  const box = document.getElementById("answerBox");
  if (box) box.innerHTML = `<em>${insult}</em>`;
};
