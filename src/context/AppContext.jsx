import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbClient } from '../db/dbClient';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [publishedConfig, setPublishedConfig] = useState(null);
  const [draftConfig, setDraftConfig] = useState(null);
  const [publishedPhotos, setPublishedPhotos] = useState([]);
  const [draftPhotos, setDraftPhotos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [previewSize, setPreviewSize] = useState('mobile'); // 'mobile', 'tablet', 'desktop'

  // Fetch configs and photos
  const refreshData = useCallback(async () => {
    try {
      const [pubConfig, drfConfig, pubPhotos, drfPhotos, user] = await Promise.all([
        dbClient.config.get('published'),
        dbClient.config.get('draft'),
        dbClient.photos.list('published'),
        dbClient.photos.list('draft'),
        dbClient.auth.getUser()
      ]);

      setPublishedConfig(pubConfig);
      setDraftConfig(drfConfig);
      setPublishedPhotos(pubPhotos);
      setDraftPhotos(drfPhotos);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error refreshing AppContext data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Update a section in draft configuration
  const updateDraft = async (section, data) => {
    setLoading(true);
    try {
      await dbClient.config.update(section, data);
      await refreshData();
    } catch (error) {
      console.error(`Error updating draft section ${section}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Publish draft configuration
  const publishChanges = async () => {
    setLoading(true);
    try {
      const email = currentUser?.email || 'admin@nestorypame.com';
      await dbClient.config.publish(email);
      await refreshData();
    } catch (error) {
      console.error('Error publishing configuration:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Authentication actions
  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await dbClient.auth.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await dbClient.auth.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // RSVP Form Action
  const submitRSVP = async (rsvpData) => {
    try {
      const result = await dbClient.confirmations.add(rsvpData);
      return result;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      throw error;
    }
  };

  // Song Suggester Action
  const submitSong = async (songData) => {
    try {
      const result = await dbClient.songs.add(songData);
      return result;
    } catch (error) {
      console.error('Error suggesting song:', error);
      throw error;
    }
  };

  // Derived current configuration (shows draft if in preview, otherwise published)
  const currentConfig = isPreview ? draftConfig : publishedConfig;
  const currentPhotos = isPreview ? draftPhotos : publishedPhotos;

  return (
    <AppContext.Provider
      value={{
        publishedConfig,
        draftConfig,
        publishedPhotos,
        draftPhotos,
        currentConfig,
        currentPhotos,
        currentUser,
        loading,
        isPreview,
        previewSize,
        setIsPreview,
        setPreviewSize,
        refreshData,
        updateDraft,
        publishChanges,
        login,
        logout,
        submitRSVP,
        submitSong
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
