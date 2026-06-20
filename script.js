let slideIndex = 0;
let serviceIndex = 0;
let newsItems = [];
const cfg = window.CONFIG;

const els = {
  img: document.getElementById('slideImage'),
  time: document.getElementById('time'),
  date: document.getElementById('date'),
  city: document.getElementById('city'),
  temp: document.getElementById('temp'),
  weatherIcon: document.getElementById('weatherIcon'),
  serviceCard: document.querySelector('.serviceCard'),
  serviceTitle: document.getElementById('serviceTitle'),
  serviceText: document.getElementById('serviceText'),
  serviceDots: document.getElementById('serviceDots'),
  eosTicker: document.getElementById('eosTickerTrack'),
  rssTicker: document.getElementById('rssTickerTrack')
};

function init(){
  setClock(); setInterval(setClock, 1000);
  setWeatherFallback(); loadWeather();
  setServiceDots();
  showSlide(0);
  buildTicker(els.eosTicker, cfg.comunicazioniEOS || [], cfg.durataTickerEOSSecondi || 40);
  setRssFallback(); loadRssNews();

  setInterval(nextSlide, (cfg.durataSlideSecondi || 8) * 1000);
  if(cfg.meteoAutomatico) setInterval(loadWeather, 15 * 60 * 1000);
  if(cfg.rssAutomatico) setInterval(loadRssNews, (cfg.aggiornaNotizieMinuti || 20) * 60 * 1000);
}

function setClock(){
  const now = new Date();
  els.time.textContent = now.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});
  const weekday = now.toLocaleDateString('it-IT', {weekday:'long'});
  const day = now.toLocaleDateString('it-IT', {day:'2-digit', month:'long', year:'numeric'});
  els.date.innerHTML = `${capitalize(weekday)}<br>${day}`;
}

function nextSlide(){
  showSlide((slideIndex + 1) % cfg.foto.length);
}
function showSlide(i){
  slideIndex = i;
  const s = cfg.foto[i];
  // Sincronizza la scheda prestazione a sinistra con la foto corrente.
  // Se ci sono meno servizi che foto, riparte dal primo servizio.
  if ((cfg.servizi || []).length) showService(i % cfg.servizi.length);
  els.img.style.opacity = 0;
  setTimeout(()=>{
    els.img.src = s.file;
    els.img.style.objectFit = s.zoom || 'cover';
    els.img.style.objectPosition = s.posizione || 'center center';
    els.img.style.opacity = 1;
  }, 280);
}

function setServiceDots(){
  els.serviceDots.innerHTML = (cfg.servizi || []).map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('');
}
function nextService(){ showService((serviceIndex + 1) % cfg.servizi.length); }
function showService(i){
  serviceIndex = i;
  const s = cfg.servizi[i];
  els.serviceCard.classList.add('fade');
  setTimeout(()=>{
    els.serviceTitle.textContent = s.titolo;
    els.serviceText.textContent = s.testo;
    [...els.serviceDots.children].forEach((d,idx)=>d.classList.toggle('active', idx===i));
    els.serviceCard.classList.remove('fade');
  }, 330);
}

function setWeatherFallback(){
  els.city.textContent = cfg.citta || 'Camaiore';
  els.temp.textContent = cfg.meteoManuale?.temperatura || '--°';
  els.weatherIcon.textContent = cfg.meteoManuale?.icona || '⛅';
}
async function loadWeather(){
  if(!cfg.meteoAutomatico) return;
  try{
    const lat = cfg.meteoCoordinate.latitudine;
    const lon = cfg.meteoCoordinate.longitudine;
    const tz = encodeURIComponent(cfg.meteoCoordinate.timezone || 'Europe/Rome');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=${tz}&forecast_days=1`;
    const res = await fetch(url, {cache:'no-store'});
    if(!res.ok) throw new Error('Meteo non disponibile');
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    els.temp.textContent = `${temp}°`;
    els.city.textContent = cfg.citta || 'Camaiore';
    els.weatherIcon.textContent = weatherIcon(code);
  }catch(e){
    console.warn('Meteo automatico non disponibile, uso fallback.', e);
    setWeatherFallback();
  }
}
function weatherIcon(code){
  if(code === 0) return '☀️';
  if([1,2].includes(code)) return '🌤️';
  if(code === 3) return '☁️';
  if([45,48].includes(code)) return '🌫️';
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️';
  if([71,73,75,77,85,86].includes(code)) return '❄️';
  if([95,96,99].includes(code)) return '⛈️';
  return '⛅';
}

function setRssFallback(){
  buildTicker(els.rssTicker, cfg.notizieFallback || [], cfg.durataTickerRSSSecondi || 58);
}
async function loadRssNews(){
  if(!cfg.rssAutomatico) return;
  const feed = encodeURIComponent(cfg.rssFeedUrl);
  const urls = [
    `https://api.allorigins.win/raw?url=${feed}`,
    `https://api.rss2json.com/v1/api.json?rss_url=${feed}`
  ];
  for(const url of urls){
    try{
      const res = await fetch(url, {cache:'no-store'});
      if(!res.ok) throw new Error('RSS non disponibile');
      const text = await res.text();
      const items = url.includes('rss2json') ? parseRss2Json(text) : parseRssXml(text);
      if(items.length){
        newsItems = items.slice(0, cfg.numeroNotizie || 8);
        buildTicker(els.rssTicker, newsItems, cfg.durataTickerRSSSecondi || 58);
        return;
      }
    }catch(e){
      console.warn('Fonte RSS non disponibile:', url, e);
    }
  }
  setRssFallback();
}
function parseRss2Json(text){
  const json = JSON.parse(text);
  return (json.items || []).map(item => cleanText(item.title));
}
function parseRssXml(text){
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  return [...doc.querySelectorAll('item')].map(item => cleanText(item.querySelector('title')?.textContent || ''));
}
function buildTicker(el, items, seconds){
  const clean = (items || []).filter(Boolean).map(cleanText);
  const html = [...clean, ...clean].map(t=>`<span>${escapeHtml(t)}</span>`).join('');
  el.innerHTML = html;
  el.style.animationDuration = `${seconds}s`;
}
function cleanText(str){
  return (str || '').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim().slice(0,130);
}
function escapeHtml(str){
  return (str || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function capitalize(str){ return (str || '').charAt(0).toUpperCase() + (str || '').slice(1); }

window.addEventListener('load', init);
