(function() {
  const TEMPLATE = {
    IZIMODAL: `<div id="izi-modal-default" data-izimodal-title="サインアップ/サインイン"><p>
    <form>
      ユーザID : <input type="text" id="userName" /><br />
      パスワード : <input type="password" id="password" /><br />
      <span id="password_confirmation_field">
        パスワード確認 : <input type="password" id="password_confirmation" /><br />
      </span>
      <button>      
      サインアップ
      </button>
    </form>
  </p></div>`,
    BOOTSTRAP: {
      SIGNUP: `<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">サインアップ</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form">      
        <div class="modal-body">
          <div class="form-group">
            <label for="inputUserName">ユーザ名</label>
            <input type="text" id="userName" class="form-control" />
          </div>
          <div class="form-group">
            <label for="inputPassword">パスワード</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div class="form-group" id="password_confirmation_field">
            <label for="inputPasswordConfirmation">パスワード（確認入力）</label>
            <input type="password" id="password_confirmation" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">サインアップ</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        </div>
      </form>
    </div>
  </div>`,
      SIGNIN: `  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">サインイン</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form">      
        <div class="modal-body">
          <div class="form-group">
            <label for="inputUserName">ユーザ名</label>
            <input type="text" id="userName" class="form-control" />
          </div>
          <div class="form-group">
            <label for="inputPassword">パスワード</label>
            <input type="password" id="password" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">サインイン</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        </div>
      </form>
    </div>
  </div>`
    }
  };
  
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
      if (this.iziModal) {
        let me = this;
        if (this[0].nodeType === 9) {
          $('body').append(TEMPLATE.IZIMODAL);
          me = $('#izi-modal-default');
        }
        me.iziModal();
      }
      return this;
  	},
    
    // サインアップ処理
    signUp: function(res, rej) {
      // 要素がない場合
      let me = this;
      const user = ncmbObj.ncmb.User.getCurrentUser();
      if (user) {
        return res(user);
      }
      let id = Math.random().toString(36).slice(-8);
      if (this[0].nodeType === 9) {
        if (this.modal) {
          $('body').append(`<div class="modal" tabindex="-1" role="dialog" id="${id}">${TEMPLATE.BOOTSTRAP.SIGNUP}</div>`);
        }
        if (this.iziModal) {
          id = 'izi-modal-default';
        }
        me = $(`#${id}`);
      }
      
      // モーダルを開く
      if (me.iziModal)
        me.iziModal('open');
      if (me.modal)
        me.modal();
      // 処理はフォームのサブミットで行う
      me.find('form').on('submit', (e) => {
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
            if (me.iziModal) 
          	  me.iziModal('close');
            if (me.modal)
              me.modal('hide');
            res(user);
          }, (err) => {
            rej(err);
          });
  		});
    },
    // ログイン
    signIn: function(res, rej) {
      // 要素がない場合
      let me = this;
      const user = ncmbObj.ncmb.User.getCurrentUser();
      if (user) {
        return res(user);
      }
      let id = Math.random().toString(36).slice(-8);
      if (this[0].nodeType === 9) {
        if (this.modal) {
          $('body').append(`<div class="modal" tabindex="-1" role="dialog" id="${id}">${TEMPLATE.BOOTSTRAP.SIGNIN}</div>`);
        }
        if (this.iziModal) {
          id = 'izi-modal-default';
        }
        me = $(`#${id}`);
      }
      
      // モーダルを開く
      if (me.iziModal)
        me.iziModal('open');
      if (me.modal)
        me.modal();
      // 処理はフォームのサブミットで行う
      me.find('form').on('submit', (e) => {
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
            if (me.iziModal) 
          	  me.iziModal('close');
            if (this.modal)
              me.modal('hide');
            res(user);
          }, (err) => {
            rej(err);
          });
  		});
    }
  })

})();

