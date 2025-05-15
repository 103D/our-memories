document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');
    
    const imageContainer = document.querySelector('.image-container');
    const floatingMessages = document.querySelector('.floating-messages');
    
    // Array of image paths - you'll need to add your images to the images folder
    const images = [
        'images/photo.jpg',
        'images/photo1.jpg',
        'images/photo2.jpg',
        // 'images/photo3.jpg',
        // 'images/photo4.jpg',
        // 'images/photo5.jpg'
    ];
    
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval = null;
    let hasCompletedFullCycle = false;
    
    // Create progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    progressIndicator.innerHTML = `
        <div class="progress-dots"></div>
        <div class="progress-text">1 / ${images.length}</div>
    `;
    imageContainer.appendChild(progressIndicator);
    
    // Create dots for each image
    const dotsContainer = progressIndicator.querySelector('.progress-dots');
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
    
    // Create image elements
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Memory ${index + 1}`;
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.transform = index === 0 ? 'scale(1)' : 'scale(1.1)';
        imageContainer.appendChild(img);
    });
    
    const allImages = imageContainer.querySelectorAll('img');
    const allDots = dotsContainer.querySelectorAll('.progress-dot');
    const progressText = progressIndicator.querySelector('.progress-text');
    
    // Add click event to image container
    imageContainer.addEventListener('click', function() {
        if (isTransitioning) return;
        
        const message = document.createElement('div');
        message.className = 'message';
        message.style.left = Math.random() * 80 + 10 + '%';
        message.textContent = getRandomMessage();
        floatingMessages.appendChild(message);
        
        // Remove message after animation
        setTimeout(() => {
            message.remove();
        }, 4000);
        
        // Start transition to next image
        transitionToNextImage();
    });

    function getRandomMessage() {
        const messages = [
            "I love your smile",
            "You're my everything",
            "Forever yours",
            "My heart beats for you",
            "You're my dream come true",
            "Every moment with you is precious",
            "You make me complete",
            "My love for you grows every day"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function updateProgressIndicator() {
        // Update dots
        allDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update text
        progressText.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function transitionToNextImage() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const currentImage = allImages[currentIndex];
        currentIndex = (currentIndex + 1) % images.length;
        const nextImage = allImages[currentIndex];
        
        // Update progress indicator
        updateProgressIndicator();
        
        // Check if we've completed a full cycle
        if (currentIndex === 0) {
            hasCompletedFullCycle = true;
            // Stop auto-sliding after completing the cycle
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        
        let progress = 0;
        const duration = 1000; // 1 second transition
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            // Fade out current image
            currentImage.style.opacity = 1 - easedProgress;
            currentImage.style.transform = `scale(${1 + (0.1 * easedProgress)})`;
            
            // Fade in next image
            nextImage.style.opacity = easedProgress;
            nextImage.style.transform = `scale(${1.1 - (0.1 * easedProgress)})`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isTransitioning = false;
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Start automatic sliding
    function startAutoSlide() {
        if (!autoSlideInterval && !hasCompletedFullCycle) {
            autoSlideInterval = setInterval(() => {
                if (!isTransitioning) {
                    transitionToNextImage();
                }
            }, 3000); // Change image every 3 seconds
        }
    }

    // Start auto-sliding when the page loads
    startAutoSlide();

    // Add floating messages periodically
    setInterval(() => {
        const message = document.createElement('div');
        message.className = 'message';
        message.style.left = Math.random() * 80 + 10 + '%';
        message.textContent = getRandomMessage();
        floatingMessages.appendChild(message);
        
        // Remove message after animation
        setTimeout(() => {
            message.remove();
        }, 4000);
    }, 3000);
}); 