/*************************
     Part.0 全局变量…？
 *************************/
let enable = 0;    //键盘演奏使能，某些情况下需要关闭使能

/*************************
     Part.I 资源加载函数
 *************************/
let flag = 0, progress = 0, tries = 0;
let au = [];    //音频列表
let bgimg = new Image();
bgimg.src = './image/bg.jpg';
for (let i = 0; i < 21; i++) {
    au.push(new Audio());
    au[i].src = './audio/' + (i + 1) + '.mp3';
}

let inv = setInterval(() => {    //循环执行，统计加载进度
    flag = 0;    //加载计数器，每个资源计数4
    for (let i = 0; i < 21; i++)
        flag += au[i].readyState;
    if (bgimg.complete)
        flag += 4;
    progress = flag / 88;    //进度累计
    document.getElementById('progress-bar').style = 'width:' +
        parseInt(progress * 100) + '%';    //进度条刷新
    tries++;
    if (progress < 1) {
        if (tries < 50) {
            document.getElementById('progress-info').innerHTML =    //进度值刷新
                '正在加载资源……已完成 ' + parseInt(progress * 100) + ' %！';
        }
        else {    //如果10秒后仍然没加载完成，显示提示
            document.getElementById('progress-info').innerHTML =    //进度值刷新
                '正在加载资源……已完成 ' + parseInt(progress * 100) + ' %！<br>' +
                '<a class=\"font-14\" href=\"javascript:void(0);\"' +
                'onmousedown=\"if(event.button == 0) forceEnter();\">' +
                '单击此处强行进入程序</a><b class=\"font-12\">' +
                ' (不推荐，建议等待资源加载完毕)</b><br>' +
                '<b class=\"font-12\">加载时间过长可能是因为网络不畅或资源异常，' +
                '<br>可以耐心等等或者刷新页面，也可以选择直接进入</b>';
        }
    }
    else {
        document.getElementById('progress-info').innerHTML =    //进度值刷新
            '加载完成！点击派蒙开始演奏吧！ ';
        clearInterval(inv);    //加载完成后就不刷新了
    }
}, 200);    //每秒刷新5次

function enterMain() {
    if (flag == 88) {
        Ani('loading', 'ui-animation');
        setTimeout(() => {
            let loading = document.getElementById('loading');
            if (loading != undefined) {    //保证不会报错
                loading.parentElement.removeChild(loading);
            }

        }, 1000);
        enable = 1;    //打开键盘演奏使能
    }
    else {
        alert('还没有加载完呢！派蒙说再等等！');
    }
}

function forceEnter() {    //强行进入主界面(草)
    Ani('loading', 'ui-animation');
    enable = 1;
}

/*************************
    Part.II 核心功能函数
 *************************/
let keyC = {    //键位对照表（采用最新的e.code）
    //原神游戏键位
    'KeyZ': '1', 'KeyX': '2', 'KeyC': '3', 'KeyV': '4',
    'KeyB': '5', 'KeyN': '6', 'KeyM': '7',    //ZXCVBNM
    'KeyA': '8', 'KeyS': '9', 'KeyD': '10', 'KeyF': '11',
    'KeyG': '12', 'KeyH': '13', 'KeyJ': '14',    //ASDFGHJ
    'KeyQ': '15', 'KeyW': '16', 'KeyE': '17', 'KeyR': '18',
    'KeyT': '19', 'KeyY': '20', 'KeyU': '21',    //QWERTYU
    //扩展键位（数字键）
    'Backquote': '7', 'Digit1': '8', 'Digit2': '9', 'Digit3': '10', 'Digit4': '11',
    'Digit5': '12', 'Digit6': '13', 'Digit7': '14', 'Digit8': '15', 'Digit9': '16',
    'Digit0': '17', 'Minus': '18', 'Equal': '19', 'Backspace': '20',    //~,1~9,0,-,+,bsp
    //扩展键位（小键盘）
    'Numpad0': '5', 'NumpadDecimal': '6', 'NumpadEnter': '7',    //0 . Enter
    'Numpad1': '8', 'Numpad2': '9', 'Numpad3': '10',
    'Numpad4': '11', 'Numpad5': '12', 'Numpad6': '13',
    'Numpad7': '14', 'Numpad8': '15', 'Numpad9': '16',    //1~9
    'NumpadAdd': '17', 'NumLock': '18', 'NumpadDivide': '19',
    'NumpadMultiply': '20', 'NumpadSubtract': '21' //+ NumLock / * -
}

function notePlay(NID) {    //播放音符
    let music = new Audio();    //创建一个音频对象
    music.src = 'audio/' + NID + '.mp3';    //给定音源路径
    music.play();    //播放声音
}

