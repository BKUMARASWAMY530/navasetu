import { Language } from './types';

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation / Header
  app_title: {
    en: 'Jan Seva Assistance Portal',
    te: 'జన సేవ సహాయ పోర్టల్',
    hi: 'जन सेवा सहायता पोर्टल'
  },
  tagline: {
    en: 'Welfare Schemes & Project Transparency for Rural Citizens',
    te: 'గ్రామీణ పౌరుల కోసం సంక్షేమ పథకాలు & ప్రాజెక్ట్ పారదర్శకత',
    hi: 'ग्रामीण नागरिकों के लिए कल्याणकारी योजनाएं और परियोजना पारदर्शिता'
  },
  citizen_mode: {
    en: 'Citizen Section',
    te: 'పౌరుల విభాగం',
    hi: 'नागरिक अनुभाग'
  },
  admin_mode: {
    en: 'Officer Section',
    te: 'అధికారుల విభాగం',
    hi: 'अधिकारी अनुभाग'
  },
  voice_assistant: {
    en: 'Speak to Jan Seva',
    te: 'జన సేవతో మాట్లాడండి',
    hi: 'जन सेवा से बात करें'
  },

  // Language selectors
  lang_en: { en: 'English', te: 'ఇంగ్లీష్ (English)', hi: 'अंग्रेजी (English)' },
  lang_te: { en: 'Telugu (తెలుగు)', te: 'తెలుగు', hi: 'तेलुगु (తెలుగు)' },
  lang_hi: { en: 'Hindi (हिन्दी)', te: 'హిందీ (हिन्दी)', hi: 'हिन्दी' },

  // General Buttons
  btn_back: { en: 'Go Back', te: 'వెనుకకు వెళ్ళు', hi: 'पीछे जाएं' },
  btn_close: { en: 'Close', te: 'మూసివేయి', hi: 'बंद करें' },
  btn_submit: { en: 'Submit Details', te: 'వివరాలు సమర్పించు', hi: 'विवरण जमा करें' },
  btn_listen: { en: 'Listen (Voice)', te: 'వినండి (వాయిస్)', hi: 'सुनें (आवाज)' },
  btn_speak: { en: 'Speak Now', te: 'ఇప్పుడు మాట్లాడండి', hi: 'अभी बोलें' },
  btn_scanning: { en: 'Scanning...', te: 'స్కాన్ అవుతోంది...', hi: 'स्कैन हो रहा है...' },
  btn_upload_doc: { en: 'Upload Card (OCR)', te: 'కార్డు అప్‌లోడ్ (OCR)', hi: 'कार्ड अपलोड करें (OCR)' },
  btn_view_eligibility: { en: 'Check Schemes', te: 'పథకాలు తనిఖీ చేయి', hi: 'योजनाएं जांचें' },

  // Profile Form Labels
  form_header: {
    en: 'Tell us about yourself to find schemes',
    te: 'పథకాలు కనుగొనడానికి మీ వివరాలు తెలపండి',
    hi: 'योजनाएं खोजने के लिए अपने बारे में बताएं'
  },
  form_age: { en: 'How old are you? (Age)', te: 'మీ వయస్సు ఎంత? (వయస్సు)', hi: 'आपकी उम्र क्या है? (आयु)' },
  form_gender: { en: 'Gender', te: 'లింగము', hi: 'लिंग' },
  gender_male: { en: 'Male', te: 'పురుషుడు', hi: 'पुरुष' },
  gender_female: { en: 'Female', te: 'స్త్రీ', hi: 'महिला' },
  gender_other: { en: 'Other', te: 'ఇతర', hi: 'अन्य' },
  form_income: { en: 'Annual Family Income (Rupees)', te: 'కుటుంబ సంవత్సర ఆదాయం (రూపాయలు)', hi: 'वार्षिक पारिवारिक आय (रुपये)' },
  form_occupation: { en: 'What is your job? (Occupation)', te: 'మీరు ఏం పని చేస్తారు? (వృత్తి)', hi: 'आप क्या काम करते हैं? (व्यवसाय)' },
  form_education: { en: 'Education Level', te: 'చదువు వివరాలు', hi: 'शिक्षा का स्तर' },
  form_category: { en: 'Caste Category', te: 'కులం కేటగిరీ', hi: 'जाति वर्ग' },
  form_district: { en: 'District', te: 'జిల్లా', hi: 'जिला' },

  // Scheme recommendation outcomes
  results_found: {
    en: 'Great News! We found eligible schemes for you',
    te: 'శుభవార్త! మీ అర్హతకు తగ్గ ప్రభుత్వ పథకాలు లభించాయి',
    hi: 'अच्छी खबर! हमें आपके लिए पात्र योजनाएं मिली हैं'
  },
  scheme_benefit: { en: 'Welfare Benefit:', te: 'లభించే ప్రయోజనం:', hi: 'मिलने वाला लाभ:' },
  scheme_eligibility: { en: 'Who can get this:', te: 'ఎవరు అర్హులు:', hi: 'कौन पात्र है:' },
  scheme_docs: { en: 'Papers / Certificates Needed:', te: 'కావలసిన పత్రాలు / సర్టిఫికేట్లు:', hi: 'आवश्यक दस्तावेज:' },
  scheme_process: { en: 'How to Apply:', te: 'దరఖాస్తు విధానం:', hi: 'आवेदन कैसे करें:' },
  scheme_deadline: { en: 'Apply Before (Deadline):', te: 'చివరి తేదీ (డెడ్‌లైన్):', hi: 'आवेदन की अंतिम तिथि:' },

  // Infrastructure Transparency
  infra_title: {
    en: 'Public Works & Transparency Board',
    te: 'ప్రజా పనుల పర్యవేక్షణ & పారదర్శకత బోర్డు',
    hi: 'सार्वजनिक निर्माण और पारदर्शिता बोर्ड'
  },
  infra_subtitle: {
    en: 'View and audit public projects in your region to prevent corruption.',
    te: 'అవినీతిని అరికట్టడానికి మీ ప్రాంతంలోని ప్రజా పనులను పర్యవేక్షించండి.',
    hi: 'भ्रष्टाचार रोकने के लिए अपने क्षेत्र की सार्वजनिक परियोजनाओं की समीक्षा करें।'
  },
  proj_budget: { en: 'Sanctioned Budget:', te: 'ప్రభుత్వ బడ్జెట్:', hi: 'स्वीकृत बजट:' },
  proj_contractor: { en: 'Contractor Name:', te: 'కాంట్రాక్టర్ పేరు:', hi: 'ठेकेदार का नाम:' },
  proj_completion: { en: 'Work Progress Status:', te: 'పనుల పురోగతి:', hi: 'कार्य की प्रगति:' },
  proj_date: { en: 'Expected Finish Date:', te: 'పూర్తయ్యే అంచనా తేదీ:', hi: 'पूर्ण होने की तिथि:' },
  proj_estimator_title: {
    en: 'Public Budget Auditor Tool',
    te: 'ప్రజా పనుల బడ్జెట్ అంచనా సాధనం',
    hi: 'सार्वजनिक कार्य बजट मूल्यांकन उपकरण'
  },
  proj_estimator_desc: {
    en: 'Input approximate dimensions and materials of this project to verify if the reported budget is fair or flagged.',
    te: 'ప్రభుత్వ బడ్జెట్ సవ్యంగా ఉందో లేదో సరిచూడటానికి ఈ ప్రాజెక్ట్ యొక్క సుమారు కొలతలను ఎంటర్ చేయండి.',
    hi: 'यह सत्यापित करने के लिए कि स्वीकृत बजट उचित है या नहीं, इस परियोजना के अनुमानित आयाम दर्ज करें।'
  },
  flagged_warning: {
    en: 'WARNING: Potential Budget Overpricing Flagged!',
    te: 'హెచ్చరిక: బడ్జెట్ భారీగా ఎక్కువగా ఉన్నట్లు గుర్తించబడింది!',
    hi: 'चेतावनी: संभावित रूप से अत्यधिक बजट का अंतर पाया गया!'
  },
  estimator_footer: {
    en: 'Disclaimer: This construction calculator provides rough estimates based on national average material costs. It serves as an empowerment tool for citizens to demand transparency and does not constitute formal proof of fraud.',
    te: 'గమనిక: ఈ బడ్జెట్ అంచనా సాధనం కేవలం సగటు నిర్మాణ ఖర్చుల ఆధారంగా చూపబడింది. ఇది అవినీతిపై ప్రశ్నించేందుకు పౌరుల సాధనంగా ఉపయోగపడుతుంది, కానీ ఇది చట్టపరమైన సాక్ష్యంగా పరిగణించబడదు.',
    hi: 'अस्वीकरण: यह निर्माण कैलकुलेटर केवल औसत लागतों पर आधारित है। यह नागरिकों को पारदर्शिता की मांग करने के लिए सशक्त बनाने का उपकरण है, न कि धोखाधड़ी का कानूनी प्रमाण।'
  },

  // Document OCR Helper
  ocr_heading: {
    en: 'Aadhaar / Certificate Scan (No Typing)',
    te: 'ఆధార్ / సర్టిఫికేట్ స్కాన్ (టైపింగ్ అవసరం లేదు)',
    hi: 'आधार / प्रमाण पत्र स्कैन (टाइपिंग की आवश्यकता नहीं)'
  },
  ocr_desc: {
    en: 'Simply upload an image of your Aadhaar card or Income Certificate. Our smart AI will read the details automatically to fill the form.',
    te: 'మీ ఆధార్ కార్డు లేదా ఆదాయ ధృవీకరణ పత్రాన్ని ఇక్కడ అప్‌లోడ్ చేయండి. మా AI వివరాలను చదివి ఫారమ్‌ను ఆటోమేటిక్‌గా నింపుతుంది.',
    hi: 'अपना आधार कार्ड या आय प्रमाण पत्र अपलोड करें। हमारा AI विवरण पढ़कर फॉर्म को स्वचालित रूप से भर देगा।'
  },

  // Chatbot Assistant
  chatbot_heading: {
    en: 'Jan Seva AI Chatbot',
    te: 'జన సేవ AI సహాయకుడు',
    hi: 'जन सेवा AI सहायक'
  },
  chatbot_placeholder: {
    en: 'Ask any question about pensions, farming support, or road projects...',
    te: 'పెన్షన్, రైతు సహాయం, లేదా రోడ్డు పనుల గురించి ఏదైనా అడగండి...',
    hi: 'पेंशन, कृषि सहायता या सड़क परियोजनाओं के बारे में कुछ भी पूछें...'
  },

  // Accessibility Big Text Option
  big_text_mode: {
    en: 'Big Text Mode (For Illiterate/Elderly)',
    te: 'పెద్ద అక్షరాల మోడ్ (చదువుకోనివారి కోసం / వృద్ధుల కోసం)',
    hi: 'बड़ा टेक्स्ट मोड (कम साक्षर/बुजुर्गों के लिए)'
  }
};

export function getTranslation(key: string, lang: Language): string {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  return key;
}
