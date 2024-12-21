const enterScreen = document.getElementById('enterScreen');
const mainContent = document.getElementById('mainContent');

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const songTitleEl = document.querySelector('.song-title');
const songArtistEl = document.querySelector('.song-artist');

function enterSite() {
    enterScreen.style.opacity = '0';
    enterScreen.style.pointerEvents = 'none';
    mainContent.style.display = 'flex';
    
    setTimeout(() => {
        mainContent.classList.add('visible');
        enterScreen.style.display = 'none';
        
        audioPlayer.play().then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
            console.error('Autoplay failed:', error);
        });
    }, 50);
}

enterScreen.addEventListener('click', enterSite);

const firebaseConfig = {
    apiKey: "AIzaSyAf_N7RhYot2lOolED_Yz4b1FOXzQh8xA0",
    authDomain: "profile-links-99278.firebaseapp.com",
    databaseURL: "https://profile-links-99278-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "profile-links-99278",
    storageBucket: "profile-links-99278.firebasestorage.app",
    messagingSenderId: "278652517176",
    appId: "1:278652517176:web:1b4d35135b082670b85fcd"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const viewsRef = database.ref('pageViews');

const formatNumber = num => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const generateUserId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
};

const hasUserViewed = () => {
    const userId = localStorage.getItem('userId');
    const viewTimestamp = localStorage.getItem('viewTimestamp');
    
    if (!userId) {
        const newUserId = generateUserId();
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('viewTimestamp', Date.now());
        return false;
    }

    if (viewTimestamp) {
        const lastView = parseInt(viewTimestamp);
        const hoursSinceLastView = (Date.now() - lastView) / (1000 * 60 * 60);
        
        if (hoursSinceLastView >= 24) {
            localStorage.setItem('viewTimestamp', Date.now());
            return false;
        }
    }

    return true;
};

const updateViewCount = async () => {
    if (!hasUserViewed()) {
        try {
            const result = await viewsRef.transaction(currentViews => (currentViews || 0) + 1);
            const views = result.snapshot.val();
            document.getElementById('viewCount').textContent = formatNumber(views);
        } catch (error) {
            console.error('Error updating view count:', error);
            document.getElementById('viewCount').textContent = '--';
        }
    }
};

viewsRef.on('value', snapshot => {
    const views = snapshot.val();
    if (views) {
        document.getElementById('viewCount').textContent = formatNumber(views);
    }
});

const playlist = [
    {
        title: 'BUNNY SUIT',
        artist: 'SEMATARY FT. GHOST MOUNTAIN',
        url: 'SEMATARY FT. GHOST MOUNTAIN - BUNNY SUIT.mp3'
    },
    {
        title: 'SLAUGHTER',
        artist: 'SEMATARY',
        url: 'SEMATARY - SLAUGHTER.mp3'
    },
    {
        title: 'HAUNTED MOUND REAPERS',
        artist: 'SEMATARY FT. HACKLE',
        url: 'SEMATARY FT. HACKLE - HAUNTED MOUND REAPERS.mp3'
    },
    {
        title: 'CREEPIN THRU DA WOODS',
        artist: 'SEMATARY',
        url: 'SEMATARY - CREEPIN THRU DA WOODS.mp3'
    },
    {
        title: 'FUNERAL',
        artist: 'SEMATARY FT. GHOST MOUNTAIN',
        url: 'SEMATARY FT. GHOST MOUNTAIN - FUNERAL.mp3'
    },
    {
        title: 'CHAINSAW PARTY',
        artist: 'SEMATARY',
        url: 'SEMATARY - CHAINSAW PARTY.mp3'
    }
];

let currentSongIndex = 0;

function loadSong(song) {
    audioPlayer.src = song.url;
    songTitleEl.textContent = song.title;
    songArtistEl.textContent = song.artist;
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(playlist[currentSongIndex]);
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > playlist.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(playlist[currentSongIndex]);
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
    durationEl.textContent = formatTime(duration);
}
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
progressBar.addEventListener('click', setProgress);

audioPlayer.addEventListener('ended', nextSong);

