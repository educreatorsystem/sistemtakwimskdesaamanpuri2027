'use strict';

const CONFIG = Object.freeze({
  YEAR: 2027,
  SCHOOL_NAME: 'SEKOLAH KEBANGSAAN DESA AMANPURI',
  SCHOOL_LOGO_URL: 'https://iili.io/nvTovln.md.png',
  HOLIDAY_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG4XJl5eweyOkrO-EtH8lpxxEbe6YvUGCjkZDzbQPBVGJRHef2wpkwYTdl-WP8YRS3xHyDBfPlhTWD/pub?gid=457971484&single=true&output=csv',
  PROGRAM_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG4XJl5eweyOkrO-EtH8lpxxEbe6YvUGCjkZDzbQPBVGJRHef2wpkwYTdl-WP8YRS3xHyDBfPlhTWD/pub?gid=679655066&single=true&output=csv',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbznUIIFLvb_a8KfbiomzpfAbDVXEcVHF_L0PYLyAbGUO1Yz8dfj8vApu10vPSntGdOp/exec'
});

const MONTHS = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
const DAYS = ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'];
const CATEGORY_SLUG = {
  'Pentadbiran': 'pentadbiran', 'Akademik': 'akademik', 'HEM': 'hem',
  'Kokurikulum': 'kokurikulum', 'Sukan': 'sukan', 'Cuti': 'cuti', 'Lain-lain': 'lain-lain'
};

// Cuti, perayaan dan sambutan 2027 untuk Negeri Selangor.
// Cuti persekolahan menggunakan Kalendar Akademik KPM 2027 Kumpulan B.
// Hari kelepasan am Selangor berasaskan jadual Hari Kelepasan Am 2027 BKPP/JPM dan cuti negeri Selangor.
const HOLIDAY_PERIODS_2027 = Object.freeze([
  // JANUARI
  { id:'jan-newyear', start:'2027-01-01', end:'2027-01-01', title:'Tahun Baru', type:'Cuti Umum', scope:'Selangor', icon:'🎆' },
  { id:'jan-israk', start:'2027-01-06', end:'2027-01-06', title:'Israk & Mikraj', type:'Perayaan', scope:'Islam', icon:'🕌' },
  { id:'jan-thaipusam', start:'2027-01-22', end:'2027-01-22', title:'Hari Thaipusam', type:'Cuti Negeri', scope:'Selangor', icon:'🪔' },

  // FEBRUARI — TAHUN BAHARU CINA + CUTI TAMBAHAN KPM
  { id:'feb-kpm-cny-1', start:'2027-02-05', end:'2027-02-05', title:'Cuti Tambahan KPM – Tahun Baharu Cina', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'feb-cny-1', start:'2027-02-06', end:'2027-02-06', title:'Tahun Baharu Cina', type:'Cuti Umum', scope:'Selangor', icon:'🧧' },
  { id:'feb-cny-2', start:'2027-02-07', end:'2027-02-07', title:'Tahun Baharu Cina (Hari Kedua)', type:'Cuti Umum', scope:'Selangor', icon:'🧧' },
  { id:'feb-cny-replace', start:'2027-02-08', end:'2027-02-08', title:'Cuti Ganti Tahun Baharu Cina (Hari Kedua)', type:'Cuti Umum', scope:'Selangor', icon:'🧧' },
  { id:'feb-ramadan', start:'2027-02-08', end:'2027-02-08', title:'Awal Ramadan', type:'Perayaan', scope:'Islam', icon:'🌙' },
  { id:'feb-kpm-cny-2', start:'2027-02-09', end:'2027-02-12', title:'Cuti Tambahan KPM – Tahun Baharu Cina', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'feb-valentine', start:'2027-02-14', end:'2027-02-14', title:'Hari Valentine', type:'Sambutan', scope:'Sambutan', icon:'💝' },
  { id:'feb-lantern', start:'2027-02-20', end:'2027-02-20', title:'Pesta Tanglung / Chap Goh Mei', type:'Perayaan', scope:'Perayaan Cina', icon:'🏮' },
  { id:'feb-nuzul', start:'2027-02-24', end:'2027-02-24', title:'Nuzul Al-Quran', type:'Cuti Negeri', scope:'Selangor', icon:'📖' },

  // MAC
  { id:'mar-term1', start:'2027-03-06', end:'2027-03-14', title:'Cuti Penggal 1', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🏫' },
  { id:'mar-women', start:'2027-03-08', end:'2027-03-08', title:'Hari Wanita Antarabangsa', type:'Sambutan', scope:'Sambutan', icon:'🌷' },
  { id:'mar-raya-1', start:'2027-03-10', end:'2027-03-10', title:'Hari Raya Aidilfitri', type:'Cuti Umum', scope:'Selangor', icon:'🌙' },
  { id:'mar-raya-2', start:'2027-03-11', end:'2027-03-11', title:'Hari Raya Aidilfitri (Hari Kedua)', type:'Cuti Umum', scope:'Selangor', icon:'🌙' },

  // APRIL
  { id:'apr-qingming', start:'2027-04-05', end:'2027-04-05', title:'Qing Ming Festival', type:'Perayaan', scope:'Perayaan Cina', icon:'🌿' },

  // MEI & JUN
  { id:'may-labour', start:'2027-05-01', end:'2027-05-01', title:'Hari Pekerja', type:'Cuti Umum', scope:'Selangor', icon:'🛠️' },
  { id:'may-mother', start:'2027-05-09', end:'2027-05-09', title:'Hari Ibu', type:'Sambutan', scope:'Sambutan', icon:'💐' },
  { id:'may-arafah', start:'2027-05-16', end:'2027-05-16', title:'Hari Arafah', type:'Perayaan', scope:'Islam', icon:'🕋' },
  { id:'may-haji', start:'2027-05-17', end:'2027-05-17', title:'Hari Raya Qurban / Aidiladha', type:'Cuti Umum', scope:'Selangor', icon:'🕌' },
  { id:'may-kpm-haji', start:'2027-05-18', end:'2027-05-19', title:'Cuti Tambahan KPM – Hari Raya Korban', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'may-wesak', start:'2027-05-20', end:'2027-05-20', title:'Hari Wesak', type:'Cuti Umum', scope:'Selangor', icon:'🪷' },
  { id:'may-kpm-wesak', start:'2027-05-21', end:'2027-05-21', title:'Cuti Tambahan KPM – Hari Wesak', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'may-midyear', start:'2027-05-22', end:'2027-06-06', title:'Cuti Pertengahan Tahun', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🌴' },
  { id:'jun-muharram', start:'2027-06-06', end:'2027-06-06', title:'Awal Muharram (Maal Hijrah)', type:'Cuti Umum', scope:'Selangor', icon:'🌙' },
  { id:'jun-agong', start:'2027-06-07', end:'2027-06-07', title:'Hari Keputeraan Rasmi Yang di-Pertuan Agong', type:'Cuti Umum', scope:'Selangor', icon:'🇲🇾' },
  { id:'jun-muharram-replace', start:'2027-06-08', end:'2027-06-08', title:'Cuti Ganti Awal Muharram', type:'Cuti Umum', scope:'Selangor', icon:'🌙' },
  { id:'jun-dragonboat', start:'2027-06-09', end:'2027-06-09', title:'Dragon Boat Festival', type:'Perayaan', scope:'Perayaan Cina', icon:'🐉' },

  // JULAI
  { id:'jul-parents', start:'2027-07-04', end:'2027-07-04', title:'Hari Ibu Bapa', type:'Sambutan', scope:'Sambutan', icon:'👨‍👩‍👧‍👦' },

  // OGOS & SEPTEMBER
  { id:'aug-chinese-valentine', start:'2027-08-08', end:'2027-08-08', title:'Chinese Valentine\'s Day', type:'Perayaan', scope:'Perayaan Cina', icon:'💞' },
  { id:'aug-maulid', start:'2027-08-15', end:'2027-08-15', title:'Maulidur Rasul', type:'Cuti Umum', scope:'Selangor', icon:'🕌' },
  { id:'aug-maulid-replace', start:'2027-08-16', end:'2027-08-16', title:'Cuti Ganti Maulidur Rasul', type:'Cuti Umum', scope:'Selangor', icon:'🕌' },
  { id:'aug-ghost', start:'2027-08-16', end:'2027-08-16', title:'Ghost Festival', type:'Perayaan', scope:'Perayaan Cina', icon:'🏮' },
  { id:'aug-term2', start:'2027-08-28', end:'2027-09-05', title:'Cuti Penggal 2', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🏫' },
  { id:'aug-merdeka', start:'2027-08-31', end:'2027-08-31', title:'Hari Kebangsaan', type:'Cuti Umum', scope:'Selangor', icon:'🇲🇾' },
  { id:'sep-midautumn', start:'2027-09-15', end:'2027-09-15', title:'Pesta Pertengahan Musim Luruh', type:'Perayaan', scope:'Perayaan Cina', icon:'🥮' },
  { id:'sep-malaysia', start:'2027-09-16', end:'2027-09-16', title:'Hari Malaysia', type:'Cuti Umum', scope:'Selangor', icon:'🇲🇾' },

  // OKTOBER
  { id:'oct-double-ninth', start:'2027-10-08', end:'2027-10-08', title:'Double Ninth Festival', type:'Perayaan', scope:'Perayaan Cina', icon:'🌼' },
  { id:'oct-kpm-deepavali-before', start:'2027-10-27', end:'2027-10-27', title:'Cuti Tambahan KPM – Hari Deepavali', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'oct-deepavali', start:'2027-10-28', end:'2027-10-28', title:'Hari Deepavali', type:'Cuti Umum', scope:'Selangor', icon:'🪔' },
  { id:'oct-kpm-deepavali-after', start:'2027-10-29', end:'2027-10-29', title:'Cuti Tambahan KPM – Hari Deepavali', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },

  // DISEMBER
  { id:'dec-yearend', start:'2027-12-04', end:'2027-12-31', title:'Cuti Akhir Persekolahan', type:'Cuti Sekolah', scope:'Sekolah Selangor • Kumpulan B', icon:'🎒' },
  { id:'dec-sultan-selangor', start:'2027-12-11', end:'2027-12-11', title:'Hari Keputeraan Sultan Selangor', type:'Cuti Negeri', scope:'Selangor', icon:'👑' },
  { id:'dec-winter', start:'2027-12-22', end:'2027-12-22', title:'Winter Solstice / Dongzhi', type:'Perayaan', scope:'Perayaan Cina', icon:'🍡' },
  { id:'dec-christmas', start:'2027-12-25', end:'2027-12-25', title:'Hari Krismas', type:'Cuti Umum', scope:'Selangor', icon:'🎄' },
  { id:'dec-israk', start:'2027-12-26', end:'2027-12-26', title:'Israk & Mikraj', type:'Perayaan', scope:'Islam', icon:'🕌' }
]);


// Tarikh pembayaran emolumen bulanan 2027 berdasarkan SPANM Bil. 5/2026, Lampiran 1 (JANM).
const EMOLUMEN_DATES_2027 = Object.freeze([
  { date:'2027-01-25', day:'Isnin', note:'' },
  { date:'2027-02-25', day:'Khamis', note:'Tahun Baharu Cina 6 & 7 Februari 2027 (Sabtu & Ahad)' },
  { date:'2027-03-25', day:'Khamis', note:'Hari Raya Puasa 10 & 11 Mac 2027 (Rabu & Khamis)' },
  { date:'2027-04-22', day:'Khamis', note:'' },
  { date:'2027-05-12', day:'Rabu', note:'Hari Raya Haji 17 & 18 Mei 2027 (Isnin & Selasa)' },
  { date:'2027-06-17', day:'Khamis', note:'' },
  { date:'2027-07-21', day:'Rabu', note:'' },
  { date:'2027-08-25', day:'Rabu', note:'' },
  { date:'2027-09-23', day:'Khamis', note:'' },
  { date:'2027-10-21', day:'Khamis', note:'Hari Deepavali 28 Oktober 2027 (Khamis)' },
  { date:'2027-11-25', day:'Khamis', note:'' },
  { date:'2027-12-20', day:'Isnin', note:'Hari Krismas 25 Disember 2027 (Sabtu)' }
]);

const state = {
  month: new Date().getFullYear() === CONFIG.YEAR ? new Date().getMonth() : 0,
  events: [],
  customHolidays: [],
  isAdmin: false,
  token: sessionStorage.getItem('takwimAdminToken') || '',
  quickAddDate: '',
  pendingAdminAction: null
};

const el = {};
let toastTimer = null;

window.addEventListener('DOMContentLoaded', init);

// PWA: daftar Service Worker selepas halaman siap dimuatkan.
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service Worker tidak dapat didaftarkan:', err);
    });
  }
});

