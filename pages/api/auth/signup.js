import { hashPassword } from '../../../helpers/auth';
import { connectDb } from '../../../helpers/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.trim().length < 3
    ) {
      return res.status(422).json({
        message: 'Invalid input!',
      });
    }

    const client = await connectDb();
    const db = client.db();
    const user = await db.collection('users').findOne({ email });
    if (user) {
      res.status(422).json({ message: 'User already exists!' });
    } else {
      const hashedPassword = await hashPassword(password);
      const newUser = await db
        .collection('users')
        .insertOne({ email, password: hashedPassword });
      res
        .status(201)
        .json({ message: 'User created!', id: newUser.insertedId.toString() });
    }
    client.close();
  }
}
