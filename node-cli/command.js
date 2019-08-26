#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta chart="utf-8" />
  <title>Templage</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>`;

const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;`

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
}

const mkdirp = (dir) => {
  const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  })
}


const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, chalk.green('생성 완료'));
    } 
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, chalk.green('생성 완료'));
    } 
  } else {
    console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
  }
};

const copyFile = (name, directory) => {
  if (exist(name)) {
    mkdirp(directory);
    fs.copyFileSync(name, path.join(directory, name));
    console.log(`${name} 파일이 복사되었습니다.`);
  } else {
    console.error('파일이 존재하지 않아요.');
  }
}

const rimraf = (p) => {
  if (exist(p)) {
    try {
      const dir = fs.readdirSync(p);
      console.log(dir);
      dir.forEach((d) => {
        rimraf(path.join(p, d));
      });
      fs.rmdirSync(p); 
      console.log(`${p} 폴더를 삭제했습니다`);
    } catch (e) {
      console.log(`${p} 파일을 삭제했습니다`);
      fs.unlinkSync(p);
    }
  } else {
    console.error('파일 또는 폴더가 존재하지 않아요');
  }
}

let triggered = false;

program
  .version('0.0.1', '-v, --version')
  .usage('[options]');

program
  .command('template <type>')
  .usage('--name <name> --path [path]')
  .description('템플릿을 생성합니다.')
  .alias('tmpl')
  .option('-n, --name <name>', '파일명을 입력하세요', 'index')
  .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
  .action((type, options) => {
    makeTemplate(type, options.name, options.directory);
    triggered = true;
  });

program
  .command('copy <name> <directory>')
  .usage('<name> <directory>')
  .description('파일을 복사합니다.')
  .action((name, directory) => {
    copyFile(name, directory);
    triggered = true;
  });

program
  .command('rimraf <path>')
  .usage('<path>')
  .description('지정한 경로와 그 아래 파일을/폴더를 지웁니다.')
  .action((path) => {
    rimraf(path);
    triggered = true;
  })


program
  .command('*', { noHelp: true })
  .action(() => {
    console.log('해당 명령어를 찾을 수 없습니다.');
    program.help();
  });

program.parse(process.argv)

if (!triggered) {
  inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: '템플릿 종류를 선택하세요.',
    choices: ['html', 'express-router']
  }, {
    type: 'input',
    name: 'name',
    message: '파일의 이름을 입력하세요.',
    defalut: 'index',
  }, {
    type: 'input',
    name: 'directory',
    message: '파일이 위치할 폴더의 경로를 입력하세요.',
    default: '.'
  }, {
    type: 'confirm',
    name: 'confirm',
    message: '생성하시겠습니까?',
  }])
    .then((answers) => {
      if (answers.confirm) {
        makeTemplate(answers.type, answers.name, answers.directory);
        console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'));
      }
    });
}