async function init() {
  cacheElements();
  applyBranding();
  buildMonthSelect();
  bindEvents();
  await restoreAdminSession();
  await loadEvents({ preferApi: false });
  await loadCustomHolidays({ preferApi: true });
}

function cacheElements() {
  [
    'loadingOverlay','loadingText','schoolLogo','schoolName','adminBtn','printBtn','logoutBtn','addProgramBtn','addHolidayBtn2',
    'holidayScheduleBtn','holidayScheduleBtn2','prevMonthBtn','nextMonthBtn','monthSelect','adminBadge','monthTitle','programCount',
    'holidayCount','holidayDayCount','emolumenDate','calendarGrid','emptyMonthMessage','holidaySummaryTitle','holidaySummaryStats','holidaySummaryList',
    'loginModal','loginForm','adminIdInput','adminPasswordInput','eventModal','eventModalTitle','eventForm','eventId','eventDate',
    'eventTime','eventTitle','eventPlace','eventCategory','eventNotes','saveEventBtn','deleteEventBtn','holidayModal','holidayModalTitle',
    'holidayModalSubtitle','holidayTableBody','printHolidayBtn','holidayPrintSheet','holidayPrintLogo','holidayPrintSchool',
    'holidayPrintTitle','holidayPrintBody','holidayEditModal','holidayEditForm','holidayEditTitle','holidayEditId','holidayStart','holidayEnd',
    'holidayTitle','holidayType','holidayScope','holidayIcon','holidayNotes','saveHolidayBtn','deleteHolidayBtn',
    'quickAddModal','quickAddDateText','quickAddProgramBtn','quickAddHolidayBtn',
    'summaryChoiceModal','summaryChoiceMonth','summaryHolidayOnlyBtn','summaryProgramOnlyBtn','summaryCombinedBtn',
    'summaryResultModal','summaryResultTitle','summaryResultSubtitle','summaryResultStats','summaryResultHead','summaryResultBody','printSummaryBtn',
    'summaryPrintSheet','summaryPrintLogo','summaryPrintSchool','summaryPrintTitle','summaryPrintSubtitle','summaryPrintStats','summaryPrintHead','summaryPrintBody','toast'
  ].forEach(id => el[id] = document.getElementById(id));
}

