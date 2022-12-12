const sc2t = require('json-schema-to-typescript');
const http = require('http');
const fs = require('fs');

const url =
  process.env.OPENAPI_URL ||
  'http://py-ispyb-development:8888/ispyb/api/v1/openapi.json';
const req = http.get(url, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      for (const schemaName in json.components.schemas) {
        if (schemaName.startsWith('Paginated')) continue;

        const schema = {
          components: json.components,
          ...json.components.schemas[schemaName],
        };

        sc2t
          .compile(schema)
          .then((ts) => {
            const construct =
              'type Constructor<T = {}> = new (...args: any[]) => T;';
            // should be dealt with vis allow extra properties: forbid
            ts = ts.replaceAll('  [k: string]: unknown;\n', '');
            const interfaces = ts.split('export interface ');
            const classes = interfaces.slice(1);
            classes.forEach((cls, idx) => {
              const lines = cls.split('\n');
              const name = lines[0].replace(' {', '');
              classes[idx] = `
export function with${name}<TBase extends Constructor>(Base: TBase) {
  return class With${name} extends Base {\n  ${lines
                .slice(1)
                .join('\n  ')
                .slice(0, -2)}}`;
            });

            fs.writeFileSync(
              `src/models/${schemaName}.d.ts`,
              ts + '\n' + construct + classes.join('') + '\n'
            );
          })
          .catch((e) => {
            console.log('Error parsing', schemaName, e);
          });
      }
    } catch (error) {
      console.error(error.message);
    }
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
