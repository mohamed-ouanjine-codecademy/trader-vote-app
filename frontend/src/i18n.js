import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "traders": "Traders",
      "socialMedia": "Social Media: {{socialMedia}}",
      "votes": "Votes",
      "scammerVotes": "Scammer Votes: {{count}}",
      "legitVotes": "Legit Votes: {{count}}",
      "submitVote": "Submit Your Vote",
      "scammer": "Scammer",
      "legit": "Legit",
      "evidenceSubmitted": "Evidence Submitted",
      "loading": "Loading...",
      "error": "Error",
      "comments": "Comments",
      "postComment": "Post Comment",
      "nameOptional": "Name (optional)",
      "comment": "Comment",
      "login": "Login",
      "register": "Register",
      "username": "Username",
      "password": "Password",
      "logout": "Logout",
      "traderVoteApp": "Trader Vote App",
      "googleSignIn": "Sign in with Google"
    }
  },
  fr: {
    translation: {
      "traders": "Commerçants",
      "socialMedia": "Réseaux sociaux : {{socialMedia}}",
      "votes": "Votes",
      "scammerVotes": "Votes d'escroc : {{count}}",
      "legitVotes": "Votes légitimes : {{count}}",
      "submitVote": "Soumettez votre vote",
      "scammer": "Escroc",
      "legit": "Légitime",
      "evidenceSubmitted": "Preuves soumises",
      "loading": "Chargement...",
      "error": "Erreur",
      "comments": "Commentaires",
      "postComment": "Poster le commentaire",
      "nameOptional": "Nom (optionnel)",
      "comment": "Commentaire",
      "login": "Connexion",
      "register": "Inscription",
      "username": "Nom d'utilisateur",
      "password": "Mot de passe",
      "logout": "Déconnexion",
      "traderVoteApp": "Application de Vote de Commerçants",
      "googleSignIn": "Se connecter avec Google"
    }
  },
  ar: {
    translation: {
      "traders": "التجار",
      "socialMedia": "وسائل التواصل الاجتماعي: {{socialMedia}}",
      "votes": "الأصوات",
      "scammerVotes": "أصوات المحتالين: {{count}}",
      "legitVotes": "أصوات الموثوقين: {{count}}",
      "submitVote": "إرسال التصويت",
      "scammer": "محتال",
      "legit": "موثوق",
      "evidenceSubmitted": "الأدلة المقدمة",
      "loading": "جار التحميل...",
      "error": "خطأ",
      "comments": "التعليقات",
      "postComment": "نشر التعليق",
      "nameOptional": "الاسم (اختياري)",
      "comment": "تعليق",
      "login": "تسجيل الدخول",
      "register": "تسجيل",
      "username": "اسم المستخدم",
      "password": "كلمة المرور",
      "logout": "تسجيل الخروج",
      "traderVoteApp": "تطبيق تصويت التجار",
      "googleSignIn": "تسجيل الدخول باستخدام جوجل"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
