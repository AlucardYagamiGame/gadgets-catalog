import { useEffect, useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { Modal } from '@/components/molecules/Modal';
import { AUTH_RULES } from '@/constants';
import { useAuthForm, useTranslation } from '@/hooks';
import { signOut } from '@/services';
import { startAuth, useAuthStore } from '@/store';

import styles from './AuthModal.module.scss';

import type { AuthFieldError, AuthMode } from '@/types';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    startAuth();
  }, []);

  const [mode, setMode] = useState<AuthMode>('signin');
  const {
    values,
    errors,
    formError,
    isPending,
    confirmationEmail,
    handleChange,
    handleSubmit,
    reset,
  } = useAuthForm(mode, onClose);

  const isSignUp = mode === 'signup';

  const getFieldError = (code?: AuthFieldError) => {
    if (!code) {
      return undefined;
    }

    return code === 'passwordShort' ?
        t.auth.validation.passwordShort(AUTH_RULES.passwordMinLength)
      : t.auth.validation[code];
  };

  const handleSwitchMode = () => {
    reset();
    setMode(isSignUp ? 'signin' : 'signup');
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (user) {
    return (
      <Modal
        title={t.auth.account}
        closeLabel={t.common.close}
        compact
        onClose={onClose}
      >
        <div className={styles.account}>
          <div>
            <p className={styles.label}>{t.auth.signedInAs}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
          <p className={styles.note}>{t.auth.syncNote}</p>
          <Button
            className={styles.submit}
            onClick={handleSignOut}
          >
            {t.auth.signOut}
          </Button>
        </div>
      </Modal>
    );
  }

  if (confirmationEmail) {
    return (
      <Modal
        title={t.auth.confirmTitle}
        closeLabel={t.common.close}
        compact
        onClose={onClose}
      >
        <div className={styles.account}>
          <p className={styles.note}>{t.auth.confirmText(confirmationEmail)}</p>
          <Button
            className={styles.submit}
            onClick={onClose}
          >
            {t.common.close}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={isSignUp ? t.auth.signUp : t.auth.signIn}
      closeLabel={t.common.close}
      compact
      onClose={onClose}
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <FormField
          name="email"
          soft
          label={t.auth.email}
          type="email"
          autoComplete="email"
          value={values.email}
          error={getFieldError(errors.email)}
          onChange={handleChange}
        />
        <FormField
          name="password"
          soft
          label={t.auth.password}
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          value={values.password}
          error={getFieldError(errors.password)}
          onChange={handleChange}
        />

        {formError && (
          <p
            className={styles.error}
            role="alert"
          >
            {t.auth.errors[formError]}
          </p>
        )}

        <Button
          className={styles.submit}
          type="submit"
          disabled={isPending}
        >
          {isPending ?
            t.auth.pending
          : isSignUp ?
            t.auth.signUp
          : t.auth.signIn}
        </Button>

        <p className={styles.switch}>
          {isSignUp ? t.auth.haveAccount : t.auth.noAccount}{' '}
          <button
            type="button"
            className={styles.switchButton}
            onClick={handleSwitchMode}
          >
            {isSignUp ? t.auth.signIn : t.auth.signUp}
          </button>
        </p>
      </form>
    </Modal>
  );
};
