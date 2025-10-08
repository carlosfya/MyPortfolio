document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            populatePage(data);
            
            // NUEVO: Una vez que la página está poblada, inicializamos las animaciones
            setupScrollAnimations(); 
            // NUEVO: Y también el scrollspy para el menú
            setupScrollspy(); 
        })
        .catch(error => console.error('Error fetching data:', error));

    // Función para poblar la página con los datos (sin cambios)
    function populatePage(data) {
        document.title = `${data.personal.name} | Portfolio`;
        document.getElementById('home-name').textContent = data.personal.name;
        document.getElementById('home-title').textContent = data.personal.title;

        const navbar = document.getElementById('navbar');
        Object.keys(data.sections).forEach(key => {
            if (document.getElementById(key)) {
                const navLink = document.createElement('a');
                navLink.href = `#${key}`;
                navLink.textContent = data.sections[key];
                navbar.appendChild(navLink);

                const titleElement = document.getElementById(`${key}-title`);
                if(titleElement) titleElement.textContent = data.sections[key];
            }
        });

        document.getElementById('about-description').innerHTML = data.about.description;

        const educationList = document.getElementById('education-list');
        data.education.forEach(item => {
            educationList.innerHTML += `
                <div class="timeline-item reveal">
                    <div class="timeline-content">
                        <h3>${item.institution}</h3>
                        <p class="degree">${item.degree}</p>
                        <span class="period">${item.period}</span>
                        ${item.details ? `<p class="details">${item.details}</p>` : ''}
                    </div>
                </div>`;
        });

        const projectsList = document.getElementById('projects-list');
        data.projects.forEach(project => {
            projectsList.innerHTML += `
                <div class="project-card reveal">
                    <img src="${project.image}" alt="${project.title}" class="project-card-image">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <a href="${project.link}">View Project</a>
                </div>`;
        });

        const experienceList = document.getElementById('experience-list');
        data.experience.forEach(item => {
            experienceList.innerHTML += `
                <div class="timeline-item reveal">
                    <div class="timeline-content">
                        <h3>${item.role} at ${item.company}</h3>
                        <span class="period">${item.period}</span>
                        <p>${item.description}</p>
                    </div>
                </div>`;
        });
        
        const skillsContent = document.getElementById('skills-content');
        skillsContent.innerHTML = `
            <div class="reveal">
                <h3>Technical Skills</h3>
                <div class="skills-list">
                    ${data.skills.technical.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                </div>
                <h3>Soft Skills</h3>
                <div class="skills-list">
                    ${data.skills.soft.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                </div>
            </div>
        `;

        const contactEmail = document.getElementById('contact-email');
        contactEmail.href = `mailto:${data.contact.email}`;
        contactEmail.textContent = data.contact.email;

        document.getElementById('footer-name').textContent = data.personal.name;
    }

    // NUEVO: Lógica para las animaciones de scroll
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1 // El elemento se revela cuando un 10% es visible
        });

        // Seleccionamos todos los elementos que queremos animar
        const elementsToReveal = document.querySelectorAll('.reveal');
        elementsToReveal.forEach(el => observer.observe(el));
    }

    // NUEVO: Lógica para el menú inteligente (scrollspy)
    function setupScrollspy() {
        const sections = document.querySelectorAll('main section');
        const navLinks = document.querySelectorAll('#navbar a');

        window.onscroll = () => {
            // Fade out del home content
            const homeContent = document.querySelector('.home-content');
            const scrollY = window.scrollY;
            const fadeDistance = 500; // Distancia en px para completar el fade
            const opacity = Math.max(0, 1 - (scrollY / fadeDistance));
            const translateY = scrollY * 0.3; // Movimiento hacia abajo
            homeContent.style.opacity = opacity;
            homeContent.style.transform = `translateY(${translateY}px)`;

            // Scrollspy logic
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 60) { // 60 es la altura del menú
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
    }

    // Inicialización de Particles.js (sin cambios)
    particlesJS("particles-js", {
        "particles": { "number": { "value": 40, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#555555" }, "shape": { "type": "circle" }, "opacity": { "value": 0.8, "random": false }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#555555", "opacity": 0.6, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out" } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } }, "retina_detect": true
    });
});