document.addEventListener('DOMContentLoaded', function () {

  const images = [
    'Imagenes/Forestal.jpg',
    'Imagenes/Casco.jpg',
    'Imagenes/inc-deposito.jpg',
  ];

  let currentIndex = 0;
  const carouselImage = document.getElementById('carouselImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');
  let autoRotateInterval = null;
  const rotateDelay = 4000; 
  const carouselFrame = document.querySelector('.carousel-frame');
  
  let touchStartX = 0;
  let touchEndX = 0;
  

  
    images.forEach((_, idx) => {
    const b = document.createElement('button');
    b.dataset.index = idx;
    if (idx === 0) b.classList.add('active');
    b.addEventListener('click', () => {
      goToIndex(idx);
      resetAutoRotate();
    });
    indicatorsContainer.appendChild(b);
  });

  function updateIndicators() {
    const buttons = indicatorsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    const active = indicatorsContainer.querySelector(`button[data-index='${currentIndex}']`);
    if (active) active.classList.add('active');
  }

  function showImage(idx) {
    
    const src = images[idx] || images[0];
    carouselImage.src = src;
    carouselImage.alt = `Imagen ${idx + 1}`;
    updateIndicators();
  }

  function goToIndex(idx) {

    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    currentIndex = idx;
    showImage(currentIndex);
  }

  prevBtn && prevBtn.addEventListener('click', () => { goToIndex(currentIndex - 1); resetAutoRotate(); });
  nextBtn && nextBtn.addEventListener('click', () => { goToIndex(currentIndex + 1); resetAutoRotate(); });

  function autoRotate() {
    autoRotateInterval = setInterval(() => {
      goToIndex(currentIndex + 1);
    }, rotateDelay);
  }
  function resetAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotate();
  }

  
  if (carouselFrame) {
    carouselFrame.addEventListener('mouseenter', () => { if (autoRotateInterval) clearInterval(autoRotateInterval); });
    carouselFrame.addEventListener('mouseleave', () => { resetAutoRotate(); });
    
    carouselFrame.addEventListener('focus', () => { if (autoRotateInterval) clearInterval(autoRotateInterval); });
    carouselFrame.addEventListener('blur', () => { resetAutoRotate(); });

    
    carouselFrame.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
    carouselFrame.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) goToIndex(currentIndex + 1);
        else goToIndex(currentIndex - 1);
        resetAutoRotate();
      }
    }, {passive:true});
  }


  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToIndex(currentIndex - 1); resetAutoRotate();
    } else if (e.key === 'ArrowRight') {
      goToIndex(currentIndex + 1); resetAutoRotate();
    }
  });


  showImage(0);
  autoRotate();



  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const errorsBox = document.getElementById('formErrors');
    const submittedArea = document.getElementById('submittedData');

    contactForm.addEventListener ('submit', function (e) {
      e.preventDefault();
      errorsBox.style.display = 'none';
      errorsBox.innerHTML = '';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      
      const errors = [];

      
      if (!name) errors.push('El nombre es obligatorio.');
      else if (name.length > 60) errors.push('El nombre no puede superar 60 caracteres.');

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) errors.push('El email es obligatorio.');
      else if (!emailRegex.test(email)) errors.push('El email no tiene un formato válido.');
      else if (email.length > 80) errors.push('El email no puede superar 80 caracteres.');

      
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phone) errors.push('El teléfono es obligatorio.');
      else if (!phoneRegex.test(phone)) errors.push('El teléfono no tiene un formato válido (solo números, espacios, guiones y opcional "+").');

      
      if (message.length > 500) errors.push('El mensaje no puede superar 500 caracteres.');

      if (errors.length) {
        
        errorsBox.style.display = 'block';
        const ul = document.createElement('ul');
        errors.forEach(msg => {
          const li = document.createElement('li');
          li.textContent = msg;
          ul.appendChild(li);
        });
        errorsBox.appendChild(ul);
        
        errorsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        
        submittedArea.innerHTML = ''; 
        const card = document.createElement('div');
        card.className = 'sent-card';
        const h = document.createElement('h3');
        h.textContent = 'Datos enviados';
        const pName = document.createElement('p');
        pName.innerHTML = `<strong>Nombre:</strong> ${escapeHtml(name)}`;
        const pEmail = document.createElement('p');
        pEmail.innerHTML = `<strong>Email:</strong> ${escapeHtml(email)}`;
        const pPhone = document.createElement('p');
        pPhone.innerHTML = `<strong>Teléfono:</strong> ${escapeHtml(phone)}`;
        const pMsg = document.createElement('p');
        pMsg.innerHTML = `<strong>Mensaje:</strong> ${escapeHtml(message || '(sin mensaje)')}`;
        card.appendChild(h);
        card.appendChild(pName);
        card.appendChild(pEmail);
        card.appendChild(pPhone);
        card.appendChild(pMsg);
        submittedArea.appendChild(card);

        
        contactForm.reset();
        
        errorsBox.style.display = 'none';
      }
    });

    
    function escapeHtml(unsafe) {
      return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }
  }

}); 
