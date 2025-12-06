/**
 * Reviews - Review interaction and filtering functionality
 * Requirements: 4.1, 4.2, 4.3
 */

/**
 * ReviewManager - Handles review expansion, voting, and filtering
 */
class ReviewManager {
  constructor() {
    this.reviews = [];
    this.currentFilter = 'all';
  }

  /**
   * Initialize review interactions
   */
  initialize() {
    this.setupExpandCollapse();
    this.setupHelpfulVotes();
    this.setupFiltering();
  }

  /**
   * Set up show more/less functionality for review text
   */
  setupExpandCollapse() {
    const reviewTexts = document.querySelectorAll('[data-review-text]');
    
    reviewTexts.forEach(reviewText => {
      const fullText = reviewText.dataset.reviewText;
      const maxLength = parseInt(reviewText.dataset.maxLength || 150, 10);
      
      if (fullText.length > maxLength) {
        const truncatedText = fullText.substring(0, maxLength) + '...';
        
        // Create elements
        const textSpan = document.createElement('span');
        textSpan.className = 'review-text-content';
        textSpan.textContent = truncatedText;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'review-toggle-btn';
        toggleButton.textContent = 'Show more';
        toggleButton.setAttribute('aria-expanded', 'false');
        
        // Clear and append
        reviewText.innerHTML = '';
        reviewText.appendChild(textSpan);
        reviewText.appendChild(toggleButton);
        
        // Toggle functionality
        let isExpanded = false;
        toggleButton.addEventListener('click', () => {
          isExpanded = !isExpanded;
          
          if (isExpanded) {
            textSpan.textContent = fullText;
            toggleButton.textContent = 'Show less';
            toggleButton.setAttribute('aria-expanded', 'true');
          } else {
            textSpan.textContent = truncatedText;
            toggleButton.textContent = 'Show more';
            toggleButton.setAttribute('aria-expanded', 'false');
          }
        });
      } else {
        reviewText.textContent = fullText;
      }
    });
  }

  /**
   * Set up helpful vote interactions
   */
  setupHelpfulVotes() {
    const voteButtons = document.querySelectorAll('[data-review-vote]');
    
    voteButtons.forEach(button => {
      const reviewId = button.dataset.reviewId;
      const voteType = button.dataset.reviewVote; // 'helpful' or 'not-helpful'
      
      button.addEventListener('click', () => {
        this.handleVote(reviewId, voteType, button);
      });
    });
  }

  /**
   * Handle vote interaction
   */
  handleVote(reviewId, voteType, button) {
    // Check if already voted
    const storageKey = `review-vote-${reviewId}`;
    const existingVote = localStorage.getItem(storageKey);
    
    if (existingVote) {
      // Already voted
      button.classList.add('voted');
      this.showVoteMessage(button, 'You already voted on this review');
      return;
    }
    
    // Record vote
    localStorage.setItem(storageKey, voteType);
    
    // Update UI
    button.classList.add('voted');
    const countElement = button.querySelector('[data-vote-count]');
    if (countElement) {
      const currentCount = parseInt(countElement.textContent, 10);
      countElement.textContent = currentCount + 1;
    }
    
    // Show feedback
    this.showVoteMessage(button, 'Thank you for your feedback!');
  }

