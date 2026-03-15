const translations = {
  de: {
    title: 'Wandersteine',
    subtitle: 'Rieke & Leo · 18.07.2026',
    tagline: 'Lass den Stein wandern.',
    homeTitle: 'Wo ist dein Stein?',
    homeLabel: 'Steinnummer eingeben',
    homePlaceholder: 'z.B. 42',
    homeButton: 'Suchen',
    explanation: [
      'Zur Hochzeit von Rieke & Leo erhält jeder Gast einen nummerierten Wanderstein.',
      'Trage deinen Stein in sein erstes Abenteuer ein – und leg ihn dann irgendwo aus, wo er von anderen gefunden werden kann.',
      'Wer den Stein findet, gibt die Nummer ein und fügt den nächsten Eintrag hinzu. So entsteht eine Reisegeschichte, die vielleicht die ganze Welt umspannt.'
    ],
    stoneTitle: 'Stein',
    stoneHistory: 'Reisegeschichte',
    stoneFirstEntry: 'Dieser Stein hat noch keine Einträge. Sei der Erste!',
    addEntry: 'Ich habe diesen Stein gefunden!',
    addEntryTitle: 'Neuen Eintrag hinzufügen',
    fieldName: 'Dein Name',
    fieldNamePlaceholder: 'Name oder Spitzname',
    fieldMessage: 'Nachricht',
    fieldMessagePlaceholder: 'Was machst du hier? Was siehst du?',
    fieldLocation: 'Standort',
    fieldLocationPlaceholder: 'z.B. Café am Marktplatz, Wien',
    fieldPhotos: 'Fotos',
    photoUploadText: 'Fotos hier ablegen oder tippen zum Auswählen',
    gpsButton: '📍 GPS-Standort verwenden',
    gpsSuccess: '✓ Standort erfasst',
    gpsError: 'GPS nicht verfügbar – bitte Ort manuell eingeben',
    submit: 'Eintrag speichern',
    submitting: 'Wird gespeichert...',
    successMessage: 'Dein Eintrag wurde gespeichert! Danke, dass du den Stein auf seiner Reise begleitet hast.',
    entries: 'Einträge',
    entry: 'Eintrag',
    active: 'Aktiv',
    inactive: 'Noch nicht aktiviert',
    loginTitle: 'Admin-Bereich',
    loginSubtitle: 'Wandersteine Rieke & Leo',
    username: 'Benutzername',
    password: 'Passwort',
    loginButton: 'Anmelden',
    loginError: 'Ungültige Zugangsdaten',
    adminTitle: 'Admin-Übersicht',
    allStones: 'Alle Steine',
    activeStones: 'Aktive Steine',
    totalEntries: 'Einträge gesamt',
    logout: 'Abmelden',
    stoneNr: 'Stein Nr.',
    status: 'Status',
    lastLocation: 'Letzter Ort',
    lastEntry: 'Letzter Eintrag',
    entriesCount: 'Einträge',
    mapTitle: 'Weltreise der Steine',
    required: '*',
    photoRequired: 'Mindestens ein Foto ist erforderlich',
    locationRequired: 'Bitte GPS aktivieren oder Ort manuell eingeben',
    nameRequired: 'Bitte Namen eingeben',
  },
  en: {
    title: 'Wandersteine',
    subtitle: 'Rieke & Leo · 18.07.2026',
    tagline: 'Let the stone wander.',
    homeTitle: 'Where is your stone?',
    homeLabel: 'Enter stone number',
    homePlaceholder: 'e.g. 42',
    homeButton: 'Search',
    explanation: [
      'At the wedding of Rieke & Leo, every guest receives a numbered wandering stone.',
      'Record your stone\'s first adventure – then leave it somewhere for others to find.',
      'Whoever finds the stone enters the number and adds the next chapter. A travel story that might span the whole world.'
    ],
    stoneTitle: 'Stone',
    stoneHistory: 'Journey',
    stoneFirstEntry: 'This stone has no entries yet. Be the first!',
    addEntry: 'I found this stone!',
    addEntryTitle: 'Add a new entry',
    fieldName: 'Your name',
    fieldNamePlaceholder: 'Name or nickname',
    fieldMessage: 'Message',
    fieldMessagePlaceholder: 'What are you doing here? What do you see?',
    fieldLocation: 'Location',
    fieldLocationPlaceholder: 'e.g. Café at the market square, Vienna',
    fieldPhotos: 'Photos',
    photoUploadText: 'Drop photos here or tap to select',
    gpsButton: '📍 Use GPS location',
    gpsSuccess: '✓ Location captured',
    gpsError: 'GPS unavailable – please enter location manually',
    submit: 'Save entry',
    submitting: 'Saving...',
    successMessage: 'Your entry has been saved! Thank you for accompanying the stone on its journey.',
    entries: 'entries',
    entry: 'entry',
    active: 'Active',
    inactive: 'Not yet activated',
    loginTitle: 'Admin Area',
    loginSubtitle: 'Wandersteine Rieke & Leo',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign in',
    loginError: 'Invalid credentials',
    adminTitle: 'Admin Overview',
    allStones: 'All Stones',
    activeStones: 'Active Stones',
    totalEntries: 'Total Entries',
    logout: 'Sign out',
    stoneNr: 'Stone No.',
    status: 'Status',
    lastLocation: 'Last Location',
    lastEntry: 'Last Entry',
    entriesCount: 'Entries',
    mapTitle: 'World Journey of Stones',
    required: '*',
    photoRequired: 'At least one photo is required',
    locationRequired: 'Please enable GPS or enter location manually',
    nameRequired: 'Please enter your name',
  }
};

export const getLang = () => {
  const nav = navigator.language || 'de';
  return nav.startsWith('de') ? 'de' : 'en';
};

export const t = (key) => {
  const lang = getLang();
  const val = translations[lang]?.[key] ?? translations['de']?.[key] ?? key;
  return val;
};

export const tStr = (key) => {
  const val = t(key);
  return Array.isArray(val) ? val.join(' ') : String(val);
};

export default translations;
