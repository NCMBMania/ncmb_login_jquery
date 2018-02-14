(function() {
	const ncmbObj = {};
  jQuery.fn.extend({
    // 初期化用
  	initialize: function(params) {
      ncmbObj.ncmb = new NCMB(
      	params.applicationKey,
        params.clientKey
      );
      
      // デフォルト値
      params.userName = params.userName || '#userName';
      params.password = params.password || '#password';
      params.password_confirmation = params.password_confirmation || '#password_confirmation';
      ncmbObj.params = params;
      
      // モーダル化
      this.iziModal();
      return this;
  	},
    
    // サインアップ処理
    signUp: function(res, rej) {
      // モーダルを開く
      this.iziModal('open');
      const me = this;
      // 処理はフォームのサブミットで行う
      this.find('form').on('submit', (e) => {
      	e.preventDefault();
        me.find('form').off('submit');
        // 入力値の取得
        const userName = this.find(ncmbObj.params.userName).val();
        const password = this.find(ncmbObj.params.password).val();
        const password_confirmation = this.find(ncmbObj.params.password_confirmation).val();
        // パスワードの確認
        if (password !== password_confirmation) {
          return rej({
            code: 1,
            error: 'Passwords doesn\'t match.'
          });
        }
        // 会員登録APIを実行
        const user = new ncmbObj.ncmb.User();
        user
          .set("userName", userName)
          .set("password", password)
          .signUpByAccount()
          .then(() => {
            // 登録がうまくいったらモーダルを閉じる
          	me.iziModal('close');
            res(user);
          }, (err) => {
            rej(err);
          });
  		});
    },
    // ログイン
    signIn: function(res, rej) {
      // モーダルを開く
      this.iziModal('open');
      const me = this;
      // 処理はフォームのサブミットで行う
      this.find('form').on('submit', (e) => {
      	e.preventDefault();
        me.find('form').off('submit');
        // 入力値の取得
        const userName = this.find(ncmbObj.params.userName).val();
        const password = this.find(ncmbObj.params.password).val();
        // ログイン処理を開始
        ncmbObj.ncmb.User
        	.login(userName, password)
          .then((user) => {
            // ログインがうまくいったらモーダルを閉じる
          	me.iziModal('close');
            res(user);
          }, (err) => {
            rej(err);
          });
  		});
    }
  })
})();

