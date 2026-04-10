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
    logoSection: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 30,
      backgroundColor: `${theme.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    appSlogan: {
      fontSize: 15,
      marginBottom: 16,
    },
    versionBadge: {
      backgroundColor: `${theme.accent}15`,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    versionText: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: '600',
    },
    introCard: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    introText: {
      fontSize: 15,
      lineHeight: 24,
      textAlign: 'center',
    },
    featuresSection: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    featureIcon: {
      width: 56,
      height: 56,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 13,
      lineHeight: 18,
    },
    policiesSection: {
      marginBottom: 32,
    },
    policyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    policyIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    policyText: {
      flex: 1,
      fontSize: 15,
    },
    socialSection: {
      marginBottom: 32,
    },
    socialLinks: {
      flexDirection: 'row',
      gap: 12,
    },
    socialLink: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    socialLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
    footer: {
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerText: {
      fontSize: 12,
      marginBottom: 8,
    },
  });
};