function applyBranding() {
  document.title = `Takwim Pintar ${CONFIG.YEAR} — ${CONFIG.SCHOOL_NAME}`;
  el.schoolName.textContent = CONFIG.SCHOOL_NAME;
  el.schoolLogo.src = CONFIG.SCHOOL_LOGO_URL;
  el.holidayPrintLogo.src = CONFIG.SCHOOL_LOGO_URL;
  el.holidayPrintSchool.textContent = CONFIG.SCHOOL_NAME;
  el.summaryPrintLogo.src = CONFIG.SCHOOL_LOGO_URL;
  el.summaryPrintSchool.textContent = CONFIG.SCHOOL_NAME;
}

function buildMonthSelect() {
  el.monthSelect.innerHTML = MONTHS.map((m, i) => `<option value="${i}">${m} ${CONFIG.YEAR}</option>`).join('');
  el.monthSelect.value = String(state.month);
}

function bindEvents() {
  el.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
  el.nextMonthBtn.addEventListener('click', () => changeMonth(1));
  el.monthSelect.addEventListener('change', e => { state.month = Number(e.target.value); renderCalendar(); });
  el.printBtn.addEventListener('click', () => window.print());
  el.addProgramBtn.addEventListener('click', () => requireAdminAction(() => openEventForAdd(defaultAddDate())));
  el.quickAddProgramBtn.addEventListener('click', () => {
    const date = state.quickAddDate || defaultAddDate();
    closeModal('quickAdd');
    openEventForAdd(date);
  });
  el.quickAddHolidayBtn.addEventListener('click', () => {
    const date = state.quickAddDate || defaultAddDate();
    closeModal('quickAdd');
    openHolidayForAdd(date);
  });
  el.holidayScheduleBtn.addEventListener('click', openSummaryChoice);
  el.holidayScheduleBtn2.addEventListener('click', openSummaryChoice);
  el.summaryHolidayOnlyBtn.addEventListener('click', () => generateMonthlySummary('holiday'));
  el.summaryProgramOnlyBtn.addEventListener('click', () => generateMonthlySummary('program'));
  el.summaryCombinedBtn.addEventListener('click', () => generateMonthlySummary('combined'));
  el.printSummaryBtn.addEventListener('click', printGeneratedSummary);
  el.printHolidayBtn.addEventListener('click', printHolidaySchedule);
  el.addHolidayBtn2.addEventListener('click', () => requireAdminAction(() => openHolidayForAdd()));
  el.holidayEditForm.addEventListener('submit', saveHoliday);
  el.deleteHolidayBtn.addEventListener('click', deleteHoliday);
  el.adminBtn.addEventListener('click', () => {
    if (state.isAdmin) return showToast('Mod admin sudah aktif.', 'success');
    state.pendingAdminAction = null;
    openModal('login');
    setTimeout(() => el.adminIdInput.focus(), 60);
  });
  el.logoutBtn.addEventListener('click', logoutAdmin);
  el.loginForm.addEventListener('submit', handleLogin);
  el.eventForm.addEventListener('submit', saveEvent);
  el.deleteEventBtn.addEventListener('click', deleteEvent);

  document.querySelectorAll('[data-close]').forEach(node => node.addEventListener('click', () => {
    if (node.dataset.close === 'login' && !state.isAdmin) state.pendingAdminAction = null;
    closeModal(node.dataset.close);
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
  });
}

function changeMonth(delta) {
  state.month = (state.month + delta + 12) % 12;
  el.monthSelect.value = String(state.month);
  renderCalendar();
}

async function restoreAdminSession() {
  if (!state.token || !isApiConfigured()) { setAdminUi(false); return; }
  try {
    const result = await postApi({ action: 'validateToken', token: state.token });
    setAdminUi(Boolean(result.success));
    if (!result.success) sessionStorage.removeItem('takwimAdminToken');
  } catch (_) { setAdminUi(false); }
}

function setAdminUi(active) {
  state.isAdmin = active;
  el.adminBadge.classList.toggle('hidden', !active);
  el.logoutBtn.classList.toggle('hidden', !active);
  el.addProgramBtn.classList.toggle('hidden', !active);
  el.addHolidayBtn2.classList.toggle('hidden', !active);
  document.body.classList.toggle('admin-active', active);
  el.adminBtn.textContent = active ? '✅ Mod Admin Aktif' : '🔐 Sunting Takwim';
  renderCalendar();
}

async function handleLogin(e) {
  e.preventDefault();
  if (!isApiConfigured()) return showToast('URL Apps Script belum dikonfigurasi.', 'error');
  setLoading(true, 'Mengesahkan admin...');
  try {
    const result = await postApi({ action: 'login', id: el.adminIdInput.value.trim(), password: el.adminPasswordInput.value });
    if (!result.success || !result.token) throw new Error(result.message || 'Username atau password tidak sah.');
    state.token = result.token;
    sessionStorage.setItem('takwimAdminToken', state.token);
    el.adminPasswordInput.value = '';
    closeModal('login');
    setAdminUi(true);
    showToast('Log masuk admin berjaya.', 'success');
    await refreshAllData({ preferApi: true });
    const pending = state.pendingAdminAction;
    state.pendingAdminAction = null;
    if (typeof pending === 'function') setTimeout(pending, 80);
  } catch (err) { showToast(err.message || 'Log masuk gagal.', 'error'); }
  finally { setLoading(false); }
}

function logoutAdmin() {
  state.token = '';
  state.isAdmin = false;
  sessionStorage.removeItem('takwimAdminToken');
  setAdminUi(false);
  showToast('Anda telah log keluar.', 'success');
}

async function loadEvents({ preferApi = false } = {}) {
  setLoading(true, `Memuatkan Takwim Pintar ${CONFIG.YEAR}...`);
  try {
    let records = [];
    let loaded = false;

    if (preferApi && isApiConfigured()) {
      try {
        records = await loadProgramsFromApi();
        loaded = true;
      } catch (apiErr) {
        console.warn('Fallback program melalui CSV:', apiErr);
      }
    }

    if (!loaded) {
      try {
        const csvRecords = await loadFromCsv(CONFIG.PROGRAM_CSV_URL);
        if (looksLikeProgramRecords(csvRecords)) {
          records = csvRecords;
          loaded = true;
        }
      } catch (csvErr) {
        console.warn('CSV program tidak dapat dibaca:', csvErr);
      }
    }

    if (!loaded && isApiConfigured()) {
      try {
        records = await loadProgramsFromApi();
        loaded = true;
      } catch (apiErr) {
        console.warn('Data program belum tersedia melalui Apps Script:', apiErr);
      }
    }

    state.events = normalizeEvents(records).filter(x => x.date.startsWith(`${CONFIG.YEAR}-`));
    renderCalendar();
  } finally { setLoading(false); }
}

function looksLikeProgramRecords(records) {
  if (!Array.isArray(records) || !records.length) return false;
  const keys = Object.keys(records[0] || {}).map(k => String(k).trim().toUpperCase());
  return keys.includes('TARIKH') && keys.includes('PROGRAM');
}

async function refreshAllData({ preferApi = false } = {}) {
  await loadEvents({ preferApi });
  await loadCustomHolidays({ preferApi });
}

async function loadCustomHolidays({ preferApi = true } = {}) {
  let records = [];
  let loaded = false;
  let apiError = null;
  let csvError = null;

  // Utamakan Apps Script kerana cuti tambahan admin disimpan terus dalam tab Cuti2027.
  if (isApiConfigured()) {
    try {
      records = await loadHolidaysFromApi();
      loaded = true;
    } catch (err) {
      apiError = err;
      console.warn('Apps Script cuti tidak dapat dibaca. Cuba CSV sebagai fallback:', err);
    }
  }

  // CSV hanya fallback. Ini penting jika tab belum dipublish atau GitHub/PWA menerima cache lama.
  if (!loaded && CONFIG.HOLIDAY_CSV_URL) {
    try {
      const csvRecords = await loadFromCsv(CONFIG.HOLIDAY_CSV_URL);
      if (looksLikeHolidayRecords(csvRecords) || csvRecords.length === 0) {
        records = csvRecords;
        loaded = true;
      } else {
        throw new Error('Struktur CSV cuti tidak sepadan dengan Cuti2027.');
      }
    } catch (err) {
      csvError = err;
      console.warn('CSV cuti tidak dapat dibaca:', err);
    }
  }

  if (loaded) {
    state.customHolidays = normalizeCustomHolidays(records);
    renderCalendar();
    return;
  }

  state.customHolidays = [];
  renderCalendar();
  const detail = [apiError && apiError.message, csvError && csvError.message].filter(Boolean).join(' | ');
  console.warn('Cuti tambahan belum dapat dimuatkan.', detail);
  if (state.isAdmin) {
    showToast('Cuti tambahan belum disambungkan. Jalankan setupTakwimSystem2027() dan deploy Apps Script versi baharu.', 'error');
  }
}

function looksLikeHolidayRecords(records) {
  if (!Array.isArray(records) || !records.length) return true;
  const keys = Object.keys(records[0] || {}).map(k => String(k).trim().toUpperCase());
  const hasStart = keys.includes('TARIKH_MULA') || keys.includes('START') || keys.includes('MULA');
  const hasTitle = keys.includes('NAMA_CUTI') || keys.includes('TITLE') || keys.includes('CUTI');
  return hasStart && hasTitle;
}

async function loadFromCsv(csvUrl) {
  const url = `${csvUrl}${csvUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`CSV HTTP ${res.status}`);
  return csvToObjects(await res.text());
}

async function loadProgramsFromApi() {
  const url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set('action', 'listPrograms');
  url.searchParams.set('_', String(Date.now()));
  const res = await fetch(url.toString(), { cache: 'no-store' });
  const data = safeJson(await res.text());
  if (!data.success) throw new Error(data.message || 'Gagal membaca data program melalui Apps Script.');
  return data.events || [];
}

async function loadHolidaysFromApi() {
  const url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set('action', 'listHolidays');
  url.searchParams.set('_', String(Date.now()));
  const res = await fetch(url.toString(), { cache: 'no-store' });
  const data = safeJson(await res.text());
  if (!data.success) throw new Error(data.message || 'Gagal membaca data cuti melalui Apps Script.');
  return data.holidays || [];
}

function csvToObjects(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const headers = rows.shift().map(h => String(h).trim());
  return rows.filter(row => row.some(v => String(v).trim() !== '')).map(row => {
    const obj = {}; headers.forEach((h, i) => obj[h] = row[i] ?? ''); return obj;
  });
}

function parseCsv(text) {
  const rows = []; let row = [], field = '', inQuotes = false;
  const s = String(text || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"' && s[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows;
}

function normalizeEvents(records) {
  return (records || []).map(r => ({
    id: String(pick(r, ['id','ID']) || '').trim(),
    date: normalizeDateString(pick(r, ['date','TARIKH','tarikh'])),
    title: String(pick(r, ['title','PROGRAM','program']) || '').trim(),
    time: String(pick(r, ['time','MASA','masa']) || '').trim(),
    place: String(pick(r, ['place','TEMPAT','tempat']) || '').trim(),
    category: normalizeCategory(pick(r, ['category','KATEGORI','kategori'])),
    notes: String(pick(r, ['notes','CATATAN','catatan']) || '').trim(),
    updatedAt: String(pick(r, ['updatedAt','UPDATED_AT']) || '').trim()
  })).filter(x => x.date && x.title);
}

function pick(obj, keys) { for (const key of keys) if (obj && Object.prototype.hasOwnProperty.call(obj, key)) return obj[key]; return ''; }
function normalizeCategory(value) {
  const s = String(value || '').trim();
  const found = Object.keys(CATEGORY_SLUG).find(k => k.toLowerCase() === s.toLowerCase());
  return found || 'Lain-lain';
}
function normalizeDateString(value) {
  if (!value) return '';
  const raw = String(value).trim();
  let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return '';
}

function renderCalendar() {
  if (!el.calendarGrid) return;
  const year = CONFIG.YEAR, month = state.month;
  const monthEvents = state.events.filter(e => dateParts(e.date).month === month + 1);
  const monthHolidayPeriods = getHolidayPeriodsForMonth(month);
  const monthHolidayEvents = getHolidayEventsForMonth(month);
  const monthEmolumen = getEmolumenForMonth(month);
  const holidayDates = new Set(monthHolidayEvents.filter(h => /^Cuti /.test(h.type)).map(h => h.date));

  el.monthTitle.textContent = `${MONTHS[month].toUpperCase()} ${year}`;
  el.programCount.textContent = String(monthEvents.length);
  el.holidayCount.textContent = String(monthHolidayPeriods.length);
  el.holidayDayCount.textContent = String(holidayDates.size);
  el.emolumenDate.textContent = monthEmolumen ? String(dateParts(monthEmolumen.date).day) : '—';
  el.emptyMonthMessage.classList.toggle('hidden', monthEvents.length !== 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const dayOffset = i - firstDay + 1;
    let cellYear = year, cellMonth = month, day = dayOffset, outside = false;
    if (dayOffset < 1) { outside = true; cellMonth = month - 1; day = prevMonthDays + dayOffset; }
    else if (dayOffset > daysInMonth) { outside = true; cellMonth = month + 1; day = dayOffset - daysInMonth; }
    if (cellMonth < 0) { cellMonth = 11; cellYear--; }
    if (cellMonth > 11) { cellMonth = 0; cellYear++; }

    const dateKey = `${cellYear}-${String(cellMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayEvents = outside ? [] : monthEvents.filter(e => e.date === dateKey);
    const dayHolidays = outside ? [] : monthHolidayEvents.filter(e => e.date === dateKey);
    const today = isTodayKey(dateKey);
    const emolumen = !outside && monthEmolumen && monthEmolumen.date === dateKey ? monthEmolumen : null;
    const addButton = (!outside && state.isAdmin) ? `<button class="add-day-btn no-print" type="button" data-add-date="${dateKey}" title="Tambah program atau cuti pada tarikh ini" aria-label="Tambah pada ${dateKey}">+</button>` : '';

    const holidayChips = dayHolidays.map(h => {
      const cls = holidayTypeSlug(h.type);
      return `<button type="button" class="holiday-chip holiday-${cls}" data-holiday-id="${escapeHtml(h.periodId)}" title="${escapeHtml(h.scope)}">
        <span>${h.icon || '🎉'}</span><strong>${escapeHtml(h.title)}${h.source === 'custom' ? ' ✎' : ''}</strong>
      </button>`;
    }).join('');


    const emolumenChip = emolumen ? `<div class="emolumen-chip" title="${escapeHtml(emolumen.note || 'Tarikh pembayaran emolumen bulanan JANM')}">
      <span class="emolumen-icon">💰</span><strong>Pembayaran Emolumen</strong><small>JANM${emolumen.note ? ' • ' + escapeHtml(emolumen.note) : ''}</small>
    </div>` : '';

    const programChips = dayEvents.map(event => {
      const slug = CATEGORY_SLUG[event.category] || 'lain-lain';
      return `<button type="button" class="event-chip cat-${slug}" data-event-id="${escapeHtml(event.id)}">
        <strong>${escapeHtml(event.title)}</strong>${event.time ? `<small>⏱ ${escapeHtml(event.time)}</small>` : ''}
      </button>`;
    }).join('');

    const weekday = i % 7;
    const classes = ['day-cell', outside ? 'outside' : '', today ? 'today-ish' : '', dayHolidays.length ? 'has-holiday' : '', weekday === 0 ? 'sunday' : '', weekday === 6 ? 'saturday' : ''].filter(Boolean).join(' ');
    cells.push(`<div class="${classes}">
      <div class="day-top"><span class="day-number">${day}</span>${addButton}</div>
      <div class="events-stack">${emolumenChip}${holidayChips}${programChips}</div>
    </div>`);
  }

  el.calendarGrid.innerHTML = cells.join('');
  el.calendarGrid.querySelectorAll('[data-add-date]').forEach(btn => btn.addEventListener('click', () => openQuickAdd(btn.dataset.addDate)));
  el.calendarGrid.querySelectorAll('[data-event-id]').forEach(btn => btn.addEventListener('click', () => openEventById(btn.dataset.eventId)));
  el.calendarGrid.querySelectorAll('[data-holiday-id]').forEach(btn => btn.addEventListener('click', () => handleHolidayClick(btn.dataset.holidayId)));
  renderHolidaySummary();
}


function getEmolumenForMonth(month) {
  return EMOLUMEN_DATES_2027.find(p => dateParts(p.date).month === month + 1) || null;
}


function renderHolidaySummary() {
  const periods = getHolidayPeriodsForMonth(state.month);
  el.holidaySummaryTitle.textContent = `Ringkasan ${MONTHS[state.month]} ${CONFIG.YEAR}`;

  const stats = {
    'Cuti Umum': periods.filter(x => x.type === 'Cuti Umum').length,
    'Cuti Negeri': periods.filter(x => x.type === 'Cuti Negeri').length,
    'Cuti Sekolah': periods.filter(x => x.type === 'Cuti Sekolah').reduce((n, x) => n + countDaysInMonth(x.start, x.end, state.month, CONFIG.YEAR), 0),
    'Perayaan / Sambutan': periods.filter(x => x.type === 'Perayaan' || x.type === 'Sambutan').length
  };
  el.holidaySummaryStats.innerHTML = `
    <div><b>${stats['Cuti Umum']}</b><span>Cuti Umum</span></div>
    <div><b>${stats['Cuti Negeri']}</b><span>Cuti Negeri</span></div>
    <div><b>${stats['Cuti Sekolah']}</b><span>Hari Cuti Sekolah</span></div>
    <div><b>${stats['Perayaan / Sambutan']}</b><span>Perayaan / Sambutan</span></div>`;

  el.holidaySummaryList.innerHTML = periods.length ? periods.map(p => `
    <button class="summary-holiday-item" type="button" data-summary-holiday="${p.id}">
      <span class="summary-icon">${p.icon || '🎉'}</span>
      <span class="summary-copy"><strong>${escapeHtml(formatPeriodDate(p))}</strong><em>${escapeHtml(p.title)}${p.source === 'custom' ? ' ✎' : ''}</em></span>
      <span class="type-badge type-${holidayTypeSlug(p.type)}">${escapeHtml(p.type)}</span>
      <small>${escapeHtml(p.scope)}</small>
    </button>`).join('') : '<div class="summary-empty">Tiada cuti atau perayaan direkodkan untuk bulan ini.</div>';

  el.holidaySummaryList.querySelectorAll('[data-summary-holiday]').forEach(btn => btn.addEventListener('click', () => handleHolidayClick(btn.dataset.summaryHoliday)));
}

function getAllHolidayPeriods() {
  const official = HOLIDAY_PERIODS_2027.map(p => ({ ...p, source:'official', editable:false }));
  return [...official, ...state.customHolidays];
}

function findHolidayById(id) { return getAllHolidayPeriods().find(p => p.id === id); }

function getHolidayPeriodsForMonth(month) {
  const targetStart = `${CONFIG.YEAR}-${String(month + 1).padStart(2,'0')}-01`;
  const targetEnd = `${CONFIG.YEAR}-${String(month + 1).padStart(2,'0')}-${String(new Date(CONFIG.YEAR, month + 1, 0).getDate()).padStart(2,'0')}`;
  return getAllHolidayPeriods().filter(p => p.start <= targetEnd && p.end >= targetStart)
    .slice().sort((a,b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title));
}

function getHolidayEventsForMonth(month) {
  const targetMonth = month + 1, out = [];
  getHolidayPeriodsForMonth(month).forEach(p => {
    eachDate(p.start, p.end, date => {
      const parts = dateParts(date);
      if (parts.year === CONFIG.YEAR && parts.month === targetMonth) out.push({ ...p, periodId:p.id, date });
    });
  });
  return out;
}

function eachDate(start, end, cb) {
  let d = localDate(start), last = localDate(end);
  while (d <= last) {
    cb(toDateKey(d));
    d.setDate(d.getDate() + 1);
  }
}
function localDate(key) { const p = dateParts(key); return new Date(p.year, p.month - 1, p.day); }
function toDateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function countDays(start, end) { return Math.round((localDate(end) - localDate(start)) / 86400000) + 1; }
function countDaysInMonth(start, end, monthIndex, year) {
  let count = 0;
  eachDate(start, end, date => {
    const p = dateParts(date);
    if (p.year === year && p.month === monthIndex + 1) count++;
  });
  return count;
}
function isTodayKey(key) { const n = new Date(); return n.getFullYear() === CONFIG.YEAR && toDateKey(n) === key; }

function holidayTypeSlug(type) {
  return ({'Cuti Umum':'public','Cuti Negeri':'state','Cuti Sekolah':'school','Perayaan':'festival','Sambutan':'observance'})[type] || 'festival';
}

function openSummaryChoice() {
  el.summaryChoiceMonth.textContent = `${MONTHS[state.month]} ${CONFIG.YEAR}`;
  openModal('summaryChoice');
}

function getProgramsForMonth(month) {
  return state.events
    .filter(e => {
      const p = dateParts(e.date);
      return p.year === CONFIG.YEAR && p.month === month + 1;
    })
    .slice()
    .sort((a,b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '') || a.title.localeCompare(b.title));
}

function summaryModeLabel(mode) {
  return mode === 'holiday' ? 'Ringkasan Cuti' : mode === 'program' ? 'Ringkasan Program' : 'Ringkasan Keseluruhan';
}

function generateMonthlySummary(mode) {
  closeModal('summaryChoice');
  const monthName = MONTHS[state.month];
  const periods = getHolidayPeriodsForMonth(state.month);
  const programs = getProgramsForMonth(state.month);
  const title = `${summaryModeLabel(mode)} • ${monthName} ${CONFIG.YEAR}`;
  el.summaryResultTitle.textContent = title;

  let head = '';
  let body = '';
  let subtitle = '';
  let statsHtml = '';

  if (mode === 'holiday') {
    head = '<tr><th>Tarikh</th><th>Hari</th><th>Cuti / Perayaan</th><th>Jenis</th><th>Skop</th></tr>';
    body = buildHolidaySummaryRows(periods);
    const schoolDays = periods.filter(x => x.type === 'Cuti Sekolah').reduce((n,x) => n + countDaysInMonth(x.start,x.end,state.month,CONFIG.YEAR),0);
    statsHtml = buildGeneratedStats([
      ['Rekod Cuti', periods.length],
      ['Cuti Umum', periods.filter(x => x.type === 'Cuti Umum').length],
      ['Cuti Negeri', periods.filter(x => x.type === 'Cuti Negeri').length],
      ['Hari Cuti Sekolah', schoolDays]
    ]);
    subtitle = `${periods.length} rekod cuti, perayaan dan sambutan bagi ${monthName} ${CONFIG.YEAR}.`;
  } else if (mode === 'program') {
    head = '<tr><th>Tarikh</th><th>Hari</th><th>Program</th><th>Masa</th><th>Tempat</th><th>Kategori</th></tr>';
    body = buildProgramSummaryRows(programs);
    const cats = new Set(programs.map(x => x.category).filter(Boolean));
    statsHtml = buildGeneratedStats([
      ['Jumlah Program', programs.length],
      ['Kategori', cats.size],
      ['Hari Berprogram', new Set(programs.map(x => x.date)).size],
      ['Bulan', monthName]
    ]);
    subtitle = `${programs.length} program sekolah direkodkan bagi ${monthName} ${CONFIG.YEAR}.`;
  } else {
    head = '<tr><th>Tarikh</th><th>Hari</th><th>Jenis Rekod</th><th>Perkara</th><th>Masa / Tempoh</th><th>Tempat / Skop</th></tr>';
    const emolumen = getEmolumenForMonth(state.month);
    body = buildCombinedSummaryRows(periods, programs, emolumen);
    statsHtml = buildGeneratedStats([
      ['Program', programs.length],
      ['Rekod Cuti', periods.length],
      ['Emolumen', emolumen ? 1 : 0],
      ['Jumlah Rekod', programs.length + periods.length + (emolumen ? 1 : 0)],
      ['Bulan', monthName]
    ]);
    subtitle = `${programs.length} program, ${periods.length} rekod cuti/perayaan${emolumen ? ' dan 1 tarikh emolumen' : ''} bagi ${monthName} ${CONFIG.YEAR}.`;
  }

  el.summaryResultSubtitle.textContent = subtitle;
  el.summaryResultStats.innerHTML = statsHtml;
  el.summaryResultHead.innerHTML = head;
  el.summaryResultBody.innerHTML = body;
  state.generatedSummary = { mode, title, subtitle, statsHtml, head, body };
  openModal('summaryResult');
}

function buildGeneratedStats(items) {
  return items.map(([label,value]) => `<div><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></div>`).join('');
}

function buildHolidaySummaryRows(periods) {
  if (!periods.length) return '<tr><td colspan="5" class="table-empty">Tiada cuti, perayaan atau sambutan direkodkan untuk bulan ini.</td></tr>';
  return periods.map(p => `<tr>
    <td><strong>${escapeHtml(formatPeriodDate(p))}</strong></td>
    <td>${escapeHtml(formatPeriodDay(p))}</td>
    <td><span class="table-icon">${p.icon || '🎉'}</span>${escapeHtml(p.title)}</td>
    <td><span class="type-badge type-${holidayTypeSlug(p.type)}">${escapeHtml(p.type)}</span></td>
    <td>${escapeHtml(p.scope)}</td>
  </tr>`).join('');
}

function buildProgramSummaryRows(programs) {
  if (!programs.length) return '<tr><td colspan="6" class="table-empty">Tiada program sekolah direkodkan untuk bulan ini.</td></tr>';
  return programs.map(p => {
    const d = localDate(p.date);
    const dp = dateParts(p.date);
    return `<tr>
      <td><strong>${dp.day} ${MONTHS[dp.month-1]}</strong></td>
      <td>${DAYS[d.getDay()]}</td>
      <td>${escapeHtml(p.title)}</td>
      <td>${escapeHtml(p.time || '—')}</td>
      <td>${escapeHtml(p.place || '—')}</td>
      <td><span class="program-summary-badge cat-${CATEGORY_SLUG[p.category] || 'lain-lain'}">${escapeHtml(p.category || 'Lain-lain')}</span></td>
    </tr>`;
  }).join('');
}

function buildCombinedSummaryRows(periods, programs, emolumen = null) {
  const rows = [];
  periods.forEach(p => rows.push({
    date:p.start,
    html:`<tr><td><strong>${escapeHtml(formatPeriodDate(p))}</strong></td><td>${escapeHtml(formatPeriodDay(p))}</td><td><span class="record-type holiday-record">CUTI</span></td><td>${p.icon || '🎉'} ${escapeHtml(p.title)}</td><td>${p.start === p.end ? '1 hari' : escapeHtml(formatPeriodDate(p))}</td><td>${escapeHtml(p.scope)}</td></tr>`
  }));
  programs.forEach(p => {
    const d = localDate(p.date), dp = dateParts(p.date);
    rows.push({
      date:p.date,
      html:`<tr><td><strong>${dp.day} ${MONTHS[dp.month-1]}</strong></td><td>${DAYS[d.getDay()]}</td><td><span class="record-type program-record">PROGRAM</span></td><td>${escapeHtml(p.title)}</td><td>${escapeHtml(p.time || '—')}</td><td>${escapeHtml(p.place || '—')}</td></tr>`
    });
  });
  if (emolumen) {
    const d = localDate(emolumen.date), dp = dateParts(emolumen.date);
    rows.push({
      date:emolumen.date,
      html:`<tr><td><strong>${dp.day} ${MONTHS[dp.month-1]}</strong></td><td>${DAYS[d.getDay()]}</td><td><span class="record-type emolumen-record">EMOLUMEN</span></td><td>💰 Pembayaran Emolumen JANM</td><td>—</td><td>${escapeHtml(emolumen.note || 'Jabatan Akauntan Negara Malaysia')}</td></tr>`
    });
  }
  rows.sort((a,b) => a.date.localeCompare(b.date));
  return rows.length ? rows.map(x => x.html).join('') : '<tr><td colspan="6" class="table-empty">Tiada cuti, program atau tarikh emolumen direkodkan untuk bulan ini.</td></tr>';
}

function printGeneratedSummary() {
  const summary = state.generatedSummary;
  if (!summary) return;
  el.summaryPrintTitle.textContent = summary.title.toUpperCase();
  el.summaryPrintSubtitle.textContent = summary.subtitle;
  el.summaryPrintStats.innerHTML = summary.statsHtml;
  el.summaryPrintHead.innerHTML = summary.head;
  el.summaryPrintBody.innerHTML = summary.body;
  document.body.classList.add('print-summary');
  closeModal('summaryResult');
  setTimeout(() => window.print(), 60);
}

function openHolidaySchedule(highlightId = '') {
  const periods = getHolidayPeriodsForMonth(state.month);
  el.holidayModalTitle.textContent = `Jadual Cuti • ${MONTHS[state.month]} ${CONFIG.YEAR}`;
  el.holidayModalSubtitle.textContent = `${periods.length} rekod cuti, perayaan dan sambutan bagi ${MONTHS[state.month]} ${CONFIG.YEAR}.`;
  const rows = buildHolidayRows(periods, highlightId);
  el.holidayTableBody.innerHTML = rows;
  el.holidayPrintBody.innerHTML = buildHolidayRows(periods, '');
  el.holidayPrintTitle.textContent = `JADUAL CUTI • ${MONTHS[state.month].toUpperCase()} ${CONFIG.YEAR}`;
  document.querySelectorAll('.holiday-admin-col').forEach(x => x.classList.toggle('hidden', !state.isAdmin));
  openModal('holiday');
  el.holidayTableBody.querySelectorAll('[data-edit-holiday]').forEach(btn => btn.addEventListener('click', () => { closeModal('holiday'); openHolidayForEdit(btn.dataset.editHoliday); }));
  if (highlightId) setTimeout(() => el.holidayTableBody.querySelector('.row-highlight')?.scrollIntoView({block:'center',behavior:'smooth'}), 80);
}

function printHolidaySchedule() {
  const periods = getHolidayPeriodsForMonth(state.month);
  el.holidayPrintBody.innerHTML = buildHolidayRows(periods, '');
  el.holidayPrintTitle.textContent = `JADUAL CUTI • ${MONTHS[state.month].toUpperCase()} ${CONFIG.YEAR}`;
  document.body.classList.add('print-holidays');
  closeModal('holiday');
  setTimeout(() => window.print(), 60);
}

window.addEventListener('afterprint', () => { document.body.classList.remove('print-holidays'); document.body.classList.remove('print-summary'); });

function buildHolidayRows(periods, highlightId) {
  if (!periods.length) return `<tr><td colspan="${state.isAdmin ? 6 : 5}" class="table-empty">Tiada rekod untuk bulan ini.</td></tr>`;
  return periods.map(p => {
    const actionCell = state.isAdmin
      ? `<td class="holiday-admin-cell no-print">${p.editable ? `<button class="mini-edit-btn" type="button" data-edit-holiday="${escapeHtml(p.id)}">✏️ Sunting</button>` : '<span class="locked-holiday">🔒 Rasmi</span>'}</td>`
      : '';
    return `<tr class="${p.id === highlightId ? 'row-highlight' : ''}">
      <td><strong>${escapeHtml(formatPeriodDate(p))}</strong></td>
      <td>${escapeHtml(formatPeriodDay(p))}</td>
      <td><span class="table-icon">${p.icon || '🎉'}</span>${escapeHtml(p.title)}${p.source === 'custom' ? ' <span class="custom-tag">ADMIN</span>' : ''}</td>
      <td><span class="type-badge type-${holidayTypeSlug(p.type)}">${escapeHtml(p.type)}</span></td>
      <td>${escapeHtml(p.scope)}</td>
      ${actionCell}
    </tr>`;
  }).join('');
}

function formatPeriodDate(p) {
  const s = dateParts(p.start), e = dateParts(p.end);
  if (p.start === p.end) return `${s.day} ${MONTHS[s.month-1]}`;
  if (s.month === e.month) return `${s.day}–${e.day} ${MONTHS[s.month-1]}`;
  return `${s.day} ${MONTHS[s.month-1]} – ${e.day} ${MONTHS[e.month-1]}`;
}
function formatPeriodDay(p) {
  const s = localDate(p.start), e = localDate(p.end);
  if (p.start === p.end) return DAYS[s.getDay()];
  return `${DAYS[s.getDay()]}–${DAYS[e.getDay()]}`;
}



function defaultAddDate() {
  const now = new Date();
  if (now.getFullYear() === CONFIG.YEAR && now.getMonth() === state.month) {
    return `${CONFIG.YEAR}-${String(state.month + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }
  return `${CONFIG.YEAR}-${String(state.month + 1).padStart(2,'0')}-01`;
}

function formatQuickAddDate(date) {
  const p = dateParts(date);
  const d = localDate(date);
  return `${DAYS[d.getDay()]}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

function requireAdminAction(callback) {
  if (state.isAdmin) return callback();
  state.pendingAdminAction = callback;
  openModal('login');
  setTimeout(() => el.adminIdInput.focus(), 60);
  showToast('Sila log masuk sebagai admin untuk menambah data.', 'error');
}

function openQuickAdd(date) {
  if (!state.isAdmin) return requireAdminAction(() => openQuickAdd(date));
  state.quickAddDate = date || defaultAddDate();
  el.quickAddDateText.textContent = formatQuickAddDate(state.quickAddDate);
  openModal('quickAdd');
}

function handleHolidayClick(id) {
  const holiday = findHolidayById(id);
  if (state.isAdmin && holiday && holiday.editable) return openHolidayForEdit(id);
  openHolidaySchedule(id);
}

function openHolidayForAdd(prefillDate = '') {
  if (!state.isAdmin) return showToast('Sila log masuk sebagai admin untuk menambah cuti.', 'error');
  const date = prefillDate || `${CONFIG.YEAR}-${String(state.month + 1).padStart(2,'0')}-01`;
  el.holidayEditId.value = '';
  el.holidayStart.value = date;
  el.holidayEnd.value = date;
  el.holidayTitle.value = '';
  el.holidayType.value = 'Cuti Sekolah';
  el.holidayScope.value = 'Sekolah Selangor';
  el.holidayIcon.value = '🎒';
  el.holidayNotes.value = '';
  el.holidayEditTitle.textContent = 'Tambah Cuti';
  el.saveHolidayBtn.textContent = 'Simpan Cuti';
  el.deleteHolidayBtn.classList.add('hidden');
  openModal('holidayEdit');
  setTimeout(() => el.holidayTitle.focus(), 60);
}

function openHolidayForEdit(id) {
  if (!state.isAdmin) return;
  const h = state.customHolidays.find(x => x.id === id);
  if (!h) return showToast('Cuti rasmi dikunci dan tidak boleh disunting.', 'error');
  el.holidayEditId.value = h.id;
  el.holidayStart.value = h.start;
  el.holidayEnd.value = h.end;
  el.holidayTitle.value = h.title;
  el.holidayType.value = h.type;
  el.holidayScope.value = h.scope || 'Sekolah Selangor';
  el.holidayIcon.value = [...el.holidayIcon.options].some(o => o.value === h.icon) ? h.icon : '🎉';
  el.holidayNotes.value = h.notes || '';
  el.holidayEditTitle.textContent = 'Sunting Cuti';
  el.saveHolidayBtn.textContent = 'Simpan Perubahan';
  el.deleteHolidayBtn.classList.remove('hidden');
  openModal('holidayEdit');
}

async function saveHoliday(e) {
  e.preventDefault();
  if (!state.isAdmin) return;
  const payload = {
    action: el.holidayEditId.value ? 'updateHoliday' : 'addHoliday',
    token: state.token,
    id: el.holidayEditId.value,
    start: el.holidayStart.value,
    end: el.holidayEnd.value,
    title: el.holidayTitle.value.trim(),
    type: el.holidayType.value,
    scope: el.holidayScope.value.trim(),
    icon: el.holidayIcon.value,
    notes: el.holidayNotes.value.trim()
  };
  if (!payload.start || !payload.end || !payload.title) return showToast('Tarikh mula, tarikh akhir dan nama cuti diperlukan.', 'error');
  if (payload.end < payload.start) return showToast('Tarikh akhir tidak boleh lebih awal daripada tarikh mula.', 'error');
  setLoading(true, payload.action === 'addHoliday' ? 'Menyimpan cuti...' : 'Mengemas kini cuti...');
  try {
    const result = await postApi(payload);
    if (!result.success) throw new Error(result.message || 'Gagal menyimpan cuti.');
    closeModal('holidayEdit');
    showToast(payload.action === 'addHoliday' ? 'Cuti berjaya ditambah.' : 'Cuti berjaya dikemas kini.', 'success');
    await loadCustomHolidays({ preferApi: true });
  } catch (err) {
    if (/token|sesi|session/i.test(err.message)) logoutAdmin();
    showToast(err.message || 'Gagal menyimpan cuti.', 'error');
  } finally { setLoading(false); }
}

async function deleteHoliday() {
  if (!state.isAdmin || !el.holidayEditId.value) return;
  const h = state.customHolidays.find(x => x.id === el.holidayEditId.value);
  if (!h) return showToast('Cuti rasmi tidak boleh dipadam.', 'error');
  if (!confirm(`Adakah anda pasti mahu memadam cuti “${h.title}”?`)) return;
  setLoading(true, 'Memadam cuti...');
  try {
    const result = await postApi({ action:'deleteHoliday', token:state.token, id:h.id });
    if (!result.success) throw new Error(result.message || 'Gagal memadam cuti.');
    closeModal('holidayEdit');
    showToast('Cuti berjaya dipadam.', 'success');
    await loadCustomHolidays({ preferApi: true });
  } catch (err) {
    showToast(err.message || 'Gagal memadam cuti.', 'error');
  } finally { setLoading(false); }
}

function openEventForAdd(date) {
  if (!state.isAdmin) return;
  setEventFormReadOnly(false);
  el.eventModalTitle.textContent = 'Tambah Program';
  el.eventId.value = ''; el.eventDate.value = date; el.eventTime.value = ''; el.eventTitle.value = '';
  el.eventPlace.value = ''; el.eventCategory.value = 'Akademik'; el.eventNotes.value = '';
  el.deleteEventBtn.classList.add('hidden'); el.saveEventBtn.classList.remove('hidden'); el.saveEventBtn.textContent = 'Simpan Program';
  openModal('event'); setTimeout(() => el.eventTitle.focus(), 60);
}

function openEventById(id) {
  const event = state.events.find(e => e.id === id); if (!event) return;
  el.eventId.value = event.id; el.eventDate.value = event.date; el.eventTime.value = event.time; el.eventTitle.value = event.title;
  el.eventPlace.value = event.place; el.eventCategory.value = event.category; el.eventNotes.value = event.notes;
  if (state.isAdmin) {
    setEventFormReadOnly(false); el.eventModalTitle.textContent = 'Sunting Program';
    el.saveEventBtn.classList.remove('hidden'); el.deleteEventBtn.classList.remove('hidden'); el.saveEventBtn.textContent = 'Simpan Perubahan';
  } else {
    setEventFormReadOnly(true); el.eventModalTitle.textContent = 'Maklumat Program'; el.saveEventBtn.classList.add('hidden'); el.deleteEventBtn.classList.add('hidden');
  }
  openModal('event');
}
function setEventFormReadOnly(readOnly) { [el.eventDate,el.eventTime,el.eventTitle,el.eventPlace,el.eventCategory,el.eventNotes].forEach(x => x.disabled = readOnly); }

async function saveEvent(e) {
  e.preventDefault(); if (!state.isAdmin) return;
  const payload = {
    action: el.eventId.value ? 'updateProgram' : 'addProgram', token: state.token, id: el.eventId.value,
    date: el.eventDate.value, title: el.eventTitle.value.trim(), time: el.eventTime.value.trim(),
    place: el.eventPlace.value.trim(), category: el.eventCategory.value, notes: el.eventNotes.value.trim()
  };
  if (!payload.title || !payload.date) return showToast('Tarikh dan nama program diperlukan.', 'error');
  setLoading(true, payload.action === 'addProgram' ? 'Menyimpan program...' : 'Mengemas kini program...');
  try {
    const result = await postApi(payload); if (!result.success) throw new Error(result.message || 'Operasi gagal.');
    closeModal('event'); showToast(payload.action === 'addProgram' ? 'Program berjaya ditambah.' : 'Program berjaya dikemas kini.', 'success');
    await loadEvents({ preferApi: true });
  } catch (err) {
    if (/token|sesi|session/i.test(err.message)) logoutAdmin();
    showToast(err.message || 'Gagal menyimpan program.', 'error');
  } finally { setLoading(false); }
}

async function deleteEvent() {
  if (!state.isAdmin || !el.eventId.value) return;
  if (!confirm('Adakah anda pasti mahu memadam program ini?')) return;
  setLoading(true, 'Memadam program...');
  try {
    const result = await postApi({ action: 'deleteProgram', token: state.token, id: el.eventId.value });
    if (!result.success) throw new Error(result.message || 'Gagal memadam program.');
    closeModal('event'); showToast('Program berjaya dipadam.', 'success'); await loadEvents({ preferApi: true });
  } catch (err) { showToast(err.message || 'Gagal memadam program.', 'error'); }
  finally { setLoading(false); }
}

function dateParts(date) { const [year,month,day] = String(date).split('-').map(Number); return { year, month, day }; }
function openModal(name) { ({ login: el.loginModal, event: el.eventModal, holiday: el.holidayModal, holidayEdit: el.holidayEditModal, quickAdd: el.quickAddModal, summaryChoice: el.summaryChoiceModal, summaryResult: el.summaryResultModal })[name]?.classList.remove('hidden'); }
function closeModal(name) { ({ login: el.loginModal, event: el.eventModal, holiday: el.holidayModal, holidayEdit: el.holidayEditModal, quickAdd: el.quickAddModal, summaryChoice: el.summaryChoiceModal, summaryResult: el.summaryResultModal })[name]?.classList.add('hidden'); }

async function postApi(payload) {
  if (!isApiConfigured()) throw new Error('URL Apps Script belum dikonfigurasi.');
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow'
  });
  const data = safeJson(await res.text());
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}
function safeJson(text) { try { return JSON.parse(text); } catch (_) { throw new Error('Respons Apps Script bukan JSON yang sah. Pastikan deployment Web App betul.'); } }
function isApiConfigured() { return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/.test(CONFIG.APPS_SCRIPT_URL); }
function setLoading(show, text='Memuatkan...') { el.loadingText.textContent = text; el.loadingOverlay.classList.toggle('hidden', !show); }
function showToast(message, type='') {
  clearTimeout(toastTimer); el.toast.textContent = message; el.toast.className = `toast ${type}`.trim(); el.toast.classList.remove('hidden');
  toastTimer = setTimeout(() => el.toast.classList.add('hidden'), 4200);
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
