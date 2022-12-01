import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

function UserProfile() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth?from=${encodeURIComponent(router.pathname)}`, 'auth');
    },
  });

  if (status === 'loading') {
    return <p className={classes.profile}>Loading...</p>;
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
