import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch 100% real driver standings and details from OpenF1 API
 */
export const fetchDrivers = async (sessionKey = 'latest') => {
  try {
    const [champRes, driversRes] = await Promise.all([
      api.get('/championship_drivers', { params: { session_key: sessionKey } }),
      api.get('/drivers', { params: { session_key: sessionKey } }),
    ]);

    const champData = Array.isArray(champRes.data) ? champRes.data : [];
    const driversData = Array.isArray(driversRes.data) ? driversRes.data : [];

    // Map driver profiles by driver_number
    const profileMap = new Map();
    driversData.forEach((d) => {
      const num = Number(d.driver_number);
      if (num && !profileMap.has(num)) {
        profileMap.set(num, d);
      }
    });

    // Merge championship points/positions with driver profiles
    const driversList = [];
    const processedNumbers = new Set();

    champData.forEach((c) => {
      const num = Number(c.driver_number);
      if (num && !processedNumbers.has(num)) {
        processedNumbers.add(num);

        const profile = profileMap.get(num) || {};
        const fullName = profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || `Piloto #${num}`;

        driversList.push({
          id: String(num),
          number: num,
          name: profile.name_acronym || profile.last_name || fullName,
          full_name: fullName,
          team: profile.team_name || 'Fórmula 1',
          country: profile.country_code || 'F1',
          country_code: profile.country_code || '',
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

    // Fallback if championship_drivers returns empty: map directly from /drivers
    if (driversList.length === 0) {
      driversData.forEach((d) => {
        const num = Number(d.driver_number);
        if (num && !processedNumbers.has(num)) {
          processedNumbers.add(num);
          const fullName = d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim() || `Piloto #${num}`;
          driversList.push({
            id: String(num),
            number: num,
            name: d.name_acronym || d.last_name || fullName,
            full_name: fullName,
            team: d.team_name || 'Fórmula 1',
            country: d.country_code || 'F1',
            country_code: d.country_code || '',
            headshot_url: d.headshot_url || null,
            team_colour: d.team_colour ? `#${d.team_colour}` : null,
            points: 0,
            pos: driversList.length + 1,
            points_start: 0,
            position_start: 0,
            meeting_key: d.meeting_key || null,
            session_key: d.session_key || null,
          });
        }
      });
    }

    return driversList.sort((a, b) => a.pos - b.pos);
  } catch (error) {
    console.warn('OpenF1 API fetchDrivers error:', error.message);
    throw error;
  }
};

/**
 * Fetch 100% real team standings directly from OpenF1 /championship_teams endpoint
 */
export const fetchTeams = async (sessionKey = 'latest') => {
  try {
    const response = await api.get('/championship_teams', {
      params: { session_key: sessionKey },
    });

    if (response.data && Array.isArray(response.data)) {
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

      return teamsList.sort((a, b) => a.pos - b.pos);
    }
    return [];
  } catch (error) {
    console.warn('OpenF1 API fetchTeams error:', error.message);
    return [];
  }
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
