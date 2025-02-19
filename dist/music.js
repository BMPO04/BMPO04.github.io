const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: true,
    audio: [
        {
            name: '歌曲名称',
            artist: '艺术家',
            url: '/music/ire_the_foggy_dew.mp3', // 替换为你的本地音乐文件路径
            //cover: '/images/cover.jpg', 替换为封面图片路径
        }
        // 可以继续添加更多歌曲
    ]
});