// Get Elements
const timeline = document.getElementById('timeline');
const infoModal = document.getElementById('infoModal');
const welcomeModal = document.getElementById('welcomeModal');
const modalCloseButtons = document.querySelectorAll('.close');
const orb = document.getElementById('orb');
const starField = document.getElementById('starField');
const startButton = document.querySelector('.start-button');

// Create Stars in the background
function createStars() {
    const numStars = 500;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 5 + 5}s`;
        starField.appendChild(star);
    }
}

// Create title cards for each data entry
function createTitleCards() {
    const centerY = timeline.clientHeight / 2;

    dataEntries.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'title-card';
        card.dataset.index = index;
        card.style.top = `${(index * 200) + centerY - 100}px`;
        card.innerHTML = `<h2>${entry.title}</h2>`;
        card.addEventListener('click', () => openInfoModal(entry));
        timeline.appendChild(card);
    });
}

// Apply scroll effects and transformations to title cards
function handleScroll() {
    const cards = document.querySelectorAll('.title-card');
    const scrollTop = timeline.scrollTop;
    const centerY = window.innerHeight / 2;

    cards.forEach(card => {
        const { top } = card.getBoundingClientRect();
        const offset = top - centerY;
        const distance = Math.abs(offset);
        const scale = Math.max(1 - distance / 500, 0.5);
        const zTranslate = Math.min(distance, 500);

        card.style.transform = `translateX(-50%) translateZ(${-zTranslate}px) scale(${scale})`;
        card.style.opacity = scale;
        card.classList.toggle('active', distance < 50);
    });

    // Move the orb indicator
    const scrollHeight = timeline.scrollHeight - timeline.clientHeight;
    const orbPosition = (scrollTop / scrollHeight) * (window.innerHeight - 20);
    orb.style.top = `${orbPosition + 10}px`;
}

// Open and populate the information modal
function openInfoModal(entry) {
    const modalTitle = infoModal.querySelector('.modal-title');
    const modalLogline = infoModal.querySelector('.logline');
    const modalCreator = infoModal.querySelector('.creator');
    const modalBody = infoModal.querySelector('.modal-body');
    const moreInfoLink = infoModal.querySelector('.more-info-link');

    modalTitle.textContent = entry.title;
    modalLogline.textContent = entry.description; // Adjusted to use 'description' as logline
    modalCreator.textContent = entry.creator;
    moreInfoLink.href = entry.moreInfoLink || '#';

    // Clear previous content
    modalBody.innerHTML = '';

    // Create and append the info grid
    const infoGrid = createInfoGrid(entry.sections);
    modalBody.appendChild(infoGrid);

    // Show the modal
    showModal(infoModal);
    orb.style.top = `${window.innerHeight - 50}px`;
}

// Create an info grid based on sections data
function createInfoGrid(sections) {
    const infoGrid = document.createElement('div');
    infoGrid.className = 'info-grid';

    sections.forEach(section => {
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';

        const title = document.createElement('h3');
        title.textContent = section.title;
        infoBox.appendChild(title);

        // Add table or list based on content type
        section.contentType === 'table' 
            ? infoBox.appendChild(createInfoTable(section.content))
            : infoBox.appendChild(createInfoList(section.content));

        infoGrid.appendChild(infoBox);
    });

    return infoGrid;
}

// Create a table for section content
function createInfoTable(content) {
    const table = document.createElement('table');
    table.className = 'info-table';
    const tbody = document.createElement('tbody');

    content.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.element}</td><td>${row.details}</td>`;
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

// Create a list for section content
function createInfoList(content) {
    const ul = document.createElement('ul');
    content.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    return ul;
}

// Show modal with a fade-in effect
function showModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => { modal.style.opacity = 1; }, 10);
}

// Hide modal with a fade-out effect
function hideModal(modal) {
    modal.style.opacity = 0;
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

// Initialize the system
function init() {
    createStars();
    createTitleCards();
    showModal(welcomeModal);
    handleScroll();
}

// Set up event listeners
function setupEventListeners() {
    modalCloseButtons.forEach(button => {
        button.onclick = () => hideModal(button.closest('.modal'));
    });

    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
        }
    };

    startButton.onclick = () => hideModal(welcomeModal);
    timeline.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
}

// Load the app and set up event listeners
window.onload = () => {
    init();
    setupEventListeners();
};
