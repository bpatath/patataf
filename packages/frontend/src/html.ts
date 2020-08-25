export type HtmlOptions = {
  title: string;
  description: string;
  rootHtml?: string;
};

export default function generateHtml(opts: HtmlOptions): string {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="${opts.description}"/>

      <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

      <title>${opts.title}</title>
      <style>html, body, #root { widht: 100%; height: 100%; margin: 0; padding: 0; }</style>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${opts.rootHtml}</div>
    </body>
  </html>`;
}
