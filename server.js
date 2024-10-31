import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const handler = async (req) => {
  const url = new URL(req.url);

  // publicフォルダー内のファイルを参照
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = `./public${filePath}`;
  xmlhttprequest
  try {
    const file = await Deno.readFile(filePath); // publicフォルダー内のファイルを読み取る
    const contentType = filePath.endsWith(".html")
      ? "text/html"
      : filePath.endsWith(".js")
      ? "application/javascript"
      : filePath.endsWith(".css")
      ? "text/css"
      : "text/plain";

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
