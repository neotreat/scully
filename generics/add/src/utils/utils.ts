const fs = require('fs');

const getPackageJson = () => {
  console.log('read package.json');
  return new Promise(resolve => {
    fs.readFile('./package.json', 'utf8', (err, content) => {
      if (err) {
        console.error('package.json not found');
        return;
      }
      resolve(JSON.parse(content));
    });
  });
};

const overwritePackageJson = data => {
  return new Promise(resolve => {
    fs.writeFile('./package.json', JSON.stringify(data, null, 2), (err, content) => {
      if (err) {
        console.log('Error reading package.json', err);
        return;
      }
      resolve(true);
    });
  });
};

const checkLibAndName = () => {
  return new Promise(resolve => {
    fs.readFile('./package.json', 'utf8', (err, content) => {
      if (err) {
        console.error('package.json not found');
        return;
      }
      const name = JSON.parse(content).name;
      if (content.indexOf('react') > 0) {
        resolve({lib: 'react', name});
      } else if (content.indexOf('vue') > 0) {
        resolve({lib: 'vue', name});
      } else {
        console.error('package.json not found react or vue library');
      }
      return;
    });
  });
};

const createConfig = () => {
  // tslint:disable-next-line:no-console
  console.info('Creating Scully config file.');
  checkLibAndName().then((data: {lib: string; name: string}) => {
    console.log(data);
    const configName = `scully.${data.name}.config.js`;
    const configFile = createConfigFile(data);
    fs.writeFile(configName, configFile, (err, content) => {
      if (err) {
        console.log(err);
      }
      return;
    });
  });
};

const createConfigFile = data => {
  return `exports.config = {
  projectName: "${data.name}",
  bareProject: true,
  distFolder: './build',
  outDir: './dist/static',
  routes: {
  }
};`;
};

export {getPackageJson, overwritePackageJson, createConfig};
