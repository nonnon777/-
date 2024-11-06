import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

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

  // publicフォルダー内のファイルを参照
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = `./public${filePath}`;

  if (filePath.endsWith("/token.txt")) {
    // token.txtには直接アクセスできないようにする（403 Forbidden）
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const contentType = getContentType(filePath); // ファイルに対応するMIMEタイプを取得

    if (filePath.endsWith(".html")) {
      // HTMLの場合はtoken.txtを埋め込む
      const token = await Deno.readTextFile("./public/token.txt");

      // index.htmlを読み込む
      let htmlContent = await Deno.readTextFile(filePath);

      // HTMLの中にtoken.txtの内容を埋め込む
      htmlContent = htmlContent.replace(
        "</body>",
        `<p id="test" class="${token.trim()}">
        </p></body>`
      );

      return new Response(htmlContent, {
        status: 200,
        headers: new Headers({
          "content-type": contentType,
        }),
      });
    } else {
      // 画像やCSS/JSファイルをそのまま返す
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        status: 200,
        headers: new Headers({
          "content-type": contentType,
        }),
      });
    }

  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
};

// サーバーを起動
serve(handler);
