window.addEventListener("DOMContentLoaded", function() {

    window.addEventListener("beforeunload", function (e) {
        e.returnValue = "本当にページ移動しますか？";
    }, false);

    var is_modal_open = false;

  // 定数
  const bingo_max_number = 75;
  const logo = document.getElementById("logo");
  const list = document.getElementById("list");
  const viewarea = document.getElementById("viewarea");
  const upperbit = document.getElementById("upperbit");
  const lowerbit = document.getElementById("lowerbit");
  const player = new Audio();
  player.src = "drum_roll.mp3";

  // 初期化
  for(let i=0;i<bingo_max_number;i++){
    let div = document.createElement("div");
    div.id = "num_box_" + (i+1);
    div.className = "item";
    let str = (i+1) < 10 ? "0" + (i+1) : (i+1);
    div.innerText = str;
    list.appendChild(div);
  }

  // モーダル終了後イベントコールバック関数 onCloseEnd
  // 引数を渡す術が分からないため、グローバル変数
  var num, pre_elem;
  let onCloseEnd = function(){
    let elem = document.getElementById("num_box_" + num);
    elem.style.backgroundColor = "#d9c816";
    elem.style.color = "#f0f0f0";
    pre_elem = elem;
    is_modal_open = false;
  };

  // モーダル開始後イベントコールバック関数 onOpenEnd
  var id;
  let onOpenEnd = function(){
    player.play();
    is_modal_open = true;
    let i=0;
    let j=5;
    let count = 0;
    id = setInterval(function(){
      if(count > 46){
        clearInterval(id);
      }
      upperbit.textContent = count < 46 ? parseInt(i++ % 10) : parseInt(num / 10);
      lowerbit.textContent = count < 46 ? parseInt(j++ % 10) : parseInt(num % 10);
      count++;
    }, 100);
  };

  // 巻き機能
  viewarea.addEventListener("click", function(){
      player.pause();
      player.currentTime = 0;
      clearInterval(id);
      upperbit.textContent = parseInt(num / 10);
      lowerbit.textContent = parseInt(num % 10);
  }, false);

  // モーダル初期化
  let elems = document.querySelectorAll('.modal');
  let options = {
    "preventScrolling": true,
    "onCloseEnd": onCloseEnd,
    "onOpenEnd": onOpenEnd
  };
  let instances = M.Modal.init(elems, options);

  // 重複のないランダムな数列を用意
  let array = getShuffledArray();

  // logoのクリックによるイベント発火
  logo.addEventListener("click", function() {
    // write code
    if(array.length >0){
      // 直前の要素の色を変更
      if(pre_elem){
        pre_elem.style.backgroundColor = "#367fa3";
        pre_elem.style.color = "#f0f0f0";
      }
      // 1つ取り出して色を変更
      num = array.pop();
      // モーダルを表示
      var instance = M.Modal.getInstance(logo);
      // モーダル終了後イベントコールバック関数を参照
      // onCloseEnd
    }
  }, false);

  document.addEventListener("keydown", function(event) {
    // write code
    if(event.key == "Enter"){
        if(is_modal_open){
            viewarea.click();
        }else{
            logo.click();
        }
    }
  }, false);

  function getShuffledArray(){
    // 1~bingo_max_numberまでの数列を用意
    let array = new Array();
    for(let i=0;i<bingo_max_number;i++){
      array.push(i+1);
    }
    // ミリ秒 回ループ（なんでもいいけどランダムな数）
    for(let j = 0;j<(new Date().getMilliseconds());j++){
      // Fisher–Yates
      for(let i = array.length - 1; i > 0; i--){
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
    }
    return array;
  }

}, false);
