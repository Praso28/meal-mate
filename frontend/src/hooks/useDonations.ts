import { useState, useEffect, useCallback } from 'react';
import { Donation, getDonations, createDonation, updateDonation, deleteDonation, assignVolunteer, completeDonation, CreateDonationData } from '../services/donations';

interface UseDonationsReturn {
  donations: Donation[];
  loading: boolean;
  error: Error | null;
  fetchDonations: (status?: string) => Promise<void>;
  createNewDonation: (data: CreateDonationData) => Promise<Donation>;
  updateExistingDonation: (id: number, data: Partial<CreateDonationData>) => Promise<Donation>;
  removeExistingDonation: (id: number) => Promise<void>;
  assignVolunteerToDonation: (id: number) => Promise<Donation>;
  completeDonationDelivery: (id: number) => Promise<Donation>;
}

export const useDonations = (): UseDonationsReturn => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDonations = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDonations(status);
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewDonation = async (data: CreateDonationData): Promise<Donation> => {
    setLoading(true);
    try {
      const newDonation = await createDonation(data);
      setDonations((prev) => [...prev, newDonation]);
      return newDonation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create donation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingDonation = async (id: number, data: Partial<CreateDonationData>): Promise<Donation> => {
    setLoading(true);
    try {
      const updatedDonation = await updateDonation(id, data);
      setDonations((prev) =>
        prev.map((donation) => (donation.id === id ? updatedDonation : donation))
      );
      return updatedDonation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update donation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeExistingDonation = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await deleteDonation(id);
      setDonations((prev) => prev.filter((donation) => donation.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete donation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignVolunteerToDonation = async (id: number): Promise<Donation> => {
    setLoading(true);
    try {
      const updatedDonation = await assignVolunteer(id);
      setDonations((prev) =>
        prev.map((donation) => (donation.id === id ? updatedDonation : donation))
      );
      return updatedDonation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to assign volunteer'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeDonationDelivery = async (id: number): Promise<Donation> => {
    setLoading(true);
    try {
      const updatedDonation = await completeDonation(id);
      setDonations((prev) =>
        prev.map((donation) => (donation.id === id ? updatedDonation : donation))
      );
      return updatedDonation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete donation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return {
    donations,
    loading,
    error,
    fetchDonations,
    createNewDonation,
    updateExistingDonation,
    removeExistingDonation,
    assignVolunteerToDonation,
    completeDonationDelivery,
  };
};
