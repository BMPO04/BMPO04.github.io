const ap = new APlayer({
    container: document.getElementById('player'),
    fixed: true,
    autoplay:true,
    audio: [{
        name: 'name',
        artist: 'artist',
        url: 'url1.mp3',
         cover: 'cov.jpg',
    }]
});