"use strict";
var leonus = {
  week: { 0: "日", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", },
  // 补0
  nol(h) { h = Number(h); return h > 9 ? h : '0' + h; },
  // 切换模式
  switchDarkMode() {
    "light" == ("dark" === document.documentElement.getAttribute("data-theme") ? "dark" : "light") ? (activateDarkMode(),
      saveToLocal.set("theme", "dark", 1),
      void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)) : (activateLightMode(),
        saveToLocal.set("theme", "light", 1),
        void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)),
      "function" == typeof utterancesTheme && utterancesTheme(),
      "object" === ("undefined" == typeof FB ? "undefined" : _typeof(FB)) && window.loadFBComment(),
      window.DISQUS && document.getElementById("disqus_thread").children.length && setTimeout(function () {
        return window.disqusReset()
      }, 200)
  },
  // 切换统计颜色
  switchPostChart() {
    // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
      try {
        let postsOptionNew = postsOption
        postsOptionNew.title.textStyle.color = color
        postsOptionNew.yAxis.nameTextStyle.color = color
        postsOptionNew.xAxis.axisLabel.color = color
        postsOptionNew.yAxis.axisLabel.color = color
        postsOptionNew.xAxis.axisLine.lineStyle.color = color
        postsOptionNew.yAxis.axisLine.lineStyle.color = color
        postsOptionNew.series[0].markLine.data[0].label.color = color
        postsChart.setOption(postsOptionNew)
      } catch (error) { }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
      try {
        let tagsOptionNew = tagsOption
        tagsOptionNew.title.textStyle.color = color
        tagsOptionNew.yAxis.nameTextStyle.color = color
        tagsOptionNew.xAxis.axisLabel.color = color
        tagsOptionNew.yAxis.axisLabel.color = color
        tagsOptionNew.xAxis.axisLine.lineStyle.color = color
        tagsOptionNew.yAxis.axisLine.lineStyle.color = color
        tagsOptionNew.series[0].markLine.data[0].label.color = color
        tagsChart.setOption(tagsOptionNew)
      } catch (error) { }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
      try {
        let categoriesOptionNew = categoriesOption
        categoriesOptionNew.title.textStyle.color = color
        categoriesOptionNew.legend.textStyle.color = color
        categoriesOptionNew.legend.pageTextStyle.color = color
        categoriesOptionNew.series[0].label.color = color
        categoriesChart.setOption(categoriesOptionNew)
      } catch (error) { }
    }
  },
  // footer随机获取友链
  randomLink() {
    let data = saveToLocal.get('links')
    if (data) {
      let footer = document.querySelectorAll('#friend-links-in-footer .footer-item')
      if (!footer.length) return
      for (let i = 0; i < 5; i++) {
        let num = parseInt(Math.random() * data.length)
        footer[i].innerText = data[num].name
        footer[i].href = data[num].link
        data.splice(num, 1)
      }
      return
    }
    fetch('/link.json').then(res => res.json()).then(data => {
      saveToLocal.set('links', data.link_list, 0.02)
      this.randomLink()
    })
  },
  // 加载壁纸
  loadBG() {
    try {
      let data = saveToLocal.get('blogbg')
      if (data) this.changeBg(data, 1)
      else {
        localStorage.removeItem('blogbg');
        if (location.pathname != "/music/") document.getElementById('web_bg').style.backgroundImage = 'none'
      }
    } catch (error) { localStorage.removeItem('blogbg'); }
  },
  // 切换背景,flag为1不弹窗
  changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) == '#') {
      bg.style.backgroundColor = s
      bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    document.querySelector('#nav').style.background = 'var(--card-bg)';
    if (!flag) {
      btf.snackbarShow("壁纸切换成功，将于一天后到期~");
      saveToLocal.set('blogbg', s, 1)
    }
  },
  // 随即壁纸
  // 运行时间
  runtime() {
    let startTime = new Date('2021/10/15 00:00:00').getTime(),
      nowTime = new Date().getTime(),
      second = Math.round((nowTime - startTime) / 1000),
      html = "本站已运行：";
    let kunYear = (second / 78840000).toFixed(2)

    if (second >= 86400) {
      html += leonus.nol(parseInt(second / 86400)) + ' 天 ';
      second %= 86400;
    }
    if (second >= 3600) {
      html += leonus.nol(parseInt(second / 3600)) + ' 时 ';
      second %= 3600;
    }
    if (second >= 60) {
      html += leonus.nol(parseInt(second / 60)) + ' 分 ';
      second %= 60;
    }
    if (second >= 0) html += leonus.nol(second) + ' 秒';



    let dom = document.getElementById("runtime")
    if (dom) {
      dom.innerHTML = html
      dom.title = `本站已运行 ${kunYear} 坤年🐔🏀`
    }
    setTimeout(leonus.runtime, 1000);
  },
  // 手机菜单
  sidebar() {
    let sidebar = document.querySelectorAll('#sidebar-menus .menus_items .site-page.group')
    if (!sidebar) return
    sidebar.forEach(i => { i.addEventListener('click', () => { sidebar.forEach(j => { if (j != i) j.classList.add('hide') }); }) });
  },
  // twikoo 博主 icon
  twIcon() {
    document.querySelectorAll('.tk-content a').forEach(i => { if (i.innerText.indexOf("@") == 0) i.style.color = "#f56c6cb3" })
    let box = document.querySelectorAll('.tk-master .tk-main .tk-row .tk-meta .tk-tag-green')
    if (box.length > 0) box.forEach(i => {
      i.className = 'Leonus';
      i.innerHTML = '<svg style="width:15px;height:15px;" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"></path></svg>'
    })
  },
  // 随机文章函数
  async randomPost() {
    let data = saveToLocal.get('articles')
    if (!data) data = await this.getArticles()
    data = data.filter(a => a.type == 'post').sort(() => 0.5 - Math.random()).splice(0, 5)
    while (true) {
      let to = data[Math.floor(Math.random() * data.length)]
      if (to.path == location.pathname) continue;
      pjax.loadUrl(to.path)
      return;
    }
  },
  // 评论总数
  comCount() {
    function count(num) {
      try {
        document.querySelectorAll('.card_comment').forEach(i => { i.innerHTML = num; });
        document.querySelector('.card-info .card_comment').parentNode.title = '累计评论数：' + num;
      } catch (error) { }
    }
    if (document.querySelector('.card_comment')) {
      let data = saveToLocal.get('comCount')
      if (data) count(data)
      else {
        fetch('https://api.leonus.cn/comCount').then(res => res.text()).then(data => {
          count(data)
          saveToLocal.set('comCount', data, 0.01);
        }).catch()
      }
    }
  },
  // 创建窗口
  winbox: '',
  createWinbox() {
    let div = document.createElement('div')
    document.body.appendChild(div)
    this.winbox = WinBox({
      id: 'changeBgBox',
      index: 999,
      title: "切换背景",
      x: "center",
      y: "center",
      minwidth: '300px',
      height: "60%",
      background: 'var(--leonus-blue)',
      onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}.winbox{border-radius:0}</style>` },
      onrestore: () => { div.innerHTML = '' }
    });
    this.winResize(leonus.winbox, 'changeBgBox');
    window.addEventListener('resize', () => leonus.winResize(leonus.winbox, 'changeBgBox'))
    this.winbox.body.innerHTML = `
    <style>
        #changeBgBox .note {
            font-size: 14px;
            margin: 0 0 10px;
            padding: 9px 0 9px 2.3rem;
        }
        #changeBgBox .note:not(.no-icon)::before,
        #changeBgBox .note>.note-icon {
            left: 0.5em;
        }
        #changeBgBox button {
            padding:12px 0 !important;
        }
        #changeBgBox a.imgbox {
            text-decoration: none !important;
        }
        #changeBgBox .toggle>.toggle-content {
            margin: 0;
        }
    </style>
    <div id="article-container" style="padding:10px;"><div class="note info flat"><p>点击对应样式即可切换背景。</p>
    </div>
    <div class="note pink icon-padding flat"><i class="note-icon fa-solid fa-image"></i><p>有效期为一天，到期切回默认壁纸。</p>
    </div>

    <p><button onclick="localStorage.removeItem('blogbg');location.reload();" style="background:#5fcdff;display:block;width:100%;padding: 15px 0;border-radius:6px;color:white;"><i class="fa-solid fa-arrows-rotate"></i> 点我恢复默认背景</button></p>
    
    <h2 id="图片"><a href="#图片" class="headerlink" title="图片"></a>图片</h2>
    <details class="toggle"><summary class="toggle-button" style="">查看电脑壁纸</summary>
        <div class="toggle-content">
            <div class="bgbox">
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/dd4aee16880411ebb6edd017c2d2eca2.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/dd4aee16880411ebb6edd017c2d2eca2.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/66a0f1473a0f4ae7850ac8607774eb03.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/66a0f1473a0f4ae7850ac8607774eb03.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/058fe486bd784f28875a7a01f68d09de.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/058fe486bd784f28875a7a01f68d09de.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/c9d3deb2880411ebb6edd017c2d2eca2.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/c9d3deb2880411ebb6edd017c2d2eca2.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/0d73ff1af5c149c2af78a4c7280c9ac9.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/0d73ff1af5c149c2af78a4c7280c9ac9.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/08206a3879f9467f93eb18e279dd2642.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/08206a3879f9467f93eb18e279dd2642.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/14d9904fe2ac4961b203c3eb2f2f467f.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/14d9904fe2ac4961b203c3eb2f2f467f.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/f048e9726518419fa15dd365902500c4.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/f048e9726518419fa15dd365902500c4.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/bab9141327ca48e39abef6229b79cf9c.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/bab9141327ca48e39abef6229b79cf9c.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/a26f66658e014e06aa70e2753742bef3.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/a26f66658e014e06aa70e2753742bef3.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/35d9316f450041b89232893f083a57f1.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/35d9316f450041b89232893f083a57f1.webp)')"></a>
                <a href="javascript:;" style="background-image:url(https://cdn.leonus.cn/other/6143778327db4d17adbb63c0f6c0a8af.webp)" class="imgbox" onclick="leonus.changeBg('url(https\://cdn.leonus.cn/other/6143778327db4d17adbb63c0f6c0a8af.webp)')"></a>
            </div>
        </div>
    </details>

    <h2 id="渐变色"><a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色</h2>
    <details class="toggle"><summary class="toggle-button" style="">查看渐变背景</summary>
        <div class="toggle-content">
            <div class="bgbox">
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, #eecda3, #ef629f)" onclick="leonus.changeBg('linear-gradient(to right, #eecda3, #ef629f)')"></a>
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, rgb(255, 110, 127), rgb(191, 233, 255))" onclick="leonus.changeBg('linear-gradient(to right, #eecda3, #ef629f)')"></a>
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, #ff4b1f, #1fddff)" onclick="leonus.changeBg('linear-gradient(to right, #ff4b1f, #1fddff)')"></a>
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, rgb(251, 215, 134), rgb(247, 121, 125))" onclick="leonus.changeBg('linear-gradient(to right, rgb(251, 215, 134), rgb(247, 121, 125))')"></a>
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, #16bffd, #cb3066)" onclick="leonus.changeBg('linear-gradient(to right, #16bffd, #cb3066)')"></a>
            <a href="javascript:;" class="box" style="background: linear-gradient(to right, rgb(192, 192, 170), rgb(28, 239, 255))" onclick="leonus.changeBg('linear-gradient(to right, rgb(192, 192, 170), rgb(28, 239, 255))')"></a>
            </div>
        </div>
    </details>

    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>
    <details class="toggle"><summary class="toggle-button" style="">查看纯色背景</summary>
        <div class="toggle-content">
            <div class="bgbox">
            <a href="javascript:;" class="box" style="background: #F4E2D8" onclick="leonus.changeBg('#F4E2D8')"></a>
            <a href="javascript:;" class="box" style="background: #7D9D9C" onclick="leonus.changeBg('#7D9D9C')"></a>
            <a href="javascript:;" class="box" style="background: #F2D7D9" onclick="leonus.changeBg('#F2D7D9')"></a>
            <a href="javascript:;" class="box" style="background: #76BA99" onclick="leonus.changeBg('#76BA99')"></a>
            <a href="javascript:;" class="box" style="background: #9FC088" onclick="leonus.changeBg('#9FC088')"></a>
            <a href="javascript:;" class="box" style="background: #CEAB93" onclick="leonus.changeBg('#CEAB93')"></a>
            </div>
        </div>
    </details>
