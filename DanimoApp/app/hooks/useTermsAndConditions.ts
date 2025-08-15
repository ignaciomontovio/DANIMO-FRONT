import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useTermsAndConditions = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    checkTermsStatus();
  }, []);

  const checkTermsStatus = async () => {
    try {
      const acceptedTerms = await AsyncStorage.getItem('termsAccepted');
      const reminderDismissed = await AsyncStorage.getItem('termsReminderDismissed');
      const dismissedDate = await AsyncStorage.getItem('termsDismissedDate');
      
      if (acceptedTerms) {
        setHasAcceptedTerms(true);
      } else {
        if (!reminderDismissed || shouldShowReminderAgain(dismissedDate)) {
          setShowTermsModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking terms status:', error);
    }
  };

  const shouldShowReminderAgain = (dismissedDate: string | null): boolean => {
    if (!dismissedDate) return true;
    
    const dismissed = new Date(dismissedDate);
    const now = new Date();
    const daysDiff = (now.getTime() - dismissed.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff >= 7;
  };

  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem('termsAccepted', 'true');
      await AsyncStorage.setItem('termsAcceptedDate', new Date().toISOString());
      await AsyncStorage.removeItem('termsReminderDismissed');
      await AsyncStorage.removeItem('termsDismissedDate');
      
      setHasAcceptedTerms(true);
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  const handleRemindLater = async () => {
    try {
      await AsyncStorage.setItem('termsReminderDismissed', 'true');
      await AsyncStorage.setItem('termsDismissedDate', new Date().toISOString());
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error setting reminder:', error);
    }
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
  };

  return {
    showTermsModal,
    hasAcceptedTerms,
    handleAcceptTerms,
    handleRemindLater,
    handleCloseModal
  };
};