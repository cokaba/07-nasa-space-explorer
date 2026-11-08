// Put your NASA API key here.
const apiKey = 'DWNfRwL78BGwKWgDwkzD8r9BnnwRtL8QG8hjTLFh';

// Find the important elements on the page.
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalCloseButton = document.querySelector('.modal-close');

// Set the date range defaults and restrictions.
setupDateInputs(startInput, endInput);

function openModal(imageData) {
  modalImage.src = imageData.url;
  modalImage.alt = imageData.title;
  modalTitle.textContent = imageData.title;
  modalDate.textContent = imageData.date;
  modalExplanation.textContent = imageData.explanation;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

modalCloseButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// When the button is clicked, fetch images for the selected date range.
button.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Please choose a valid date range before searching.</p>
      </div>
    `;
    return;
  }

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading space images...</p>
    </div>
  `;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('The request to NASA failed.');
    }

    const data = await response.json();

    if (!data.length) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">🔭</div>
          <p>No images were found for that date range.</p>
        </div>
      `;
      return;
    }

    gallery.innerHTML = '';

    data.forEach((item) => {
      if (item.media_type !== 'image') {
        return;
      }

      const card = document.createElement('article');
      card.classList.add('gallery-item');

      const image = document.createElement('img');
      image.src = item.url;
      image.alt = item.title;

      const title = document.createElement('h2');
      title.textContent = item.title;

      const date = document.createElement('p');
      date.textContent = item.date;

      const description = document.createElement('p');
      description.textContent = item.explanation;

      card.addEventListener('click', () => {
        openModal(item);
      });

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(date);
      card.appendChild(description);
      gallery.appendChild(card);
    });
  } catch (error) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🌌</div>
        <p>Unable to load space images right now. Please try again.</p>
      </div>
    `;
  }
});