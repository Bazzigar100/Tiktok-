document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const videoFeedContainer = document.querySelector('.video-feed-container');
    const uploadButton = document.querySelector('.upload-btn');
    const uploadInput = document.getElementById('upload-input');

    let videos = JSON.parse(localStorage.getItem('videos')) || [
        {
            id: 1,
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            username: '@bunny',
            caption: 'Big Buck Bunny is a 2008 short computer-animated comedy film.',
            likes: 1200000,
            comments: '34.5K',
            shares: '10.2K'
        },
        {
            id: 2,
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            username: '@dreamer',
            caption: 'Elephants Dream is a 2006 computer-animated science fiction fantasy short film.',
            likes: 987000,
            comments: '22.1K',
            shares: '8.5K'
        },
        {
            id: 3,
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            username: '@fire',
            caption: 'For Bigger Blazes is a short film by the Blender Foundation.',
            likes: 500000,
            comments: '10K',
            shares: '2K'
        }
    ];

    function formatLikes(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    function handleLike(videoId, likeButton) {
        const video = videos.find(v => v.id === videoId);
        if (video) {
            video.likes++;
            localStorage.setItem('videos', JSON.stringify(videos));
            likeButton.querySelector('span').textContent = formatLikes(video.likes);
        }
    }

    function createVideoElement(videoData) {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');
        videoContainer.dataset.videoId = videoData.id;

        const video = document.createElement('video');
        video.src = videoData.src;
        video.loop = true;
        video.muted = false; // Set to false for sound, but browsers may block autoplay with sound

        const overlay = document.createElement('div');
        overlay.classList.add('video-overlay');
        overlay.innerHTML = `
            <div class="username">${videoData.username} ${currentUser.isPremium ? '<span class="premium-badge">Premium</span>' : ''}</div>
            <div class="caption">${videoData.caption}</div>
        `;

        const sidebar = document.createElement('div');
        sidebar.classList.add('video-sidebar');
        sidebar.innerHTML = `
            <div class="video-actions">
                <button class="like-btn">❤️<span>${formatLikes(videoData.likes)}</span></button>
                <button>💬<span>${videoData.comments}</span></button>
                <button>🔗<span>${videoData.shares}</span></button>
            </div>
            <img src="https://i.pravatar.cc/150?u=${videoData.username}" class="profile-pic">
        `;

        const likeButton = sidebar.querySelector('.like-btn');
        likeButton.addEventListener('click', () => handleLike(videoData.id, likeButton));

        videoContainer.appendChild(video);
        videoContainer.appendChild(overlay);
        videoContainer.appendChild(sidebar);

        return videoContainer;
    }

    function loadVideos() {
        videoFeedContainer.innerHTML = '';
        videos.forEach(videoData => {
            const videoElement = createVideoElement(videoData);
            videoFeedContainer.appendChild(videoElement);
        });
        setupIntersectionObserver();
    }

    // Autoplay videos when they are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play().catch(e => console.error("Autoplay was prevented: ", e));
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });

    function setupIntersectionObserver() {
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            observer.observe(container);
        });
    }
    
    // Simulate upload
    if(uploadButton && uploadInput) {
        uploadButton.addEventListener('click', () => {
            uploadInput.click();
        });

        uploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const newVideo = {
                    id: videos.length + 1,
                    src: URL.createObjectURL(file),
                    username: `@${currentUser.username}`,
                    caption: 'A new video!',
                    likes: 0,
                    comments: '0',
                    shares: '0'
                };
                videos.push(newVideo);
                localStorage.setItem('videos', JSON.stringify(videos));
                loadVideos();
            }
        });
    }

    loadVideos();

    const premiumBtn = document.getElementById('premium-btn');
    const premiumModal = document.getElementById('premium-modal');
    const closeBtn = document.querySelector('.close-btn');
    const verifyPaymentBtn = document.getElementById('verify-payment-btn');

    premiumBtn.addEventListener('click', () => {
        premiumModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        premiumModal.style.display = 'none';
    });

    verifyPaymentBtn.addEventListener('click', () => {
        const transactionId = document.getElementById('transaction-id').value;
        if (transactionId === '100') {
            const users = JSON.parse(localStorage.getItem('tiktok_users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);

            if (userIndex !== -1) {
                users[userIndex].isPremium = true;
                localStorage.setItem('tiktok_users', JSON.stringify(users));
                sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
                alert('Congratulations! You are now a premium member.');
                location.reload();
            }
        } else {
            alert('Invalid transaction ID.');
        }
    });
});
