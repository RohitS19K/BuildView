
const typingText = document.querySelector(".typing-text");
const phrases = ["Web Development", "SEO & Digital Marketing", "Full-Scale Brand Transformation"];
let i = 0, j = 0, currentPhrase = [], isDeleting = false;

function loop() {
  typingText.innerHTML = currentPhrase.join("");
  if (!isDeleting && j <= phrases[i].length) {
    currentPhrase.push(phrases[i][j]);
    j++;
  }
  if (isDeleting && j <= phrases[i].length) {
    currentPhrase.pop(phrases[i][j]);
    j--;
  }
  if (j === phrases[i].length) {
    isDeleting = true;
  }
  if (isDeleting && j === 0) {
    currentPhrase = [];
    isDeleting = false;
    i++;
    if (i === phrases.length) i = 0;
  }
  setTimeout(loop, isDeleting ? 50 : 100);
}
loop();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in, .fade-up").forEach(el => {
  observer.observe(el);
});


  document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 0.1}s`;
          entry.target.classList.add("animate");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".category-card").forEach(card => {
      observer.observe(card);
    });
  });


  const slider = document.getElementById('slider');
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });

// footer

  document.querySelector(".subscribe-form button").addEventListener("click", function () {
    const input = document.querySelector(".subscribe-form input");
    if (!input.value.trim()) {
      alert("Please enter a valid email address.");
    } else {
      alert("Thanks for subscribing!");
    }
  });


