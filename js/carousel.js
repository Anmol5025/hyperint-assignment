/**
 * Carousel - Image carousel with navigation and thumbnail support
 * Requirements: 5.1, 5.2
 */
class Carousel {
  constructor(images, options = {}) {
    this.images = images;
    this.currentIndex = 0;
    this.options = {
      autoPlay: options.autoPlay || false,
      autoPlayInterval: options.autoPlayInterval || 3000,
      loop: options.loop !== undefined ? options.loop : true,
      transitionDuration: options.transitionDuration || 300,
      ...options
    };
    
    this.autoPlayTimer = null;
    this.isTransitioning = false;
    
    // DOM elements (set via setElements method)
    this.mainImageElement = null;
    this.thumbnailElements = [];
    this.prevButton = null;
    this.nextButton = null;
  }

  /**
   * Set DOM elements for the carousel
   */
  setElements(mainImageElement, thumbnailElements = [], prevButton = null, nextButton = null) {
    this.mainImageElement = mainImageElement;
    this.thumbnailElements = thumbnailElements;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize display
    this.updateDisplay();
  }

  /**
   * Set up event listeners for navigation
   */
  setupEventListeners() {
    // Previous button
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.previous());
    }
    
    // Next button
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }
    
    // Thumbnail clicks
    this.thumbnailElements.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.goto(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previous();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  /**
   * Navigate to next image
   */
  next() {
    if (this.isTransitioning) return;
    
    if (this.currentIndex < this.images.length - 1) {
      this.goto(this.currentIndex + 1);
    } else if (this.options.loop) {
      this.goto(0);
    }
  }

  /**
   * Navigate to previous image
   */
  previous() {
    if (this.isTransitioning) return;
    
    if (this.currentIndex > 0) {
      this.goto(this.currentIndex - 1);
    } else if (this.options.loop) {
      this.goto(this.images.length - 1);
    }
  }

  /**
   * Navigate to specific image by index
   */
  goto(index) {
    if (this.isTransitioning) return;
    if (index < 0 || index >= this.images.length) return;
    if (index === this.currentIndex) return;
    
    this.currentIndex = index;
    this.updateDisplay();
    
    // Reset autoplay timer
    if (this.options.autoPlay) {
      this.resetAutoPlay();
    }
  }

  /**
   * Update the display with smooth transition
   */
  updateDisplay() {
    if (!this.mainImageElement) return;
    
    this.isTransitioning = true;
    
    // Add fade-out class
    this.mainImageElement.classList.add('carousel-transitioning');
    
    setTimeout(() => {
      // Update image source
      this.mainImageElement.src = this.images[this.currentIndex];
      
      // Update thumbnails
      this.updateThumbnails();
      
      // Remove transition class
      setTimeout(() => {
        this.mainImageElement.classList.remove('carousel-transitioning');
        this.isTransitioning = false;
      }, this.options.transitionDuration);
    }, this.options.transitionDuration / 2);
  }

  /**
   * Update thumbnail active states
   */
  updateThumbnails() {
    this.thumbnailElements.forEach((thumbnail, index) => {
      if (index === this.currentIndex) {
        thumbnail.classList.add('active');
      } else {
        thumbnail.classList.remove('active');
      }
    });
  }

  /**
   * Get current index
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Get current image
   */
  getCurrentImage() {
    return this.images[this.currentIndex];
  }

  /**
   * Start autoplay
   */
  startAutoPlay() {
    if (!this.options.autoPlay) return;
    
    this.autoPlayTimer = setInterval(() => {
      this.next();
    }, this.options.autoPlayInterval);
  }

  /**
   * Stop autoplay
   */
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  /**
   * Reset autoplay timer
   */
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  /**
   * Destroy carousel and clean up
   */
  destroy() {
    this.stopAutoPlay();
    // Event listeners would need to be removed here in production
  }
}

/**
 * Initialize all carousels on the page
 */
function initializeCarousels() {
  const carouselContainers = document.querySelectorAll('[data-carousel]');
  
  carouselContainers.forEach(container => {
    const mainImage = container.querySelector('[data-carousel-main]');
    const thumbnails = Array.from(container.querySelectorAll('[data-carousel-thumbnail]'));
    const prevButton = container.querySelector('[data-carousel-prev]');
    const nextButton = container.querySelector('[data-carousel-next]');
    
    // Extract image URLs from thumbnails
    const images = thumbnails.map(thumb => thumb.dataset.image || thumb.src);
    
    // Create carousel instance
    const carousel = new Carousel(images, {
      autoPlay: container.dataset.autoplay === 'true',
      loop: container.dataset.loop !== 'false'
    });
    
    carousel.setElements(mainImage, thumbnails, prevButton, nextButton);
    
    // Start autoplay if enabled
    if (carousel.options.autoPlay) {
      carousel.startAutoPlay();
      
      // Pause on hover
      container.addEventListener('mouseenter', () => carousel.stopAutoPlay());
      container.addEventListener('mouseleave', () => carousel.startAutoPlay());
    }
  });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCarousels);
} else {
  initializeCarousels();
}

/**
 * Initialize Variation 2 carousel with navigation dots
 */
