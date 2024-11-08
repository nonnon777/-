import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const allowedReferer = "https://nonnon777-original-we-41.deno.dev";  // 許可するリファラーURL

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

  // AJAXによるトークンリクエスト処理
  if (url.pathname === "/get-token") {
    const referer = req.headers.get("referer");

    if (referer === allowedReferer) {
      try {
        // Refererが許可されたURLと一致する場合、token.txtの内容を返す
        const token = await Deno.readTextFile("./public/token.txt");
        return new Response(token, {
          status: 200,
          headers: new Headers({
            "content-type": "text/plain",
          }),
        });
      } catch (error) {
        return new Response("Token file not found", { status: 404 });
      }
    } else {
      
      return new Response(req, {
        status: 200,
        headers: new Headers({
          "content-type": "text/plain",
        }),
      });
    }
  }

  // 他のリクエスト処理
  let filePath;
  if (url.pathname === "/") {
    filePath = "./public/index.html";  // / -> index.html
  } else if (url.pathname === "/test") {
    filePath = "./public/test.html";  // /test -> test.html
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
