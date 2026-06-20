window.CONFIG = {
  citta: "Camaiore",

  meteoAutomatico: true,
  meteoCoordinate: {
    latitudine: 43.9427,
    longitudine: 10.2978,
    timezone: "Europe/Rome"
  },
  meteoManuale: {
    temperatura: "27°",
    icona: "⛅"
  },

  // Feed RSS Adnkronos Salute.
  rssAutomatico: true,
  rssFeedUrl: "https://www.adnkronos.com/RSS_Salute.xml",
  numeroNotizie: 8,
  aggiornaNotizieMinuti: 20,

  durataSlideSecondi: 8,
  // La scritta/prestazione a sinistra cambia insieme alla foto.
  durataTickerEOSSecondi: 40,
  durataTickerRSSSecondi: 65,

  foto: [
    { file: "assets/foto/desk-sala-attesa.jpg", posizione: "left center", zoom: "cover" },
    { file: "assets/foto/zona-bimbi.jpg", posizione: "center center", zoom: "contain" },
    { file: "assets/foto/giardino-ingresso.jpg", posizione: "center center", zoom: "cover" },
    { file: "assets/foto/stanza-bimbi-1.jpg", posizione: "center center", zoom: "contain" },
    { file: "assets/foto/stanza-bimbi-2.jpg", posizione: "center center", zoom: "contain" },
    { file: "assets/foto/sterilizzazione.jpg", posizione: "center center", zoom: "contain" }
  ],

  servizi: [
    { titolo: "Implantologia", testo: "Soluzioni avanzate per ritrovare il sorriso e la funzionalità." },
    { titolo: "Medicina Estetica", testo: "Armonia, naturalezza e benessere per valorizzare il volto." },
    { titolo: "Invisalign", testo: "Allineatori trasparenti per sorridere con più libertà." },
    { titolo: "Pedodonzia", testo: "Percorsi dedicati ai bambini in un ambiente sereno e colorato." },
    { titolo: "Igiene Dentale", testo: "Prevenzione e cura quotidiana per un sorriso sano." },
    { titolo: "Ortodonzia", testo: "Soluzioni personalizzate per equilibrio, funzione ed estetica." }
  ],

  comunicazioniEOS: [
    "Prima visita gratuita",
    "Trattamenti Invisalign",
    "Sbiancamento professionale",
    "Medicina estetica non invasiva",
    "Aperto sabato mattina",
    "Nuovi trattamenti",
    "Chiedi informazioni allo staff"
  ],

  notizieFallback: [
    "Salute: estate e caldo, i consigli degli esperti",
    "Economia: inflazione, dati in calo",
    "Cronaca: ultime notizie",
    "Sport: risultati e classifiche"
  ]
};
