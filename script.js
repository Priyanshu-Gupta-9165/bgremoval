const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const previewContainer = document.getElementById('previewContainer');
const removeBtn = document.getElementById('removeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('themeToggle');

// API Key (Note: In a production app, this should be backend-side)
const API_KEY = 'CxburPJP3Q3crZjhm5psQS5K';

let currentFile = null;
let resultBlobUrl = null;

// Theme Toggle Logic
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
});

// Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary-hover)';
    dropZone.style.transform = 'scale(1.02)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary)';
    dropZone.style.transform = 'scale(1)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary)';
    dropZone.style.transform = 'scale(1)';
    
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    currentFile = file;
    const url = URL.createObjectURL(file);
    originalImage.src = url;
    
    // Reset State
    resultImage.src = '';
    resultBlobUrl = null;
    previewContainer.style.display = 'grid';
    removeBtn.classList.remove('hidden');
    downloadBtn.classList.add('hidden');
    loader.classList.add('hidden');
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

removeBtn.addEventListener('click', async () => {
    if (!currentFile) return;

    loader.classList.remove('hidden');
    removeBtn.classList.add('hidden');
    
    const formData = new FormData();
    formData.append('image_file', currentFile);
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to remove background');
        }

        const blob = await response.blob();
        resultBlobUrl = URL.createObjectURL(blob);
        resultImage.src = resultBlobUrl;
        
        downloadBtn.classList.remove('hidden');
    } catch (error) {
        console.error(error);
        alert('Error removing background. Please check the API key or try again.');
        removeBtn.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
});

downloadBtn.addEventListener('click', () => {
    if (!resultBlobUrl) return;
    
    const link = document.createElement('a');
    link.href = resultBlobUrl;
    link.download = 'removed-bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
