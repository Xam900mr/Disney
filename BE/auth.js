const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

//Middleware para Google ID Token
const verifyGoogleToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENTID,
    });

    const payload = ticket.getPayload();

    req.user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    };

    next();
  } catch (error) {
    console.error("Error verificando token Google:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

//Middleware para JWT propio
const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ ok: false, message: 'No token provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).send({ ok: false, message: 'Token format invalid.' });
  }

  const token = parts[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ ok: false, message: 'Failed to authenticate token.' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

module.exports = {verifyGoogleToken, tokenVerify};
