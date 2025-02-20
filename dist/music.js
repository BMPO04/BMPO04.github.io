document.addEventListener('DOMContentLoaded', () => {
    // 初始化播放器
    const ap = new APlayer({ 
       container: document.getElementById('aplayer'),
        fixed: true,
        preload: 'auto',
        autoplay: true, 
        audio: [
            {
            name: '老人与海（管弦）',
            artist: '未知艺术家',
            url: '/music/laor.mp3', 
        },
   {
            name: 'ire_the_foggy_dew',
            artist: '未知艺术家',
            url: '/music/ire_the_foggy_dew.mp3', // 替换为你的本地音乐文件路径
            //cover: '/images/cover.jpg', 替换为封面图片路
        }

        ]
  });
    let isInitialized = false;
    
    // 预创建播放引导组件
    const createPlayButton = () => {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
        });
        btn.textContent = '点击播放音乐';
        return btn;
    };

    // 统一播放控制逻辑
    const attemptPlay = async () => {
        if (isInitialized) return;
        isInitialized = true;
        
        try {
            await ap.play();
        } catch (error) {
            handlePlayError(error);
        }
    };

    // 错误处理模块化
    const handlePlayError = (error) => {
        console.error('播放失败:', error);
        const playButton = createPlayButton();
        
        const clickHandler = () => {
            ap.play().finally(() => {
                playButton.remove();
                playButton.removeEventListener('click', clickHandler);
            });
        };
        
        playButton.addEventListener('click', clickHandler);
        document.body.appendChild(playButton);
    };

    // 智能事件绑定
    const initEvent = ('ontouchstart' in window) ? 'touchstart' : 'click';
    document.addEventListener(initEvent, attemptPlay, { once: true });
});
