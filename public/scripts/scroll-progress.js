(function () {
  const progressBar = document.getElementById('scroll-progress-bar');
  const container = document.getElementById('scroll-progress-container');

  if (!progressBar || !container) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.hidden = true;
    return;
  }

  let ticking = false;
  let lastProgress = 0;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (Math.abs(progress - lastProgress) > 0.001) {
      progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
      lastProgress = progress;
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  updateProgress();
  window.addEventListener('scroll', requestTick, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout !== undefined) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(updateProgress, 100);
  }, { passive: true });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    container.hidden = event.matches;
    if (!event.matches) {
      updateProgress();
    }
  });
})();
