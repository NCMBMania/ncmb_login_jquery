# NCMB 認証プラグイン for jQuery

NCMBの認証処理をjQueryプラグイン化しました。

[デモ](https://jsfiddle.net/f35r0u49/3/)

## 実装

モーダルウィンドウに対してメソッドを追加します。

```js
$('#signupForm').on('click', (e) => {
  $('#modal-default').signUp(
    (user) => {
      $('#result').text(`サインアップしました。userName -> ${user.userName}`);
    },
    (err) => {
      $('#result').text(`エラー -> ${JSON.stringify(err)}`);
    }
  );
});

$('#modal-default').initialize({
  applicationKey: applicationKey,
  clientKey: clientKey
});
```

## 依存性

- [jQuery](http://jquery.com/)
- [iziModal.js](http://izimodal.marcelodolce.com/)

## LICENSE

MIT
