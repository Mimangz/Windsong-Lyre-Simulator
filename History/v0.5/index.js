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

setInterval(() => {    //循环执行，统计加载进度
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
    }
}, 200);

function enterMain() {
    if (flag == 88) {
        Ani('loading', 'ui-animation');
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

let keyC = {    //键位对照表
    //原神游戏键位
    90: '1', 88: '2', 67: '3', 86: '4',
    66: '5', 78: '6', 77: '7',    //ZXCVBNM
    65: '8', 83: '9', 68: '10', 70: '11',
    71: '12', 72: '13', 74: '14',    //ASDFGHJ
    81: '15', 87: '16', 69: '17', 82: '18',
    84: '19', 89: '20', 85: '21',    //QWERTYU
    //扩展键位（数字键）
    192: '7', 49: '8', 50: '9', 51: '10', 52: '11',
    53: '12', 54: '13', 55: '14', 56: '15', 57: '16',
    48: '17', 189: '18', 187: '19', 8: '20',    //~,1~9,0,-,+,bsp
    //扩展键位（小键盘）
    96: '5', 110: '6', 13: '7',    //0 . Enter
    97: '8', 98: '9', 99: '10', 100: '11', 101: '12',
    102: '13', 103: '14', 104: '15', 105: '16',    //1~9
    107: '17', 111: '18', 106: '19', 109: '20'    //+ / * -
    //暂不使用Num Lock，因为可能会导致奇怪的问题
}
let enable = 0;    //键盘演奏使能，当有其他界面时默认关闭使能

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
        if (e.repeat)     //防止未松开按键时重复触发
            return;
        if (enable == 1)    //只有使能时才允许键盘演奏
            if (keyC[e.keyCode] != undefined)    //对未定义按键不响应(严谨)
                playDo(keyC[e.keyCode]);
    })