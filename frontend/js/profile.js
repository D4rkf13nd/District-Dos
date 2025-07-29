// Profile Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

// Initialize all profile functionality
function initializeProfile() {
    setupTabSwitching();
    setupProfileEditing();
    setupSocialLinks();
    setupVerificationButtons();
    setupPortfolioHovers();
    setupScrollAnimations();
}

// Tab Switching Functionality
function switchTab(tabName) {
    // Remove active class from all tabs and panes
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding pane
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activePane = document.getElementById(tabName);
    
    if (activeButton && activePane) {
        activeButton.classList.add('active');
        activePane.classList.add('active');
        
        // Add smooth transition effect
        activePane.style.opacity = '0';
        setTimeout(() => {
            activePane.style.opacity = '1';
        }, 50);
    }
}

// Setup tab switching event listeners
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
            
            // Add ripple effect
            createRippleEffect(button, event);
        });
    });
}

// Profile Image Change Functionality
function changeProfileImage() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profileImage = document.getElementById('profileImage');
                profileImage.src = e.target.result;
                
                // Add animation when image changes
                profileImage.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    profileImage.style.transform = 'scale(1)';
                }, 200);
            };
            reader.readAsDataURL(file);
        }
    };
    
    fileInput.click();
}

// Profile Name Editing
function setupProfileEditing() {
    const profileName = document.getElementById('profileName');
    
    // Double click to edit name
    profileName.addEventListener('dblclick', function() {
        this.contentEditable = true;
        this.focus();
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.padding = '4px 8px';
        this.style.borderRadius = '4px';
        
        // Select all text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
    });
    
    // Save on enter or blur
    profileName.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });
    
    profileName.addEventListener('blur', function() {
        this.contentEditable = false;
        this.style.background = 'transparent';
        this.style.padding = '0';
        
        // Show save notification
        showNotification('Profile name updated!', 'success');
    });
}

// Contact/Hire Me Button
function contactUser() {
    // Create modal or contact form
    const modal = createContactModal();
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Create Contact Modal
function createContactModal() {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 30px;
            max-width: 500px;
            width: 90%;
            transform: translateY(50px);
            transition: transform 0.3s ease;
        ">
            <h3 style="color: white; margin-bottom: 20px; text-align: center;">Contact Jenny Wilson</h3>
            <form class="contact-form">
                <input type="text" placeholder="Your Name" required style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 14px;
                ">
                <input type="email" placeholder="Your Email" required style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 14px;
                ">
                <textarea placeholder="Your Message" rows="4" required style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 14px;
                    resize: vertical;
                "></textarea>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" onclick="closeContactModal()" style="
                        padding: 10px 20px;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 8px;
                        background: transparent;
                        color: white;
                        cursor: pointer;
                    ">Cancel</button>
                    <button type="submit" style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 8px;
                        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                        color: white;
                        cursor: pointer;
                    ">Send Message</button>
                </div>
            </form>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeContactModal();
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('.contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Message sent successfully!', 'success');
        closeContactModal();
    });
    
    return modal;
}

// Close Contact Modal
function closeContactModal() {
    const modal = document.querySelector('.contact-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Social Links Functionality
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            handleSocialClick(platform);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Handle Social Platform Clicks
function handleSocialClick(platform) {
    const actions = {
        google: () => showNotification('Opening Google profile...', 'info'),
        gmail: () => showNotification('Opening Gmail...', 'info'),
        calendar: () => showNotification('Opening Calendar...', 'info'),
        messenger: () => showNotification('Opening Messenger...', 'info')
    };
    
    if (actions[platform]) {
        actions[platform]();
    }
}

// Verification Buttons
function setupVerificationButtons() {
    const verifyButtons = document.querySelectorAll('.get-verified-btn');
    verifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const verificationItem = this.closest('.verification-item');
            const service = verificationItem.querySelector('span').textContent;
            
            // Simulate verification process
            this.textContent = 'Verifying...';
            this.disabled = true;
            
            setTimeout(() => {
                verificationItem.classList.remove('pending');
                verificationItem.classList.add('verified');
                
                // Replace button with check icon
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fas fa-check-circle';
                checkIcon.style.color = '#28a745';
                this.parentNode.replaceChild(checkIcon, this);
                
                showNotification(`${service} verified successfully!`, 'success');
            }, 2000);
        });
    });
}

