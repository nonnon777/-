import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const allowedOrigin = "https://nonnon777-original-we-41.deno.dev";  // 許可するオリジン
const allowedReferer = "https://nonnon777-original-we-41.deno.dev/game/game.html";  // 許可するリファラー
// Google Apps Script WebアプリのURL（GASエンドポイント）
const gasEndpoint = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; 

// 静的ファイルの拡張子に対するMIMEタイプを設定
const getContentType = (filePath) => {
  if (filePath.endsWith(".html")) {
    return "text/html";
  } else if (filePath.endsWith(".css")) {
    return "text/css";
  } else if (filePath.endsWith(".js")) {
    return "application/javascript";
  } else if (filePath.endsWith(".png")) {
    return "image/png";
  } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (filePath.endsWith(".gif")) {
    return "image/gif";
  } else {
    return "text/plain";
  }
};


const handler = async (req) => {
  const url = new URL(req.url);

  // `/send-data` パスに対する処理
  if (url.pathname === "/send-data" && req.method === "POST") {
    const referer = req.headers.get("referer");
    const origin = req.headers.get("origin");

    // CORS設定とReferer確認
    const headers = new Headers();
    if (origin === allowedOrigin && referer === allowedReferer) {
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type");
    } else {
      // 許可されていないオリジンやリファラーの場合
      return new Response("Forbidden: Invalid Origin or Referer", {
        status: 403,
        headers: {
          "content-type": "text/plain",
        },
      });
    }
    // OPTIONSメソッドへの対応（CORSプリフライトリクエスト）
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204, // No content
        headers: headers,
      });
    }

    try {
      const body = await req.json();  // リクエストボディのデータをJSONとして取得

      // Google Apps Scriptへデータを送信
      const response = await fetch(gasEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),  // ボディにPOSTされたデータを送信
      });

      // GASからのレスポンスを返す
      const responseData = await response.json();
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...headers,  // CORSヘッダーを追加
        },
      });
    } catch (error) {
      return new Response("Failed to send data to GAS", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // 他のパス（HTMLファイルを返す）
  let filePath;
  if (url.pathname === "/") {
    filePath = "./public/index.html";  // / -> index.html
  } else if (url.pathname === "/game") {
    filePath = "./public/game/game.html";  // /game -> game.html
  } else {
    filePath = `./public${url.pathname}`;  // その他のパス
  }

  if (filePath.endsWith("/token.txt")) {
    // token.txtには直接アクセスできないようにする（403 Forbidden）
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const contentType = getContentType(filePath);
    const file = await Deno.readFile(filePath);
    return new Response(file, {
      status: 200,
      headers: new Headers({
        "content-type": contentType,
      }),
    });
  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
};

// サーバーを起動
serve(handler);
