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
            // should be dealt with vis allow extra properties: forbid
            ts = ts.replaceAll('  [k: string]: unknown;\n', '');
            const interfaces = ts.split('export interface ');
            const classes = interfaces.slice(1);
            classes.forEach((cls, idx) => {
              const lines = cls.split('\n');
              const name = lines[0].replace(' {', '');
              // This is a nested class, skip it to avoid syntax errors
              if (lines[1].startsWith('  [k: string]:')) {
                console.log("skipping nested class", name);
                classes[idx] = '';
                return;
              }
              classes[idx] = `
export abstract class ${name}Base extends Entity {\n${lines
                .slice(1)
                .join('\n')}
export abstract class ${name}SingletonBase extends SingletonEntity {\n${lines
                .slice(1)
                .join('\n')}`;
            });

            fs.writeFileSync(
              `src/models/new/${schemaName}.ts`,
              'import { Entity } from \'@rest-hooks/rest\';\nimport { SingletonEntity } from \'api/resources/Base/Singleton\';\n\n' + ts + '\n' + classes.join('') + '\n'
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
