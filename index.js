require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function emojiDoClima(desc) {
  const descLower = desc.toLowerCase();
  if (descLower.includes('nuvem')) return '☁️';
  if (descLower.includes('chuva')) return '🌧️';
  if (descLower.includes('sol') || descLower.includes('claro')) return '☀️';
  if (descLower.includes('neve')) return '❄️';
  if (descLower.includes('tempestade')) return '⛈️';
  return '🌤️';
}

async function obterClima(cidade) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('❌ API_KEY não encontrada. Verifique o arquivo .env.');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const { data } = await axios.get(url);
    const { temp, humidity } = data.main;
    const descricao = data.weather[0].description;
    const vento = data.wind.speed;
    const icone = emojiDoClima(descricao);

    console.log(`\n${icone} Clima em ${cidade}:`);
    console.log(`🌡️ Temperatura: ${temp}°C`);
    console.log(`💧 Umidade: ${humidity}%`);
    console.log(`💨 Vento: ${vento} m/s`);
    console.log(`📝 Condição: ${descricao}\n`);
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('\n❌ Cidade não encontrada. Verifique o nome e tente novamente.\n');
    } else {
      console.error('\n❌ Erro ao buscar dados do clima:', error.message);
    }
  }
}

function perguntarCidade() {
  rl.question('Digite o nome da cidade (ou "sair" para encerrar): ', async (cidade) => {
    const cidadeTrim = cidade.trim();
    if (cidadeTrim.toLowerCase() === 'sair' || cidadeTrim.toLowerCase() === 'exit') {
      console.log('Até mais! ☀️');
      rl.close();
      return;
    }
    if (!cidadeTrim) {
      console.log('Por favor, digite um nome válido.');
      return perguntarCidade();
    }
    await obterClima(cidadeTrim);
    perguntarCidade();
  });
}

perguntarCidade();