  /**
   * Show vote feedback message
   */
  showVoteMessage(button, message) {
    const messageElement = document.createElement('span');
    messageElement.className = 'vote-message';
    messageElement.textContent = message;
    
    button.parentElement.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.remove();
    }, 2000);
  }

  /**
   * Set up review filtering
   */
  setupFiltering() {
    const filterButtons = document.querySelectorAll('[data-review-filter]');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.dataset.reviewFilter;
        this.applyFilter(filterValue);
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  /**
   * Apply filter to reviews
   */
  applyFilter(filterValue) {
    this.currentFilter = filterValue;
    const reviewCards = document.querySelectorAll('[data-review-card]');
    
    reviewCards.forEach(card => {
      const rating = parseInt(card.dataset.rating, 10);
      const verified = card.dataset.verified === 'true';
      
      let shouldShow = true;
      
      switch (filterValue) {
        case 'all':
          shouldShow = true;
          break;
        case 'verified':
          shouldShow = verified;
          break;
        case '5-star':
          shouldShow = rating === 5;
          break;
        case '4-star':
          shouldShow = rating === 4;
          break;
        case '3-star':
          shouldShow = rating === 3;
          break;
        case '2-star':
          shouldShow = rating === 2;
          break;
        case '1-star':
          shouldShow = rating === 1;
          break;
        default:
          shouldShow = true;
      }
      
      if (shouldShow) {
        card.style.display = '';
        card.classList.remove('filtered-out');
      } else {
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });
    
    // Update visible count
    this.updateVisibleCount();
  }

  /**
   * Update visible review count
   */
  updateVisibleCount() {
    const visibleReviews = document.querySelectorAll('[data-review-card]:not(.filtered-out)');
    const countElement = document.querySelector('[data-visible-review-count]');
    
    if (countElement) {
      countElement.textContent = visibleReviews.length;
    }
  }

  /**
   * Load more reviews (for pagination)
   */
  loadMore(count = 3) {
    const hiddenReviews = document.querySelectorAll('[data-review-card].hidden');
    const reviewsToShow = Array.from(hiddenReviews).slice(0, count);
    
    reviewsToShow.forEach(review => {
      review.classList.remove('hidden');
    });
    
    // Hide load more button if no more reviews
    if (hiddenReviews.length <= count) {
      const loadMoreButton = document.querySelector('[data-load-more-reviews]');
      if (loadMoreButton) {
        loadMoreButton.style.display = 'none';
      }
    }
  }
}

/**
 * ReviewCarousel - Handles horizontal scrolling review carousel
 * Requirements: 4.1, 4.2, 4.3
 */
class ReviewCarousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.track = this.carousel.querySelector('.carousel-track');
    this.cards = Array.from(this.track.querySelectorAll('.review-card-carousel'));
    this.prevButton = this.carousel.querySelector('.carousel-prev');
    this.nextButton = this.carousel.querySelector('.carousel-next');
    this.indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));
    
    this.currentIndex = 0;
    this.autoScrollInterval = null;
    this.autoScrollDelay = 5000; // 5 seconds
    
    this.initialize();
  }

  /**
   * Initialize carousel functionality
   */
  initialize() {
    if (!this.track || this.cards.length === 0) {
      return;
    }

    this.setupNavigation();
    this.setupIndicators();
    this.setupAutoScroll();
    this.updateCarousel();
  }

  /**
   * Set up navigation arrows
   */
  setupNavigation() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.previous();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.next();
      });
    }
  }

  /**
   * Set up indicator dots
   */
  setupIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goTo(index);
      });
    });
  }

  /**
   * Set up auto-scroll with pause on hover
   */
  setupAutoScroll() {
    // Start auto-scroll
    this.startAutoScroll();

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.stopAutoScroll();
    });

    // Resume on mouse leave
    this.carousel.addEventListener('mouseleave', () => {
      this.startAutoScroll();
    });

    // Pause when user interacts with navigation
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.stopAutoScroll();
        this.startAutoScroll();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.stopAutoScroll();
        this.startAutoScroll();
      });
    }
  }

  /**
   * Start auto-scroll
   */
  startAutoScroll() {
    this.stopAutoScroll(); // Clear any existing interval
    this.autoScrollInterval = setInterval(() => {
      this.next();
    }, this.autoScrollDelay);
  }

  /**
   * Stop auto-scroll
   */
  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  /**
   * Navigate to next review
   */
  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to start
    }
    this.updateCarousel();
  }

  /**
   * Navigate to previous review
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.cards.length - 1; // Loop to end
    }
    this.updateCarousel();
  }

  /**
   * Go to specific review index
   */
  goTo(index) {
    if (index >= 0 && index < this.cards.length) {
      this.currentIndex = index;
      this.updateCarousel();
      this.stopAutoScroll();
      this.startAutoScroll();
    }
  }

  /**
   * Update carousel position and UI
   */
  updateCarousel() {
    // Calculate transform
    const cardWidth = this.cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(this.track).gap) || 0;
    const offset = -(this.currentIndex * (cardWidth + gap));
    
    // Apply transform
    this.track.style.transform = `translateX(${offset}px)`;

    // Update navigation buttons
    this.updateNavigationButtons();

    // Update indicators
    this.updateIndicators();

    // Update review count indicator
    this.updateCountIndicator();
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    // For looping carousel, buttons are always enabled
    // If you want to disable at ends, uncomment below:
    /*
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
    }
    */
  }

  /**
   * Update indicator dots
   */
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  /**
   * Update review count indicator
   */
  updateCountIndicator() {
    const countElement = document.querySelector('.summary-count');
    if (countElement) {
      // Show current review number out of total
      const currentNum = this.currentIndex + 1;
      const total = this.cards.length;
      
      // Update the text to show current position
      const baseText = countElement.textContent.replace(/\d+/, '');
      countElement.textContent = `Showing ${currentNum} of ${total} reviews`;
    }
  }

  /**
   * Get current index
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Get total number of reviews
   */
  getTotalReviews() {
    return this.cards.length;
  }
}

/**
 * Initialize review manager
 */
function initializeReviews() {
  const reviewManager = new ReviewManager();
  reviewManager.initialize();
  
  // Set up load more button
  const loadMoreButton = document.querySelector('[data-load-more-reviews]');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      reviewManager.loadMore();
    });
  }

  // Initialize review carousel
  const carouselElement = document.querySelector('[data-review-carousel]');
  if (carouselElement) {
    const reviewCarousel = new ReviewCarousel(carouselElement);
    window.reviewCarousel = reviewCarousel;
  }
  
  // Make manager globally accessible for debugging
  window.reviewManager = reviewManager;
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeReviews);
} else {
  initializeReviews();
}


/**
 * Initialize review filters for Variation 3
 */
function initializeReviewFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');
  
  if (filterButtons.length === 0 || reviewCards.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      
      // Filter reviews
      reviewCards.forEach(card => {
        const rating = card.querySelector('.review-rating').children.length;
        const isVerified = card.querySelector('.verified-badge') !== null;
        const isFeatured = card.classList.contains('featured');
        
        let shouldShow = false;
        
        switch (filter) {
          case 'all':
            shouldShow = true;
            break;
          case '5':
            shouldShow = rating === 5 || isFeatured;
            break;
          case '4':
            shouldShow = rating === 4;
            break;
          case 'verified':
            shouldShow = isVerified || isFeatured;
            break;
          default:
            shouldShow = true;
        }
        
        if (shouldShow) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Initialize review filters on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeReviewFilters);
} else {
  initializeReviewFilters();
}
