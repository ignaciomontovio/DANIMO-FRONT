import { URL_AUTH, URL_BASE } from '@/stores/consts';
import { useUserLogInStore } from '@/stores/userLogIn';
import { useEffect, useState } from 'react';

export const useTermsAndConditions = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  
  const token = useUserLogInStore((state) => state.token);
  const userType = useUserLogInStore((state) => state.userType);
  const userLogIn = useUserLogInStore((state) => state.userLogIn);

  useEffect(() => {
    if (userType === 'usuario' && userLogIn && token) {
      checkTermsStatusFromBackend();
    }
  }, [token, userType, userLogIn]);

  const checkTermsStatusFromBackend = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const backendAccepted = userData.hasAcceptedTerms;
        
        if (backendAccepted) {
          setHasAcceptedTerms(true);
          setShowTermsModal(false);
        } else {
          setHasAcceptedTerms(false);
          setIsReadOnlyMode(false);
          setShowTermsModal(true);
        }
      } else {
        console.error('Error fetching profile:', response.status);
        checkTermsStatusFromLocal();
      }
    } catch (error) {
      console.error('Error in checkTermsStatusFromBackend:', error);
      checkTermsStatusFromLocal();
    }
  };

  const checkTermsStatusFromLocal = async () => {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    
    try {
      const acceptedTerms = await AsyncStorage.default.getItem('termsAccepted');
      
      if (acceptedTerms) {
        setHasAcceptedTerms(true);
        setShowTermsModal(false);
      } else {
        setHasAcceptedTerms(false);
        setIsReadOnlyMode(false);
        setShowTermsModal(true);
      }
    } catch (error) {
      console.error('Error checking local terms:', error);
      setShowTermsModal(true);
      setIsReadOnlyMode(false);
    }
  };

  const handleAcceptTerms = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(URL_BASE + URL_AUTH + '/acceptTerms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        setHasAcceptedTerms(true);
        setShowTermsModal(false);
        
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem('termsAccepted', 'true');
        await AsyncStorage.default.setItem('termsAcceptedDate', new Date().toISOString());
        
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to accept terms');
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
      
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('termsAccepted', 'true');
      await AsyncStorage.default.setItem('termsAcceptedDate', new Date().toISOString());
      
      setHasAcceptedTerms(true);
      setShowTermsModal(false);
      
      alert('Términos guardados localmente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
  };

  const showTermsManually = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const currentAcceptedStatus = userData.hasAcceptedTerms;
        
        setHasAcceptedTerms(currentAcceptedStatus);
        setIsReadOnlyMode(currentAcceptedStatus);
        setShowTermsModal(true);
      }
    } catch (error) {
      console.error('Error in showTermsManually:', error);
    }
  };

  return {
    showTermsModal,
    hasAcceptedTerms,
    loading,
    isReadOnlyMode,
    handleAcceptTerms,
    handleCloseModal,
    showTermsManually,
  };
};