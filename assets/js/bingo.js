window.addEventListener("DOMContentLoaded", function() {

  window.addEventListener("beforeunload", function (e) {
    e.returnValue = "本当にページ移動しますか？";
  }, false);

  // maxを設定（初期値は75）
  let bingo_max_number;
  let queries = getUrlQueries();
  if(queries["max"] && queries["max"] > 0){
    bingo_max_number = queries["max"];
  } else {
    bingo_max_number = 75;
  }

  // 定数
  const logo = document.getElementById("logo");
  const list = document.getElementById("list");
  const numarea = document.getElementById("numarea");
  const upperbit = document.getElementById("upperbit");
  const lowerbit = document.getElementById("lowerbit");
  const player = new Audio();
  player.src = "./assets/audio/drum_roll.mp3";

  // 変数
  let pre_elem, interval_id, num, is_started = false;

  // 初期化
  for(let i=0;i<bingo_max_number;i++){
    // 数字表示用の領域を作成
    let div = document.createElement("div");
    div.id = "num_box_" + (i+1);
    div.className = "item";
    let str = (i+1) < 10 ? "0" + (i+1) : (i+1);
    div.innerText = str;
    list.appendChild(div);
  }
  upperbit.textContent = "0";
  lowerbit.textContent = "0";

  // keyevents
  document.addEventListener("keydown", function(event) {
    switch (event.key) {
      case "Enter":
      {
        numarea.click();
        break;
      }
      default:
      {
        break;
      }
    }
  }, false);

  // 重複のないランダムな数列を用意
  let array = getShuffledArray(null);

  // numareaのクリックによるイベント発火
  numarea.addEventListener("click", function() {
    if(!is_started){
      if(array.length > 0){
        is_started = true;
        // シャッフルする
        reshuffled_array = getShuffledArray(array);
        // 1つ取り出す
        num = reshuffled_array.pop();
        // 音楽を再生して数字を表示し色を変更
        player.play();
        let i=0, j=5;
        let count = 0;
        interval_id = setInterval(function(){
          if(count > 46){
            clearInterval(interval_id);
            changeColor(num);
          }
          upperbit.textContent = count < 46 ? parseInt(i++ % 10) : parseInt(num / 10);
          lowerbit.textContent = count < 46 ? parseInt(j++ % 10) : parseInt(num % 10);
          count++;
        }, 100);
      }
    } else {
      // 巻き機能
      player.pause();
      player.currentTime = 0;
      clearInterval(interval_id);
      upperbit.textContent = parseInt(num / 10);
      lowerbit.textContent = parseInt(num % 10);
      changeColor(num);
      is_started = false;
    }
  }, false);

  function changeColor(num){
    // 直前の要素の色を変更
    if(pre_elem){
      pre_elem.style.backgroundColor = "#367fa3";
      pre_elem.style.color = "#f0f0f0";
    }
    // 現在の要素の色を変更
    let elem = document.getElementById("num_box_" + num);
    elem.style.backgroundColor = "#d9c816";
    elem.style.color = "#f0f0f0";
    pre_elem = elem;
  }

  // 引数が配列でない場合は配列を作成し、Fisher–Yatesによるシャッフルを実施する
  // 引数が配列の場合は再度Fisher–Yatesによるシャッフルを実施する
  function getShuffledArray(target){
    // 1~bingo_max_numberまでの数列を用意
    if(!Array.isArray(target)){
      target = new Array();
      for(let i=0;i<bingo_max_number;i++){
        target.push(i+1);
      }
    }
    // ミリ秒 回ループ（なんでもいいけどランダムな数）
    for(let j = 0;j<(new Date().getMilliseconds());j++){
      // Fisher–Yates
      for(let i = target.length - 1; i > 0; i--){
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = target[i];
        target[i] = target[r];
        target[r] = tmp;
      }
    }
    return target;
  }

  // クエリ文字列を取得
  function getUrlQueries() {
    let ret = {};
    const query_str = window.location.search.slice(1);
    let queriy_array = query_str.split("&");
    if(queriy_array.length == 0) return ret;
    for(let query of queriy_array){
      let keyval = query.split("=");
      ret[keyval[0]] = keyval[1];
    }
    return ret;
  }

}, false);
