var rewards = [
    {name: "腾讯视频VIP季卡", count: 10},
    {name: "Luckin coffee优惠券", count: 10},
    {name: "腾讯视频VIP季卡", count: 10},
    null,
    {name: "相声新势力", count: 3},
    {name: "天空之城音乐演奏会", count: 2},
    {name: "《哈姆雷特》戏剧", count: 2},
    {name: "华为荣耀手环", count: 10},
    null,
    {name: "双人海鲜自助午餐", count: 2},
    {name: "双人海鲜自助晚餐", count: 2},
    {name: "瑞丝丽酒店豪华套房", count: 2},
    null,
    {name: "悦椿温泉酒店", count: 1},
]

class Game{
    _isRuning= false;
    _num_scroll = document.getElementById("number-c");
    _area = document.querySelector('.area');
    _ouputPanel = document.querySelector(".output-panel");
    _title = document.querySelector('.title');
    _bgm = document.getElementById('bgm');
    _bgm2 = document.getElementById('bgm2');
    _currentReward = -1;
    _luckeyNumbers = [];
    _step = -1;

    constructor(){
        
    }

    go(){
        this._step = (this._step + 1) % 3;
        switch(this._step){
            case 0:
                this.currentReward = this.currentReward + 1;
                break;
            case 1:
            case 2:
                this.isRuning = !this.isRuning;
                break;
        }
    }

    get isRuning(){
        return this._isRuning;
    }

    set isRuning(value){
        this._isRuning = value;
        
        this.toggleAudio();
        this.toggleAnimation();
        this.toggleOverlay();
        this.output();
    }

    get currentReward(){
        return this._currentReward;
    }

    set currentReward(v){
        this._currentReward = v;
        if(this._currentReward == rewards.length){
            return;
        }
        
        this._ouputPanel.innerHTML = "";
        this._ouputPanel.style.left = "-3000px";
        var rw = rewards[this._currentReward];
        
        if(rw === null){
            this._title.innerHTML = "";
            this._step = -1;
        }else{
            this._title.innerHTML = rw.name;
            fetchLuckyNumber(rw.count, rw.name, (luckies) => this._luckeyNumbers = luckies);
        }
    }

    output(){
        if(this._isRuning){
           return; 
        }
        this.createNumberCard(this._luckeyNumbers);
        this._ouputPanel.style.left = 0;

    }

    toggleOverlay(){
        if(this._step == 1){
            this._area.classList.remove('hide');
        }else{
            this._area.classList.add('hide');
        }
    }

    toggleAnimation(){
        var uls = this._num_scroll.querySelectorAll(".num_card");
        for (var i = 0; i < uls.length; i++) {
            if (this.isRuning) {
                uls[i].style.animation = "3s rowup linear infinite normal"
            } else {
                uls[i].style.removeProperty("animation");
            }
        }
    }

    toggleAudio(){
        if(this.isRuning){
            this._bgm.currentTime = 0;
            this._bgm.play();
        }else{
            this._bgm.pause();
            this._bgm2.currentTime = 0;
            this._bgm2.play();
        }
    }

    createNumberCard(nums){
        var frage = document.createDocumentFragment();
        var row = document.createElement('div');
        row.classList.add('row');
        frage.appendChild(row);
        nums.forEach((num, index) => {
            
            var div = document.createElement("div");
            div.classList.add("number_card");
            div.textContent = num;
            if(index % 5 == 0 & index > 0){
                row = document.createElement('div');
                row.classList.add('row');
                frage.appendChild(row);
            }
            row.appendChild(div);
        });
        this._ouputPanel.appendChild(frage);
    }
}

const fetchLuckyNumber = (count, name, cb) => {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `http://localhost:9090?count=${count}&name=${name}`, true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            cb(json);
        }
    };
}

window.game = new Game();

