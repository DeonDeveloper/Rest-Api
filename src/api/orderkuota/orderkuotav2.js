const axios = require('axios');
const crypto = require("crypto");

function generateTransactionId() {
    return crypto.randomBytes(5).toString('hex').toUpperCase();
}

function generateExpirationTime() {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    return expirationTime;
}

let tokenCache = {};

async function loginOrderkuota(username, password) {
    const loginUrl = `https://amfcode.my.id/orkut/login?username=${username}&password=${password}`;
    const res = await axios.get(loginUrl);
    if (!res.data.success) throw new Error("Login gagal");
    return res.data.results;
}

async function verifyOTP(username, otp) {
    const otpUrl = `https://amfcode.my.id/orkut/otp?username=${username}&otp=${otp}`;
    const res = await axios.get(otpUrl);
    if (!res.data.success) throw new Error("OTP gagal");
    return res.data.results;
}

async function getMutasi(username, token) {
    const mutasiUrl = `https://amfcode.my.id/orkut/mutasi?username=${username}&token=${token}`;
    const res = await axios.get(mutasiUrl);
    if (!res.data.success) throw new Error("Gagal ambil data mutasi");
    return res.data;
}

module.exports = function(app) {
    app.get('/orderkuotav2/login', async (req, res) => {
        const { apikey, username, password } = req.query;
        try {
            const result = await loginOrderkuota(username, password);
            res.json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    });

    app.get('/orderkuotav2/otp', async (req, res) => {
        const { apikey, username, otp } = req.query;
        try {
            const result = await verifyOTP(username, otp);
            tokenCache[username] = result.token;
            res.json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    });

    app.get('/orderkuotav2/mutasi', async (req, res) => {
        const { username, apikey, token} = req.query;
        if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: "Apikey tidak valid." });

        try {
            const token = tokenCache[username];
            if (!token) return res.status(401).json({ status: false, message: "Token tidak ditemukan. Silakan login dan verifikasi OTP dulu." });
            const result = await getMutasi(username, token);
            res.json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    });
};
