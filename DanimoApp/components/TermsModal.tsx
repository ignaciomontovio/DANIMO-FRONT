import { colors } from '@/stores/colors';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TermsModalProps {
  isVisible: boolean;
  onAccept: () => void;
  onRemindLater: () => void;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ 
  isVisible, 
  onAccept, 
  onRemindLater, 
  onClose 
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Términos y Condiciones</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.termsText}>
              Al utilizar nuestra plataforma médica Danimo, usted acepta los siguientes términos y condiciones:
              {'\n\n'}
              <Text style={styles.sectionTitle}>1. Uso de la Plataforma</Text>
              {'\n'}
              Esta aplicación está diseñada para ayudar en el seguimiento de su bienestar y rutinas de salud. No sustituye el consejo médico profesional.
              {'\n\n'}
              <Text style={styles.sectionTitle}>2. Privacidad de Datos</Text>
              {'\n'}
              Sus datos de salud son tratados con la máxima confidencialidad y seguridad, cumpliendo con todas las normativas vigentes.
              {'\n\n'}
              <Text style={styles.sectionTitle}>3. Responsabilidades del Usuario</Text>
              {'\n'}
              Usted es responsable de mantener la precisión de la información ingresada y de consultar con profesionales de la salud cuando sea necesario.
              {'\n\n'}
              <Text style={styles.sectionTitle}>4. Actualizaciones</Text>
              {'\n'}
              Nos reservamos el derecho de actualizar estos términos. Le notificaremos sobre cambios significativos.
              {'\n\n'}
              Para más información, contacte con nuestro equipo de soporte.
            </Text>
          </ScrollView>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={onRemindLater}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Recordar más tarde</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>Acepto los términos</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.reminderInfo}>
            Si no aceptas ahora, te recordaremos en 7 días
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(89, 81, 84, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.fondo,
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    maxHeight: '85%',
    alignSelf: 'center',
    shadowColor: colors.oscuro,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.color4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.oscuro,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.color4,
  },
  closeText: {
    fontSize: 18,
    color: colors.oscuro,
    fontWeight: '500',
  },
  content: {
    maxHeight: 350,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  termsText: {
    lineHeight: 24,
    color: colors.oscuro,
    fontSize: 15,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.oscuro,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.color4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.oscuro,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    color: colors.fondo,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.color4,
    minHeight: 50,
  },
  secondaryButtonText: {
    color: colors.oscuro,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  reminderInfo: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.oscuro,
    paddingHorizontal: 24,
    paddingBottom: 24,
    opacity: 0.7,
  },
});

export default TermsModal;