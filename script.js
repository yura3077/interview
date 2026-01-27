// --- 5ページ目 左下スライドショー ---
document.addEventListener('DOMContentLoaded', () => {
    const slideImg = document.getElementById('slideshow-5-5');
    if (slideImg) {
        const slideImages = [
            'images/5-5-1.PNG',
            'images/5-5-2.PNG',
            'images/5-5-3.PNG',
            'images/5-5-4.PNG',
            'images/5-5-5.PNG',
            'images/5-5-6.PNG',
            'images/5-5-7.PNG',
            'images/5-5-8.PNG',
            'images/5-5-9.PNG',
            'images/5-5-10.PNG'
        ];
        let idx = 0;
        let started = false;
        let observer = null;
        // 画像の存在チェック関数
        function imageExists(url, callback) {
            const img = new Image();
            img.onload = () => callback(true);
            img.onerror = () => callback(false);
            img.src = url;
        }

        function showNextImage() {
            if (idx < slideImages.length - 1) {
                idx++;
                imageExists(slideImages[idx], exists => {
                    if (exists) {
                        slideImg.style.display = '';
                        slideImg.src = slideImages[idx];
                    } else {
                        slideImg.style.display = 'none';
                    }
                });
                if (idx < slideImages.length - 1) {
                    setTimeout(showNextImage, 1000);
                }
            }
        }

        // Intersection Observerで画像が見えたらスタート
        function startSlideshowIfVisible(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    setTimeout(showNextImage, 1000);
                    if (observer) observer.disconnect();
                }
            });
        }
        observer = new window.IntersectionObserver(startSlideshowIfVisible, {
            threshold: 0.3 // 画像の30%以上が見えたら
        });
        observer.observe(slideImg);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // アラートボタンの処理
    const button = document.getElementById('alertButton');
    if (button) {
        button.addEventListener('click', () => {
            alert('ボタンがクリックされました！');
        });
    }

    // --- スクロール回転アニメーション (.bg-shape と .hero-decoration) ---
    const rotateShapes = document.querySelectorAll('.bg-shape, .hero-decoration');

    rotateShapes.forEach((shape, index) => {
        // 現在の初期角度を取得 (CSSで設定された transform: rotate(...) を読み取る)
        const style = window.getComputedStyle(shape);
        const matrix = style.transform;
        let initialAngle = 0;

        // matrix(a, b, c, d, tx, ty) から角度を計算
        if (matrix && matrix !== 'none') {
            const values = matrix.split('(')[1].split(')')[0].split(',');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            // atan2(b, a) でラジアンを取得し、度数法に変換
            initialAngle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }

        shape.dataset.initialRotation = initialAngle;
        
        // インデックスに基づいて回転方向と速度を設定
        // 偶数は時計回り(正)、奇数は反時計回り(負)
        // 0.4 は回転速度の係数（少し速め）
        shape.dataset.speed = (index % 2 === 0) ? 0.4 : -0.4; 
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        rotateShapes.forEach(shape => {
            const initial = parseFloat(shape.dataset.initialRotation);
            const speed = parseFloat(shape.dataset.speed);
            // 現在の回転角度 = 初期角度 + (スクロール量 * 速度)
            const currentRotation = initial + (scrollY * speed);
            shape.style.transform = `rotate(${currentRotation}deg)`;
        });
    });

    // --- チャットの吹き出し表示アニメーション ---
    const chatRows = document.querySelectorAll('.chat-row');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // 少し内側に入ってから発火
        threshold: 0.1 // 10%が見えたら
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // 一度表示されたら監視終了
            }
        });
    }, observerOptions);

    chatRows.forEach(row => {
        observer.observe(row);
    });
});

// --- 「トップへ戻る」ボタン ---
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.innerHTML = '↑'; // 矢印
backToTopBtn.ariaLabel = 'トップへ戻る';

// document.body が読み込まれているか確認してから追加
if (document.body) {
    document.body.appendChild(backToTopBtn);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(backToTopBtn);
    });
}

// スクロール時にボタンの表示/非表示を切り替え
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// クリック時にトップへスムーズスクロール
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