function Ani(ID, cls) {    //动画生成函数
    let key = document.getElementById(ID);
    if (key.classList.contains(cls))    //动画类不为空时才重置(严谨)
        key.classList.remove(cls);
    void key.offsetTop;    //去掉这句动画就不能重置了，原因未知
    key.classList.add(cls);
}

function playDo(NID) {    //包括播放、动画等的总事件操作
    notePlay(NID);
    Ani(NID, 'key-animation');
    Ani(NID * 100, 'circle-animation');
}

function dispKey() {    //批量显示按键
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {    //格式化写入img标签，写入3×7次
            document.getElementById('show-key').innerHTML +=
                '<img src=\"./image/' + (j + 1) + '.svg\" id=\"' +
                //加上空的alt标签是为了避免出现警告(严谨)
                ((2 - i) * 7 + j + 1) + '\" alt = \"\" ' +
                //使按键事件只对左键生效
                'onmousedown = \" if(event.button == 0) playDo(this.id);\">';
        }
        document.getElementById('show-key').innerHTML += '<br>';
    }
}

function dispCircle() {    //批量显示按键圆，键按下时动画显示
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {    //格式化写入img标签，写入3×7次
            document.getElementById('show-circle').innerHTML +=
                '<img src=\"./image/circle.svg\" id=\"' +
                ((2 - i) * 7 + j + 1) * 100 + '\" alt = \"\" ' +
                //这个class保证未按下按键时看不到按键圆
                'class=\"initial-circle\">';
        }
        document.getElementById('show-circle').innerHTML += '<br>';
    }
}

dispKey();
dispCircle();

document.addEventListener(    //使用事件监听器实现键盘操作
    'keydown', function (e) {
        if (e.repeat) { return; }   //防止未松开按键时重复触发
        if (enable == 1) {   //只有使能时才允许键盘演奏
            if (keyC[e.code] != undefined) {    //对未定义按键不响应(严谨)
                playDo(keyC[e.code]);
            }
        }
    })

/*************************
     Part.III 界面交互函数
 *************************/
function hideBox(id) {     //关闭某一个特定的窗口
    document.getElementById(id).style.display = 'none';
    if (checkBox() == 0) { enable = 1; }
}

function showBox(id) {     //打开某一个特定的窗口
    document.getElementById(id).style.display = 'inline';
    enable = 0;
}

function checkBox() {    //检查当前是否有窗口打开
    let aStyle = document.getElementsByClassName('func-box');
    let length = aStyle.length;    //设置可变长，提高代码兼容性
    let shown = 0;    //显示窗口计数
    for (let i = 0; i < length; i++) {
        if (aStyle[i].style.display != 'none' &&
            aStyle[i].style.display != '') { shown++; }
    }
    return shown;   //返回窗口打开数
}

function hideMenuBg() {    //在没有任何窗口的情况下，才能隐藏背景板
    //其实直接隐藏也可以，但这样做可以避免极端情况下的某些bug
    let shown = checkBox();    //显示窗口计数
    if (shown == 0) {
        document.getElementById('box-bg').
            style.display = 'none';
        enable = 1;
    }
}

function hideAll() {    //无条件直接关闭所有窗口，隐藏背景板，并打开键盘使能
    let bB = document.getElementById('box-bg').style;
    if (bB.display != 'none') {    //有任何窗口显示时才进行关闭
        let aB = document.getElementsByClassName('func-box');
        let length = aB.length;
        bB.display = 'none';
        for (let i = 0; i < length; i++)
            if (aB[i].style.display != 'none') { aB[i].style.display = 'none'; }
        enable = 1;
    }
}

document.addEventListener(
    'keydown', function (e) {
        //按Esc关闭所有窗口
        if (e.code == 'Escape') {
            hideAll();
        }
        //按P打开编曲模式
        if (e.code == 'KeyP' && checkBox() == 0) {
            showBox('make-music');
            showBox('box-bg');
        }
    })

/*************************
     Part.IV 编曲模式函数
 *************************/
let clock = 0;    //标识setInterval，用于关闭循环
let isPlay = 0;    //正在播放吗？
let numC = {    //简谱对照表
    11: 1, 12: 2, 13: 3, 14: 4, 15: 5, 16: 6, 17: 7,
    21: 8, 22: 9, 23: 10, 24: 11, 25: 12, 26: 13, 27: 14,
    31: 15, 32: 16, 33: 17, 34: 18, 35: 19, 36: 20, 37: 21
}

