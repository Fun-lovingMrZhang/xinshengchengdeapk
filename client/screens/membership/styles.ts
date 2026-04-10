import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createStyles = (theme: any) => {
  return StyleSheet.create({
    scrollContent: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
    },
    membershipCard: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -1,
      right: -1,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderBottomLeftRadius: 12,
      borderTopRightRadius: 16,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    tierName: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    tierDuration: {
      fontSize: 13,
    },
    tierPrice: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    featureList: {
      marginBottom: 20,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureText: {
      fontSize: 14,
      marginLeft: 12,
      lineHeight: 20,
    },
    subscribeButton: {
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledButton: {
      opacity: 0.5,
    },
    subscribeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    featuresSection: {
      marginTop: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -8,
    },
    featureCard: {
      width: (width - 48) / 2,
      marginHorizontal: 8,
      marginBottom: 16,
      alignItems: 'center',
      paddingVertical: 24,
      borderRadius: 16,
    },
    featureIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
    faqSection: {
      marginTop: 32,
    },
    faqItem: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 8,
    },
    faqAnswer: {
      fontSize: 13,
      lineHeight: 18,
    },
  });
};
