import { useState, useEffect } from 'react';
import AuthForm from '../components/auth/auth-form';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function AuthPage() {
  // const router = useRouter();

  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (session) {
  //       router.replace('/');
  //     }
  //     setLoading(false);
  //   });
  // }, [router]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default AuthPage;