function resetInput() {    //重置编曲模式的输入框
    document.getElementById('sheet').value = '';
    document.getElementById('bpm').value = '240';
}

function playSheet() {    //播放曲谱初始化
    let mode = document.getElementById('read-mode').options.selectedIndex;
    let sheet = document.getElementById('sheet').value;
    let bpm = document.getElementById('bpm').value;
    if (isPlay == 0) {
        if (mode == 0) { keyMode(sheet, bpm); }
        if (mode == 1) { numMode(sheet, bpm); }
        if (mode == 2) { chaosMode(sheet, bpm); }
    }
}

function stopSheet() {    //停止曲谱播放
    isPlay = 0;
    clearInterval(clock);
}

function keyMode(sheet, bpm) {    //按键模式演奏
    isPlay = 1;
    let sheetArr = sheet.toUpperCase().split('');
    let realArr = [];
    for (let i = 0; i < sheetArr.length; i++) {
        if (sheetArr[i] == '\n') {    //忽略换行
            continue;
        }
        else if (sheetArr[i] == '\(') {
            let temp = '';
            let harmonyCount = 0;
            while (sheetArr[i + 1] != '\)') {
                i++;
                harmonyCount++;
                temp += sheetArr[i];
                //允许最大和弦数量为7，否则直接忽视剩余部分和右括号
                if (harmonyCount >= 7) { break; }
            }
            realArr.push(temp);
            i++;
        }
        else if (sheetArr[i] == ' ') {    //使用O作为空拍占位
            realArr.push('O');
        }
        else {
            realArr.push(sheetArr[i]);
        }
    }
    //根据给定的播放速度按序播放
    let playCount = 0;
    clock = setInterval(() => {
        if (realArr[playCount] != undefined) {
            if (realArr[playCount].length == 1) {
                let realKey = 'Key' + realArr[playCount];
                if (keyC[realKey] != undefined) {
                    playDo(keyC[realKey]);
                }
            }
            else {
                let repeat = realArr[playCount].length;
                for (let i = 0; i < repeat; i++) {
                    let realKey = 'Key' + realArr[playCount][i];
                    if (keyC[realKey] != undefined) {
                        playDo(keyC[realKey]);
                    }
                }
            }
            playCount++;
            if (playCount == realArr.length) {
                isPlay = 0;
                clearInterval(clock);
            }
        }
        else {
            isPlay = 0;
            clearInterval(clock);
        }
    }, 60000 / bpm);
}

function numMode(sheet, bpm) {    //简谱模式演奏
    isPlay = 1;
    let sheetArr = sheet.replace('\n', ' ');
    sheetArr = sheetArr.split(' ');
    let realArr = [];
    for (let i = 0; i < sheetArr.length; i++) {
        if (sheetArr[i] == '\(') {
            let temp = [];
            let harmonyCount = 0;
            while (sheetArr[i + 1] != '\)') {
                i++;
                harmonyCount++;
                temp.push(parseInt(sheetArr[i]));
                //允许最大和弦数量为7，否则直接忽视剩余部分和右括号
                if (harmonyCount >= 7) { break; }
            }
            realArr.push(temp);
            i++;
        }
        else {
            realArr.push(parseInt(sheetArr[i]));
        }
    }
    //根据给定的播放速度按序播放
    let playCount = 0;
    clock = setInterval(() => {
        if (realArr[playCount] != undefined) {
            //如果只是一个数字，它是没有长度的
            if (realArr[playCount].length == undefined) {
                //确保该音符有意义再进行播放
                if (numC[realArr[playCount]] != undefined) {
                    playDo(numC[realArr[playCount]]);
                }
            }
            else {
                let repeat = realArr[playCount].length;
                for (let i = 0; i < repeat; i++) {
                    if (numC[realArr[playCount][i]] != undefined) {
                        playDo(numC[realArr[playCount][i]]);
                    }
                }
            }
            playCount++;
            if (playCount == realArr.length) {
                isPlay = 0;
                clearInterval(clock);
            }
        }
        else {
            isPlay = 0;
            clearInterval(clock);
        }
    }, 60000 / bpm);
}

function chaosMode(sheet, bpm) {    //混沌模式演奏
    let chaosSheet = '';
    for (let i = 0; i < sheet.length; i++) {
        //即便是混沌模式，空格或换行也空拍
        if (sheet[i] == ' ' || sheet[i] == '\n') {
            chaosSheet += 'O';
        }
        else {
            //奇怪的编码方式
            chaosSheet += String.fromCharCode
                ([sheet[i].charCodeAt() % 26 + 65]);
        }
    }
    //使用按键模式强行播放
    keyMode(chaosSheet, bpm);
}