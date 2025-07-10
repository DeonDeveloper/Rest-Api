const fetch = require('node-fetch');
const axios = require('axios');

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

async function stalkFreeFire(id) {
let data = JSON.stringify({
  "app_id": 100067,
  "login_id": id
});

let config = {
  method: 'POST',
  url: 'https://kiosgamer.co.id/api/auth/player_id_login',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'sec-ch-ua-platform': '"Android"',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
    'sec-ch-ua-mobile': '?1',
    'Origin': 'https://kiosgamer.co.id',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://kiosgamer.co.id/',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cookie': 'source=mb; region=CO.ID; mspid2=d175049875f78d90e7618f10b5930826; _ga=GA1.1.1096715143.1744003536; language=id; datadome=Oh~Qd6USZYfQps_cIi6V06MyaYyU4M8goxVzxq6lyoLUu6ml9hRkiA6eiMdmFuBr6hwB52PiydIWCRZxWtdE1FQLBGu7nqW5mfbBfXbSLbhg7XlKtPfOVTOzJ4OhLFgm; session_key=4txikks54uzrbj9hz174ic2g8ma0zd2p; _ga_Q7ESEPHPSF=GS1.1.1744003535.1.1.1744004048.0.0.0'
  },
  data: data
};

const api = await axios.request(config);
return api.data;
}
module.exports = function(app) {
  app.get('/stalk/ff', async (req, res) => {
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

      if (!result.nickname) {
        return res.status(404).json({
          status: false,
          message: 'Data tidak ditemukan. Pastikan ID Free Fire yang dimasukkan benar.'
        });
      }

  
      const nickname = result.nickname || 'Tidak ditemukan';
      const regionCode = (result.region || '').toUpperCase();
      const regionFull = mooCountry(regionCode);
      const flagEmoji = regionFull.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';

      return res.status(200).json({
        status: true,
        nickname,
        region: regionFull,
        region_flag: flagEmoji
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
