const fetch = require('node-fetch');
const axios = require('axios');
const moment = require('moment');
const { createClient } = require('@supabase/supabase-js');

// ✅ Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGpkbHFxZW94dnNtaGFkb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzU3NDAsImV4cCI6MjA2NzYxMTc0MH0.eH4cOXY1w58xPrcq8IP4AyU5P3RArAZ_SXd023DsIog'
);

// Fungsi untuk mengonversi kode negara ke nama lengkap dengan bendera
const mooCountry = (value) => {
  const regionMap = {
        AF: 'Afganistan 🇦🇫',
        AX: 'Kepulauan Aland 🇦🇽',
        AL: 'Albania 🇦🇱',
        DZ: 'Aljazair 🇩🇿',
        AS: 'Samoa Amerika 🇦🇸',
        AD: 'Andorra 🇦🇩',
        AO: 'Angola 🇦🇴',
        AI: 'Anguilla 🇦🇮',
        AQ: 'Antartika 🇦🇶',
        AG: 'Antigua dan Barbuda 🇦🇬',
        AR: 'Argentina 🇦🇷',
        AM: 'Armenia 🇦🇲',
        AW: 'Aruba 🇦🇼',
        AU: 'Australia 🇦🇺',
        AT: 'Austria 🇦🇹',
        AZ: 'Azerbaijan 🇦🇿',
        BS: 'Bahama 🇧🇸',
        BH: 'Bahrain 🇧🇭',
        BD: 'Bangladesh 🇧🇩',
        BB: 'Barbados 🇧🇧',
        BY: 'Belarus 🇧🇾',
        BE: 'Belgia 🇧🇪',
        BZ: 'Belize 🇧🇿',
        BJ: 'Benin 🇧🇯',
        BM: 'Bermuda 🇧🇲',
        BT: 'Bhutan 🇧🇹',
        BO: 'Bolivia 🇧🇴',
        BQ: 'Bonaire, Sint Eustatius dan Saba 🇧🇶',
        BA: 'Bosnia dan Herzegovina 🇧🇦',
        BW: 'Botswana 🇧🇼',
        BV: 'Pulau Bouvet 🇧🇻',
        BR: 'Brazil 🇧🇷',
        IO: 'Wilayah Samudra Hindia Britania 🇮🇴',
        BN: 'Brunei Darussalam 🇧🇳',
        BG: 'Bulgaria 🇧🇬',
        BF: 'Burkina Faso 🇧🇫',
        BI: 'Burundi 🇧🇮',
        CV: 'Cabo Verde 🇨🇻',
        KH: 'Kamboja 🇰🇭',
        CM: 'Kamerun 🇨🇲',
        CA: 'Kanada 🇨🇦',
        KY: 'Kepulauan Cayman 🇰🇾',
        CF: 'Republik Afrika Tengah 🇨🇫',
        TD: 'Chad 🇹🇩',
        CL: 'Chili 🇨🇱',
        CN: 'Tiongkok 🇨🇳',
        CX: 'Pulau Natal 🇨🇽',
        CC: 'Kepulauan Cocos (Keeling) 🇨🇨',
        CO: 'Kolombia 🇨🇴',
        KM: 'Komoro 🇰🇲',
        CG: 'Kongo 🇨🇬',
        CD: 'Republik Demokratik Kongo 🇨🇩',
        CK: 'Kepulauan Cook 🇨🇰',
        CR: 'Kosta Rika 🇨🇷',
        HR: 'Kroasia 🇭🇷',
        CU: 'Kuba 🇨🇺',
        CW: 'Curaçao 🇨🇼',
        CY: 'Siprus 🇨🇾',
        CZ: 'Republik Ceko 🇨🇿',
        DK: 'Denmark 🇩🇰',
        DJ: 'Djibouti 🇩🇯',
        DM: 'Dominika 🇩🇲',
        DO: 'Republik Dominika 🇩🇴',
        EC: 'Ekuador 🇪🇨',
        EG: 'Mesir 🇪🇬',
        SV: 'El Salvador 🇸🇻',
        GQ: 'Guinea Ekuatorial 🇬🇶',
        ER: 'Eritrea 🇪🇷',
        EE: 'Estonia 🇪🇪',
        ET: 'Etiopia 🇪🇹',
        FK: 'Kepulauan Falkland (Malvinas) 🇫🇰',
        FO: 'Kepulauan Faroe 🇫🇴',
        FJ: 'Fiji 🇫🇯',
        FI: 'Finlandia 🇫🇮',
        FR: 'Prancis 🇫🇷',
        GF: 'Guyana Prancis 🇬🇫',
        PF: 'Polinesia Prancis 🇵🇫',
        TF: 'Wilayah Selatan Prancis 🇹🇫',
        GA: 'Gabon 🇬🇦',
        GM: 'Gambia 🇬🇲',
        GE: 'Georgia 🇬🇪',
        DE: 'Jerman 🇩🇪',
        GH: 'Ghana 🇬🇭',
        GI: 'Gibraltar 🇬🇮',
        GR: 'Yunani 🇬🇷',
        GL: 'Greenland 🇬🇱',
        GD: 'Grenada 🇬🇩',
        GP: 'Guadeloupe 🇬🇵',
        GU: 'Guam 🇬🇺',
        GT: 'Guatemala 🇬🇹',
        GG: 'Guernsey 🇬🇬',
        GN: 'Guinea 🇬🇳',
        GW: 'Guinea-Bissau 🇬🇼',
        GY: 'Guyana 🇬🇾',
        HT: 'Haiti 🇭🇹',
        HM: 'Pulau Heard dan Kepulauan McDonald 🇭🇲',
        VA: 'Kota Vatikan 🇻🇦',
        HN: 'Honduras 🇭🇳',
        HK: 'Hong Kong 🇭🇰',
        HU: 'Hungaria 🇭🇺',
        IS: 'Islandia 🇮🇸',
        IN: 'India 🇮🇳',
        ID: 'Indonesia 🇮🇩',
        IR: 'Iran 🇮🇷',
        IQ: 'Irak 🇮🇶',
        IE: 'Irlandia 🇮🇪',
        IM: 'Pulau Man 🇮🇲',
        IL: 'Israel 🇮🇱',
        IT: 'Italia 🇮🇹',
        JM: 'Jamaika 🇯🇲',
        JP: 'Jepang 🇯🇵',
        JE: 'Jersey 🇯🇪',
        JO: 'Yordania 🇯🇴',
        KZ: 'Kazakhstan 🇰🇿',
        KE: 'Kenya 🇰🇪',
        KI: 'Kiribati 🇰🇮',
        KP: 'Korea Utara 🇰🇵',
        KR: 'Korea Selatan 🇰🇷',
        KW: 'Kuwait 🇰🇼',
        KG: 'Kirgizstan 🇰🇬',
        LA: 'Laos 🇱🇦',
        LV: 'Latvia 🇱🇻',
        LB: 'Lebanon 🇱🇧',
        LS: 'Lesotho 🇱🇸',
        LR: 'Liberia 🇱🇷',
        LY: 'Libya 🇱🇾',
        LI: 'Liechtenstein 🇱🇮',
        LT: 'Lituania 🇱🇹',
        LU: 'Luksemburg 🇱🇺',
        MO: 'Makau 🇲🇴',
        MK: 'Makedonia Utara 🇲🇰',
        MG: 'Madagaskar 🇲🇬',
        MW: 'Malawi 🇲🇼',
        MY: 'Malaysia 🇲🇾',
        MV: 'Maladewa 🇲🇻',
        ML: 'Mali 🇲🇱',
        MT: 'Malta 🇲🇹',
        MH: 'Kepulauan Marshall 🇲🇭',
        MQ: 'Martinique 🇲🇶',
        MR: 'Mauritania 🇲🇷',
        MU: 'Mauritius 🇲🇺',
        YT: 'Mayotte 🇾🇹',
        MX: 'Meksiko 🇲🇽',
        FM: 'Mikronesia 🇫🇲',
        MD: 'Moldova 🇲🇩',
        MC: 'Monako 🇲🇨',
        MN: 'Mongolia 🇲🇳',
        ME: 'Montenegro 🇲🇪',
        MS: 'Montserrat 🇲🇸',
        MA: 'Maroko 🇲🇦',
        MZ: 'Mozambik 🇲🇿',
        MM: 'Myanmar (Burma) 🇲🇲',
        NA: 'Namibia 🇳🇦',
        NR: 'Nauru 🇳🇷',
        NP: 'Nepal 🇳🇵',
        NL: 'Belanda 🇳🇱',
        NC: 'Kaledonia Baru 🇳🇨',
        NZ: 'Selandia Baru 🇳🇿',
        NI: 'Nikaragua 🇳🇮',
        NE: 'Niger 🇳🇪',
        NG: 'Nigeria 🇳🇬',
        NU: 'Niue 🇳🇺',
        NF: 'Pulau Norfolk 🇳🇫',
        MP: 'Kepulauan Mariana Utara 🇲🇵',
        NO: 'Norwegia 🇳🇴',
        OM: 'Oman 🇴🇲',
        PK: 'Pakistan 🇵🇰',
        PW: 'Palau 🇵🇼',
        PS: 'Palestina 🇵🇸',
        PA: 'Panama 🇵🇦',
        PG: 'Papua Nugini 🇵🇬',
        PY: 'Paraguay 🇵🇾',
        PE: 'Peru 🇵🇪',
        PH: 'Filipina 🇵🇭',
        PN: 'Pitcairn 🇵🇳',
        PL: 'Polandia 🇵🇱',
        PT: 'Portugal 🇵🇹',
        PR: 'Puerto Rico 🇵🇷',
        QA: 'Qatar 🇶🇦',
        RE: 'Réunion 🇷🇪',
        RO: 'Rumania 🇷🇴',
        RU: 'Rusia 🇷🇺',
        RW: 'Rwanda 🇷🇼',
        BL: 'Saint Barthélemy 🇧🇱',
        SH: 'Saint Helena 🇸🇭',
        KN: 'Saint Kitts dan Nevis 🇰🇳',
        LC: 'Saint Lucia 🇱🇨',
        MF: 'Saint Martin 🇲🇫',
        PM: 'Saint Pierre dan Miquelon 🇵🇲',
        VC: 'Saint Vincent dan Grenadines 🇻🇨',
        WS: 'Samoa 🇼🇸',
        SM: 'San Marino 🇸🇲',
        ST: 'Sao Tome dan Principe 🇸🇹',
        SA: 'Arab Saudi 🇸🇦',
        SN: 'Senegal 🇸🇳',
        RS: 'Serbia 🇷🇸',
        SC: 'Seychelles 🇸🇨',
        SL: 'Sierra Leone 🇸🇱',
        SG: 'Singapura 🇸🇬',
        SX: 'Sint Maarten 🇸🇽',
        SK: 'Slovakia 🇸🇰',
        SI: 'Slovenia 🇸🇮',
        SB: 'Kepulauan Solomon 🇸🇧',
        SO: 'Somalia 🇸🇴',
        ZA: 'Afrika Selatan 🇿🇦',
        GS: 'Georgia Selatan dan Kepulauan Sandwich Selatan 🇬🇸',
        SS: 'Sudan Selatan 🇸🇸',
        ES: 'Spanyol 🇪🇸',
        LK: 'Sri Lanka 🇱🇰',
        SD: 'Sudan 🇸🇩',
        SR: 'Suriname 🇸🇷',
        SJ: 'Svalbard dan Jan Mayen 🇸🇯',
        SE: 'Swedia 🇸🇪',
        CH: 'Swiss 🇨🇭',
        SY: 'Suriah 🇸🇾',
        TW: 'Taiwan 🇹🇼',
        TJ: 'Tajikistan 🇹🇯',
        TZ: 'Tanzania 🇹🇿',
        TH: 'Thailand 🇹🇭',
        TL: 'Timor-Leste 🇹🇱',
        TG: 'Togo 🇹🇬',
        TK: 'Tokelau 🇹🇰',
        TO: 'Tonga 🇹🇴',
        TT: 'Trinidad dan Tobago 🇹🇹',
        TN: 'Tunisia 🇹🇳',
        TR: 'Turki 🇹🇷',
        TM: 'Turkmenistan 🇹🇲',
        TC: 'Kepulauan Turks dan Caicos 🇹🇨',
        TV: 'Tuvalu 🇹🇻',
        UG: 'Uganda 🇺🇬',
        UA: 'Ukraina 🇺🇦',
        AE: 'Uni Emirat Arab 🇦🇪',
        GB: 'Inggris Raya 🇬🇧',
        US: 'Amerika Serikat 🇺🇸',
        UM: 'Kepulauan Terluar Kecil Amerika Serikat 🇺🇲',
        UY: 'Uruguay 🇺🇾',
        UZ: 'Uzbekistan 🇺🇿',
        VU: 'Vanuatu 🇻🇺',
        VE: 'Venezuela 🇻🇪',
        VN: 'Vietnam 🇻🇳',
        VG: 'Kepulauan Virgin Britania Raya 🇻🇬',
        VI: 'Kepulauan Virgin Amerika Serikat 🇻🇮',
        WF: 'Wallis dan Futuna 🇼🇫',
        EH: 'Sahara Barat 🇪🇭',
        YE: 'Yaman 🇾🇪',
        ZM: 'Zambia 🇿🇲',
        ZW: 'Zimbabwe 🇿🇼',
    };


  // Mengembalikan nama region dengan bendera jika ditemukan, atau 'Tidak diketahui' jika tidak
  return regionMap[value] || 'Tidak diketahui';
};


