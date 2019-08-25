import posthtml from 'posthtml';
import plugin from '../';

describe('posthtml-hash', () => {
  it('matches the snapshot – default options', () => {
    posthtml()
      .use(plugin({ path: 'src/tests/__fixtures__' }))
      .process(
        `
        <html>
          <head>
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result: { html: string }) => {
        expect(result.html).toMatchSnapshot();
      });
  });

  it('matches the snapshot – custom hash length', () => {
    posthtml()
      .use(plugin({ path: 'src/tests/__fixtures__', hashLength: 10 }))
      .process(
        `
        <html>
          <head>
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result: { html: string }) => {
        expect(result.html).toMatchSnapshot();
      });
  });
});
