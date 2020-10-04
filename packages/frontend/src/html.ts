export type HtmlOptions = {
  title: string;
  description: string;
  rootHtml?: string;
  styleTags: string;
  publicPath: string;
};

export default function generateHtml(opts: HtmlOptions): string {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="${opts.description}"/>

      <link rel="icon" href="${opts.publicPath}/favicon.ico" />
      <link rel="apple-touch-icon" href="${opts.publicPath}/logo192.png" />
      <script src="${opts.publicPath}/static/js/vendors.chunk.js"></script>

      <title>${opts.title}</title>
      <style>html, body, #root { widht: 100%; height: 100%; margin: 0; padding: 0; }</style>
      ${opts.styleTags}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${opts.rootHtml}</div>
      <script src="${opts.publicPath}/static/js/main.chunk.js"></script>
    </body>
  </html>`;
}
