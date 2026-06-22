document.addEventListener('DOMContentLoaded', function() {

  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.nav-dot');
  const progress = document.getElementById('progress');
  const counter  = document.getElementById('slide-counter');
  const btnPrev  = document.getElementById('btn-prev');
  const btnNext  = document.getElementById('btn-next');
  let current = 0;
  const total = slides.length;

  // ---- Video registry ----
  // id → { videoEl, playBtnEl, progEl, timeEl, progWrapEl }
  const vids = {};

  function regVid(id, videoId, btnId, progId, timeId, wrapId) {
    const v = document.getElementById(videoId);
    if (!v) return;
    vids[id] = {
      v,
      btn: document.getElementById(btnId),
      prog: document.getElementById(progId),
      time: document.getElementById(timeId),
    };
    v.addEventListener('timeupdate', () => {
      const r = vids[id];
      if (v.duration) {
        r.prog.style.width = (v.currentTime / v.duration * 100) + '%';
        r.time.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration);
      }
    });
    v.addEventListener('ended', () => {
      vids[id].btn.classList.remove('playing');
      vids[id].prog.style.width = '0%';
    });
  }

  function fmt(s) {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function toggleVid(id) {
    const r = vids[id];
    if (!r) return;
    if (r.v.paused) { r.v.play(); r.btn.classList.add('playing'); }
    else            { r.v.pause(); r.btn.classList.remove('playing'); }
  }

  function seekVid(id, e) {
    const r = vids[id];
    if (!r) return;
    const wrap = e.currentTarget;
    const rect = wrap.getBoundingClientRect();
    r.v.currentTime = ((e.clientX - rect.left) / rect.width) * r.v.duration;
  }

  // Register all videos
  regVid(2, 'vid2', 'playBtn2', 'prog2', 'time2');
  regVid(3, 'vid3', 'playBtn3', 'prog3', 'time3');
  regVid(4, 'vid4', 'playBtn4', 'prog4', 'time4');
  regVid(5, 'vid5', 'playBtn5', 'prog5', 'time5');

  // ---- Slide navigation ----
  function pauseAllVids() {
    Object.values(vids).forEach(r => {
      if (r.v && !r.v.paused) { r.v.pause(); r.btn.classList.remove('playing'); }
    });
  }

  function goToSlide(n) {
    pauseAllVids();
    slides[current].classList.remove('active');
    slides[current].classList.add('prev');
    dots[current].classList.remove('active');
    setTimeout(() => slides[current].classList.remove('prev'), 600);
    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    progress.style.width = ((current + 1) / total * 100) + '%';
    counter.textContent = (current + 1) + ' / ' + total;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  function changeSlide(dir) {
    const n = current + dir;
    if (n >= 0 && n < total) goToSlide(n);
  }

  btnNext.addEventListener('click', () => changeSlide(1));
  btnPrev.addEventListener('click', () => changeSlide(-1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); changeSlide(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); changeSlide(-1); }
  });

  // ---- Responsive scaling ----
  function scaleViewport() {
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    document.getElementById('viewport').style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
  }
  window.addEventListener('resize', scaleViewport);
  scaleViewport();

  // Init progress
  progress.style.width = (1 / total * 100) + '%';

  // Global tooltip — follows mouse, outside scaled viewport
  var gTooltip = document.getElementById('global-tooltip');
  var _ttContent = '';
  document.addEventListener('mousemove', function(e) {
    if (gTooltip.style.display === 'none') return;
    var bw = 260;
    var bh = gTooltip.offsetHeight || 60;
    var mx = e.clientX;
    var my = e.clientY;
    var left = mx - bw / 2;
    var top  = my - bh - 14;
    if (left + bw > window.innerWidth - 8) left = window.innerWidth - bw - 8;
    if (left < 8) left = 8;
    if (top < 8) top = my + 14;
    gTooltip.style.left = left + 'px';
    gTooltip.style.top  = top + 'px';
  });
  document.querySelectorAll('.s-ov-tooltip-wrap').forEach(function(wrap) {
    var box = wrap.querySelector('.s-ov-tooltip-box');
    if (!box) return;
    wrap.addEventListener('mouseenter', function() {
      gTooltip.textContent = box.textContent;
      gTooltip.style.cssText = [
        'display:block',
        'position:fixed',
        'z-index:99999',
        'pointer-events:none',
        'width:260px',
        'max-width:260px',
        'padding:10px 14px',
        'background:rgba(20,20,30,0.97)',
        'border:1px solid rgba(255,205,0,0.2)',
        'border-radius:8px',
        'font-size:13px',
        'font-weight:400',
        'color:rgba(255,255,255,0.85)',
        'line-height:1.6',
        'white-space:normal',
        'word-break:break-word',
        'writing-mode:horizontal-tb',
        'box-shadow:0 8px 24px rgba(0,0,0,0.5)',
        'left:-9999px',
        'top:-9999px'
      ].join(';');
    });
    wrap.addEventListener('mouseleave', function() {
      gTooltip.style.display = 'none';
    });
  });
});
