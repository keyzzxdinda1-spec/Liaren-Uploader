const axios = require('axios');
const cheerio = require('cheerio');

async function getSchedule(channel) {
  const url = `https://www.jadwaltv.net/channel/${channel}`;
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(response.data);
  const schedules = [];
  $('table.table-bordered tbody tr').each((i, row) => {
    const tds = $(row).find('td');
    if (tds.length === 2) {
      const time = $(tds[0]).text().trim();
      const program = $(tds[1]).text().trim();
      if ($(row).hasClass('jkllv')) return;
      if (program.includes('Jadwal TV selengkapnya')) return;
      if (time === 'Jam' || program === 'Acara') return;
      if (time && program) schedules.push({ time, program });
    }
  });
  return schedules;
}

(async () => {
  const channel = 'rtv';
  const jadwal = await getSchedule(channel);
  console.log(`Jadwal ${channel.toUpperCase()} Hari Ini:`);
  jadwal.forEach(item => console.log(`${item.time} - ${item.program}`));
})();

module.exports = { getSchedule };