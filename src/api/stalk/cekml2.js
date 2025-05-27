const fetch = require('node-fetch');

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

// Fungsi untuk validasi akun MLBB via GoPay
async function validateMobileLegendsGopay(userId, zoneId) {
  const url = 'https://gopay.co.id/games/v1/order/user-account';
  const payload = {
    code: 'MOBILE_LEGENDS',
    data: {
      userId,
      zoneId
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat validasi.',
      error: error.message
    };
  }
}

module.exports = function (app) {
  app.get('/stalk/mlbb', async (req, res) => {
    const { userId, zoneId } = req.query;
    
    if (!userId || !zoneId) {
      return res.status(400).json({ status: false, message: 'Parameter userId dan zoneId harus diisi.' });
    }

    try {
      const result = await validateMobileLegendsGopay(userId, zoneId);
      
      const data = result.data || {};
      const username = data.username || 'Tidak ditemukan';
      const countryCode = (data.countryOrigin || '').toUpperCase();
      const countryFull = mooCountry(countryCode);
      // Cari emoji bendera, fallback ke kosong jika tidak ada
      const flagEmoji = countryFull.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';

      return res.status(200).json({
        status: true,
        username,
        country: countryFull,
        country_flag: flagEmoji,
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
