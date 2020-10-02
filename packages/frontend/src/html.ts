export type HtmlOptions = {
  title: string;
  description: string;
  rootHtml?: string;
  styleTags: string;
};

export default function generateHtml(opts: HtmlOptions): string {
  const public_path = process.env.FRONTEND_PUBLIC_PATH;
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="${opts.description}"/>

      <link rel="icon" href="${public_path}/favicon.ico" />
      <link rel="apple-touch-icon" href="${public_path}/logo192.png" />

      <title>${opts.title}</title>
      <style>html, body, #root { widht: 100%; height: 100%; margin: 0; padding: 0; }</style>
      ${opts.styleTags}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${opts.rootHtml}</div>
    </body>
  </html>`;
}
