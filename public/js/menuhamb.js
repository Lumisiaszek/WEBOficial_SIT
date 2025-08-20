document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav_links');
    const dropdownLinks = document.querySelectorAll('.dropdown ul li a');
  
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  
    if (window.innerWidth <= 667) {
      const dropdown = document.querySelector('.dropdown');
      dropdownLinks.forEach(link => {
        const newListItem = document.createElement('li');
        newListItem.appendChild(link.cloneNode(true));
        navLinks.appendChild(newListItem);
      });
      dropdown.remove();
    }
  });