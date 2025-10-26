import { useState, useEffect } from 'react';
import { Site, ControlAction, SyncStatus } from '@types';
import { queueAction, isOnline, setupNetworkListeners } from '@lib/utils/offline';
import { apiClient } from '@lib/api/client';

/**
 * Hook for fetching and managing site data
 * Handles offline queueing and sync status
 */
export function useSiteData(siteId = 'site_123') {
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: isOnline() ? 'synced' : 'offline',
  });

  useEffect(() => {
    fetchSiteData();

    // Set up network status listeners
    const cleanup = setupNetworkListeners(
      () => {
        setSyncStatus({ status: 'synced' });
        fetchSiteData(); // Retry when back online
      },
      () => {
        setSyncStatus({ status: 'offline' });
      }
    );

    // Refresh data every 10 seconds
    const interval = setInterval(() => {
      if (isOnline()) {
        fetchSiteData();
      }
    }, 10000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [siteId]);

  const fetchSiteData = async () => {
    try {
      setSyncStatus((prev) => ({ ...prev, status: 'syncing' }));
      const data = await apiClient.getSiteSummary(siteId);
      setSite(data);
      setSyncStatus({
        status: 'synced',
        lastSyncTime: new Date().toISOString(),
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
      setSyncStatus({ status: 'stale' });
    } finally {
      setIsLoading(false);
    }
  };

  const performAction = async (action: ControlAction) => {
    if (!isOnline()) {
      // Queue for later
      await queueAction(action);
      setSyncStatus((prev) => ({
        ...prev,
        pendingActions: (prev.pendingActions || 0) + 1,
      }));
      return;
    }

    await apiClient.performAction(siteId, action);
    await fetchSiteData(); // Refresh after action
  };

  return {
    site,
    isLoading,
    error,
    syncStatus,
    performAction,
    refetch: fetchSiteData,
  };
}
