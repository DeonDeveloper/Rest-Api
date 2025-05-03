const fetch = require('node-fetch');

// Fungsi country langsung di dalam file
const mooCountry = (value) => {
  const regionMap = {
    AF: 'Afghanistan 🇦🇫',
    AL: 'Albania 🇦🇱',
    DZ: 'Algeria 🇩🇿',
    AS: 'American Samoa 🇦🇸',
    AD: 'Andorra 🇦🇩',
    AO: 'Angola 🇦🇴',
    AI: 'Anguilla 🇦🇮',
    AQ: 'Antarctica 🇦🇶',
    AG: 'Antigua and Barbuda 🇦🇬',
    AR: 'Argentina 🇦🇷',
    AM: 'Armenia 🇦🇲',
    AW: 'Aruba 🇦🇼',
    AU: 'Australia 🇦🇺',
    AT: 'Austria 🇦🇹',
    AZ: 'Azerbaijan 🇦🇿',
    BH: 'Bahrain 🇧🇭',
    BD: 'Bangladesh 🇧🇩',
    BY: 'Belarus 🇧🇾',
    BE: 'Belgium 🇧🇪',
    BZ: 'Belize 🇧🇿',
    BJ: 'Benin 🇧🇯',
    BM: 'Bermuda 🇧🇲',
    BT: 'Bhutan 🇧🇹',
    BO: 'Bolivia 🇧🇴',
    BA: 'Bosnia and Herzegovina 🇧🇦',
    BW: 'Botswana 🇧🇼',
    BR: 'Brazil 🇧🇷',
    BN: 'Brunei 🇧🇳',
    BG: 'Bulgaria 🇧🇬',
    BF: 'Burkina Faso 🇧🇫',
    BI: 'Burundi 🇧🇮',
    KH: 'Cambodia 🇰🇭',
    CM: 'Cameroon 🇨🇲',
    CA: 'Canada 🇨🇦',
    CV: 'Cape Verde 🇨🇻',
    CF: 'Central African Republic 🇨🇫',
    TD: 'Chad 🇹🇩',
    CL: 'Chile 🇨🇱',
    CN: 'China 🇨🇳',
    CO: 'Colombia 🇨🇴',
    KM: 'Comoros 🇰🇲',
    CD: 'Congo 🇨🇩',
    CG: 'Congo Republic 🇨🇬',
    CR: 'Costa Rica 🇨🇷',
    HR: 'Croatia 🇭🇷',
    CU: 'Cuba 🇨🇺',
    CY: 'Cyprus 🇨🇾',
    CZ: 'Czech Republic 🇨🇿',
    DK: 'Denmark 🇩🇰',
    DJ: 'Djibouti 🇩🇯',
    DM: 'Dominica 🇩🇲',
    DO: 'Dominican Republic 🇩🇴',
    EC: 'Ecuador 🇪🇨',
    EG: 'Egypt 🇪🇬',
    SV: 'El Salvador 🇸🇻',
    GQ: 'Equatorial Guinea 🇬🇶',
    ER: 'Eritrea 🇪🇷',
    EE: 'Estonia 🇪🇪',
    ET: 'Ethiopia 🇪🇹',
    FJ: 'Fiji 🇫🇯',
    FI: 'Finland 🇫🇮',
    FR: 'France 🇫🇷',
    GA: 'Gabon 🇬🇦',
    GM: 'Gambia 🇬🇲',
    GE: 'Georgia 🇬🇪',
    DE: 'Germany 🇩🇪',
    GH: 'Ghana 🇬🇭',
    GR: 'Greece 🇬🇷',
    GD: 'Grenada 🇬🇩',
    GT: 'Guatemala 🇬🇹',
    GN: 'Guinea 🇬🇳',
    GW: 'Guinea-Bissau 🇬🇼',
    GY: 'Guyana 🇬🇾',
    HT: 'Haiti 🇭🇹',
    HN: 'Honduras 🇭🇳',
    HK: 'Hong Kong 🇭🇰',
    HU: 'Hungary 🇭🇺',
    IS: 'Iceland 🇮🇸',
    IN: 'India 🇮🇳',
    ID: 'Indonesia 🇮🇩',
    IR: 'Iran 🇮🇷',
    IQ: 'Iraq 🇮🇶',
    IE: 'Ireland 🇮🇪',
    IL: 'Israel 🇮🇱',
    IT: 'Italy 🇮🇹',
    JM: 'Jamaica 🇯🇲',
    JP: 'Japan 🇯🇵',
    JO: 'Jordan 🇯🇴',
    KZ: 'Kazakhstan 🇰🇿',
    KE: 'Kenya 🇰🇪',
    KI: 'Kiribati 🇰🇮',
    KP: 'North Korea 🇰🇵',
    KR: 'South Korea 🇰🇷',
    KW: 'Kuwait 🇰🇼',
    KG: 'Kyrgyzstan 🇰🇬',
    LA: 'Laos 🇱🇦',
    LV: 'Latvia 🇱🇻',
    LB: 'Lebanon 🇱🇧',
    LS: 'Lesotho 🇱🇸',
    LR: 'Liberia 🇱🇷',
    LY: 'Libya 🇱🇾',
    LI: 'Liechtenstein 🇱🇮',
    LT: 'Lithuania 🇱🇹',
    LU: 'Luxembourg 🇱🇺',
    MO: 'Macau 🇲🇴',
    MG: 'Madagascar 🇲🇬',
    MW: 'Malawi 🇲🇼',
    MY: 'Malaysia 🇲🇾',
    MV: 'Maldives 🇲🇻',
    ML: 'Mali 🇲🇱',
    MT: 'Malta 🇲🇹',
    MH: 'Marshall Islands 🇲🇭',
    MR: 'Mauritania 🇲🇷',
    MU: 'Mauritius 🇲🇺',
    MX: 'Mexico 🇲🇽',
    FM: 'Micronesia 🇫🇲',
    MD: 'Moldova 🇲🇩',
    MC: 'Monaco 🇲🇨',
    MN: 'Mongolia 🇲🇳',
    ME: 'Montenegro 🇲🇪',
    MA: 'Morocco 🇲🇦',
    MZ: 'Mozambique 🇲🇿',
    MM: 'Myanmar 🇲🇲',
    NA: 'Namibia 🇳🇦',
    NP: 'Nepal 🇳🇵',
    NL: 'Netherlands 🇳🇱',
    NZ: 'New Zealand 🇳🇿',
    NI: 'Nicaragua 🇳🇮',
    NE: 'Niger 🇳🇪',
    NG: 'Nigeria 🇳🇳',
    MK: 'North Macedonia 🇲🇰',
    NO: 'Norway 🇳🇴',
    OM: 'Oman 🇴🇲',
    PK: 'Pakistan 🇵🇰',
    PW: 'Palau 🇵🇼',
    PS: 'Palestine 🇵🇸',
    PA: 'Panama 🇵🇦',
    PG: 'Papua New Guinea 🇵🇬',
    PY: 'Paraguay 🇵🇾',
    PE: 'Peru 🇵🇪',
    PH: 'Philippines 🇵🇭',
    PL: 'Poland 🇵🇱',
    PT: 'Portugal 🇵🇹',
    QA: 'Qatar 🇶🇦',
    RO: 'Romania 🇷🇴',
    RU: 'Russia 🇷🇺',
    RW: 'Rwanda 🇷🇼',
    KN: 'Saint Kitts and Nevis 🇰🇳',
    LC: 'Saint Lucia 🇱🇨',
    VC: 'Saint Vincent 🇻🇨',
    WS: 'Samoa 🇼🇸',
    SM: 'San Marino 🇸🇲',
    ST: 'Sao Tome 🇸🇹',
    SA: 'Saudi Arabia 🇸🇦',
    SN: 'Senegal 🇸🇳',
    RS: 'Serbia 🇷🇸',
    SC: 'Seychelles 🇸🇨',
    SL: 'Sierra Leone 🇸🇱',
    SG: 'Singapore 🇸🇬',
    SK: 'Slovakia 🇸🇰',
    SI: 'Slovenia 🇸🇮',
    SB: 'Solomon Islands 🇸🇧',
    SO: 'Somalia 🇸🇴',
    ZA: 'South Africa 🇿🇦',
    ES: 'Spain 🇪🇸',
    LK: 'Sri Lanka 🇱🇰',
    SD: 'Sudan 🇸🇩',
    SR: 'Suriname 🇸🇷',
    SE: 'Sweden 🇸🇪',
    CH: 'Switzerland 🇨🇭',
    SY: 'Syria 🇸🇾',
    TW: 'Taiwan 🇹🇼',
    TJ: 'Tajikistan 🇹🇯',
    TZ: 'Tanzania 🇹🇿',
    TH: 'Thailand 🇹🇭',
    TG: 'Togo 🇹🇬',
    TO: 'Tonga 🇹🇴',
    TT: 'Trinidad and Tobago 🇹🇹',
    TN: 'Tunisia 🇹🇳',
    TR: 'Turkey 🇹🇷',
    TM: 'Turkmenistan 🇹🇲',
    TV: 'Tuvalu 🇹🇻',
    UG: 'Uganda 🇺🇬',
    UA: 'Ukraine 🇺🇦',
    AE: 'United Arab Emirates 🇦🇪',
    GB: 'United Kingdom 🇬🇧',
    US: 'United States 🇺🇸',
    UY: 'Uruguay 🇺🇾',
    UZ: 'Uzbekistan 🇺🇿',
    VU: 'Vanuatu 🇻🇺',
    VE: 'Venezuela 🇻🇪',
    VN: 'Vietnam 🇻🇳',
    YE: 'Yemen 🇾🇪',
    ZM: 'Zambia 🇿🇲',
    ZW: 'Zimbabwe 🇿🇼'
  };

  return regionMap[value] || 'Tidak diketahui';
};

async function validateMobileLegendsGopay(userId, zoneId) {
  const url = 'https://gopay.co.id/games/v1/order/user-account';
  const payload = {
    code: 'MOBILE_LEGENDS',
    data: { userId, zoneId }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result?.data?.countryCode) {
      result.data.country = mooCountry(result.data.countryCode);
    }

    return result;
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat validasi.',
      error: error.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/mlbb', async (req, res) => {
    const { userId, zoneId } = req.query;

    if (!userId || !zoneId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter userId dan zoneId harus diisi.'
      });
    }

    try {
      const result = await validateMobileLegendsGopay(userId, zoneId);
      res.status(200).json({ status: true, result });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
