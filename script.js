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


// ===== REAL VIDEO AVATAR CONTROLS =====
const avatarVideo  = document.getElementById('avatar-video');
const soundRings   = document.getElementById('sound-rings');
const muteBtn      = document.getElementById('mute-btn');
const muteLabel    = document.getElementById('mute-label');
const iconMuted    = document.getElementById('icon-muted');
const iconUnmuted  = document.getElementById('icon-unmuted');

let videoUnmuted = false;

function setUnmutedUI(unmuted) {
  videoUnmuted = unmuted;
  if (soundRings)  soundRings.classList.toggle('active', unmuted);
  if (muteBtn)     muteBtn.classList.toggle('is-talking', unmuted);
  if (muteLabel)   muteLabel.textContent = unmuted ? 'MUTE REEL' : 'UNMUTE REEL';
  if (iconMuted)   iconMuted.style.display   = unmuted ? 'none' : '';
  if (iconUnmuted) iconUnmuted.style.display = unmuted ? '' : 'none';
}

// Ensure video plays on load (autoplay muted)
if (avatarVideo) {
  avatarVideo.muted = true;
  avatarVideo.play().catch(() => {});

  // Pulse the button after splash to invite interaction
  setTimeout(() => {
    if (muteBtn) muteBtn.style.animation = 'mutePulse 1.5s ease-in-out 3';
  }, 3800);
}

// Toggle mute/unmute on button click
if (muteBtn && avatarVideo) {
  muteBtn.addEventListener('click', () => {
    if (videoUnmuted) {
      // Mute
      avatarVideo.muted = true;
      setUnmutedUI(false);
    } else {
      // Unmute — restart from beginning for a clean experience
      avatarVideo.currentTime = 0;
      avatarVideo.muted = false;
      avatarVideo.loop = false;
      avatarVideo.play().catch(() => {});
      setUnmutedUI(true);

      // When video ends, go back to muted loop
      avatarVideo.onended = () => {
        avatarVideo.muted = true;
        avatarVideo.loop = true;
        avatarVideo.play().catch(() => {});
        setUnmutedUI(false);
      };
    }
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
