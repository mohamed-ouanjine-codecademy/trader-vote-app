// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      traders: "Traders",
      socialMedia: "Social Media: {{socialMedia}}",
      votes: "Votes",
      scammerVotes: "Scammer Votes: {{count}}",
      legitVotes: "Legit Votes: {{count}}",
      submitVote: "Submit Your Vote",
      scammer: "Scammer",
      legit: "Legit",
      evidenceSubmitted: "Evidence Submitted",
      loading: "Loading...",
      error: "Error",
      comments: "Comments",
      postComment: "Post Comment",
      nameOptional: "Name (optional)",
      comment: "Comment",
      login: "Login",
      register: "Register",
      username: "Username",
      password: "Password",
      logout: "Logout",
      traderVoteApp: "Trader Vote App",
      googleSignIn: "Sign in with Google",
      profile: "Profile",
      myVotes: "My Votes",
      noVotes: "You haven't voted on any trader yet.",
      myComments: "My Comments",
      noComments: "You haven't posted any comments yet.",
      "pleaseLoginToVote": "Please log in to vote.",
      "leaderboard": "Leaderboard",
      "searchTraders": "Search Traders",
      "sortBy": "Sort By",
      "sortScammer": "Scammer %",
      "sortLegit": "Legit %",
      "sortTotal": "Total Votes",
      "viewDetails": "View Details",
      "follow": "Follow",
      "unfollow": "Unfollow",
      "reply": "Reply",
      "submitReply": "Submit Reply",
      "upvote": "Upvote",
      "downvote": "Downvote",
      "currentName": "Current Name",
      "newName": "New Name",
      "updateProfile": "Update Profile",
      "discoverTopTraders": "Discover and evaluate traders based on community feedback.",
      "welcome": "Welcome to your profile",
      "saveChanges": "Save Changes",
      "profileError": "Error loading profile",
      "profileUpdated": "Profile updated successfully!",
      "profileUpdateError": "Error updating profile",
      "noNotifications": "No notifications",
      "evidenceLabel": "Evidence (Optional)",
      "evidenceHelp": "Attach images or screenshots to support your vote.",
      "evidenceTooltip": "You can upload multiple files as evidence",
      "uploadEvidence": "Upload Evidence",
      "filesSelected": "{{count}} file(s) selected"
    }
  },
  fr: {
    translation: {
      traders: "Commerçants",
      socialMedia: "Réseaux sociaux : {{socialMedia}}",
      votes: "Votes",
      scammerVotes: "Votes d'escroc : {{count}}",
      legitVotes: "Votes légitimes : {{count}}",
      submitVote: "Soumettez votre vote",
      scammer: "Escroc",
      legit: "Légitime",
      evidenceSubmitted: "Preuves soumises",
      loading: "Chargement...",
      error: "Erreur",
      comments: "Commentaires",
      postComment: "Poster le commentaire",
      nameOptional: "Nom (optionnel)",
      comment: "Commentaire",
      login: "Connexion",
      register: "Inscription",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      logout: "Déconnexion",
      traderVoteApp: "Application de Vote de Commerçants",
      googleSignIn: "Se connecter avec Google",
      profile: "Profil",
      myVotes: "Mes Votes",
      noVotes: "Vous n'avez encore voté pour aucun commerçant.",
      myComments: "Mes Commentaires",
      noComments: "Vous n'avez encore posté aucun commentaire."
    }
  },
  ar: {
    translation: {
      traders: "التجار",
      socialMedia: "وسائل التواصل الاجتماعي: {{socialMedia}}",
      votes: "الأصوات",
      scammerVotes: "أصوات المحتالين: {{count}}",
      legitVotes: "أصوات الموثوقين: {{count}}",
      submitVote: "إرسال التصويت",
      scammer: "محتال",
      legit: "موثوق",
      evidenceSubmitted: "الأدلة المقدمة",
      loading: "جار التحميل...",
      error: "خطأ",
      comments: "التعليقات",
      postComment: "نشر التعليق",
      nameOptional: "الاسم (اختياري)",
      comment: "تعليق",
      login: "تسجيل الدخول",
      register: "تسجيل",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      logout: "تسجيل الخروج",
      traderVoteApp: "تطبيق تصويت التجار",
      googleSignIn: "تسجيل الدخول باستخدام جوجل",
      profile: "الملف الشخصي",
      myVotes: "أصواتي",
      noVotes: "لم تقم بالتصويت لأي تاجر بعد.",
      myComments: "تعليقاتي",
      noComments: "لم تنشر أي تعليقات بعد."
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
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
