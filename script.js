/* Progressive enhancements: particle background, scroll reveal, tilt, modal, dark toggle, storage */
document.addEventListener('DOMContentLoaded', () => {
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Particles
  initParticles();

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(n => io.observe(n));

  // Card tilt
  document.querySelectorAll('.tilt, .card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(600px) rotateX(${(-y*6)}deg) rotateY(${x*8}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  // Modal interactions
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const modalSubmit = document.getElementById('modal-submit');
  const modalEvent = document.getElementById('modal-event');
  const modalName = document.getElementById('modal-name');
  const modalEmail = document.getElementById('modal-email');
  const modalMsg = document.getElementById('modal-msg');

  function openModal(eventName){
    modal.setAttribute('aria-hidden','false');
    modalEvent.textContent = eventName;
    modalEvent.dataset.event = eventName;
    modalName.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modalMsg.textContent = '';
  }

  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.open));
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  // Submit handler
  modalSubmit.addEventListener('click', ()=>{
    const name = modalName.value.trim();
    const email = modalEmail.value.trim();
    const eventName = modalEvent.dataset.event || '';
    if(!name || !email){ modalMsg.textContent = 'Please fill out name and email.'; return; }
    const regs = JSON.parse(localStorage.getItem('registrations')||'[]');
    regs.push({ name, email, event: eventName });
    localStorage.setItem('registrations', JSON.stringify(regs));
    modalMsg.textContent = 'Registered — thank you!';
    modalName.value = modalEmail.value = '';
  });

  // Inline form controls (bottom contact form)
  document.getElementById('submitBtn').addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const eventName = document.getElementById('event').value || 'General';
    if(!name||!email){ document.getElementById('msg').textContent='Please fill required fields'; return; }
    const regs = JSON.parse(localStorage.getItem('registrations')||'[]');
    regs.push({ name, email, event: eventName });
    localStorage.setItem('registrations', JSON.stringify(regs));
    document.getElementById('msg').textContent = 'Saved — thanks!';
  });
  document.getElementById('closeBtn').addEventListener('click', ()=>{
    document.getElementById('name').value = document.getElementById('email').value = '';
    document.getElementById('msg').textContent = '';
  });

  // Event buttons should populate the inline form event field when focused
  document.querySelectorAll('.card [data-open]').forEach(btn=>{
    btn.addEventListener('mouseenter', ()=> document.getElementById('event').value = btn.dataset.open);
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (dark)=>{
    document.documentElement.style.setProperty('--bg', dark? '#071226' : '#f7fbff');
    themeToggle.setAttribute('aria-pressed', String(dark));
    localStorage.setItem('dark', dark? '1':'0');
  }
  themeToggle.addEventListener('click', ()=> setTheme(localStorage.getItem('dark')!=='1'));
  if(localStorage.getItem('dark')==='1') setTheme(true);
});

/* Particle system (lightweight) */
function initParticles(){
  const canvas = document.getElementById('particle-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles=[];
  const resize = ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  window.addEventListener('resize', resize); resize();

  function create(){
    particles = Array.from({length: Math.floor((w*h)/90000)}, ()=>({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.6+0.6, vx:(Math.random()-.5)/2, vy:(Math.random()-.5)/2
    }));
  }
  create();

  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0; if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}