// ===== SPLASH SCREEN =====
(function initSplash() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  document.body.classList.add('splash-active');

  // Fade out after 2.8s
  setTimeout(() => {
    splash.classList.add('fade-out');
  }, 2800);

  // Hide and unlock scroll after fade
  setTimeout(() => {
    splash.classList.add('hidden');
    document.body.classList.remove('splash-active');
    // NOTE: cannot auto-play audio — browser requires a user click first
    // The avatar mouth animation hint pulses to invite user to click the button
    if (muteBtn) muteBtn.style.animation = 'mutePulse 1.5s ease-in-out 3';
  }, 3700);
})();


// ===== TALKING AVATAR + VOICE =====
const mouthOverlay = document.getElementById('mouth-overlay');
const soundRings   = document.getElementById('sound-rings');
const muteBtn      = document.getElementById('mute-btn');
const muteLabel    = document.getElementById('mute-label');
const iconMuted    = document.getElementById('icon-muted');
const iconUnmuted  = document.getElementById('icon-unmuted');

let isTalking = false;
let talkTimer  = null;
let utterance  = null;

// The speech text — cinematic "About Me" video style
const introText = `
What if your software could think for itself?

My name is Gandhi Manikandan. I'm an AI Developer — and I don't just write code. I build systems that reason, plan, and act on their own.

I'm pursuing B.Tech in Artificial Intelligence and Data Science at SRM TRP Engineering College, with a CGPA of 8 point 0 9 out of 10.

At Prodapt Solutions, I engineered tool-calling LLM agents that automated enterprise delivery workflows — reducing manual handoffs across entire reporting pipelines.

I've shipped five production-grade AI projects. Aether — an autonomous browser agent that navigates live websites with zero hardcoded rules. A multi-agent NOC system using LangGraph that detects anomalies and auto-generates incident reports. An AI-augmented SDLC platform that embeds LLM agents at every phase of software development. And MineGuard AI — a real-time mine safety system powered by YOLOv11 and live sensor data.

My stack? Python. LangChain. LangGraph. React. Flask. MongoDB. And a passion for building things that actually work.

Two hundred plus LeetCode problems solved. Four hundred plus on CodeChef. Twenty four public repositories on GitHub.

I don't just follow AI trends. I build with them.

If you're looking for someone who ships autonomous AI systems — let's talk.
`;


function showTalkingVisuals() {
  if (mouthOverlay) mouthOverlay.classList.add('talking');
  if (soundRings)   soundRings.classList.add('active');
  if (muteBtn)      muteBtn.classList.add('is-talking');
  if (muteLabel)    muteLabel.textContent = 'MUTE SOUND';
  if (iconMuted)    iconMuted.style.display   = 'none';
  if (iconUnmuted)  iconUnmuted.style.display = '';
}

function hideTalkingVisuals() {
  if (mouthOverlay) mouthOverlay.classList.remove('talking');
  if (soundRings)   soundRings.classList.remove('active');
  if (muteBtn)      muteBtn.classList.remove('is-talking');
  if (muteLabel)    muteLabel.textContent = 'UNMUTE REEL';
  if (iconMuted)    iconMuted.style.display   = '';
  if (iconUnmuted)  iconUnmuted.style.display = 'none';
  isTalking = false;
}

function startTalking() {
  if (isTalking) return;

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  isTalking = true;
  showTalkingVisuals();

  // Build the utterance
  utterance = new SpeechSynthesisUtterance(introText);
  utterance.volume = 1.0;

  // Pick a MALE English voice
  const voices = window.speechSynthesis.getVoices();

  // Priority list of known male voice name keywords across browsers
  const maleKeywords = [
    'Male', 'David', 'James', 'Daniel', 'Alex', 'Google UK English Male',
    'Google US English', 'Microsoft David', 'Microsoft James',
    'Microsoft Guy', 'Aaron', 'Fred', 'Bruce', 'Albert', 'Rishi', 'Moira',
    'Thomas', 'Jorge', 'Carlos', 'Oliver', 'Arthur'
  ];

  let maleVoice =
    // 1. Exact keyword match in name, English language
    voices.find(v => v.lang.startsWith('en') && maleKeywords.some(k => v.name.includes(k))) ||
    // 2. Any English voice not containing "Female" or "woman" or female names
    voices.find(v => v.lang.startsWith('en') && !/female|woman|zira|hazel|susan|victoria|karen|samantha|fiona|tessa|veena|Monica|Nicky/i.test(v.name)) ||
    // 3. Any English voice as last resort
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0];

  if (maleVoice) utterance.voice = maleVoice;

  // Force lower pitch + slower dramatic pace for video reel feel
  utterance.pitch  = 0.75;
  utterance.rate   = 0.88;   // slower = more dramatic, like a voiceover

  // When speech ends naturally — stop visuals
  utterance.onend = () => hideTalkingVisuals();

  // Safety fallback — longer script needs ~70s
  talkTimer = setTimeout(stopTalking, 75000);

  window.speechSynthesis.speak(utterance);
}

function stopTalking() {
  clearTimeout(talkTimer);
  window.speechSynthesis.cancel();
  hideTalkingVisuals();
}

// Some browsers load voices async — wait for them
if (typeof window.speechSynthesis !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => { /* voices ready */ };
}

// Toggle on button click
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    isTalking ? stopTalking() : startTalking();
  });
}


// ===== NAVBAR SCROLL =====
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.skill-card, .expertise-card, .project-card, .timeline-item, .about-content, .about-image-wrap'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ===== HAMBURGER MENU =====
const hamburger         = document.getElementById('hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.contains('mobile-open');
    if (isOpen) {
      navLinksContainer.classList.remove('mobile-open');
    } else {
      navLinksContainer.classList.add('mobile-open');
    }
  });

  // Close on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('mobile-open');
    });
  });
}

// ===== CONTACT FORM =====
const contactSubmit = document.getElementById('contact-submit');
if (contactSubmit) {
  contactSubmit.addEventListener('click', () => {
    const first   = (document.getElementById('contact-firstname')?.value || '').trim();
    const email   = (document.getElementById('contact-email')?.value || '').trim();
    const message = (document.getElementById('contact-message')?.value || '').trim();

    if (!first || !email || !message) {
      contactSubmit.textContent = 'Please fill required fields!';
      setTimeout(() => { contactSubmit.textContent = 'Send Message'; }, 2500);
      return;
    }

    contactSubmit.textContent = 'Message Sent! ✓';
    contactSubmit.style.background = '#1a1a2e';
    contactSubmit.style.color = '#fff';

    setTimeout(() => {
      contactSubmit.textContent = 'Send Message';
      contactSubmit.style.background = '';
      contactSubmit.style.color = '';
      ['contact-firstname','contact-lastname','contact-email','contact-message']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    }, 3000);
  });
}

// ===== SKILL TAG HOVER STAGGER =====
document.querySelectorAll('.skill-card').forEach(card => {
  card.querySelectorAll('.skill-tags span').forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 30}ms`;
  });
});

// ===== PROJECT CARD TILT EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect    = card.getBoundingClientRect();
    const rotateX = (((e.clientY - rect.top)  / rect.height) - 0.5) * -8;
    const rotateY = (((e.clientX - rect.left) / rect.width)  - 0.5) *  8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