loadSong(playlist[0]);

// Market Screen Functionality
const marketBtn = document.getElementById('marketBtn');
const marketScreen = document.getElementById('marketScreen');
const closeMarket = document.getElementById('closeMarket');

// Fullscreen Image Functionality
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenImg = fullscreenImage.querySelector('img');
const closeImage = document.getElementById('closeImage');
const productImages = document.querySelectorAll('.item-image.clickable');

marketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    marketScreen.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMarket.addEventListener('click', () => {
    marketScreen.classList.remove('active');
    document.body.style.overflow = '';
});

// Close market screen when clicking outside
marketScreen.addEventListener('click', (e) => {
    if (e.target === marketScreen) {
        marketScreen.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Image fullscreen functionality
productImages.forEach(imageContainer => {
    imageContainer.addEventListener('click', (e) => {
        const img = imageContainer.querySelector('img');
        const rect = img.getBoundingClientRect();
        
        // Position fullscreen image at the same place as thumbnail
        fullscreenImg.style.position = 'absolute';
        fullscreenImg.style.top = `${rect.top}px`;
        fullscreenImg.style.left = `${rect.left}px`;
        fullscreenImg.style.width = `${rect.width}px`;
        fullscreenImg.style.height = `${rect.height}px`;
        fullscreenImg.style.objectFit = 'cover';
        
        // Set the image source
        fullscreenImg.src = img.src;
        
        // Show the fullscreen container
        fullscreenImage.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset the image position after a brief delay
        setTimeout(() => {
            fullscreenImg.style.position = '';
            fullscreenImg.style.top = '';
            fullscreenImg.style.left = '';
            fullscreenImg.style.width = '';
            fullscreenImg.style.height = '';
            fullscreenImg.style.objectFit = '';
        }, 50);
        
        e.stopPropagation();
    });
});

closeImage.addEventListener('click', () => {
    fullscreenImage.classList.remove('active');
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 300); // Match the CSS transition duration
});

fullscreenImage.addEventListener('click', (e) => {
    if (e.target === fullscreenImage) {
        fullscreenImage.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300); // Match the CSS transition duration
    }
});

// Handle download button click
const downloadButtons = document.querySelectorAll('.download-button');
downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if it's a disabled button
        if (button.hasAttribute('disabled')) {
            return;
        }
        
        // Get the download link
        const downloadLink = button.getAttribute('href');
        
        // Create a temporary anchor element to trigger download
        const tempLink = document.createElement('a');
        tempLink.href = downloadLink;
        tempLink.download = downloadLink.split('/').pop(); // Use filename from link
        
        // Trigger download
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        // Animation feedback
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        console.log(`Downloading: ${downloadLink}`);
    });
});

// Close screens with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (fullscreenImage.classList.contains('active')) {
            fullscreenImage.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300); // Match the CSS transition duration
        } else if (marketScreen.classList.contains('active')) {
            marketScreen.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Add to cart functionality
const buyButtons = document.querySelectorAll('.buy-button');
buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.market-item');
        const itemName = item.querySelector('h3').textContent;
        const itemPrice = item.querySelector('.item-price').textContent;
        
        // Add animation to button
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        // You can add actual cart functionality here
        console.log(`Added to cart: ${itemName} - ${itemPrice}`);
    });
});

// Market Categories
const categoryBtns = document.querySelectorAll('.category-btn');
const marketLists = document.querySelectorAll('.market-list');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Don't do anything if clicking the active category
        if (btn.classList.contains('active')) return;
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate category change
        marketLists.forEach(list => {
            if (list.classList.contains('active')) {
                // Fade out current category
                list.classList.add('fade-out');
                list.classList.remove('active');
                
                // After fade out, show new category
                setTimeout(() => {
                    list.classList.remove('fade-out');
                    
                    // Show new category
                    marketLists.forEach(newList => {
                        if (newList.dataset.category === category) {
                            newList.classList.add('active');
                        }
                    });
                }, 300);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    mainContent.style.display = 'none';
    
    loadSong(playlist[0]);
    
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    updateViewCount();
});
