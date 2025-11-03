/**
 * Simple i18n (internationalization) utility
 * Basic translation system for accessibility
 */

const translations = {
  en: {
    // Header
    'pro': 'Pro',
    'signUp': 'Sign up',
    'signOut': 'Sign out',
    
    // Hero
    'landAnyJob': 'Land any job',
    'tailorResume': 'Tailor your resume with AI ⚡',
    'resumesOptimized': 'resumes optimized this week',
    'uploadResume': 'Upload resume',
    'instantResults': 'Instant results',
    'private': '100% private',
    'freeOptimizations': '3 free optimizations',
    
    // Step 2
    'pasteJobPosting': 'Paste the job posting',
    'includeFullDescription': 'Include the full description for best results 🎯',
    'resumeStaysOnDevice': 'Your resume stays on your device',
    'optimizeResume': 'Optimize Resume',
    'optimizing': 'Optimizing...',
    
    // Step 3
    'allSet': 'All set! 🎉',
    'resumeReady': 'Your resume is optimized and ready to download',
    'atsScore': 'ATS Score',
    'jobMatch': 'Job Match',
    'downloadResume': 'Download Resume',
    'preview': 'Preview',
    'tone': 'Tone',
    'keyImprovements': 'Key improvements',
    'optimizeAnother': 'Optimize Another',
    'downloadResumeDocx': 'Download Resume (DOCX)',
    
    // Pricing
    'readyToKeepGoing': 'Ready to keep going? 🚀',
    'usedAllFree': 'You\'ve used all 3 free optimizations. Unlock unlimited optimizations for just',
    'onePayment': '— one payment, yours forever.',
    'unlimitedOptimizations': 'Unlimited resume optimizations',
    'optimizeAsMany': 'Optimize as many resumes as you need',
    'allToneOptions': 'All tone options unlocked',
    'professionalCreativeTechnical': 'Professional, Creative, Technical, Executive',
    'priorityAiProcessing': 'Priority AI processing',
    'fasterResults': 'Faster results when you need them',
    'advancedAtsOptimization': 'Advanced ATS optimization',
    'deepKeywordMatching': 'Deep keyword matching and formatting',
    'signUpFirst': 'Sign up first',
    'unlockProTakes30Seconds': 'to unlock Pro — takes 30 seconds',
    'upgradeToPro': 'Upgrade to Pro',
    'signUpAndUpgrade': 'Sign up & Upgrade',
    'continueWithFree': 'Continue with free account',
    'poweredByStripe': 'Powered by Stripe · Secure payment processing',
    'encrypted': 'Encrypted',
    'noSubscription': 'No subscription',
    'instantAccess': 'Instant access',
    
    // Footer
    'madeWith': 'Made with',
    'by': 'by',
    'freeForever': 'Free forever',
    
    // Language
    'language': 'Language',
    'english': 'English',
    'chinese': '中文',
    'spanish': 'Español',
    'french': 'Français'
  },
  
  zh: {
    'pro': '专业版',
    'signUp': '注册',
    'signOut': '登出',
    'landAnyJob': '找到任何工作',
    'tailorResume': '用 AI 定制您的简历 ⚡',
    'resumesOptimized': '本周优化的简历',
    'uploadResume': '上传简历',
    'instantResults': '即时结果',
    'private': '100% 隐私',
    'freeOptimizations': '3 次免费优化',
    'pasteJobPosting': '粘贴职位描述',
    'includeFullDescription': '包含完整描述以获得最佳结果 🎯',
    'resumeStaysOnDevice': '您的简历保留在您的设备上',
    'optimizeResume': '优化简历',
    'optimizing': '优化中...',
    'allSet': '全部完成！ 🎉',
    'resumeReady': '您的简历已优化，可以下载',
    'atsScore': 'ATS 分数',
    'jobMatch': '职位匹配',
    'downloadResume': '下载简历',
    'preview': '预览',
    'tone': '语调',
    'keyImprovements': '关键改进',
    'optimizeAnother': '再优化一个',
    'downloadResumeDocx': '下载简历 (DOCX)',
    'readyToKeepGoing': '准备继续？ 🚀',
    'usedAllFree': '您已用完所有 3 次免费优化。仅需',
    'onePayment': '解锁无限优化 — 一次性付费，永久拥有。',
    'unlimitedOptimizations': '无限简历优化',
    'optimizeAsMany': '优化任意数量的简历',
    'allToneOptions': '解锁所有语调选项',
    'professionalCreativeTechnical': '专业、创意、技术、高管',
    'priorityAiProcessing': '优先 AI 处理',
    'fasterResults': '需要时更快的结果',
    'advancedAtsOptimization': '高级 ATS 优化',
    'deepKeywordMatching': '深度关键词匹配和格式设置',
    'signUpFirst': '先注册',
    'unlockProTakes30Seconds': '解锁专业版 — 只需 30 秒',
    'upgradeToPro': '升级到专业版',
    'signUpAndUpgrade': '注册并升级',
    'continueWithFree': '继续使用免费账户',
    'poweredByStripe': '由 Stripe 提供支持 · 安全支付处理',
    'encrypted': '加密',
    'noSubscription': '无订阅',
    'instantAccess': '即时访问',
    'madeWith': '用',
    'by': '制作',
    'freeForever': '永远免费',
    'language': '语言',
    'english': 'English',
    'chinese': '中文',
    'spanish': 'Español',
    'french': 'Français'
  },
  
  es: {
    'pro': 'Pro',
    'signUp': 'Registrarse',
    'signOut': 'Cerrar sesión',
    'landAnyJob': 'Consigue cualquier trabajo',
    'tailorResume': 'Personaliza tu currículum con IA ⚡',
    'resumesOptimized': 'currículos optimizados esta semana',
    'uploadResume': 'Subir currículum',
    'instantResults': 'Resultados instantáneos',
    'private': '100% privado',
    'freeOptimizations': '3 optimizaciones gratuitas',
    'pasteJobPosting': 'Pega la publicación del trabajo',
    'includeFullDescription': 'Incluye la descripción completa para mejores resultados 🎯',
    'resumeStaysOnDevice': 'Tu currículum permanece en tu dispositivo',
    'optimizeResume': 'Optimizar Currículum',
    'optimizing': 'Optimizando...',
    'allSet': '¡Todo listo! 🎉',
    'resumeReady': 'Tu currículum está optimizado y listo para descargar',
    'atsScore': 'Puntuación ATS',
    'jobMatch': 'Coincidencia',
    'downloadResume': 'Descargar Currículum',
    'preview': 'Vista previa',
    'tone': 'Tono',
    'keyImprovements': 'Mejoras clave',
    'optimizeAnother': 'Optimizar Otro',
    'downloadResumeDocx': 'Descargar Currículum (DOCX)',
    'readyToKeepGoing': '¿Listo para continuar? 🚀',
    'usedAllFree': 'Has usado las 3 optimizaciones gratuitas. Desbloquea optimizaciones ilimitadas por solo',
    'onePayment': '— un pago, tuyo para siempre.',
    'unlimitedOptimizations': 'Optimizaciones ilimitadas de currículos',
    'optimizeAsMany': 'Optimiza tantos currículos como necesites',
    'allToneOptions': 'Todas las opciones de tono desbloqueadas',
    'professionalCreativeTechnical': 'Profesional, Creativo, Técnico, Ejecutivo',
    'priorityAiProcessing': 'Procesamiento de IA prioritario',
    'fasterResults': 'Resultados más rápidos cuando los necesites',
    'advancedAtsOptimization': 'Optimización avanzada de ATS',
    'deepKeywordMatching': 'Coincidencia profunda de palabras clave y formato',
    'signUpFirst': 'Regístrate primero',
    'unlockProTakes30Seconds': 'para desbloquear Pro — toma 30 segundos',
    'upgradeToPro': 'Actualizar a Pro',
    'signUpAndUpgrade': 'Regístrate y Actualiza',
    'continueWithFree': 'Continuar con cuenta gratuita',
    'poweredByStripe': 'Impulsado por Stripe · Procesamiento de pago seguro',
    'encrypted': 'Encriptado',
    'noSubscription': 'Sin suscripción',
    'instantAccess': 'Acceso instantáneo',
    'madeWith': 'Hecho con',
    'by': 'por',
    'freeForever': 'Gratis para siempre',
    'language': 'Idioma',
    'english': 'English',
    'chinese': '中文',
    'spanish': 'Español',
    'french': 'Français'
  },
  
  fr: {
    'pro': 'Pro',
    'signUp': 'S\'inscrire',
    'signOut': 'Se déconnecter',
    'landAnyJob': 'Trouvez n\'importe quel emploi',
    'tailorResume': 'Personnalisez votre CV avec l\'IA ⚡',
    'resumesOptimized': 'CV optimisés cette semaine',
    'uploadResume': 'Télécharger le CV',
    'instantResults': 'Résultats instantanés',
    'private': '100% privé',
    'freeOptimizations': '3 optimisations gratuites',
    'pasteJobPosting': 'Collez l\'offre d\'emploi',
    'includeFullDescription': 'Incluez la description complète pour de meilleurs résultats 🎯',
    'resumeStaysOnDevice': 'Votre CV reste sur votre appareil',
    'optimizeResume': 'Optimiser le CV',
    'optimizing': 'Optimisation...',
    'allSet': 'Tout est prêt ! 🎉',
    'resumeReady': 'Votre CV est optimisé et prêt à être téléchargé',
    'atsScore': 'Score ATS',
    'jobMatch': 'Correspondance',
    'downloadResume': 'Télécharger le CV',
    'preview': 'Aperçu',
    'tone': 'Ton',
    'keyImprovements': 'Améliorations clés',
    'optimizeAnother': 'Optimiser un autre',
    'downloadResumeDocx': 'Télécharger le CV (DOCX)',
    'readyToKeepGoing': 'Prêt à continuer ? 🚀',
    'usedAllFree': 'Vous avez utilisé les 3 optimisations gratuites. Débloquez des optimisations illimitées pour seulement',
    'onePayment': '— un paiement, à vous pour toujours.',
    'unlimitedOptimizations': 'Optimisations illimitées de CV',
    'optimizeAsMany': 'Optimisez autant de CV que nécessaire',
    'allToneOptions': 'Toutes les options de ton débloquées',
    'professionalCreativeTechnical': 'Professionnel, Créatif, Technique, Exécutif',
    'priorityAiProcessing': 'Traitement IA prioritaire',
    'fasterResults': 'Résultats plus rapides quand vous en avez besoin',
    'advancedAtsOptimization': 'Optimisation ATS avancée',
    'deepKeywordMatching': 'Correspondance approfondie des mots-clés et formatage',
    'signUpFirst': 'Inscrivez-vous d\'abord',
    'unlockProTakes30Seconds': 'pour débloquer Pro — prend 30 secondes',
    'upgradeToPro': 'Passer à Pro',
    'signUpAndUpgrade': 'S\'inscrire et Mettre à niveau',
    'continueWithFree': 'Continuer avec un compte gratuit',
    'poweredByStripe': 'Alimenté par Stripe · Traitement de paiement sécurisé',
    'encrypted': 'Crypté',
    'noSubscription': 'Pas d\'abonnement',
    'instantAccess': 'Accès instantané',
    'madeWith': 'Fait avec',
    'by': 'par',
    'freeForever': 'Gratuit pour toujours',
    'language': 'Langue',
    'english': 'English',
    'chinese': '中文',
    'spanish': 'Español',
    'french': 'Français'
  }
};

// Get current language from localStorage or default to English
export function getLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('clay_language') || 'en';
  }
  return 'en';
}

// Set language preference
export function setLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clay_language', lang);
    // Trigger a custom event to notify components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }
}

// Get translation
export function t(key, lang = null) {
  const currentLang = lang || getLanguage();
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// Get all available languages
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' }
  ];
}

