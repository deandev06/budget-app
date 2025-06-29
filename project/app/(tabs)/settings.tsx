import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { User, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Download, Share, Settings as SettingsIcon, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 24,
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    profileCard: {
      marginBottom: 24,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    userName: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    settingAction: {
      marginLeft: 16,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    themeToggleContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    signOutButton: {
      marginTop: 24,
      backgroundColor: '#EF4444',
      borderWidth: 0,
    },
    signOutButtonText: {
      color: '#FFFFFF',
    },
  });

  const handleSettingPress = (setting: string) => {
    Alert.alert('Coming Soon', `${setting} feature will be available in the next update!`);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={100}>
          <Card style={styles.profileCard}>
            <View style={styles.avatar}>
              <User size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.userName}>
              {user?.user_metadata?.username || 'User'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </Card>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.themeToggleContainer}>
              <View style={styles.themeToggleContent}>
                <View style={styles.settingIcon}>
                  <SettingsIcon size={24} color={theme.colors.text} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingDescription}>
                    Switch between light and dark mode
                  </Text>
                </View>
              </View>
              <ThemeToggle />
            </View>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Profile')}
            >
              <View style={styles.settingIcon}>
                <User size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Profile</Text>
                <Text style={styles.settingDescription}>Manage your personal information</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Notifications')}
            >
              <View style={styles.settingIcon}>
                <Bell size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Budget alerts and reminders</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Privacy')}
            >
              <View style={styles.settingIcon}>
                <Shield size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy & Security</Text>
                <Text style={styles.settingDescription}>Data protection and security settings</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Export Data')}
            >
              <View style={styles.settingIcon}>
                <Download size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Export Data</Text>
                <Text style={styles.settingDescription}>Download your financial data</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Share App')}
            >
              <View style={styles.settingIcon}>
                <Share size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Share App</Text>
                <Text style={styles.settingDescription}>Invite friends to use the app</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSettingPress('Help')}
            >
              <View style={styles.settingIcon}>
                <HelpCircle size={24} color={theme.colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get help and contact support</Text>
              </View>
              <View style={styles.settingAction}>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={600}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            style={styles.signOutButton}
            textStyle={styles.signOutButtonText}
          />
        </FadeInAnimation>
      </ScrollView>
    </SafeAreaView>
  );
}