import { getSession } from 'next-auth/react';
import { hashPassword, verifyPassword } from '../../../helpers/auth';
import { connectDb } from '../../../helpers/db';

const handler = async (req, res) => {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const { newPswd, oldPswd } = req.body;
  const { email } = session.user;

  if (newPswd.trim().length < 3 || oldPswd.trim().length < 3) {
    res.status(422).json({ message: 'Password is too short' });
    return;
  }

  let client;

  try {
    client = await connectDb();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed!' });
    return;
  }

  const db = client.db();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    client.close();
    return res.status(404).json({ message: 'User not found!' });
  }

  const isValid = await verifyPassword(oldPswd, user.password);

  if (isValid) {
    try {
      const newHashedPswd = await hashPassword(newPswd);
      await db
        .collection('users')
        .updateOne({ email }, { $set: { password: newHashedPswd } });
      return res.status(200).json({ message: 'Password updated!' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong!' });
    } finally {
      client.close();
    }
  } else {
    client.close();
    return res.status(403).json({ message: 'Wrong password' });
  }
};

export default handler;
