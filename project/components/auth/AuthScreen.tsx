import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FadeInAnimation } from '@/components/animations/FadeIn';
import { User, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const countries = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
];

export function AuthScreen() {
  const { theme } = useTheme();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!username.trim()) {
        newErrors.username = 'Username is required';
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (!country) {
        newErrors.country = 'Please select your country';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      let result;
      if (isLogin) {
        result = await signIn(email.trim(), password);
      } else {
        const selectedCountry = countries.find(c => c.code === country);
        result = await signUp(
          email.trim(), 
          password, 
          username.trim(), 
          selectedCountry?.name, 
          selectedCountry?.currency
        );
      }

      if (result.error) {
        const errorMessage = result.error.message || 'An error occurred';
        Alert.alert('Error', errorMessage);
      } else if (!isLogin) {
        Alert.alert(
          'Success', 
          'Account created successfully! You can now sign in.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setPassword('');
                setUsername('');
              }
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries.find(c => c.code === country);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    inputWrapperError: {
      borderColor: theme.colors.error,
    },
    inputIcon: {
      paddingLeft: 16,
    },
    input: {
      flex: 1,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    passwordToggle: {
      paddingRight: 16,
    },
    countrySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    countryText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      flex: 1,
      marginLeft: 12,
    },
    countryPicker: {
      maxHeight: 200,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      marginTop: 8,
    },
    countryOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    countryOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      marginLeft: 12,
    },
    currencyBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginLeft: 'auto',
    },
    currencyText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
    },
    errorText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.error,
      marginTop: 4,
    },
    submitButton: {
      marginTop: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    switchText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    switchButton: {
      marginLeft: 4,
    },
    switchButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.primary,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInAnimation direction="down" delay={0}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <User size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Sign in to continue managing your budget' 
                : 'Join us to start tracking your finances'
              }
            </Text>
          </View>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={200}>
          <Card style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={[
                  styles.inputWrapper,
                  errors.username && styles.inputWrapperError
                ]}>
                  <View style={styles.inputIcon}>
                    <User size={20} color={theme.colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrapper,
                errors.email && styles.inputWrapperError
              ]}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={theme.colors.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputWrapper,
                errors.password && styles.inputWrapperError
              ]}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color={theme.colors.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Country & Currency</Text>
                <View style={[
                  styles.inputWrapper,
                  errors.country && styles.inputWrapperError
                ]}>
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                  >
                    <Globe size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.countryText}>
                      {selectedCountry ? `${selectedCountry.name} (${selectedCountry.symbol})` : 'Select your country'}
                    </Text>
                    <View style={styles.currencyBadge}>
                      <Text style={styles.currencyText}>
                        {selectedCountry?.currency || 'USD'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {showCountryPicker && (
                  <ScrollView style={styles.countryPicker} nestedScrollEnabled>
                    {countries.map((countryOption) => (
                      <TouchableOpacity
                        key={countryOption.code}
                        style={styles.countryOption}
                        onPress={() => {
                          setCountry(countryOption.code);
                          setShowCountryPicker(false);
                        }}
                      >
                        <Globe size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.countryOptionText}>
                          {countryOption.name}
                        </Text>
                        <View style={styles.currencyBadge}>
                          <Text style={styles.currencyText}>
                            {countryOption.currency}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
                {errors.country && (
                  <Text style={styles.errorText}>{errors.country}</Text>
                )}
              </View>
            )}

            <Button
              title={loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            />
          </Card>
        </FadeInAnimation>

        <FadeInAnimation direction="up" delay={400}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setPassword('');
                setUsername('');
                setShowCountryPicker(false);
              }}
            >
              <Text style={styles.switchButtonText}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInAnimation>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}