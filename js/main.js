const APPID = "1053580581661993383"; //APIのID
const GENREID = "551177"; //ジャンルコード（衣服）
const IMAGEFLAG = "1"; //画像
const MAX_PAGE = 3; //最大取得ページ件数(1ページ30件)。この場合3ページ = 90件取得。
const SORT = "-reviewCount"; //レビューの多い順

const searchButton = document.getElementById("search-button");

function put_item(item) {
  //ループで1件1件表示したいHTML部分を作成
  $("#contentInner").append(
    `
      <li class="col-md-4">
      <dl>
        <dt>
          <a href="${item.itemUrl}" target="_blank">
            <img src=
            "${item.mediumImageUrls[0].imageUrl.replace("?_ex=128x128", "")}"
            width="100%"
            >
          </a>
        </dt>
        <dd class="itemName">
          <a href="${item.itemUrl}" target="_blank">${item.itemName}</a>
        </dd>
        <dd class="itemPrice">${item.itemPrice}<span>円(税込)</span></dd>
        <dd class="itemValue">
          レビュー:&nbsp;<span>${item.reviewAverage}
          </span>(${item.reviewCount})件
        </dd>
      </dl>
      </li>
      `
  );
}

//商品情報のリクエスト
function search_rakuten(page, KEYWORD) {
  $.ajax({
    url:
      "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&applicationId=" +
      APPID +
      // "&shopCode=" +
      // SHOP_CODE + //店舗を指定しない場合は不要
      "&keyword=" +
      KEYWORD +
      "&genreId=" +
      GENREID +
      "&imageFlag=" +
      IMAGEFLAG +
      "&sort=" +
      SORT +
      "&page=" +
      page,
    type: "get",
    dataType: "json",
    timeout: 10000,
    async: "true",
  })
    //チェーンメソッド
    //リクエストを投げ、レスポンスの結果が成功のときはdoneメソッドで受け取る。失敗のときはfailメソッドで受け取る
    .done(function (data) {
      goods = data.Items;
      //1つずつデータを渡していく。
      for (let i in goods) {
        put_item(goods[i].Item);
      }
      //MAX_PAGEで設定した数値になるまでループする
      if (page < MAX_PAGE) {
        search_rakuten(page + 1, KEYWORD);
      }
    })
    .fail(function (data) {
      //読み込み失敗時の処理
      console.log("読み込みエラー");
    });
}

//入力欄に入力したKEYWORDで検索メソッド実行
$("#search-button").click(function () {
  //処理を記載。
  $("#contentInner").empty(); //検索結果リセット
  const KEYWORD = document.getElementById("search-text").value;
  search_rakuten(1, KEYWORD);
});
//enterkeyを押して検索実行
$("#search-text").keypress(function (e) {
  if (e.which == 13) {
    $("#search-button").click();
  }
});
