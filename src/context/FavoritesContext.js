import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

const STORAGE_KEY = '@f1_favorites_v1';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState({ drivers: [], teams: [] });

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  };

  const saveFavorites = async (newFavs) => {
    try {
      setFavorites(newFavs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  };

  const toggleFavoriteDriver = (driverId) => {
    const isFav = favorites.drivers.includes(driverId);
    const updatedDrivers = isFav
      ? favorites.drivers.filter(id => id !== driverId)
      : [...favorites.drivers, driverId];
    
    const newFavs = { ...favorites, drivers: updatedDrivers };
    saveFavorites(newFavs);
  };

  const toggleFavoriteTeam = (teamId) => {
    const isFav = favorites.teams.includes(teamId);
    const updatedTeams = isFav
      ? favorites.teams.filter(id => id !== teamId)
      : [...favorites.teams, teamId];

    const newFavs = { ...favorites, teams: updatedTeams };
    saveFavorites(newFavs);
  };

  const isFavoriteDriver = (driverId) => favorites.drivers.includes(driverId);
  const isFavoriteTeam = (teamId) => favorites.teams.includes(teamId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavoriteDriver,
        toggleFavoriteTeam,
        isFavoriteDriver,
        isFavoriteTeam,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
