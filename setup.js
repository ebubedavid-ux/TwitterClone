const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const folders = {
  server: [
    'config',
    'controllers',
    'middleware',
    'models',
    'routes'
  ],
  client: [
    'src/api',
    'src/components',
    'src/pages',
    'src/context'
  ]
};

const files = {
  server: {
    'server.js': '',
    '.env': '',
    'package.json': ''
  },
  client: {
    '.env': '',
    'vite.config.js': '',
    'package.json': ''
  }
};

const writeFiles = (basePath, fileMap) => {
  for (const [file, content] of Object.entries(fileMap)) {
    fs.writeFileSync(path.join(basePath, file), content);
  }
};

const createFolderTree = (base, subfolders) => {
  for (const folder of subfolders) {
    fs.mkdirSync(path.join(base, folder), { recursive: true });
  }
};

const generateProject = () => {
  const root = process.cwd();

  // === Server ===
  const serverPath = path.join(root, 'server');
  fs.mkdirSync(serverPath);
  createFolderTree(serverPath, folders.server);
  writeFiles(serverPath, files.server);

  // === Client ===
  const clientPath = path.join(root, 'client');
  execSync('npm create vite@latest client -- --template react', { stdio: 'inherit' });
  createFolderTree(clientPath, folders.client);
  writeFiles(clientPath, files.client);

  console.log('\n✅ Folder structure created. Now installing dependencies...');

  // === Install backend dependencies ===
  execSync('npm install express mongoose dotenv bcryptjs jsonwebtoken cors', { cwd: serverPath, stdio: 'inherit' });
  execSync('npm install --save-dev nodemon', { cwd: serverPath, stdio: 'inherit' });

  // === Install frontend dependencies ===
  execSync('npm install axios react-router-dom', { cwd: clientPath, stdio: 'inherit' });

  console.log('\n✅ All dependencies installed and project is ready!');
};

generateProject();