// Portfolio Hover Effects
function setupPortfolioHovers() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click handler for portfolio items
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

// Open Image Modal
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <img src="${src}" alt="${alt}" style="
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        ">
        <button onclick="closeImageModal()" style="
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s ease;
        ">×</button>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('img').style.transform = 'scale(1)';
    }, 10);
    
    // Close on click outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// Close Image Modal
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all glass cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Ripple Effect for Buttons
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: 'linear-gradient(135deg, #28a745, #20c997)',
        error: 'linear-gradient(135deg, #dc3545, #fd7e14)',
        info: 'linear-gradient(135deg, #17a2b8, #6f42c1)',
        warning: 'linear-gradient(135deg, #ffc107, #fd7e14)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 1002;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Skill Tag Interactions
function setupSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Toggle selected state
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                this.style.background = 'linear-gradient(135deg, #4facfe, #00c6ff)';
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Portfolio Links Interactions
function setupPortfolioLinks() {
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('span').textContent;
            
            // Simulate opening external link
            showNotification(`Opening ${platform} profile...`, 'info');
            
            // Add loading state
            const originalText = this.innerHTML;
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 1500);
        });
    });
}

// Experience Item Interactions
function setupExperienceItems() {
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create expanded view
            const details = this.querySelector('.experience-details');
            const title = details.querySelector('h4').textContent;
            const company = details.querySelector('.company-name').textContent;
            const duration = details.querySelector('.duration').textContent;
            
            showExperienceModal(title, company, duration);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.05)';
            this.style.borderRadius = '10px';
            this.style.padding = '10px';
            this.style.margin = '0 -10px';
            this.style.cursor = 'pointer';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.padding = '0';
            this.style.margin = '0';
        });
    });
}

// Show Experience Modal
function showExperienceModal(title, company, duration) {
    const modal = document.createElement('div');
    modal.className = 'experience-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 30px;
            max-width: 600px;
            width: 90%;
            transform: translateY(50px);
            transition: transform 0.3s ease;
        ">
            <h3 style="color: white; margin-bottom: 10px;">${title}</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 5px; font-size: 16px;">${company}</p>
            <p style="color: rgba(255, 255, 255, 0.6); margin-bottom: 20px; font-size: 14px;">${duration}</p>
            <div style="margin-bottom: 20px;">
                <h4 style="color: white; margin-bottom: 15px;">Key Responsibilities:</h4>
                <ul style="color: rgba(255, 255, 255, 0.8); line-height: 1.6;">
                    <li>Led design initiatives for major product launches</li>
                    <li>Collaborated with cross-functional teams to deliver user-centered solutions</li>
                    <li>Mentored junior designers and established design systems</li>
                    <li>Conducted user research and usability testing</li>
                </ul>
            </div>
            <button onclick="closeExperienceModal()" style="
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #4facfe, #00c6ff);
                color: white;
                cursor: pointer;
                float: right;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeExperienceModal();
        }
    });
}

// Close Experience Modal
function closeExperienceModal() {
    const modal = document.querySelector('.experience-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupSkillTags();
    setupPortfolioLinks();
    setupExperienceItems();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Tab navigation with arrow keys
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeTab = document.querySelector('.tab-btn.active');
        const allTabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = allTabs.indexOf(activeTab);
        
        let nextIndex;
        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % allTabs.length;
        } else {
            nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
        }
        
        const nextTab = allTabs[nextIndex];
        const tabName = nextTab.getAttribute('data-tab');
        switchTab(tabName);
    }
});

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme toggle functionality (optional)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    showNotification(`Switched to ${theme} theme`, 'info');
}

// Save user preferences
function saveUserPreferences() {
    const preferences = {
        theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
        activeTab: document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'skills'
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Load user preferences
function loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        
        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        if (preferences.activeTab) {
            switchTab(preferences.activeTab);
        }
    }
}

// Export functions for global access
window.switchTab = switchTab;
window.changeProfileImage = changeProfileImage;
window.contactUser = contactUser;
window.closeContactModal = closeContactModal;
window.closeImageModal = closeImageModal;
window.closeExperienceModal = closeExperienceModal;
window.toggleTheme = toggleTheme;