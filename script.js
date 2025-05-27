document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('mobileMenu');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function() {
          mainNav.classList.toggle('active');
          menuToggle.classList.toggle('active');
      });
  }
});