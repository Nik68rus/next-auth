import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../helpers/auth';
import { connectDb } from '../../../helpers/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize({ email, password }) {
        let client;
        try {
          client = await connectDb();
          const db = client.db();

          const user = await db.collection('users').findOne({ email });

          if (!user) {
            throw new Error('User not found');
          }

          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            throw new Error('Wrong password');
          }

          return {
            email,
          };
        } catch (err) {
          throw new Error(err.message);
        } finally {
          client.close();
        }
      },
    }),
  ],
});
