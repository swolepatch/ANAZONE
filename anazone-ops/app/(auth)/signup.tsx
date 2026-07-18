import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { CategoryPicker } from '@/components/CategoryPicker';
import { FormField } from '@/components/FormField';
import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { STAFF_ROLES, type StaffRole } from '@/data/types';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

export default function SignupScreen() {
  const signUp = useAuthStore((s) => s.signUp);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('Coach');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && password.length >= 6 && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const { error: signUpError } = await signUp(email.trim(), password, name.trim(), role);
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <View className="px-6 py-10">
          <View className="items-center mb-8">
            <Logo size={40} />
            <Text className="font-heading text-ink text-[13px] uppercase tracking-[3px] mt-3">Anazone Ops</Text>
          </View>

          <Text className="font-heading text-ink text-xl uppercase tracking-wide mb-5">Create Account</Text>

          <FormField label="Name" value={name} onChangeText={setName} placeholder="e.g. Jess Tremblay" autoFocus />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@anazone.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
          />
          <CategoryPicker options={STAFF_ROLES} value={role} onChange={setRole} label="Role" />

          {error && <Text className="font-body text-pink text-sm mb-4">{error}</Text>}

          <PrimaryButton label={submitting ? 'Creating…' : 'Create Account'} onPress={submit} disabled={!canSubmit} />

          <Link href="/(auth)/login" asChild>
            <Text className="font-body text-muted text-sm text-center mt-6" style={{ color: colors.muted }}>
              Already have an account? <Text style={{ color: colors.cyan }}>Sign in</Text>
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
