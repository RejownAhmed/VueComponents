<template>
  <div class="dropdown" ref="dropdown">
    <div class="dropdown-toggle text-start border border-1 text-muted default-padding d-flex justify-content-center align-items-center" :class="props.InputClass" type="button"
      data-bs-toggle="dropdown">
      {{ `${selectedOption?.flag} ${selectedOption?.dial_code}` }}
    </div>
    <div class="dropdown-menu">
      <div class="form-group mb-3">
        <input type="text" ref="SearchBox" class="form-control" placeholder="Search" v-model="searchQuery" @input="search">
      </div>
      <div class="menu-container">
        <div v-for="option in filteredOptions" :key="option.id" class="dropdown-item cursor-pointer"
          @click="selectOption(option)">
          {{ option.flag+' '+option.dial_code+' ('+option.code+' - '+option.name+')' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: String,
  defaultCountry: String,
  InputClass: String
})

const emit = defineEmits(['update:modelValue'])
const SearchBox = ref();
const dropdown = ref();
const options = [{
  name: "Afghanistan",
  dial_code: "+93",
  flag: "🇦🇫",
  code: "AF"
},
{
  name: "Aland Islands",
  dial_code: "+358",
  flag: "🇦🇽",
  code: "AX"
},
{
  name: "Albania",
  dial_code: "+355",
  flag: "🇦🇱",
  code: "AL"
},
{
  name: "Algeria",
  dial_code: "+213",
  flag: "🇩🇿",
  code: "DZ"
},
{
  name: "AmericanSamoa",
  dial_code: "+1684",
  flag: "🇦🇸",
  code: "AS"
},
{
  name: "Andorra",
  dial_code: "+376",
  flag: "🇦🇩",
  code: "AD"
},
{
  name: "Angola",
  dial_code: "+244",
  flag: "🇦🇴",
  code: "AO"
},
{
  name: "Anguilla",
  dial_code: "+1264",
  flag: "🇦🇮",
  code: "AI"
},
{
  name: "Antarctica",
  dial_code: "+672",
  flag: "🇦🇶",
  code: "AQ"
},
{
  name: "Antigua and Barbuda",
  dial_code: "+1268",
  flag: "🇦🇬",
  code: "AG"
},
{
  name: "Argentina",
  dial_code: "+54",
  flag: "🇦🇷",
  code: "AR"
},
{
  name: "Armenia",
  dial_code: "+374",
  flag: "🇦🇲",
  code: "AM"
},
{
  name: "Aruba",
  dial_code: "+297",
  flag: "🇦🇼",
  code: "AW"
},
{
  name: "Australia",
  dial_code: "+61",
  flag: "🇦🇺",
  code: "AU"
},
{
  name: "Austria",
  dial_code: "+43",
  flag: "🇦🇹",
  code: "AT"
},
{
  name: "Azerbaijan",
  dial_code: "+994",
  flag: "🇦🇿",
  code: "AZ"
},
{
  name: "Bahamas",
  dial_code: "+1242",
  flag: "🇧🇸",
  code: "BS"
},
{
  name: "Bahrain",
  dial_code: "+973",
  flag: "🇧🇭",
  code: "BH"
},
{
  name: "Bangladesh",
  dial_code: "+880",
  flag: "🇧🇩",
  code: "BD"
},
{
  name: "Barbados",
  dial_code: "+1246",
  flag: "🇧🇧",
  code: "BB"
},
{
  name: "Belarus",
  dial_code: "+375",
  flag: "🇧🇾",
  code: "BY"
},
{
  name: "Belgium",
  dial_code: "+32",
  flag: "🇧🇪",
  code: "BE"
},
{
  name: "Belize",
  dial_code: "+501",
  flag: "🇧🇿",
  code: "BZ"
},
{
  name: "Benin",
  dial_code: "+229",
  flag: "🇧🇯",
  code: "BJ"
},
{
  name: "Bermuda",
  dial_code: "+1441",
  flag: "🇧🇲",
  code: "BM"
},
{
  name: "Bhutan",
  dial_code: "+975",
  flag: "🇧🇹",
  code: "BT"
},
{
  name: "Bolivia, Plurinational State of",
  dial_code: "+591",
  flag: "🇧🇴",
  code: "BO"
},
{
  name: "Bosnia and Herzegovina",
  dial_code: "+387",
  flag: "🇧🇦",
  code: "BA"
},
{
  name: "Botswana",
  dial_code: "+267",
  flag: "🇧🇼",
  code: "BW"
},
{
  name: "Brazil",
  dial_code: "+55",
  flag: "🇧🇷",
  code: "BR"
},
{
  name: "British Indian Ocean Territory",
  dial_code: "+246",
  flag: "🇮🇴",
  code: "IO"
},
{
  name: "Brunei Darussalam",
  dial_code: "+673",
  flag: "🇧🇳",
  code: "BN"
},
{
  name: "Bulgaria",
  dial_code: "+359",
  flag: "🇧🇬",
  code: "BG"
},
{
  name: "Burkina Faso",
  dial_code: "+226",
  flag: "🇧🇫",
  code: "BF"
},
{
  name: "Burundi",
  dial_code: "+257",
  flag: "🇧🇮",
  code: "BI"
},
{
  name: "Cambodia",
  dial_code: "+855",
  flag: "🇰🇭",
  code: "KH"
},
{
  name: "Cameroon",
  dial_code: "+237",
  flag: "🇨🇲",
  code: "CM"
},
{
  name: "Canada",
  dial_code: "+1",
  flag: "🇨🇦",
  code: "CA"
},
{
  name: "Cape Verde",
  dial_code: "+238",
  flag: "🇨🇻",
  code: "CV"
},
{
  name: "Cayman Islands",
  dial_code: "+345",
  flag: "🇰🇾",
  code: "KY"
},
{
  name: "Central African Republic",
  dial_code: "+236",
  flag: "🇨🇫",
  code: "CF"
},
{
  name: "Chad",
  dial_code: "+235",
  flag: "🇹🇩",
  code: "TD"
},
{
  name: "Chile",
  dial_code: "+56",
  flag: "🇨🇱",
  code: "CL"
},
{
  name: "China",
  dial_code: "+86",
  flag: "🇨🇳",
  code: "CN"
},
{
  name: "Christmas Island",
  dial_code: "+61",
  flag: "🇨🇽",
  code: "CX"
},
{
  name: "Cocos (Keeling) Islands",
  dial_code: "+61",
  flag: "🇨🇨",
  code: "CC"
},
{
  name: "Colombia",
  dial_code: "+57",
  flag: "🇨🇴",
  code: "CO"
},
{
  name: "Comoros",
  dial_code: "+269",
  flag: "🇰🇲",
  code: "KM"
},
{
  name: "Congo",
  dial_code: "+242",
  flag: "🇨🇬",
  code: "CG"
},
{
  name: "Congo, The Democratic Republic of the Congo",
  dial_code: "+243",
  flag: "🇨🇩",
  code: "CD"
},
{
  name: "Cook Islands",
  dial_code: "+682",
  flag: "🇨🇰",
  code: "CK"
},
{
  name: "Costa Rica",
  dial_code: "+506",
  flag: "🇨🇷",
  code: "CR"
},
{
  name: "Cote d'Ivoire",
  dial_code: "+225",
  flag: "🇨🇮",
  code: "CI"
},
{
  name: "Croatia",
  dial_code: "+385",
  flag: "🇭🇷",
  code: "HR"
},
{
  name: "Cuba",
  dial_code: "+53",
  flag: "🇨🇺",
  code: "CU"
},
{
  name: "Cyprus",
  dial_code: "+357",
  flag: "🇨🇾",
  code: "CY"
},
{
  name: "Czech Republic",
  dial_code: "+420",
  flag: "🇨🇿",
  code: "CZ"
},
{
  name: "Denmark",
  dial_code: "+45",
  flag: "🇩🇰",
  code: "DK"
},
{
  name: "Djibouti",
  dial_code: "+253",
  flag: "🇩🇯",
  code: "DJ"
},
{
  name: "Dominica",
  dial_code: "+1767",
  flag: "🇩🇲",
  code: "DM"
},
{
  name: "Dominican Republic",
  dial_code: "+1849",
  flag: "🇩🇴",
  code: "DO"
},
{
  name: "Ecuador",
  dial_code: "+593",
  flag: "🇪🇨",
  code: "EC"
},
{
  name: "Egypt",
  dial_code: "+20",
  flag: "🇪🇬",
  code: "EG"
},
{
  name: "El Salvador",
  dial_code: "+503",
  flag: "🇸🇻",
  code: "SV"
},
{
  name: "Equatorial Guinea",
  dial_code: "+240",
  flag: "🇬🇶",
  code: "GQ"
},
{
  name: "Eritrea",
  dial_code: "+291",
  flag: "🇪🇷",
  code: "ER"
},
{
  name: "Estonia",
  dial_code: "+372",
  flag: "🇪🇪",
  code: "EE"
},
{
  name: "Ethiopia",
  dial_code: "+251",
  flag: "🇪🇹",
  code: "ET"
},
{
  name: "Falkland Islands (Malvinas)",
  dial_code: "+500",
  flag: "🇫🇰",
  code: "FK"
},
{
  name: "Faroe Islands",
  dial_code: "+298",
  flag: "🇫🇴",
  code: "FO"
},
{
  name: "Fiji",
  dial_code: "+679",
  flag: "🇫🇯",
  code: "FJ"
},
{
  name: "Finland",
  dial_code: "+358",
  flag: "🇫🇮",
  code: "FI"
},
{
  name: "France",
  dial_code: "+33",
  flag: "🇫🇷",
  code: "FR"
},
{
  name: "French Guiana",
  dial_code: "+594",
  flag: "🇬🇫",
  code: "GF"
},
{
  name: "French Polynesia",
  dial_code: "+689",
  flag: "🇵🇫",
  code: "PF"
},
{
  name: "Gabon",
  dial_code: "+241",
  flag: "🇬🇦",
  code: "GA"
},
{
  name: "Gambia",
  dial_code: "+220",
  flag: "🇬🇲",
  code: "GM"
},
{
  name: "Georgia",
  dial_code: "+995",
  flag: "🇬🇪",
  code: "GE"
},
{
  name: "Germany",
  dial_code: "+49",
  flag: "🇩🇪",
  code: "DE"
},
{
  name: "Ghana",
  dial_code: "+233",
  flag: "🇬🇭",
  code: "GH"
},
{
  name: "Gibraltar",
  dial_code: "+350",
  flag: "🇬🇮",
  code: "GI"
},
{
  name: "Greece",
  dial_code: "+30",
  flag: "🇬🇷",
  code: "GR"
},
{
  name: "Greenland",
  dial_code: "+299",
  flag: "🇬🇱",
  code: "GL"
},
{
  name: "Grenada",
  dial_code: "+1473",
  flag: "🇬🇩",
  code: "GD"
},
{
  name: "Guadeloupe",
  dial_code: "+590",
  flag: "🇬🇵",
  code: "GP"
},
{
  name: "Guam",
  dial_code: "+1671",
  flag: "🇬🇺",
  code: "GU"
},
{
  name: "Guatemala",
  dial_code: "+502",
  flag: "🇬🇹",
  code: "GT"
},
{
  name: "Guernsey",
  dial_code: "+44",
  flag: "🇬🇬",
  code: "GG"
},
{
  name: "Guinea",
  dial_code: "+224",
  flag: "🇬🇳",
  code: "GN"
},
{
  name: "Guinea-Bissau",
  dial_code: "+245",
  flag: "🇬🇼",
  code: "GW"
},
{
  name: "Guyana",
  dial_code: "+595",
  flag: "🇬🇾",
  code: "GY"
},
{
  name: "Haiti",
  dial_code: "+509",
  flag: "🇭🇹",
  code: "HT"
},
{
  name: "Holy See (Vatican City State)",
  dial_code: "+379",
  flag: "🇻🇦",
  code: "VA"
},
{
  name: "Honduras",
  dial_code: "+504",
  flag: "🇭🇳",
  code: "HN"
},
{
  name: "Hong Kong",
  dial_code: "+852",
  flag: "🇭🇰",
  code: "HK"
},
{
  name: "Hungary",
  dial_code: "+36",
  flag: "🇭🇺",
  code: "HU"
},
{
  name: "Iceland",
  dial_code: "+354",
  flag: "🇮🇸",
  code: "IS"
},
{
  name: "India",
  dial_code: "+91",
  flag: "🇮🇳",
  code: "IN"
},
{
  name: "Indonesia",
  dial_code: "+62",
  flag: "🇮🇩",
  code: "ID"
},
{
  name: "Iran, Islamic Republic of Persian Gulf",
  dial_code: "+98",
  flag: "🇮🇷",
  code: "IR"
},
{
  name: "Iraq",
  dial_code: "+964",
  flag: "🇮🇷",
  code: "IQ"
},
{
  name: "Ireland",
  dial_code: "+353",
  flag: "🇮🇪",
  code: "IE"
},
{
  name: "Isle of Man",
  dial_code: "+44",
  flag: "🇮🇲",
  code: "IM"
},
{
  name: "Israel",
  dial_code: "+972",
  flag: "🇮🇱",
  code: "IL"
},
{
  name: "Italy",
  dial_code: "+39",
  flag: "🇮🇹",
  code: "IT"
},
{
  name: "Jamaica",
  dial_code: "+1876",
  flag: "🇯🇲",
  code: "JM"
},
{
  name: "Japan",
  dial_code: "+81",
  flag: "🇯🇵",
  code: "JP"
},
{
  name: "Jersey",
  dial_code: "+44",
  flag: "🇯🇪",
  code: "JE"
},
{
  name: "Jordan",
  dial_code: "+962",
  flag: "🇯🇴",
  code: "JO"
},
{
  name: "Kazakhstan",
  dial_code: "+77",
  flag: "🇰🇿",
  code: "KZ"
},
{
  name: "Kenya",
  dial_code: "+254",
  flag: "🇰🇪",
  code: "KE"
},
{
  name: "Kiribati",
  dial_code: "+686",
  flag: "🇰🇮",
  code: "KI"
},
{
  name: "Korea, Democratic People's Republic of Korea",
  dial_code: "+850",
  flag: "🇰🇵",
  code: "KP"
},
{
  name: "Korea, Republic of South Korea",
  dial_code: "+82",
  flag: "🇰🇷",
  code: "KR"
},
{
  name: "Kuwait",
  dial_code: "+965",
  flag: "🇰🇼",
  code: "KW"
},
{
  name: "Kyrgyzstan",
  dial_code: "+996",
  flag: "🇰🇬",
  code: "KG"
},
{
  name: "Laos",
  dial_code: "+856",
  flag: "🇱🇦",
  code: "LA"
},
{
  name: "Latvia",
  dial_code: "+371",
  flag: "🇱🇻",
  code: "LV"
},
{
  name: "Lebanon",
  dial_code: "+961",
  flag: "🇱🇧",
  code: "LB"
},
{
  name: "Lesotho",
  dial_code: "+266",
  flag: "🇱🇸",
  code: "LS"
},
{
  name: "Liberia",
  dial_code: "+231",
  flag: "🇱🇷",
  code: "LR"
},
{
  name: "Libyan Arab Jamahiriya",
  dial_code: "+218",
  flag: "🇱🇾",
  code: "LY"
},
{
  name: "Liechtenstein",
  dial_code: "+423",
  flag: "🇱🇮",
  code: "LI"
},
{
  name: "Lithuania",
  dial_code: "+370",
  flag: "🇱🇹",
  code: "LT"
},
{
  name: "Luxembourg",
  dial_code: "+352",
  flag: "🇱🇺",
  code: "LU"
},
{
  name: "Macao",
  dial_code: "+853",
  flag: "🇲🇴",
  code: "MO"
},
{
  name: "Macedonia",
  dial_code: "+389",
  flag: "🇲🇰",
  code: "MK"
},
{
  name: "Madagascar",
  dial_code: "+261",
  flag: "🇲🇬",
  code: "MG"
},
{
  name: "Malawi",
  dial_code: "+265",
  flag: "🇲🇼",
  code: "MW"
},
{
  name: "Malaysia",
  dial_code: "+60",
  flag: "🇲🇾",
  code: "MY"
},
{
  name: "Maldives",
  dial_code: "+960",
  flag: "🇲🇻",
  code: "MV"
},
{
  name: "Mali",
  dial_code: "+223",
  flag: "🇲🇱",
  code: "ML"
},
{
  name: "Malta",
  dial_code: "+356",
  flag: "🇲🇹",
  code: "MT"
},
{
  name: "Marshall Islands",
  dial_code: "+692",
  flag: "🇲🇭",
  code: "MH"
},
{
  name: "Martinique",
  dial_code: "+596",
  flag: "🇲🇶",
  code: "MQ"
},
{
  name: "Mauritania",
  dial_code: "+222",
  flag: "🇲🇷",
  code: "MR"
},
{
  name: "Mauritius",
  dial_code: "+230",
  flag: "🇲🇺",
  code: "MU"
},
{
  name: "Mayotte",
  dial_code: "+262",
  flag: "🇾🇹",
  code: "YT"
},
{
  name: "Mexico",
  dial_code: "+52",
  flag: "🇲🇽",
  code: "MX"
},
{
  name: "Micronesia, Federated States of Micronesia",
  dial_code: "+691",
  flag: "🇫🇲",
  code: "FM"
},
{
  name: "Moldova",
  dial_code: "+373",
  flag: "🇲🇩",
  code: "MD"
},
{
  name: "Monaco",
  dial_code: "+377",
  flag: "🇲🇨",
  code: "MC"
},
{
  name: "Mongolia",
  dial_code: "+976",
  flag: "🇲🇳",
  code: "MN"
},
{
  name: "Montenegro",
  dial_code: "+382",
  flag: "🇲🇪",
  code: "ME"
},
{
  name: "Montserrat",
  dial_code: "+1664",
  flag: "🇲🇸",
  code: "MS"
},
{
  name: "Morocco",
  dial_code: "+212",
  flag: "🇲🇦",
  code: "MA"
},
{
  name: "Mozambique",
  dial_code: "+258",
  flag: "🇲🇿",
  code: "MZ"
},
{
  name: "Myanmar",
  dial_code: "+95",
  flag: "🇲🇲",
  code: "MM"
},
{
  name: "Namibia",
  flag: "🇳🇦",
  dial_code: "+264",
  code: "NA"
},
{
  name: "Nauru",
  dial_code: "+674",
  flag: "🇳🇷",
  code: "NR"
},
{
  name: "Nepal",
  dial_code: "+977",
  flag: "🇳🇵",
  code: "NP"
},
{
  name: "Netherlands",
  dial_code: "+31",
  flag: "🇳🇱",
  code: "NL"
},
{
  name: "Netherlands Antilles",
  dial_code: "+599",
  flag: "🇧🇶",
  code: "AN"
},
{
  name: "New Caledonia",
  dial_code: "+687",
  flag: "🇳🇨",
  code: "NC"
},
{
  name: "New Zealand",
  dial_code: "+64",
  flag: "🇳🇿",
  code: "NZ"
},
{
  name: "Nicaragua",
  dial_code: "+505",
  flag: "🇳🇮",
  code: "NI"
},
{
  name: "Niger",
  dial_code: "+227",
  flag: "🇳🇪",
  code: "NE"
},
{
  name: "Nigeria",
  dial_code: "+234",
  flag: "🇳🇬",
  code: "NG"
},
{
  name: "Niue",
  dial_code: "+683",
  flag: "🇳🇺",
  code: "NU"
},
{
  name: "Norfolk Island",
  dial_code: "+672",
  flag: "🇳🇫",
  code: "NF"
},
{
  name: "Northern Mariana Islands",
  dial_code: "+1670",
  flag: "🇲🇵",
  code: "MP"
},
{
  name: "Norway",
  dial_code: "+47",
  flag: "🇳🇴",
  code: "NO"
},
{
  name: "Oman",
  dial_code: "+968",
  flag: "🇴🇲",
  code: "OM"
},
{
  name: "Pakistan",
  dial_code: "+92",
  flag: "🇵🇰",
  code: "PK"
},
{
  name: "Palau",
  dial_code: "+680",
  flag: "🇵🇼",
  code: "PW"
},
{
  name: "Palestinian Territory, Occupied",
  dial_code: "+970",
  flag: "🇵🇸",
  code: "PS"
},
{
  name: "Panama",
  dial_code: "+507",
  flag: "🇵🇦",
  code: "PA"
},
{
  name: "Papua New Guinea",
  dial_code: "+675",
  flag: "🇵🇬",
  code: "PG"
},
{
  name: "Paraguay",
  dial_code: "+595",
  flag: "🇵🇾",
  code: "PY"
},
{
  name: "Peru",
  dial_code: "+51",
  flag: "🇵🇪",
  code: "PE"
},
{
  name: "Philippines",
  dial_code: "+63",
  flag: "🇵🇭",
  code: "PH"
},
{
  name: "Pitcairn",
  dial_code: "+872",
  flag: "🇵🇳",
  code: "PN"
},
{
  name: "Poland",
  dial_code: "+48",
  flag: "🇵🇱",
  code: "PL"
},
{
  name: "Portugal",
  dial_code: "+351",
  flag: "🇵🇹",
  code: "PT"
},
{
  name: "Puerto Rico",
  dial_code: "+1939",
  flag: "🇵🇷",
  code: "PR"
},
{
  name: "Qatar",
  dial_code: "+974",
  flag: "🇶🇦",
  code: "QA"
},
{
  name: "Romania",
  dial_code: "+40",
  flag: "🇷🇴",
  code: "RO"
},
{
  name: "Russia",
  dial_code: "+7",
  flag: "🇷🇺",
  code: "RU"
},
{
  name: "Rwanda",
  dial_code: "+250",
  flag: "🇷🇼",
  code: "RW"
},
{
  name: "Reunion",
  dial_code: "+262",
  flag: "🇷🇪",
  code: "RE"
},
{
  name: "Saint Barthelemy",
  dial_code: "+590",
  flag: "🇧🇱",
  code: "BL"
},
{
  name: "Saint Helena, Ascension and Tristan Da Cunha",
  dial_code: "+290",
  flag: "🇸🇭",
  code: "SH"
},
{
  name: "Saint Kitts and Nevis",
  dial_code: "+1869",
  flag: "🇰🇳",
  code: "KN"
},
{
  name: "Saint Lucia",
  dial_code: "+1758",
  flag: "🇱🇨",
  code: "LC"
},
{
  name: "Saint Martin",
  dial_code: "+590",
  flag: "🇲🇫",
  code: "MF"
},
{
  name: "Saint Pierre and Miquelon",
  dial_code: "+508",
  flag: "🇵🇲",
  code: "PM"
},
{
  name: "Saint Vincent and the Grenadines",
  dial_code: "+1784",
  flag: "🇻🇨",
  code: "VC"
},
{
  name: "Samoa",
  dial_code: "+685",
  flag: "🇼🇸",
  code: "WS"
},
{
  name: "San Marino",
  dial_code: "+378",
  flag: "🇸🇲",
  code: "SM"
},
{
  name: "Sao Tome and Principe",
  dial_code: "+239",
  flag: "🇸🇹",
  code: "ST"
},
{
  name: "Saudi Arabia",
  dial_code: "+966",
  flag: "🇸🇦",
  code: "SA"
},
{
  name: "Senegal",
  dial_code: "+221",
  flag: "🇸🇳",
  code: "SN"
},
{
  name: "Serbia",
  dial_code: "+381",
  flag: "🇷🇸",
  code: "RS"
},
{
  name: "Seychelles",
  dial_code: "+248",
  flag: "🇸🇨",
  code: "SC"
},
{
  name: "Sierra Leone",
  dial_code: "+232",
  flag: "🇸🇱",
  code: "SL"
},
{
  name: "Singapore",
  dial_code: "+65",
  flag: "🇸🇬",
  code: "SG"
},
{
  name: "Slovakia",
  dial_code: "+421",
  flag: "🇸🇰",
  code: "SK"
},
{
  name: "Slovenia",
  dial_code: "+386",
  flag: "🇸🇮",
  code: "SI"
},
{
  name: "Solomon Islands",
  dial_code: "+677",
  flag: "🇸🇧",
  code: "SB"
},
{
  name: "Somalia",
  dial_code: "+252",
  flag: "🇸🇴",
  code: "SO"
},
{
  name: "South Africa",
  dial_code: "+27",
  flag: "🇿🇦",
  code: "ZA"
},
{
  name: "South Sudan",
  dial_code: "+211",
  flag: "🇸🇸",
  code: "SS"
},
{
  name: "South Georgia and the South Sandwich Islands",
  dial_code: "+500",
  flag: "🇬🇸",
  code: "GS"
},
{
  name: "Spain",
  dial_code: "+34",
  flag: "🇪🇸",
  code: "ES"
},
{
  name: "Sri Lanka",
  dial_code: "+94",
  flag: "🇱🇰",
  code: "LK"
},
{
  name: "Sudan",
  dial_code: "+249",
  flag: "🇸🇩",
  code: "SD"
},
{
  name: "Suriname",
  dial_code: "+597",
  flag: "🇸🇷",
  code: "SR"
},
{
  name: "Svalbard and Jan Mayen",
  dial_code: "+47",
  flag: "🇸🇯",
  code: "SJ"
},
{
  name: "Swaziland",
  dial_code: "+268",
  flag: "🇸🇿",
  code: "SZ"
},
{
  name: "Sweden",
  dial_code: "+46",
  flag: "🇸🇪",
  code: "SE"
},
{
  name: "Switzerland",
  dial_code: "+41",
  flag: "🇨🇭",
  code: "CH"
},
{
  name: "Syrian Arab Republic",
  dial_code: "+963",
  flag: "🇸🇾",
  code: "SY"
},
{
  name: "Taiwan",
  dial_code: "+886",
  flag: "🇹🇼",
  code: "TW"
},
{
  name: "Tajikistan",
  dial_code: "+992",
  flag: "🇹🇯",
  code: "TJ"
},
{
  name: "Tanzania, United Republic of Tanzania",
  dial_code: "+255",
  flag: "🇹🇿",
  code: "TZ"
},
{
  name: "Thailand",
  dial_code: "+66",
  flag: "🇹🇭",
  code: "TH"
},
{
  name: "Timor-Leste",
  dial_code: "+670",
  flag: "🇹🇱",
  code: "TL"
},
{
  name: "Togo",
  dial_code: "+228",
  flag: "🇹🇬",
  code: "TG"
},
{
  name: "Tokelau",
  dial_code: "+690",
  flag: "🇹🇰",
  code: "TK"
},
{
  name: "Tonga",
  dial_code: "+676",
  flag: "🇹🇴",
  code: "TO"
},
{
  name: "Trinidad and Tobago",
  dial_code: "+1868",
  flag: "🇹🇹",
  code: "TT"
},
{
  name: "Tunisia",
  dial_code: "+216",
  flag: "🇹🇳",
  code: "TN"
},
{
  name: "Turkey",
  dial_code: "+90",
  flag: "🇹🇷",
  code: "TR"
},
{
  name: "Turkmenistan",
  dial_code: "+993",
  flag: "🇹🇲",
  code: "TM"
},
{
  name: "Turks and Caicos Islands",
  dial_code: "+1649",
  flag: "🇹🇨",
  code: "TC"
},
{
  name: "Tuvalu",
  dial_code: "+688",
  flag: "🇹🇻",
  code: "TV"
},
{
  name: "Uganda",
  dial_code: "+256",
  flag: "🇺🇬",
  code: "UG"
},
{
  name: "Ukraine",
  dial_code: "+380",
  flag: "🇺🇦",
  code: "UA"
},
{
  name: "United Arab Emirates",
  dial_code: "+971",
  flag: "🇦🇪",
  code: "AE"
},
{
  name: "United Kingdom",
  dial_code: "+44",
  flag: "🇬🇧",
  code: "GB"
},
{
  name: "United States",
  dial_code: "+1",
  flag: "🇺🇸",
  code: "US"
},
{
  name: "Uruguay",
  dial_code: "+598",
  flag: "🇺🇾",
  code: "UY"
},
{
  name: "Uzbekistan",
  dial_code: "+998",
  flag: "🇺🇿",
  code: "UZ"
},
{
  name: "Vanuatu",
  dial_code: "+678",
  flag: "🇻🇺",
  code: "VU"
},
{
  name: "Venezuela, Bolivarian Republic of Venezuela",
  dial_code: "+58",
  flag: "🇻🇪",
  code: "VE"
},
{
  name: "Vietnam",
  dial_code: "+84",
  flag: "🇻🇳",
  code: "VN"
},
{
  name: "Virgin Islands, British",
  dial_code: "+1284",
  flag: "🇻🇬",
  code: "VG"
},
{
  name: "Virgin Islands, U.S.",
  dial_code: "+1340",
  flag: "🇻🇮",
  code: "VI"
},
{
  name: "Wallis and Futuna",
  dial_code: "+681",
  flag: "🇼🇫",
  code: "WF"
},
{
  name: "Yemen",
  dial_code: "+967",
  flag: "🇾🇪",
  code: "YE"
},
{
  name: "Zambia",
  dial_code: "+260",
  flag: "🇿🇲",
  code: "ZM"
},
{
  name: "Zimbabwe",
  dial_code: "+263",
  flag: "🇿🇼",
  code: "ZW"
}
]
const searchQuery = ref(null);

const filteredOptions = computed(() => {
    if (searchQuery.value) {
      return options.filter((code) => {
        const searchLower = searchQuery.value.toLowerCase();
        let foundMatch = false;
        const checkObject = (obj) => {
          Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (typeof value === 'object') {
              checkObject(value);
            } else if (typeof value === 'string' || typeof value === 'number') {
              if (value.toString().toLowerCase().includes(searchLower)) {
                foundMatch = true;
              }
            }
          });
        };
        checkObject(code);
        return foundMatch;
      });
    }
    return options;
    });


const selectedOption = ref({});
const selectOption = (option)=>{
  selectedOption.value = option
  emit('update:modelValue', option.dial_code)
}

onMounted(()=>{
  let country = options[0];
  if (props.defaultCountry) {
    country = options.filter(o => o.name.toString().toLowerCase().includes(props.defaultCountry.toLowerCase()))[0] 
  }
  selectOption(country);
  dropdown.value.addEventListener('shown.bs.dropdown', ()=> SearchBox.value.focus())
});

</script>