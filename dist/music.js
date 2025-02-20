
document.addEventListener('DOMContentLoaded', function () {
    // 初始化 APlayer
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
  // 标志：是否已经播放过音乐
    let hasPlayed = false;

    // 定义播放音乐的函数
    function playMusic() {
        if (hasPlayed) return; // 如果已经播放过，则不再触发
        ap.play().catch((error) => {
            console.warn('自动播放失败，需要用户交互', error);
        });
        hasPlayed = true; // 标记为已播放
        removeInteractionListeners(); // 移除所有交互事件监听器
    }

    // 注册用户交互事件监听器
    function registerInteractionListeners() {
        document.addEventListener('mousemove', playMusic, { once: true });
        document.addEventListener('scroll', playMusic, { once: true });
        document.addEventListener('click', playMusic, { once: true });
    }

    // 移除所有交互事件监听器
    function removeInteractionListeners() {
        document.removeEventListener('mousemove', playMusic);
        document.removeEventListener('scroll', playMusic);
        document.removeEventListener('click', playMusic);
    }

    // 设置定时器：5秒后自动播放
    setTimeout(() => {
        playMusic(); // 5秒后尝试自动播放
    }, 5000);

    // 注册用户交互事件监听器
    registerInteractionListeners();

    // 监听播放器的暂停事件
    ap.on('pause', () => {
        console.log('音乐已暂停');
        // 用户暂停后，不再允许通过交互触发播放
        hasPlayed = false; // 允许再次播放
    });
});