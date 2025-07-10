const fetch = require('node-fetch');

async function stalkGenshin(uid) {
  const url = `https://enka.network/api/uid/${uid}?info`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/119.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`Gagal mengambil data: ${res.status}`);

  const data = await res.json();
  return data;
}

module.exports = function (app) {
  app.get('/stalk/genshin', async (req, res) => {
    const { apikey, uid } = req.query;
    const now = new Date().toISOString();  
  const { data, error } = await supabase
    .from('apikeys')
    .select('token')
    .eq('token', apikey)
    .gt('expired_at', now)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Apikey tidak ditemukan atau sudah expired' });
  }
    if (!uid) {
      return res.status(400).json({
        status: false,
        message: 'Parameter uid harus diisi.',
      });
    }

    try {
      const result = await stalkGenshin(uid);

      if (!result.playerInfo) {
        return res.status(404).json({
          status: false,
          message: 'Data tidak ditemukan atau UID privat.',
        });
      }

      const player = result.playerInfo;
      const nickname = player.nickname || 'Tidak ditemukan';
      const ar = player.level || '-';
      const worldLevel = player.worldLevel || '-';
      const achievement = player.finishAchievementNum || '-';
      const bio = player.signature || '-';
      const levelAbyss = `Lantai ${player.towerFloorIndex || '-'}-${player.towerLevelIndex || '-'}`;
      const karakterList = player.showAvatarInfoList
        .map((a, i) => `*${i + 1}.* ID: ${a.avatarId} | Lv. ${a.level}`)
        .join('\n');

      const avatarId = player.profilePicture?.avatarId;
      const avatarImage = avatarId
        ? `https://enka.network/ui/${avatarId}.png`
        : 'https://i.ibb.co/FgRk7WJ/default.png';

      return res.status(200).json({
        status: true,
        nickname,
        ar,
        worldLevel,
        achievement,
        bio,
        levelAbyss,
        karakterList,
        avatarImage,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
};