`;
  },
  // 适应窗口大小
  winResize(obj, id) {
    let box = document.querySelector('#' + id)
    if (!box || box.classList.contains('min') || box.classList.contains('max')) return
    var offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) obj.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    else obj.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
  },
  // 按钮切换显示，有窗口进行切换，没窗口创建窗口
  toggleWinbox() {
    if (document.querySelector('#changeBgBox')) leonus.winbox.toggleClass('hide');
    else leonus.createWinbox();
  },
  // 换线
  switchLine() {
    let host = location.host
    if (host == 'b.leonus.cn' && document.querySelector('.announcement_content')) {
      document.querySelector('.announcement_content').innerHTML = `您当前使用的是Vercel线路，欢迎使用主线路访问本站：<a style="color: var(--leonus-main);" href="https://blog.leonus.cn/">blog.leonus.cn</a>`
      document.querySelectorAll('.menus_item:last-child ul li:first-child a').forEach(i => { i.href = 'https://blog.leonus.cn/' })
    }
    if (saveToLocal.get('line')) return;
    setTimeout(() => {
      if (document.referrer.match(/b.leonus.cn/i) && host == 'blog.leonus.cn') {
        btf.snackbarShow("欢迎使用主线路访问本站。");
        saveToLocal.set('line', 1, 0.04);
      }
      if (document.referrer.match(/blog.leonus.cn/i) && host == 'b.leonus.cn') {
        btf.snackbarShow("欢迎使用Vercel线路访问本站。")
        saveToLocal.set('line', 1, 0.04);
      }
    }, 500)
  },
  // 申请友链
  linkCom(type) {
    var n = document.querySelector(".el-textarea__inner")
    if (type == 'bf') {
      n.value = '```yml\n';
      n.value += `    - name: 
      link: 
      avatar: 
      descr: 
      rss: `;
      n.value += '\n```';
      n.setSelectionRange(15, 15);
    } else {
      n.value = `站点名称：
站点地址：
头像链接：
站点描述：
RSS地址：`;
      n.setSelectionRange(5, 5);
    }
    n.focus();
  },
  // 表情放大
  owoBig() {
    if (!document.getElementById('post-comment') || document.body.clientWidth < 768) return
    let flag = 1, // 设置节流阀
      owo_time = '', // 设置计时器
      m = 3; // 设置放大倍数

    let body = document.body,
      div = document.getElementById('owo-big');
    if (!div) {
      // 创建盒子
      div = document.createElement('div');
      // 设置ID
      div.id = 'owo-big';
      // 插入盒子
      body.appendChild(div)
    }

    // 构造observer
    let observer = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i++) {
        let dom = mutations[i].addedNodes,
          owo_body = '';
        if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
        else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
        else continue;

        // 鼠标移入
        owo_body.onmouseover = (e) => {
          if (flag && ((owo_body.className == 'OwO-body' && e.target.tagName == 'IMG') || e.target.className == 'tk-owo-emotion')) {
            flag = 0;
            // 移入300毫秒后显示盒子
            owo_time = setTimeout(() => {
              let height = e.target.clientHeight * m, // 盒子高
                width = e.target.clientWidth * m, // 盒子宽
                left = (e.x - e.offsetX) - (width - e.target.clientWidth) / 2, // 盒子与屏幕左边距离
                top = e.y - e.offsetY; // 盒子与屏幕顶部距离

              if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10); // 右边缘检测，防止超出屏幕
              if (left < 0) left = 10; // 左边缘检测，防止超出屏幕
              // 设置盒子样式
              div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
              // 在盒子中插入图片
              div.innerHTML = `<img src="${e.target.src}">`
            }, 300);
          }
        };
        // 鼠标移出隐藏盒子
        owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
      }
    })
    observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // 监听的 元素 和 配置项
  },
  // 页面百分比
  percent() {
    let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
      b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight, // 整个网页高度
      result = Math.round(a / b * 100), // 计算百分比
      up = document.querySelector("#go-up"), // 获取按钮
      down = document.querySelector("#go-down"); // 获取按钮
    if (!up) return
    if (result <= 95) {
      up.childNodes[0].style.display = 'none'
      up.childNodes[1].style.display = down.style.display = 'block'
      up.childNodes[1].innerHTML = result;
    } else {
      up.childNodes[1].style.display = down.style.display = 'none'
      up.childNodes[0].style.display = 'block'
    }
  },
  // talkTime: null,
  // 说说轮播
  // indexTalk() {
  //   if (leonus.talkTime) {
  //     clearInterval(leonus.talkTime)
  //     leonus.talkTime = null;
  //   }
  //   if (!document.getElementById('bber-talk')) return

  //   function toText(ls) {
  //     let text = []
  //     ls.forEach(item => { text.push(item.content.replace(/#(.*?)\s/g, '').replace(/{\s*music\s*(.*)\s*}/g, '<i class="fa-solid fa-music"></i>').replace(/{\s*bilibili\s*(.*)\s*}/g, '<i class="fa-brands fa-bilibili"></i>').replace(/```/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-image"></i>').replace(/\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-link"></i>')) });
  //     return text
  //   }

  //   function talk(ls) {
  //     let html = ''
  //     ls.forEach((item, i) => { html += `<li class="item item-${i + 1}">${item}</li>` });
  //     let box = document.querySelector("#bber-talk .talk-list")
  //     if (box) {
  //       box.innerHTML = html;
  //       leonus.talkTime = setInterval(() => { box.appendChild(box.children[0]); }, 3000);
  //     }
  //   }

  //   let d = saveToLocal.get('talk');
  //   if (d) talk(d);
  //   else {
  //     fetch('https://m.leonus.cn/api/v1/memo?creatorId=1&tag=说说&limit=10').then(res => res.json()).then(data => {
  //       data = toText(data);
  //       talk(data);
  //       saveToLocal.set('talk', data, 0.01);
  //     })
  //   }
  // },
  // 分类条滚轮
  topCategoriesBarScroll() {
    if (document.querySelector(".categoryBar-list")) {
      let xscroll = document.querySelector(".categoryBar-list");
      xscroll.addEventListener("mousewheel", function (e) {
        //计算鼠标滚轮滚动的距离
        let v = -e.wheelDelta / 2;
        xscroll.scrollLeft += v;
        //阻止浏览器默认方法
        e.preventDefault();
      }, false);
    }
  },
  // 控制台打印信息
  logInfo() {
    console.log(`Welcome to:\n%cLeonus blog:%c https://blog.leonus.cn%c\nThis site has been running stably for %c${Math.round((new Date().getTime() - new Date('2021/10/15 00:00:00').getTime()) / 86400000)} %c days`,
      'border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#4976f5;margin:10px 0',
      'border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;', '', 'color:#4976f5', '');
  },
  // 隐藏只有一页的底部分页
  pagination() {
    if (document.querySelector('.pagination') && document.querySelector('.pagination').children.length == 1) document.querySelector('#pagination').style.display = 'none'
  },
  // 轮播图
  swiper() {
    var swiper = new Swiper('.blog-slider', {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      passiveListeners: true,
      loop: true,
      // autoplay: false,
      autoplay: {
        disableOnInteraction: true,
        delay: 5000
      },
      mousewheel: true,
      // autoHeight: true,
      pagination: {
        el: '.blog-slider__pagination',
        clickable: true,
      }
    });

    var comtainer = document.getElementById('swiper_container');
    if (comtainer !== null) {
      comtainer.onmouseenter = () => { swiper.autoplay.stop() };
      comtainer.onmouseleave = () => { swiper.autoplay.start() };
    }
  },
  // 页面跳转
  goToPage() {
    let dom = document.querySelector('#pageNumInput input')
    if (!dom) return
    dom.addEventListener('input', () => {
      let ls = document.querySelectorAll('.page-number'),
        max = ls[ls.length - 1].innerHTML;
      if (Number(dom.value) > max) dom.value = max
      if (Number(dom.value) < 1) dom.value = ''
    })
    dom.addEventListener('keyup', e => { if (e.key == 'Enter' && dom.value != '' && dom.value != '0') pjax.loadUrl(dom.value == '1' ? '/' : `/page/${dom.value}/`) })
  },
  loadLike() {
    if (!document.querySelector('#post')) return
    fetch('https://api.leonus.cn/articleLike/get?path=' + location.pathname).then(res => res.json()).then(data => {
      if (data != '0') {
        if (data['like']) document.querySelector('#article-like .like-btn span').innerHTML = data['like']
        if (data['heart']) document.querySelector('#article-like .heart-btn span').innerHTML = data['heart']
        if (data['share']) document.querySelector('#article-like .share-btn span').innerHTML = data['share']
      }
    }).catch()
    let data = JSON.parse(localStorage.getItem('likeClicked'))
    if (!data || !data.articles[location.pathname]) return
    if (new Date(data.time).toLocaleDateString() != new Date().toLocaleDateString()) return localStorage.removeItem('likeClicked')
    if (data.articles[location.pathname]['like']) document.querySelector('#article-like .like-btn').classList.add('clicked')
    if (data.articles[location.pathname]['heart']) document.querySelector('#article-like .heart-btn').classList.add('clicked')
    if (data.articles[location.pathname]['share']) document.querySelector('#article-like .share-btn').classList.add('clicked')
  },
  articleLike(type) {
    let btn = null;
    switch (type) {
      case 'like':
        btn = document.querySelector('#article-like .like-btn')
        if (btn.classList.contains('clicked')) btf.snackbarShow('你今天已经点过赞了，明天再来吧(^ v ^)')
        else add(btn)
        break;
      case 'heart':
        btn = document.querySelector('#article-like .heart-btn')
        if (!btn.classList.contains('clicked')) add(btn)
        var url = window.location.href;
        var title = document.title;
        if (window.sidebar && window.sidebar.addPanel) window.sidebar.addPanel(title, url, "");
        else if (window.external && ('AddFavorite' in window.external)) window.external.AddFavorite(url, title);
        else alert('请使用Ctrl+D 或 Command+D 添加收藏夹！');
        break;
      case 'share':
        btn = document.querySelector('#article-like .share-btn')
        if (!btn.classList.contains('clicked')) add(btn)
        break;
      default:
        break;
    }
    function add(btn) {
      // 服务器加一
      btn.children[1].innerHTML = Number(btn.children[1].innerHTML) + 1
      btn.classList.add('clicked')
      fetch('https://api.leonus.cn/articleLike/add', {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type, pathname: location.pathname })
      })
      // 本地记录状态
      let data = JSON.parse(localStorage.getItem('likeClicked'))
      if (!data) { data = { time: 0, articles: {} } }
      data.time = Date.now()
      if (!data.articles[location.pathname]) {
        data.articles[location.pathname] = {
          "like": 0,
          "heart": 0,
          "share": 0
        }
      }
      data.articles[location.pathname][type] = 1
      localStorage.setItem('likeClicked', JSON.stringify(data))
    }
  },
  cp() {
    document.body.addEventListener('copy', (e) => {
      if (e.target.tagName == 'TEXTAREA' && e.target.className == '') return
      btf.snackbarShow("复制成功~")
    });
    document.body.addEventListener('paste', () => { btf.snackbarShow("粘贴成功~") });
  },
  addScript(id, src, loaded) {
    if (document.getElementById(id)) {
      if (loaded) return loaded()
      else return
    }
    let scr = document.createElement('script')
    scr.src = src
    scr.id = id
    if (loaded) scr.onload = loaded
    document.head.appendChild(scr)
  },
  page404() {
    gsap.set("svg", {
      visibility: "visible"
    });
    gsap.to("#headStripe", {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      duration: 1
    });
    gsap.to("#spaceman", {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      duration: 1
    });
    gsap.to("#craterSmall", {
      x: -3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut"
    });
    gsap.to("#craterBig", {
      x: 3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut"
    });
    gsap.to("#planet", {
      rotation: -2,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut",
      transformOrigin: "50% 50%"
    });
    gsap.to("#starsBig g", {
      rotation: "random(-30,30)",
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
    gsap.fromTo(
      "#starsSmall g", {
      scale: 0,
      transformOrigin: "50% 50%"
    }, {
      scale: 1,
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      stagger: 0.1
    });
    gsap.to("#circlesSmall circle", {
      y: -4,
      yoyo: true,
      duration: 1,
      ease: "sine.inOut",
      repeat: -1
    });
    gsap.to("#circlesBig circle", {
      y: -2,
      yoyo: true,
      duration: 1,
      ease: "sine.inOut",
      repeat: -1
    });
    gsap.set("#glassShine", {
      x: -68
    });
    gsap.to("#glassShine", {
      x: 80,
      duration: 2,
      rotation: -30,
      ease: "expo.inOut",
      transformOrigin: "50% 50%",
      repeat: -1,
      repeatDelay: 3,
      delay: 1
    });
  },
  danmu() {
    const Danmaku = new EasyDanmaku({
      page: '/message/',
      el: '#danmu', //弹幕挂载节点
      line: 10, //弹幕行数
      speed: 20, //弹幕播放速度
      hover: true,
      loop: true, //开启循环播放
    })
    let data = saveToLocal.get('danmu')
    if (data) Danmaku.batchSend(data, true);
    else {
      let ls = []
      fetch('https://twikoo.leonus.cn/', {
        method: "POST",
        body: JSON.stringify({
          "event": "GET_RECENT_COMMENTS",
          "includeReply": false,
          "pageSize": 100
        }),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json()).then(({ data }) => {
        data.forEach(i => {
          if (i.avatar == undefined) i.avatar = 'https://cravatar.cn/avatar/d615d5793929e8c7d70eab5f00f7f5f1?d=mp'
          ls.push({ avatar: i.avatar, content: i.nick + '：' + formatDanmaku(i.comment), url: i.url + '#' + i.id })
        });
        Danmaku.batchSend(ls, true);
        saveToLocal.set('danmu', ls, 0.02)
      });
      // 格式化评论
      function formatDanmaku(str) {
        str = str.replace(/<\/*br>|[\s\uFEFF\xA0]+/g, '');
        str = str.replace(/<img.*?>/g, '[图片]');
        str = str.replace(/<a.*?>.*?<\/a>/g, '[链接]');
        str = str.replace(/<pre.*?>.*?<\/pre>/g, '[代码块]');
        str = str.replace(/<.*?>/g, '');
        return str
      }
    }
    document.getElementById('danmuBtn').innerHTML = `<button class="hideBtn" onclick="document.getElementById('danmu').classList.remove('hidedanmu')">显示弹幕</button> <button class="hideBtn" onclick="document.getElementById('danmu').classList.add('hidedanmu')">隐藏弹幕</button>`
  },
  gotoID(id) {
    var url = location.href;
    location.href = "#" + id;
    history.replaceState(null, null, url);
    let top = document.getElementById(id).offsetTop - 60;
    window.scrollTo({ top: top })
  },
  addMusic() {
    let dom = null;
    if (document.body.clientWidth > 768) dom = document.getElementById('pcMusic')
    else dom = document.getElementById('phMusic')
    if (dom) dom.innerHTML = `<meting-js id="7903334636" server="tencent" type="playlist" theme="var(--leonus-main)" order="random" preload="metadata" listFolded="true"></meting-js>`
  },
  musicBtn() {
    if (document.querySelector('#pcMusic .aplayer')) {
      let dom = document.querySelector('#nav .music-btn')
      if (dom) dom.style.display = 'block'
    }
  },
  openRss(e, name, avatar, link) {
    e.preventDefault();
    document.querySelector('.rss-avatar').href = link
    document.querySelector('.rss-avatar img').src = avatar
    document.querySelector('.rss-name span').innerHTML = name
    document.querySelector('.flink-rss-box').style.display = 'block'
    document.querySelector('.rss-content .rss-articles').innerHTML = `<img src="/img/loading.svg" style="margin-bottom: 0;">`
    document.body.style.overflow = 'hidden'
    fetch('https://fcircle.leonus.cn/u/' + name).then(res => res.json()).then(data => {
      if (data.length == 0) {
        document.querySelector('.rss-content .rss-articles').innerHTML = '<p style="text-align:center">未获取到该博客订阅内容</p>'
      } else {
        let html = ''
        data.forEach((item, index) => {
          let isNew = ''
          if (Date.now() - new Date(item.time).getTime() < 1000 * 60 * 60 * 24 * 2) {
            let t = Math.floor((Date.now() - new Date(item.time).getTime()) / 3600000)
            if (t < 1) isNew = '<span class="new-article">刚刚</span>'
            else if (t < 24) isNew = `<span class="new-article">${t}小时</span>`
            else if (t < 48) isNew = `<span class="new-article">一天前</span>`
          }
          html += `<p><a href="${item.link}"><span class="rss-index">${index + 1}.</span>${item.title}</a>${isNew}<span class="rss-time">${new Date(item.time).toLocaleDateString()}</span></p>`
        })
        document.querySelector('.rss-content .rss-articles').innerHTML = html
      }
    })
  },
  async asidePost() {
    if (!document.querySelector('.card-recent-post')) return
    let data = saveToLocal.get('articles')
    if (!data) data = await this.getArticles()
    data = data.filter(a => a.type == 'post').sort(() => 0.5 - Math.random()).splice(0, 5)
    let html = ''
    data.forEach(item => { html += `<div class="aside-list-item"><a class="thumbnail" href="javascript:;" onclick="pjax.loadUrl('${item.path}')" title="${item.title}"><img src="${item.cover}" onerror="this.onerror=null;this.src='/img/404.gif'" alt="${item.title}"></a><div class="content"><a class="title" href="javascript:;" onclick="pjax.loadUrl('${item.path}')" title="${item.title}">${item.title}</a><time datetime="${item.date}" title="发布于 ${new Date(item.date).toLocaleString()}">${item.date.slice(0, 10)}</time></div></div>` });
    let dom = document.querySelector('.card-recent-post .aside-list')
    if (dom) dom.innerHTML = html
  },
  async getArticles() {
    let ls = await fetch('/article.json').then(res => res.json())
    saveToLocal.set('articles', ls, 1)
    return ls
  },
  addArticleStar() {
    if (document.getElementById('addArticleStarBox')) return
    let box = new WinBox({
      id: 'addArticleStarBox',
      index: 999,
      title: "文章操作",
      x: "center",
      y: "center",
      minwidth: '300px',
      height: "60%",
      background: 'var(--leonus-blue)'
    });
    box.body.innerHTML = `
    <br>
    <h2 align="center">文章操作</h2>
    <div class="addArticleBox">
      <input id="articleLink" type="text" placeholder="请输入文章链接">
      <input id="password" type="text" placeholder="请输入密码">
      <button onclick="leonus.articleOperate()">收藏</button>
      <button onclick="leonus.articleOperate(1)">删除</button>
    </div>
    `
    leonus.winResize(box, 'addArticleStarBox')
    window.addEventListener('resize', () => leonus.winResize(box, 'addArticleStarBox'))
  },
  articleOperate(del) {
    let link = document.getElementById('articleLink').value
    let password = document.getElementById('password').value
    let api = 'https://fcircle.leonus.cn/add'
    if (del) api = 'https://fcircle.leonus.cn/del'
    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link, password })
    }).then(res => res.text()).then(code => {
      if (code == '1') btf.snackbarShow("操作成功");
      else if (code == '密码错误') btf.snackbarShow("密码错误");
      else btf.snackbarShow("操作失败");
    })
  },
  newYear() {
    if (!document.querySelector('#newYear')) return;
    // 新年时间戳 and 星期对象
    let SpringFestival = new Date('2024-02-10 00:00:00')
    let newYear = SpringFestival.getTime() / 1000,
      week = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }

    time();

    function time() {
      // 现在 时间对象
      let now = new Date();

      // 右下角 今天
      document.querySelector('#newYear .today').innerHTML = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + week[now.getDay()]

      // 现在与新年相差秒数
      let second = newYear - Math.round(now.getTime() / 1000);

      // 小于0则表示已经过年
      if (second < 0) {
        window.newYearTimer = null
        document.querySelector('#newYear .title').innerHTML = 'Happy New Year!';
        document.querySelector('#newYear .newYear-time').innerHTML = '<span class="happyNewYear">新年快乐</span>';
      } else {
        // 大于0则还未过年
        document.querySelector('#newYear .title').innerHTML = '距离 ' + SpringFestival.getFullYear() + ' 年春节：'
        // 大于一天则直接渲染天数
        if (second > 86400) {
          document.querySelector('#newYear .newYear-time').innerHTML = `<span class="day">${Math.ceil(second / 86400)}</span><span class="unit"> 天</span>`
        } else {
          // 小于一天则使用时分秒计时。
          let h = leonus.nol(parseInt(second / 3600));
          second %= 3600;
          let m = leonus.nol(parseInt(second / 60));
          second %= 60;
          let s = leonus.nol(second);
          document.querySelector('#newYear .newYear-time').innerHTML = `<span class="time">${h}:${m}:${s}</span></span>`;
          // 计时
          if (!window.newYearTimer) window.newYearTimer = setInterval(time, 1000);
        }
      }
    }
  },
  newYearSwiper() {
    var swiper = new Swiper('.newYear-slider', {
      passiveListeners: true,
      loop: true,
      // autoplay: false,
      autoplay: {
        disableOnInteraction: true,
        delay: 5000
      },
      effect: 'fade',
      mousewheel: true,
      autoHeight: true
    });

    var comtainer = document.querySelector('.newYear-slider');
    if (comtainer !== null) {
      comtainer.onmouseenter = () => { swiper.autoplay.stop() };
      comtainer.onmouseleave = () => { swiper.autoplay.start() };
    }
  },
}