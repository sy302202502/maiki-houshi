/**
 * VTuber・Vライバー向け HP制作ヒアリングシート v3
 * ------------------------------------------------------------
 * 目的: 回答をそのままAI(Claude+Codex)に渡し、依頼者の理想を正確にHPへ落とし込む「設計図」にする。
 * 設計: 二段構成
 *   PART 1 = 必須コア（これだけで制作着手できる）
 *   PART 2 = 任意の深掘り（こだわり・実データ・権利を最大限に引き出す）
 * ClaudeとCodexの協働で設計・レビュー（2026-07）。
 * 注: 「その他」は showOtherOption で自由記入にし、具体内容を取りこぼさない。
 */
function addQuestions() {
  var form = FormApp.openById('1kCtNs18rEVz4b5zkD6-m9ESCCKjt0Er4fn7n7a6qlyg');

  // 既存の質問をすべて削除
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }

  form.setTitle('VTuber・Vライバー向け HP制作ヒアリングシート');
  form.setDescription(
    'ホームページ制作のご相談ありがとうございます！\n' +
    'この回答は、AIを活用したHP制作の「設計図」としてそのまま使います。Webの知識は不要です。\n\n' +
    '▼ 前半（★必須）だけでも制作を始められます。所要5〜10分。\n' +
    '▼ 後半は「もっとこだわりたい人」向けの深掘り（すべて任意）。実際の制作を最後まで進めるには、後半のURL・素材・権利の回答もいただくとスムーズです。\n' +
    '▼ 迷ったら「おまかせ」「未定」でOK。あなたの言葉で書いてくれるほど理想に近づきます。\n\n' +
    '※ 月額のサーバー代は原則かかりません（Vercel＋GitHub利用）。独自ドメインを使う場合のみ、年1,000〜2,000円ほどの実費がかかります。'
  );

  // ============================================================
  // PART 1 : 必須コア（これだけで制作着手できる）
  // ============================================================

  // ① あなたと活動
  form.addSectionHeaderItem()
    .setTitle('① あなたと活動について')
    .setHelpText('まずはあなたのことを教えてください。');

  form.addTextItem().setTitle('活動名（ホームページでの表記）').setRequired(true);
  form.addTextItem().setTitle('活動名の読み方（ひらがな）').setHelpText('例：まいきほうし').setRequired(true);

  form.addCheckboxItem().setTitle('主に活動している場所（複数選択OK）').setRequired(true)
    .setChoiceValues(['YouTube', 'IRIAM', 'Twitch', 'TikTok LIVE', 'ニコニコ生放送', 'Xのスペース'])
    .showOtherOption(true);

  form.addCheckboxItem().setTitle('活動内容・ジャンル（複数選択OK）').setRequired(true)
    .setChoiceValues(['ゲーム実況', '歌・音楽', '雑談・トーク', 'お絵描き', 'ASMR', 'ダンス', '朗読・声劇', '企画・バラエティ', '解説・教育'])
    .showOtherOption(true);

  form.addParagraphTextItem()
    .setTitle('あなたを初めて知る人に、どんな活動者だと伝えたいですか？')
    .setHelpText('例：「和風の世界観で、歌と雑談を中心に活動するVライバー」')
    .setRequired(true);

  form.addMultipleChoiceItem().setTitle('主にホームページを見てほしい相手は？').setRequired(true)
    .setChoiceValues(['今いるファン', '初めて知る人', '企業・仕事の依頼者', 'コラボ相手', '配信プラットフォームの利用者', '幅広い人', 'わからない']);

  form.addTextItem()
    .setTitle('連絡先（制作のやりとり用）')
    .setHelpText('XのDMアカウント名 または メールアドレス。※この連絡先はサイトには公開しません。')
    .setRequired(true);

  // ② 目的と最優先（最重要）
  form.addSectionHeaderItem()
    .setTitle('② ホームページの目的と、いちばん大切なこと')
    .setHelpText('ここが制作の「軸」になります。じっくり考えて答えてください。');

  form.addCheckboxItem().setTitle('ホームページを作りたい理由（複数選択OK）').setRequired(true)
    .setChoiceValues([
      '活動をまとめて紹介したい', '新しいファンを増やしたい', '配信やSNSへ誘導したい',
      '案件・仕事を受けたい', 'コラボ相手を探したい', 'グッズを販売したい',
      'ファンクラブ・メンバーを増やしたい', 'プロらしい印象を作りたい', '二次創作ルールを伝えたい'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem().setTitle('その中で「いちばん大切な目的」を1つだけ選ぶなら？').setRequired(true)
    .setChoiceValues(['活動紹介', '新規ファン獲得', '配信・SNSへの誘導', '案件獲得', 'コラボ募集', 'グッズ販売', 'ファンクラブ・メンバー加入', 'ルールの案内'])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('訪問者に、最終的に取ってほしい「たった一つの行動」は？')
    .setHelpText('いちばん目立つボタンになります。')
    .setRequired(true)
    .setChoiceValues(['YouTubeをチャンネル登録', '配信を見に行く', 'Xをフォロー', '仕事・案件を問い合わせ', 'コラボを申し込む', 'メンバー・ファンクラブに加入', 'グッズを購入', 'プロフィール・実績を読む'])
    .showOtherOption(true);

  form.addTextItem()
    .setTitle('その「一つの行動」につなげるURL')
    .setHelpText('例：YouTube・問い合わせフォーム・FANBOXなどのURL。まだ無ければ空欄でOK（制作を進める段階で必要になります）。');

  form.addParagraphTextItem()
    .setTitle('公開後、どんな状態になれば「成功」だと感じますか？')
    .setHelpText('例：「企業から依頼が来る」「初見の人に活動がすぐ伝わる」')
    .setRequired(true);

  form.addMultipleChoiceItem().setTitle('今、ホームページはありますか？').setRequired(true)
    .setChoiceValues(['ない（初めて作る）', 'ある（リニューアルしたい）', '以前あったが今はない']);

  form.addTextItem().setTitle('（ある方のみ）現在または以前のホームページURL');

  // ③ 世界観・デザイン
  form.addSectionHeaderItem()
    .setTitle('③ 世界観・デザインの雰囲気')
    .setHelpText('見た目の方向性を決めます。');

  form.addCheckboxItem().setTitle('好きなデザインの雰囲気（複数選択OK）').setRequired(true)
    .setChoiceValues([
      'かわいい・ふわふわ', 'ポップ・元気', 'クール・スタイリッシュ', 'ダーク・神秘的', '上品・高級感',
      'ナチュラル・やさしい', 'シンプル・すっきり', 'ゲーミング・近未来', '和風', 'レトロ', '幻想的・物語的', 'おまかせ'
    ])
    .showOtherOption(true);

  form.addTextItem()
    .setTitle('その中で「最優先」の雰囲気は？')
    .setHelpText('例：「和風が最優先。少しダーク」「おまかせ」')
    .setRequired(true);

  form.addTextItem()
    .setTitle('あなたの世界観を表す言葉を3つまで')
    .setHelpText('例：妖怪、祭り、夜')
    .setRequired(true);

  form.addCheckboxItem().setTitle('使いたい色（複数選択OK）').setRequired(true)
    .setChoiceValues(['黒・ダーク系', '白・ライト系', '赤・オレンジ系', '青・水色系', '紫系', 'ピンク系', '緑・黄緑系', '黄色・金色系', 'キャラクターやロゴに合わせたい', 'おまかせ'])
    .showOtherOption(true);

  form.addParagraphTextItem()
    .setTitle('使いたくない色・表現・雰囲気（NG）')
    .setHelpText('例：「パステルピンクは避けたい」「怖すぎる表現はNG」「特になし」')
    .setRequired(true);

  form.addMultipleChoiceItem().setTitle('アニメーション（動く演出）の強さは？').setRequired(true)
    .setChoiceValues(['ほぼ動かさず見やすさ優先', '少しだけ動かしたい', '印象的にしっかり動かしたい', '派手な演出を多く使いたい', 'おまかせ']);

  form.addMultipleChoiceItem().setTitle('スマホとPC、どちらで見る人が多そう？').setRequired(true)
    .setChoiceValues(['スマホが多い', 'PCが多い', '半々くらい', 'わからない']);

  // ④ 理想像（自由記述）
  form.addSectionHeaderItem()
    .setTitle('④ 参考と、あなたの理想')
    .setHelpText('言葉で自由に。ここがいちばん大事です。');

  form.addParagraphTextItem()
    .setTitle('参考にしたいホームページ・画像・動画のURL')
    .setHelpText('1行に1件。なければ空欄でOK。');

  form.addParagraphTextItem()
    .setTitle('制約を気にせず、理想のホームページを自由に語ってください')
    .setHelpText('実現できるか分からなくてOK。最初に見せたい景色、訪問者に感じてほしいこと、好きな演出などを、あなたの言葉で。')
    .setRequired(true);

  // ⑤ 掲載内容
  form.addSectionHeaderItem()
    .setTitle('⑤ ホームページに載せたい内容')
    .setHelpText('必要なページを洗い出します。');

  form.addCheckboxItem().setTitle('載せたい内容（複数選択OK）').setRequired(true)
    .setChoiceValues([
      'メインビジュアル（最初の画面）', 'プロフィール・自己紹介', 'キャラクター設定・物語', '配信先・SNSリンク',
      '配信スケジュール', '最新のお知らせ', '活動実績・出演歴', '歌・動画・作品紹介', '案件・仕事の案内',
      'お問い合わせ', 'グッズ', 'メンバー・ファンクラブ', '二次創作ガイドライン', 'ファンアート紹介', 'よくある質問'
    ])
    .showOtherOption(true);

  form.addParagraphTextItem()
    .setTitle('公開時に「絶対に必要」な内容を3つまで')
    .setHelpText('上で選んだ中から、初回公開に最低限これは欲しい、というものを。例：プロフィール、YouTubeへの導線、問い合わせ')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('プロフィール・キャラクター設定（書ける範囲でOK）')
    .setHelpText('年齢・誕生日・種族・出身・身長・好きなもの・性格・物語など。※ここに書いた内容はHPに公開されます。出したくない情報は書かないでください。')
    .setRequired(true);

  // 決定的に重要なので必須（AIが最終判断で必ず守る基準）
  form.addSectionHeaderItem()
    .setTitle('⑥ これだけは、という要望')
    .setHelpText('制作の最終的なよりどころにします。');

  form.addParagraphTextItem()
    .setTitle('今回、絶対に実現したいこと（重要な順に1〜3個）')
    .setHelpText('「これだけは外せない」という内容を。最終提案で必ず守ります。')
    .setRequired(true);

  // ============================================================
  // PART 2 : 深掘り（すべて任意 / こだわり・実データ・権利）
  // ============================================================
  form.addSectionHeaderItem()
    .setTitle('― ここから先はすべて任意です ―')
    .setHelpText('答えるほど「あなたらしい」HPになります。時間がなければここで送信してもOK。ただし、実際に完成・公開まで進める際は、この先のURL・素材・権利の情報が必要になります。');

  // ⑦ 文章・話し方
  form.addSectionHeaderItem()
    .setTitle('⑦ あなたらしい文章・話し方')
    .setHelpText('サイトの文章にあなたの雰囲気を反映します。');

  form.addTextItem().setTitle('普段使う一人称').setHelpText('例：私／僕／わし／自分の名前');
  form.addTextItem().setTitle('ファンや訪問者を何と呼びますか？').setHelpText('例：みんな／リスナーさん／眷属／特にない');

  form.addCheckboxItem().setTitle('普段の話し方に近いもの（複数選択OK）')
    .setChoiceValues(['丁寧', '親しみやすい', '元気', '落ち着いている', 'かわいい', 'クール', '知的', 'コミカル', '強気', '古風', '方言を使う', 'キャラクター口調がある'])
    .showOtherOption(true);

  form.addParagraphTextItem().setTitle('よく使う言葉・語尾・挨拶').setHelpText('配信開始/終了の挨拶、口癖、語尾、ファンへの呼びかけなど');

  form.addMultipleChoiceItem().setTitle('サイトの文章の語り手は？')
    .setChoiceValues(['本人が直接話しかける感じ', '第三者が紹介するプロフィール風', '場所によって使い分けたい', 'おまかせ']);

  form.addTextItem().setTitle('キャッチコピー（あれば）').setHelpText('例：「歌と笑いで夜を彩るVライバー」／AIに考えてほしい場合はその旨');
  form.addParagraphTextItem().setTitle('避けたい言葉・言い方').setHelpText('例：「過度にかわいい口調は避けたい」「企業向けには砕けすぎない」');
  form.addParagraphTextItem().setTitle('普段の話し方がわかるURL').setHelpText('X・YouTube・配信アーカイブなど。AIが実際の言葉遣いを参考にします。');

  // ⑧ 素材・権利
  form.addSectionHeaderItem()
    .setTitle('⑧ 画像・ロゴ・素材の準備状況')
    .setHelpText('制作に使える材料と、著作権の確認です。実際の制作にはこの情報が重要になります。');

  form.addCheckboxItem().setTitle('今すぐ用意できる素材（複数選択OK）')
    .setChoiceValues(['キャラクター立ち絵', '表情差分', 'キービジュアル', 'ロゴ', '配信画面・背景', 'ファンアート', '写真', '動画', '音声・BGM', 'デザイン資料・設定資料', '特にない', 'わからない']);

  form.addMultipleChoiceItem().setTitle('キャラクター立ち絵の状態')
    .setChoiceValues(['透過PNGがある', '背景付き画像のみある', 'Live2D・PSDなどの元データがある', 'あるが形式はわからない', 'これから用意する', '立ち絵はない', 'おまかせで進めたい']);

  form.addMultipleChoiceItem().setTitle('ロゴの状態')
    .setChoiceValues(['透過PNGまたはSVGがある', '背景付き画像のみある', 'あるが形式はわからない', 'これから用意する', 'ロゴはない', '文字だけで作ってほしい', 'おまかせ']);

  form.addParagraphTextItem().setTitle('素材を確認できる共有URL').setHelpText('Google Drive・Dropbox・ギガファイル便など。1行に1件。');

  form.addMultipleChoiceItem().setTitle('その素材を、HPに掲載・加工・商用利用してよいですか？')
    .setHelpText('自分に権利がある／制作者の許可を得ているか、という確認です。')
    .setChoiceValues(['すべて自分に権利があり、掲載・加工してよい', '制作者から掲載・加工の許可を得ている', '一部は制作者への確認が必要', '利用してよい範囲がわからない', '使える素材はまだない']);

  form.addParagraphTextItem().setTitle('素材の制作者名・クレジット表記（必要な場合）').setHelpText('例：イラスト担当者名、SNS URL、「サイト内に名前を掲載」など');

  form.addCheckboxItem().setTitle('素材の加工はどこまで可能ですか？（複数選択OK）')
    .setChoiceValues(['サイズ変更', 'トリミング', '背景除去', '色味調整', '一部を隠して配置', 'アニメーション加工', '加工不可', '制作者への確認が必要', 'わからない']);

  form.addMultipleChoiceItem().setTitle('今ない素材は、どう進めたいですか？')
    .setChoiceValues(['仮画像・仮文字で先に制作したい', '素材が完成するまで待ちたい', '素材なしでも成立するデザインにしたい', 'フリー素材や生成素材を提案してほしい', '相談して決めたい']);

  form.addMultipleChoiceItem().setTitle('AI生成の画像・装飾を使ってもよいですか？')
    .setChoiceValues(['使ってよい', 'キャラクター以外の背景・装飾ならよい', '事前確認があればよい', '使わないでほしい', '相談したい']);

  // ⑨ SNS・問い合わせ・運用
  form.addSectionHeaderItem()
    .setTitle('⑨ SNS・問い合わせ・公開後の運用');

  form.addParagraphTextItem()
    .setTitle('掲載したいSNS・外部サービスのURL')
    .setHelpText('X・YouTube・IRIAM・Twitch・TikTok・FANBOX・Patreon・BOOTH・Discordなど。1行に1件「サービス名：URL」で。');

  form.addParagraphTextItem().setTitle('特に目立たせたいリンクを3つまで').setHelpText('全部を同じ強さで並べず、重要な導線を強調します。');

  form.addCheckboxItem().setTitle('ホームページで受け付けたい問い合わせ（複数選択OK）')
    .setChoiceValues(['企業案件', '出演・イベント', 'コラボ', 'MIX・音楽関連', 'イラスト・制作関連', '取材', 'ファンからのメッセージ', '問い合わせは受け付けない'])
    .showOtherOption(true);

  form.addMultipleChoiceItem().setTitle('問い合わせの受け取り方法は？')
    .setChoiceValues(['メール', 'XのDM', '既存のGoogleフォームなど', '新しい問い合わせフォームを作りたい', '問い合わせは設置しない', '相談したい']);

  form.addMultipleChoiceItem().setTitle('二次創作ガイドラインを掲載しますか？')
    .setChoiceValues(['完成した内容がある', '相談しながら作りたい', '将来掲載したい', '掲載しない', '未定']);

  form.addCheckboxItem().setTitle('完成後、どんな内容を更新しそうですか？（複数選択OK）')
    .setChoiceValues(['配信スケジュール', 'お知らせ・ブログ', '活動実績', 'プロフィール', '画像', 'SNSリンク', 'グッズ', 'ページ追加', 'ほとんど更新しない', 'わからない']);

  form.addMultipleChoiceItem().setTitle('完成後の管理方法は？')
    .setChoiceValues(['自分で更新したい', '更新を依頼したい', '基本は自分で、難しい部分だけ依頼したい', 'ほぼ更新しない', 'まだわからない']);

  // ⑩ 予算・スケジュール・公開環境・最終確認
  form.addSectionHeaderItem()
    .setTitle('⑩ 予算・スケジュール・公開・最終確認');

  form.addMultipleChoiceItem().setTitle('制作費用のご予算は？')
    .setHelpText('月額のサーバー代は原則0円（独自ドメイン利用時のみ年1,000〜2,000円ほどの実費）。')
    .setChoiceValues(['5,000円未満', '5,000〜10,000円', '10,000〜30,000円', '30,000〜50,000円', '50,000円以上', 'まだわからない・相談したい']);

  form.addMultipleChoiceItem().setTitle('完成希望時期は？')
    .setChoiceValues(['できるだけ早く', '1か月以内', '1〜2か月以内', '3か月以内', '急いでいない', '相談したい']);

  form.addTextItem().setTitle('公開したい具体的な日と、その理由').setHelpText('例：「10月1日、活動1周年に合わせたい」');

  form.addMultipleChoiceItem().setTitle('独自ドメイン（例：○○.com）は使いたいですか？')
    .setChoiceValues(['使いたい', '今は無料URLでいい（あとで検討）', 'よくわからない・相談したい']);

  form.addMultipleChoiceItem().setTitle('ホームページの公開・管理アカウントについて')
    .setHelpText('納品後にご自身で持てるようにするか、制作者側で用意するかの確認です。')
    .setChoiceValues(['自分のGitHub・Vercelアカウントで持ちたい（作り方も教えてほしい）', 'まずは制作者におまかせ（あとで自分に移せると嬉しい）', 'よくわからない・相談したい']);

  form.addCheckboxItem().setTitle('将来的に追加・強化したいもの（複数選択OK）')
    .setChoiceValues(['グッズ販売', 'メンバー・有料コンテンツへの導線', 'ブログ・お知らせ', '配信スケジュール連携', '多言語対応', 'SEO・検索対策', 'アクセス解析', 'ファン向けコンテンツ', '複数タレント対応', '今の内容だけでよい'])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('制作中、判断に迷ったときに優先してほしいものは？')
    .setHelpText('細かい仕様をAIが判断するときの共通の基準になります。')
    .setChoiceValues(['自分らしい世界観', '見やすさ・わかりやすさ', 'ファンへの親しみやすさ', '企業から見た信頼感', '印象に残る派手さ', '表示の軽さ・速さ', '費用を抑えること', 'おまかせ']);

  form.addCheckboxItem().setTitle('AI・制作者に「おまかせ」してよい範囲（複数選択OK）')
    .setChoiceValues(['ページ構成', '配色', 'フォント', '文章・キャッチコピー', '画像の配置・加工', '背景・装飾', 'アニメーション', 'ほぼ全部', 'おまかせせず相談しながら決めたい']);

  form.addParagraphTextItem()
    .setTitle('最後に、AIと制作者へ伝えておきたいこと（自由）')
    .setHelpText('まだ設問に出ていない希望・こだわり・夢・不安・背景事情など、何でも自由に。');

  Logger.log('ヒアリングシート v3 生成完了！');
}