function initializeV2Carousel() {
  const carouselV2 = document.querySelector('[data-carousel-v2]');
  if (!carouselV2) return;

  const slides = Array.from(carouselV2.querySelectorAll('.image-slide'));
  const navDots = Array.from(document.querySelectorAll('.nav-dot'));
  let currentSlide = 0;
  let isTransitioning = false;

  function showSlide(index, smooth = true) {
    if (isTransitioning) return;
    if (index < 0 || index >= slides.length) return;
    if (index === currentSlide) return;

    isTransitioning = true;

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    navDots.forEach(dot => dot.classList.remove('active'));

    // Show current slide with smooth transition
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    if (navDots[index]) {
      navDots[index].classList.add('active');
    }

    currentSlide = index;

    // Reset transition lock after animation completes
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  // Add click handlers to navigation dots
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && currentSlide > 0) {
      e.preventDefault();
      showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowDown' && currentSlide < slides.length - 1) {
      e.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  // Mouse wheel navigation for smooth scrolling
  const galleryPanel = document.querySelector('.gallery-panel');
  if (galleryPanel) {
    let wheelTimeout;
    galleryPanel.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0 && currentSlide < slides.length - 1) {
          showSlide(currentSlide + 1);
        } else if (e.deltaY < 0 && currentSlide > 0) {
          showSlide(currentSlide - 1);
        }
      }, 50);
    }, { passive: false });
  }

  // Touch swipe support for mobile
  let touchStartY = 0;
  let touchEndY = 0;

  carouselV2.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  });

  carouselV2.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartY - touchEndY > swipeThreshold && currentSlide < slides.length - 1) {
      showSlide(currentSlide + 1);
    } else if (touchEndY - touchStartY > swipeThreshold && currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  }

  // Initialize customer photo carousel
  initializeCustomerPhotoCarousel();
}

/**
 * Initialize customer photo carousel with smooth scrolling
 */
function initializeCustomerPhotoCarousel() {
  const photosScroll = document.querySelector('.photos-scroll');
  if (!photosScroll) return;

  const customerThumbs = Array.from(photosScroll.querySelectorAll('.customer-thumb'));
  
  // Add click handlers to customer photos
  customerThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      // Optional: Could open lightbox or show larger version
      thumb.style.transform = 'scale(1.1)';
      setTimeout(() => {
        thumb.style.transform = '';
      }, 200);
    });
  });

  // Auto-scroll animation (optional)
  let scrollPosition = 0;
  let scrollDirection = 1;
  let autoScrollInterval;

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      const maxScroll = photosScroll.scrollWidth - photosScroll.clientWidth;
      
      scrollPosition += scrollDirection * 1;
      
      if (scrollPosition >= maxScroll) {
        scrollDirection = -1;
      } else if (scrollPosition <= 0) {
        scrollDirection = 1;
      }
      
      photosScroll.scrollLeft = scrollPosition;
    }, 30);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Pause auto-scroll on hover
  photosScroll.addEventListener('mouseenter', stopAutoScroll);
  photosScroll.addEventListener('mouseleave', startAutoScroll);

  // Stop auto-scroll on manual interaction
  photosScroll.addEventListener('scroll', () => {
    scrollPosition = photosScroll.scrollLeft;
  });

  // Start auto-scroll after a delay
  setTimeout(startAutoScroll, 2000);
}

/**
 * Initialize review carousel for Variation 2
 */
function initializeReviewCarousel() {
  const reviewCarousel = document.querySelector('[data-review-carousel]');
  if (!reviewCarousel) return;

  const track = reviewCarousel.querySelector('.carousel-track');
  const cards = Array.from(track.querySelectorAll('.review-card-carousel'));
  const prevButton = reviewCarousel.querySelector('.carousel-prev');
  const nextButton = reviewCarousel.querySelector('.carousel-next');
  const indicators = Array.from(reviewCarousel.parentElement.querySelectorAll('.indicator'));
  
  let currentIndex = 0;
  let autoScrollTimer = null;
  const autoScrollInterval = 5000; // 5 seconds

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 20; // Gap between cards
    const offset = -(currentIndex * (cardWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update button states
    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }
    if (nextButton) {
      nextButton.disabled = currentIndex === cards.length - 1;
    }
  }

  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  function startAutoScroll() {
    autoScrollTimer = setInterval(() => {
      if (currentIndex < cards.length - 1) {
        nextSlide();
      } else {
        currentIndex = 0;
        updateCarousel();
      }
    }, autoScrollInterval);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  // Event listeners
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prevSlide();
      resetAutoScroll();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
      resetAutoScroll();
    });
  }

  // Pause on hover
  reviewCarousel.addEventListener('mouseenter', stopAutoScroll);
  reviewCarousel.addEventListener('mouseleave', startAutoScroll);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  reviewCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
  });

  reviewCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoScroll();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
    }
  }

  // Initialize
  updateCarousel();
  startAutoScroll();
}

// Initialize Variation 2 specific carousels
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeV2Carousel();
    initializeReviewCarousel();
  });
} else {
  initializeV2Carousel();
  initializeReviewCarousel();
}
