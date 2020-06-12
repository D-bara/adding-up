'use strict';
const fs = require('fs');　//fs=filesystemモジュールファイル読み込むとき使う
const readline = require('readline'); //readlineモジュールは一行ずつ読む
const rs = fs.createReadStream('./popu-pref.csv'); //fs.createREadStreamはstreamを作る
const rl = readline.createInterface({input: rs, output: {}});
const prefectureDateMap = new Map(); //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(','); //文章のどこで区切るか
    const year = parseInt(columns[0]);　//一個目が年
    const prefecture = columns[1]; //都道府県
    const popu = Number(columns[3]); //Number(parseInt)は文字列は計算できないから数字に直す
    
    if (year === 2010 || year === 2015) { //一行目を実行しない
        let value = prefectureDateMap.get(prefecture);
        if (!value) {　//データ持ってないとき空のデータを作る
            value = {
                popu10: 0,
                popu15: 0,
                change: null　//changeは変化率
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});
rl.on('close', () => {
   for (let [key, value] of prefectureDateMap) {
       value.change = value.popu15/value.popu10;
   }
   const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
       return pair2[1].change - pair1[1].change; //pair2[1]はprefectureDateMap[kye, value]のvalue(変化率)
   });
   const rankingStrings = rankingArray.map(([key, value]) => {
       return `${key}: ${value.popu10} -> ${value.popu15} 変化率 ${value.change}`; //文字列連結を短く
   })
   console.log(rankingStrings);
});