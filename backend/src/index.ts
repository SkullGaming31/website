import { config } from 'dotenv';
config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

const clientId = process.env.WEBSITE_CLIENT_ID as string;
const clientSecret = process.env.WEBSITE_CLIENT_SECRET as string;
const redirectUri = 'http://localhost:3001/api/v1/auth/twitch/callback';

app.get('/api/v1/auth/twitch/callback', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('Code is missing');
  }

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }
    });

    const { access_token } = response.data;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 300000, // 5 minutes
      path: '/',
      domain: 'localhost',
      sameSite: 'lax'
    });

    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Error retrieving access token');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});