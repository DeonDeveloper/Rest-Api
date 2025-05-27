const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
require("./function.js")

const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'api-page')));
app.use('/src', express.static(path.join(__dirname, 'src')));

const settingsPathh = path.join(__dirname, './src/settings.json');
const settingss = JSON.parse(fs.readFileSync(settingsPathh, 'utf-8'));
global.apikey = settingss.apiSettings.apikey

const settingsPath = path.join(process.cwd(), 'src/settings.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Hanya menerima metode POST' });
  }

  const { newKey } = req.body;

  if (!newKey || typeof newKey !== 'string') {
    return res.status(400).json({ status: false, message: 'Parameter newKey tidak valid' });
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

    // Cek apakah key sudah ada
    if (settings.apiSettings.apikey.includes(newKey)) {
      return res.status(409).json({ status: false, message: 'API key sudah terdaftar' });
    }

    settings.apiSettings.apikey.push(newKey);

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    return res.status(200).json({ status: true, message: 'API key berhasil ditambahkan', apikeys: settings.apiSettings.apikey });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Gagal menulis ke settings.json', error: error.message });
  }
}


app.use((req, res, next) => {
console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Request Route: ${req.path} `));
global.totalreq += 1
    const originalJson = res.json;
    res.json = function (data) {
        if (data && typeof data === 'object') {
            const responseData = {
                status: data.status,
                creator: settings.apiSettings.creator || "Created Using Deoberon",
                ...data
            };
            return originalJson.call(this, responseData);
        }
        return originalJson.call(this, data);
    };
    next();
});

// Api Route
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src/api');
fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
        fs.readdirSync(subfolderPath).forEach((file) => {
            const filePath = path.join(subfolderPath, file);
            if (path.extname(file) === '.js') {
                require(filePath)(app);
                totalRoutes++;
                console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${path.basename(file)} `));
            }
        });
    }
});
console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-page', 'index.html'));
});

app.use((req, res, next) => {
    res.status(404).sendFile(process.cwd() + "/api-page/404.html");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(process.cwd() + "/api-page/500.html");
});

app.listen(PORT, () => {
    console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server is running on port ${PORT} `));
});

module.exports = app;
