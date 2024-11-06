import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

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
    
    // token.txtを読み込む
    const token = await Deno.readTextFile("./public/token.txt");

    // index.htmlを読み込む
    let htmlContent = await Deno.readTextFile(filePath);

    // HTMLの中にtoken.txtの内容を埋め込む
    // 例えば、<script>タグの中にtokenを変数として埋め込む
    htmlContent = htmlContent.replace(
      "</body>",
      `<p id="test" class="${token.trim()}">
      </p></body>`
    );
    const contentType = filePath.endsWith(".html")
      ? "text/html"
      : filePath.endsWith(".js")
      ? "application/javascript"
      : filePath.endsWith(".css")
      ? "text/css"
      : "text/plain";
    return new Response(htmlContent, {
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
