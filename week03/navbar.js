document.addEventListener('scroll', () => {
  const nav = document.querySelector('#sticky-navbar');

  if (window.scrollY > 0) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
})