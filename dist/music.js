
document.addEventListener('DOMContentLoaded', function () {
    // 初始化 APlayer
    const ap = new APlayer({
        container: document.getElementById('aplayer'),
        fixed: true,
        preload: 'auto',
        autoplay: false, // 禁用自动播放
        audio: [
            {
            name: '老人与海（管弦）',
            artist: '未知艺术家',
            url: '/music/laor.mp3', // 替换为你的本地音乐文件路径
            //cover: '/images/cover.jpg', 替换为封面图片路径
        },
   {
            name: 'ire_the_foggy_dew',
            artist: '未知艺术家',
            url: '/music/ire_the_foggy_dew.mp3', // 替换为你的本地音乐文件路径
            //cover: '/images/cover.jpg', 替换为封面图片路
        }

        ]
    });

    // 定义播放函数
    function playMusic() {
        ap.play(); // 播放音乐
        console.log('音乐已播放');
    }

    // 监听用户交互事件（点击页面）
    document.addEventListener('click', playMusic, { once: true });
document.addEventListener('scroll', playMusic, { once: true });

    // 设置定时器：1秒后自动播放
    setTimeout(() => {
        if (!ap.audio.paused) return; // 如果已经播放，则不操作
        playMusic(); // 1秒后自动播放
        console.log('1秒后自动播放');
    }, 1000);
});