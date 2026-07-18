import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { FormField } from '@/components/FormField';
import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <View className="px-6">
          <View className="items-center mb-10">
            <Logo size={40} />
            <Text className="font-heading text-ink text-[13px] uppercase tracking-[3px] mt-3">Anazone Ops</Text>
            <Text className="font-body text-muted text-sm mt-1">Internal ops for Anazone Strength Labs</Text>
          </View>

          <Text className="font-heading text-ink text-xl uppercase tracking-wide mb-5">Sign In</Text>

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@anazone.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          {error && <Text className="font-body text-pink text-sm mb-4">{error}</Text>}

          <PrimaryButton label={submitting ? 'Signing In…' : 'Sign In'} onPress={submit} disabled={!canSubmit} />

          <Link href="/(auth)/signup" asChild>
            <Text className="font-body text-muted text-sm text-center mt-6" style={{ color: colors.muted }}>
              New here? <Text style={{ color: colors.cyan }}>Create an account</Text>
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
