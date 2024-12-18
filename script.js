document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    let overlay = document.querySelector('.overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        const main = document.querySelector('main');
        if (sidebar.classList.contains('active')) {
            if (window.innerWidth > 768) {
                main.style.marginLeft = '250px';
                main.style.width = 'calc(100% - 250px)';
            }
        } else {
            main.style.marginLeft = '0';
            main.style.width = '100%';
        }
    }

    function closeSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            const main = document.querySelector('main');
            if (main) {
                main.style.marginLeft = '0';
                main.style.width = '100%';
            }
        }
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', closeSidebar);

        window.addEventListener('resize', () => {
            closeSidebar();
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        });
    }

    function switchTab(targetId, direction = 'right') {
        const currentTab = document.querySelector('.tab-content.active');
        const targetTab = document.getElementById(targetId);
        
        if (!currentTab || !targetTab || currentTab === targetTab) return;

        closeSidebar();

        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove(
                'slide-from-right', 'slide-from-left',
                'slide-to-right', 'slide-to-left'
            );
        });

        switch(direction) {
            case 'right':
                currentTab.classList.add('slide-to-left');
                targetTab.classList.add('slide-from-right');
                break;
            case 'left':
                currentTab.classList.add('slide-to-right');
                targetTab.classList.add('slide-from-left');
                break;
        }

        currentTab.classList.remove('active');
        targetTab.classList.add('active');

        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('data-tab');
            switchTab(targetId, 'right');
        });
    });

    function getNextTab(direction) {
        const currentTab = document.querySelector('.tab-btn.active');
        if (!currentTab) return null;

        const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabButtons.indexOf(currentTab);
        
        if (direction === 'next') {
            return tabButtons[currentIndex + 1] || tabButtons[0];
        } else {
            return tabButtons[currentIndex - 1] || tabButtons[tabButtons.length - 1];
        }
    }

    function handleSwipe(endX, endY, startX, startY) {
        const minSwipeDistance = 100;
        const maxVerticalOffset = 50;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > minSwipeDistance && absY < maxVerticalOffset) {
            if (deltaX > 0) {
                if (!sidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            } else {
                if (sidebar.classList.contains('active')) {
                    closeSidebar();
                } else {
                    const nextTab = getNextTab('next');
                    if (nextTab) {
                        const targetId = nextTab.getAttribute('data-tab');
                        switchTab(targetId, 'right');
                    }
                }
            }
        }
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    let isScrolling = false;
    let startTime = 0;
    let touchMoved = false;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        startTime = Date.now();
        isSwiping = true;
        isScrolling = false;
        touchMoved = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - touchStartX;
        const deltaY = Math.abs(currentY - touchStartY);
        
        touchMoved = true;

        if (deltaY > 30) {
            isScrolling = true;
            isSwiping = false;
        }

        if (Math.abs(deltaX) > 30 && !isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!touchMoved || !isSwiping) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = Math.abs(touchEndY - touchStartY);
        const swipeTime = Date.now() - startTime;
        
        const minSwipeDistance = 50;
        const maxVerticalOffset = 75;
        const maxSwipeTime = 300;
        
        if (Math.abs(deltaX) > minSwipeDistance && 
            deltaY < maxVerticalOffset && 
            swipeTime < maxSwipeTime && 
            !isScrolling) {
            
            if (deltaX > 0) {
                if (!sidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            } else {
                if (sidebar.classList.contains('active')) {
                    closeSidebar();
                } else {
                    const nextTab = getNextTab('next');
                    if (nextTab) {
                        const targetId = nextTab.getAttribute('data-tab');
                        switchTab(targetId, 'right');
                    }
                }
            }
        }

        isSwiping = false;
        isScrolling = false;
        touchMoved = false;
    }, { passive: true });

    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;

    document.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        startTime = Date.now();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;

        const timeElapsed = Date.now() - startTime;
        if (timeElapsed < 300) {
            handleSwipe(e.clientX, e.clientY, mouseStartX, mouseStartY);
        }

        isMouseDown = false;
    });

    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('expandedImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const productImages = document.querySelectorAll('.product-image');

    productImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const audio = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const timeline = document.getElementById('timeline');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const clickToContinue = document.getElementById('clickToContinue');

    let isPlaying = false;
    let isMuted = false;

    audio.autoplay = false;
    audio.pause();

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function initializeAudio() {
        audio.loop = true;
        audio.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            clickToContinue.classList.add('hidden');
        }).catch(error => {
            console.log("Playback failed:", error);
        });
    }

    clickToContinue.addEventListener('click', initializeAudio);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !clickToContinue.classList.contains('hidden')) {
            e.preventDefault();
            initializeAudio();
        }
    });

    playPauseBtn.addEventListener('click', () => {
        if (clickToContinue.classList.contains('hidden')) {
            if (isPlaying) {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        }
    });

    muteBtn.addEventListener('click', () => {
        if (isMuted) {
            audio.volume = volumeSlider.value / 100;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            audio.volume = 0;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        isMuted = !isMuted;
    });

    function updateSliderFill(slider) {
        const progress = (slider.value / slider.max) * 100;
        slider.style.setProperty('--slider-progress', `${progress}%`);
    }

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        audio.volume = value / 100;
        updateSliderFill(volumeSlider);
        if (value == 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            isMuted = true;
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMuted = false;
        }
    });

    updateSliderFill(volumeSlider);

    audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        timeline.max = duration;
        totalTimeEl.textContent = formatTime(duration);
        updateSliderFill(timeline);
    });

    audio.addEventListener('timeupdate', () => {
        const currentTime = Math.floor(audio.currentTime);
        const duration = Math.floor(audio.duration);
        
        if (currentTime >= 0 && duration > 0) {
            timeline.value = currentTime;
            timeline.max = duration;
            currentTimeEl.textContent = formatTime(currentTime);
            totalTimeEl.textContent = formatTime(duration);
            updateSliderFill(timeline);
        }
    });

    audio.addEventListener('canplaythrough', () => {
        const duration = Math.floor(audio.duration);
        timeline.max = duration;
        totalTimeEl.textContent = formatTime(duration);
        updateSliderFill(timeline);
    });

    timeline.addEventListener('input', (e) => {
        const time = parseInt(e.target.value);
        if (!isNaN(time) && isFinite(time)) {
            audio.currentTime = time;
            currentTimeEl.textContent = formatTime(time);
            updateSliderFill(timeline);
        }
    });

    const floatingPlayBtn = document.createElement('button');
    floatingPlayBtn.className = 'floating-play-btn';
    floatingPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.body.appendChild(floatingPlayBtn);

    function updateFloatingButton() {
        if (audio.paused) {
            floatingPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            floatingPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    floatingPlayBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        updateFloatingButton();
    });

    playPauseBtn.addEventListener('click', () => {
        updateFloatingButton();
    });

    document.addEventListener('DOMContentLoaded', () => {
        const defaultTab = document.querySelector('[data-tab="main"]');
        if (defaultTab) {
            defaultTab.click();
        }
    });
});
