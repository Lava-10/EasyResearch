const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: process.env.CLIENT_ADDRESS,
  failureRedirect: '/auth/failure',
}));

router.get('/failure', (req, res) => {
  res.status(403).send('Authentication failed.');
});

router.get('/status', (req, res) => {
  if (req.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(400).json({ isAuthenticated: false });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_ADDRESS);
});

module.exports = router;