async function stalkFreeFire(uid) {
  try {
    const url = `https://discordbot.freefirecommunity.com/player_info_api?uid=${uid}&region=id`;

    const res = await axios.get(url, {
      headers: {
        'Origin': 'https://www.freefirecommunity.com',
        'Referer': 'https://www.freefirecommunity.com/ff-account-info/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    const d = res.data.player_info || {};
    const b = d.basicInfo || {};
    const c = d.creditScoreInfo || {};
    const p = d.petInfo || {};
    const prof = d.profileInfo || {};
    const s = d.socialInfo || {};
    const diamond = d.diamondCostRes || {};

    const safe = (val, fallback = 'N/A') => val !== undefined && val !== null ? val : fallback;
    const formatTime = (unix) => unix ? moment.unix(unix).format('YYYY-MM-DD HH:mm:ss') : 'N/A';

    const regionCode = (b.region || 'ID').toUpperCase();
    const regionFull = mooCountry(regionCode);
    const flagEmoji = regionFull.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';

    return {
      status: true,
      uid: b.accountId,
      nickname: b.nickname,
      level: b.level,
      exp: b.exp,
      like: b.liked,
      regionCode,
      region: regionFull,
      flag: flagEmoji,
      title: b.title || '-',
      seasonId: b.seasonId,
      releaseVersion: b.releaseVersion,
      createTime: formatTime(b.createAt),
      lastLogin: formatTime(b.lastLoginAt),
      rank: {
        battleRoyale: {
          rank: b.rank,
          max: b.maxRank,
          point: b.rankingPoints
        },
        clashSquad: {
          rank: b.csRank
        }
      },
      diamondCost: diamond.diamondCost || 0,
      outfitIDs: Array.isArray(prof.clothes) ? prof.clothes : [],
      skillIDs: Array.isArray(prof.equipedSkills) ? prof.equipedSkills : [],
      creditScore: c.creditScore || 0,
      signature: s.signature || '-',
      pet: p?.id ? {
        id: p.id,
        name: p.name,
        level: p.level,
        exp: p.exp,
        selectedSkill: p.selectedSkillId,
        skin: p.skinId
      } : null,
      bannerImage: `https://discordbot.freefirecommunity.com/banner_image_api?uid=${uid}&region=id`,
      outfitImage: `https://discordbot.freefirecommunity.com/outfit_image_api?uid=${uid}&region=id`
    };

  } catch (e) {
    return {
      status: false,
      message: 'Gagal mengambil data akun.',
      error: e?.response?.data || e.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/ffv2', async (req, res) => {
    const { apikey, id } = req.query;
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
    if (!id) {
      return res.status(400).json({
        status: false,
        message: 'Parameter id harus diisi.'
      });
    }

    try {
      const result = await stalkFreeFire(id);

      if (!result.status) {
        return res.status(404).json({
          status: false,
          message: result.message || 'Data tidak ditemukan.'
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
