/*
  Text to Layers
    (C) あかつきみさき(みくちぃP)

  このスクリプトについて
    選択したファイルからテキストを読み込み,区切りの一つ目から順番にテキストレイヤーとして追加するスクリプト.
    区切り文字はプロンプトで入力し,空白の場合は改行で区切ります.
    ファイルの先頭がレイヤーの一つ目になります.

  使用方法
    1.ファイル→スクリプト→スクリプトファイルの実行から実行.

  動作環境
    Adobe After Effects CS6以上

  配布元
    http://sunrisemoon.net/program/ae/script/TexttoLayers/

  ライセンス
    MIT License

  バージョン情報
    2016/10/26 Ver 1.2.0 Update
      ダイアログのテキストを修正.

    2015/11/22 Ver 1.1.0 Update
      プロジェクトを開いている時,プロジェクトのフォルダーを開くようにした.
      区切り文字を指定できるようにした.
      ファイルを閉じていなかった問題の修正.

    2014/01/14 Ver 1.0.0 Release
*/

/// <reference path="C:/Users/RUI/OneDrive/lib/aftereffects.d.ts/ae.d.ts"/>

(function() {
  const _STRINGS = {
    JP: {
      LOAD: "ファイルを開く",
      SPLIT: "区切り文字を入力してください.\nなにも入力しない場合は改行で区切られます.",
    },
    EN: {
      LOAD: "Load File",
      SPLIT: "Input split text\nif text is non, use Return.",
    }
  };

  const LOAD_SUPPORT_EXTENTION:string[] = ["All files:*.*", "Text files:*.txt"];


	const getLocalizedText = function(str) {
    if(app.isoLanguage == "ja_JP"){
      return str.jp;
    } else {
      return str.en;
    }
  }

  const isCompActive = function(comp:CompItem) {
    if (!(comp && comp instanceof CompItem)) {
      return false;
    } else {
      return true;
    }
  }


  const main = function() {
    const actComp:CompItem = <CompItem>app.project.activeItem;
    if (!isCompActive(actComp)) {
      return 0;
    }

    let folderPath:Folder = Folder.desktop;

    if(app.project.file != null){
      folderPath = app.project.file.parent;
    }

    const fileName:string = decodeURIComponent(folderPath);
    const filePath:File = new File(fileName).openDlg(getLocalizedText({jp:_STRINGS.JP.LOAD,en:_STRINGS.EN.LOAD}), LOAD_SUPPORT_EXTENTION);
    if(filePath == null){
      return 0;
    }

    let line:string[] =[];
    let splitText:string = prompt(getLocalizedText({jp:_STRINGS.JP.SPLIT,en:_STRINGS.EN.SPLIT}), "", "Text to Layers");

    if(splitText == ""){
      splitText = "\n";
    }

    try{
      filePath.open("r");
      line = filePath.read().split(splitText);
      filePath.close();
    }catch (err){
      alert(err, "Text to Layers");
    }

    for(let i=line.length;i>=0;i--){
      if(!line[i]){
        continue;
      }

      actComp.layers.addText(line[i]);
    }
  }

  app.beginUndoGroup("Text to Layers");
  main();
	app.endUndoGroup();
}).call(this);
