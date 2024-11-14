import User from "../models/userModel.js";
import passport from "passport";

// Função para iniciar o login com o Google
export const googleLogin = (req, res) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  };
  

// Função de callback do Google após o login bem-sucedido
export const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifique se o usuário já existe no banco de dados pelo googleId
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // Se o usuário não existir, crie um novo usuário
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      avatar: profile.photos[0]?.value,
    });

    // Salvar o usuário no banco
    await user.save();
    return done(null, user);
  } catch (err) {
    console.error("Erro na autenticação com Google:", err);
    return done(err, null);
  }
};

// Função para deslogar
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Erro ao fazer logout');
    }
    return res.redirect('/');
  });
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};
