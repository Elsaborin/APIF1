import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const VALID_GRID_NUMBERS = new Set([
  1, 3, 4, 5, 10, 11, 12, 14, 16, 18, 22, 23, 27, 30, 31, 41, 43, 44, 55, 63, 77, 81, 87
]);

const DRIVER_NAMES_MAP = {
  1: 'Lando Norris',
  3: 'Max Verstappen',
  5: 'Gabriel Bortoleto',
  10: 'Pierre Gasly',
  11: 'Sergio Perez',
  12: 'Kimi Antonelli',
  14: 'Fernando Alonso',
  16: 'Charles Leclerc',
  18: 'Lance Stroll',
  22: 'Yuki Tsunoda',
  23: 'Alexander Albon',
  27: 'Nico Hulkenberg',
  30: 'Liam Lawson',
  31: 'Esteban Ocon',
  41: 'Arvid Lindblad',
  43: 'Franco Colapinto',
  44: 'Lewis Hamilton',
  55: 'Carlos Sainz',
  63: 'George Russell',
  77: 'Valtteri Bottas',
  81: 'Oscar Piastri',
  87: 'Oliver Bearman',
};

const COUNTRY_MAP = {
  1: { country: 'Reino Unido', code: 'GBR' },
  3: { country: 'Países Bajos', code: 'NED' },
  5: { country: 'Brasil', code: 'BRA' },
  10: { country: 'Francia', code: 'FRA' },
  11: { country: 'México', code: 'MEX' },
  12: { country: 'Italia', code: 'ITA' },
  14: { country: 'España', code: 'ESP' },
  16: { country: 'Mónaco', code: 'MON' },
  18: { country: 'Canadá', code: 'CAN' },
  22: { country: 'Japón', code: 'JPN' },
  23: { country: 'Tailandia', code: 'THA' },
  27: { country: 'Alemania', code: 'GER' },
  30: { country: 'Nueva Zelanda', code: 'NZL' },
  31: { country: 'Francia', code: 'FRA' },
  41: { country: 'Reino Unido', code: 'GBR' },
  43: { country: 'Argentina', code: 'ARG' },
  44: { country: 'Reino Unido', code: 'GBR' },
  55: { country: 'España', code: 'ESP' },
  63: { country: 'Reino Unido', code: 'GBR' },
  77: { country: 'Finlandia', code: 'FIN' },
  81: { country: 'Australia', code: 'AUS' },
  87: { country: 'Reino Unido', code: 'GBR' },
};

// In-Memory Cache to prevent HTTP 429 Rate Limiting
let cachedDrivers = null;
let cachedTeams = null;
let lastDriversFetchTime = 0;
let lastTeamsFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetch 100% real driver standings from OpenF1 API with rate-limit protection and caching
 */
export const fetchDrivers = async (sessionKey = 'latest', forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedDrivers && now - lastDriversFetchTime < CACHE_TTL) {
    return cachedDrivers;
  }

  try {
    const [champRes, driversRes] = await Promise.all([
      api.get('/championship_drivers', { params: { session_key: sessionKey } }).catch(() => ({ data: [] })),
      api.get('/drivers', { params: { session_key: sessionKey } }).catch(() => ({ data: [] })),
    ]);

    const champData = Array.isArray(champRes.data) ? champRes.data : [];
    const driversData = Array.isArray(driversRes.data) ? driversRes.data : [];

    const profileMap = new Map();
    driversData.forEach((d) => {
      const num = Number(d.driver_number);
      if (num && !profileMap.has(num)) {
        profileMap.set(num, d);
      }
    });

    const driversList = [];
    const processedNumbers = new Set();

    champData.forEach((c) => {
      const num = Number(c.driver_number);
      if (num && VALID_GRID_NUMBERS.has(num) && !processedNumbers.has(num)) {
        processedNumbers.add(num);

        const profile = profileMap.get(num) || {};
        const knownName = DRIVER_NAMES_MAP[num];
        const fullName = knownName || profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        const countryInfo = COUNTRY_MAP[num] || { country: profile.country_code || 'F1', code: profile.country_code || '' };

        driversList.push({
          id: String(num),
          number: num,
          name: profile.name_acronym || profile.last_name || fullName,
          full_name: fullName,
          team: profile.team_name || 'Fórmula 1',
          country: countryInfo.country,
          country_code: countryInfo.code,
          headshot_url: profile.headshot_url || null,
          team_colour: profile.team_colour ? `#${profile.team_colour}` : null,
          points: c.points_current ?? 0,
          pos: c.position_current ?? driversList.length + 1,
          points_start: c.points_start ?? 0,
          position_start: c.position_start ?? 0,
          meeting_key: c.meeting_key || null,
          session_key: c.session_key || null,
        });
      }
    });

    if (driversList.length > 0) {
      cachedDrivers = driversList.sort((a, b) => a.pos - b.pos);
      lastDriversFetchTime = now;
      return cachedDrivers;
    }

    if (cachedDrivers) return cachedDrivers;
    return [];
  } catch (error) {
    if (cachedDrivers) return cachedDrivers;
    return [];
  }
};

/**
 * Fetch 100% real team standings directly from OpenF1 /championship_teams endpoint with caching
 */
export const fetchTeams = async (sessionKey = 'latest', forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedTeams && now - lastTeamsFetchTime < CACHE_TTL) {
    return cachedTeams;
  }

  try {
    const response = await api.get('/championship_teams', {
      params: { session_key: sessionKey },
    }).catch(() => ({ data: [] }));

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const processedTeams = new Set();
      const teamsList = [];

      response.data.forEach((t) => {
        const tName = t.team_name;
        if (tName && !processedTeams.has(tName)) {
          processedTeams.add(tName);
          teamsList.push({
            id: `team-${tName.toLowerCase().replace(/\s+/g, '-')}`,
            name: tName,
            country: 'Fórmula 1',
            location: tName,
            points: t.points_current ?? 0,
            pos: t.position_current ?? teamsList.length + 1,
            points_start: t.points_start ?? 0,
            position_start: t.position_start ?? 0,
            meeting_key: t.meeting_key || null,
            session_key: t.session_key || null,
          });
        }
      });

      cachedTeams = teamsList.sort((a, b) => a.pos - b.pos);
      lastTeamsFetchTime = now;
      return cachedTeams;
    }

    if (cachedTeams) return cachedTeams;
    return [];
  } catch (error) {
    if (cachedTeams) return cachedTeams;
    return [];
  }
};

export const fetchTeamsFromDrivers = (drivers) => {
  if (!drivers || !Array.isArray(drivers)) return [];
  const teamMap = new Map();

  drivers.forEach((d) => {
    const tName = d.team || 'Otros';
    if (!teamMap.has(tName)) {
      teamMap.set(tName, {
        id: `team-${tName.toLowerCase().replace(/\s+/g, '-')}`,
        name: tName,
        country: d.country || 'Fórmula 1',
        location: d.country || tName,
        points: 0,
        pos: 1,
        points_start: 0,
        position_start: 1,
      });
    }

    const tObj = teamMap.get(tName);
    tObj.points += d.points || 0;
    tObj.points_start += d.points_start || 0;
  });

  return Array.from(teamMap.values())
    .sort((a, b) => b.points - a.points)
    .map((t, index) => ({ ...t, pos: index + 1 }));
};

export const fetchSessions = async (year = 2024) => {
  try {
    const response = await api.get('/sessions', { params: { year } });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export default api;
