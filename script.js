document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Alert Button Logic (if present) ---
    const button = document.getElementById('alertButton');
    if (button) {
        button.addEventListener('click', () => {
            alert('ボタンがクリックされました！');
        });
    }

    // --- Scroll Rotation Logic ---
    const shapes = document.querySelectorAll('.bg-shape');

    // Initialize shapes: store existing rotation
    shapes.forEach((shape, index) => {
        const style = window.getComputedStyle(shape);
        const matrix = style.transform;
        let initialAngle = 0;

        // Parse computed transform matrix to get degrees
        if (matrix !== 'none') {
            const values = matrix.split('(')[1].split(')')[0].split(',');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            initialAngle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }

        shape.dataset.initialRotation = initialAngle;
        // Check if the shape is on the right or left based on class or computed style implies position
        // Or just alternate for variety. 
        // Index based alternation: evens +, odds -
        shape.dataset.speed = (index % 2 === 0) ? 0.1 : -0.1; 
    });

    // Update rotation on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach(shape => {
            const initial = parseFloat(shape.dataset.initialRotation || 0);
            const speed = parseFloat(shape.dataset.speed || 0.1);
            const rotation = initial + (scrollY * speed);
            shape.style.transform = `rotate(${rotation}deg)`;
        });
    });

    // --- Chat Bubble Fade-in Logic ---
    const chatRows = document.querySelectorAll('.chat-row');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // 少し内側に入ってから発火
        threshold: 0.1 // 10%が見えたら
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示されたら監視終了
            }
        });
    }, observerOptions);

    chatRows.forEach(row => {
        observer.observe(row);
    });
});

// �g�b�v�֖߂�{�^���̍쐬�Ɛ���
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.innerHTML = '↑';
backToTopBtn.ariaLabel = 'トップへ戻る';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

