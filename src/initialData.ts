import { Scheme, Project, Notification } from './types';

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: 'scheme_rythu_bharosa',
    name: 'Rythu Bharosa - Farmer Financial Support',
    nameLocal: {
      te: 'రైతు భరోసా - రైతు ఆర్థిక సహాయం',
      hi: 'रायथु भरोसा - किसान वित्तीय सहायता'
    },
    department: 'Department of Agriculture',
    benefit: 'Financial assistance of ₹13,500 per year per farmer family, plus free borewell drilling and crop insurance support.',
    benefitLocal: {
      te: 'ప్రతి రైతు కుటుంబానికి ఏడాదికి ₹13,500 ఆర్థిక సహాయం, ఉచిత బోర్‌వెల్ డ్రిల్లింగ్ మరియు ఉచిత పంట బీమా.',
      hi: 'प्रति किसान परिवार को प्रति वर्ष ₹13,500 की वित्तीय सहायता, मुफ्त बोरवेल ड्रिलिंग और फसल बीमा सहायता।'
    },
    eligibility: 'Farmers owning cultivable land, tenant farmers from Scheduled Castes (SC), Scheduled Tribes (ST), OBC, and minority categories.',
    eligibilityLocal: {
      te: 'వ్యవసాయ భూమి ఉన్న రైతులు, ఎస్సీ (SC), ఎస్టీ (ST), బీసీ (OBC) మరియు మైనారిటీ వర్గాలకు చెందిన కౌలు రైతులు.',
      hi: 'कृषि भूमि के मालिक किसान, और अनुसूचित जाति (SC), अनुसूचित जनजाति (ST), ओबीसी (OBC) और अल्पसंख्यक वर्गों के बटाईदार किसान।'
    },
    requiredDocuments: ['Aadhaar Card', 'Pattadar Passbook / Land Records', 'Bank Account Passbook', 'Tenant Agreement (if applicable)'],
    applicationProcess: 'Submit application online through Rythu Bharosa Kendra (RBK) or Grama Ward Sachivalayam.',
    applicationProcessLocal: {
      te: 'రైతు భరోసా కేంద్రం (RBK) లేదా గ్రామ వార్డు సచివాలయం ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి.',
      hi: 'रायथु भरोसा केंद्र (RBK) या ग्राम वार्ड सचिवालय के माध्यम से ऑनलाइन आवेदन जमा करें।'
    },
    deadline: '2026-08-31',
    minAge: 18,
    maxIncome: 250000,
    allowedGender: ['all', 'male', 'female'],
    allowedCategory: ['All', 'SC', 'ST', 'OBC']
  },
  {
    id: 'scheme_amma_vodi',
    name: 'Amma Vodi - Mothers Education Support',
    nameLocal: {
      te: 'అమ్మ ఒడి - తల్లి విద్యా సహాయం',
      hi: 'अम्मा वोडी - माताओं के लिए शिक्षा सहायता'
    },
    department: 'Department of School Education',
    benefit: 'Annual financial assistance of ₹15,000 deposited directly to the bank account of the mother or guardian of school-going children.',
    benefitLocal: {
      te: 'బడికి వెళ్లే పిల్లల తల్లి లేదా సంరక్షకురాలి బ్యాంక్ ఖాతాలో నేరుగా ఏడాదికి ₹15,000 జమ చేయబడుతుంది.',
      hi: 'स्कूल जाने वाले बच्चों की माता या अभिभावक के बैंक खाते में सीधे ₹15,000 की वार्षिक वित्तीय सहायता।'
    },
    eligibility: 'Mother or guardian below poverty line whose children study in Classes I to XII in recognized government or private aided/unaided schools.',
    eligibilityLocal: {
      te: 'దారిద్ర్య రేఖకు దిగువన ఉన్న తల్లులు, వారి పిల్లలు ప్రభుత్వ లేదా గుర్తింపు పొందిన ప్రైవేట్ పాఠశాలల్లో 1 నుండి 12 తరగతి చదువుతుండాలి.',
      hi: 'गरीबी रेखा से नीचे की माता या अभिभावक जिनके बच्चे कक्षा 1 से 12 में सरकारी या मान्यता प्राप्त निजी स्कूलों में पढ़ते हैं।'
    },
    requiredDocuments: ['Mother Aadhaar Card', 'Child Aadhaar Card', 'Ration Card (BPL)', 'School Admission Proof / ID Card', 'Bank Account details'],
    applicationProcess: 'School headmasters upload eligibility data directly to the educational portal. Verification done by Sachivalayam volunteers.',
    applicationProcessLocal: {
      te: 'పాఠశాల ప్రధానోపాధ్యాయులు నేరుగా పోర్టల్‌లో అప్‌లోడ్ చేస్తారు. సచివాలయం వాలంటీర్లు ధృవీకరిస్తారు.',
      hi: 'स्कूल के प्रधानाध्यापक सीधे पोर्टल पर डेटा अपलोड करते हैं। सचिवालय स्वयंसेवकों द्वारा सत्यापन किया जाता है।'
    },
    deadline: '2026-09-15',
    maxIncome: 120000,
    allowedGender: ['female'],
    allowedCategory: ['All', 'SC', 'ST', 'OBC', 'General']
  },
  {
    id: 'scheme_pension_kanuka',
    name: 'YSR Pension Kanuka - Elderly & Disabled Support',
    nameLocal: {
      te: 'వైఎస్ఆర్ పెన్షన్ కానుక - వృద్ధులు మరియు వికలాంగుల పెన్షన్',
      hi: 'वाईएसआर पेंशन कनुका - बुजुर्ग और दिव्यांग सहायता'
    },
    department: 'Department of Social Welfare',
    benefit: 'Monthly pension of ₹3,000 for elderly, widows, and weavers. ₹3,000 for disabled citizens, delivered directly to their doorstep by volunteers.',
    benefitLocal: {
      te: 'వృద్ధులు, వితంతువులకు నెలకు ₹3,000 పెన్షన్. వికలాంగులకు కూడా ₹3,000 పెన్షన్, వాలంటీర్ల ద్వారా నేరుగా ఇంటివద్దే అందుతుంది.',
      hi: 'बुजुर्गों और विधवाओं को ₹3,000 मासिक पेंशन। दिव्यांग नागरिकों के लिए ₹3,000 पेंशन, जो स्वयंसेवकों द्वारा सीधे घर पर दी जाती है।'
    },
    eligibility: 'Elderly above 60 years. Widows of any age. Disabled individuals with >40% disability certificate. Household income below ₹1,20,000/year.',
    eligibilityLocal: {
      te: '60 ఏళ్లు పైబడిన వృద్ధులు. ఏ వయస్సు వితంతువులైనా. 40% కన్నా ఎక్కువ వైకల్యం ఉన్నవారు. సంవత్సర ఆదాయం ₹1,20,000 లోపు ఉండాలి.',
      hi: '60 वर्ष से अधिक आयु के बुजुर्ग। किसी भी उम्र की विधवाएं। 40% से अधिक दिव्यांगता प्रमाण पत्र वाले व्यक्ति। वार्षिक आय ₹1,20,000 से कम।'
    },
    requiredDocuments: ['Aadhaar Card', 'BPL Ration Card', 'Age Proof / Disability Certificate (SADAREM)', 'Bank Passbook'],
    applicationProcess: 'Apply through village volunteer or submit physically at local Sachivalayam office.',
    applicationProcessLocal: {
      te: 'గ్రామ వాలంటీర్ ద్వారా లేదా స్థానిక సచివాలయంలో దరఖాస్తును సమర్పించండి.',
      hi: 'ग्राम स्वयंसेवक के माध्यम से आवेदन करें या स्थानीय सचिवालय कार्यालय में भौतिक रूप से जमा करें।'
    },
    deadline: 'Ongoing - Apply anytime',
    minAge: 60,
    maxIncome: 120000,
    allowedGender: ['all', 'male', 'female'],
    allowedCategory: ['All', 'SC', 'ST', 'OBC', 'General']
  },
  {
    id: 'scheme_vidya_deevena',
    name: 'Vidya Deevena - Complete Fee Reimbursement',
    nameLocal: {
      te: 'విద్యా దీవెన - పూర్తి ఫీజు రీయింబర్స్మెంట్',
      hi: 'विद्या दीवेना - पूर्ण शुल्क प्रतिपूर्ति'
    },
    department: 'Department of Higher Education',
    benefit: '100% tuition fee reimbursement for students pursuing higher education (ITI, Polytechnic, Degree, Engineering, Medicine).',
    benefitLocal: {
      te: 'ఉన్నత విద్య (ITI, పాలిటెక్నిక్, డిగ్రీ, ఇంజనీరింగ్, మెడిసిన్) చదువుతున్న విద్యార్థులకు 100% పూర్తి ఫీజు రీయింబర్స్మెంట్.',
      hi: 'उच्च शिक्षा (ITI, पॉलिटेक्निक, डिग्री, इंजीनियरिंग, मेडिकल) प्राप्त करने वाले छात्रों के लिए 100% ट्यूशन फीस की प्रतिपूर्ति।'
    },
    eligibility: 'Students pursuing college education. Family annual income less than ₹2.5 Lakhs. Less than 25 acres of dry land or 10 acres of wet land.',
    eligibilityLocal: {
      te: 'కళాశాలల్లో చదువుతున్న విద్యార్థులు. కుటుంబ సంవత్సర ఆదాయం ₹2.5 లక్షల లోపు ఉండాలి. భూమి పరిమితి లోపల ఉండాలి.',
      hi: 'कॉलेज की शिक्षा प्राप्त करने वाले छात्र। पारिवारिक वार्षिक आय ₹2.5 लाख से कम। 25 एकड़ से कम सूखी भूमि या 10 एकड़ से कम गीली भूमि।'
    },
    requiredDocuments: ['Aadhaar Card', 'College Admission Letter', 'Fee Structure Certificate', 'Income Certificate', 'Caste Certificate'],
    applicationProcess: 'Register on Jnanabhumi Portal and submit hardcopy documents to college scholarship desk.',
    applicationProcessLocal: {
      te: 'జ్ఞానభూమి పోర్టల్‌లో నమోదు చేసుకోండి మరియు కళాశాల స్కాలర్‌షిప్ డెస్క్‌లో పత్రాలను సమర్పించండి.',
      hi: 'ज्ञानभूमि पोर्टल पर पंजीकरण करें और कॉलेज छात्रवृत्ति डेस्क पर भौतिक दस्तावेज जमा करें।'
    },
    deadline: '2026-10-31',
    minAge: 16,
    maxAge: 30,
    maxIncome: 250000,
    allowedGender: ['all', 'male', 'female'],
    allowedCategory: ['All', 'SC', 'ST', 'OBC', 'General']
  },
  {
    id: 'scheme_cheyutha',
    name: 'Cheyutha - Women Entrepreneurship Support',
    nameLocal: {
      te: 'చేయూత - మహిళా వ్యాపార ఆర్థిక సహాయం',
      hi: 'चेयुथा - महिला उद्यमिता सहायता'
    },
    department: 'Department of Women & Child Welfare',
    benefit: 'Financial empowerment support of ₹75,000 in four equal installments of ₹18,750 per year to set up small grocery, livestock, or cottage businesses.',
    benefitLocal: {
      te: 'చిన్న వ్యాపారాలు, కిరాణా షాపులు లేదా పశువుల కొనుగోలుకు ప్రతి సంవత్సరం ₹18,750 చొప్పున 4 ఏళ్లలో మొత్తం ₹75,000 ఆర్థిక సహాయం.',
      hi: 'छोटे किराना, पशुधन या कुटीर उद्योग स्थापित करने के लिए प्रति वर्ष ₹18,750 की चार समान किश्तों में ₹75,000 की वित्तीय सहायता।'
    },
    eligibility: 'Women belonging to SC, ST, OBC, or minority communities. Age group between 45 and 60 years. Family annual income under ₹1.2 Lakhs.',
    eligibilityLocal: {
      te: 'ఎస్సీ, ఎస్టీ, బీసీ లేదా మైనారిటీ వర్గాలకు చెందిన మహిళలు. వయస్సు 45 నుండి 60 ఏళ్ల లోపు ఉండాలి. కుటుంబ సంవత్సర ఆదాయం ₹1.2 లక్షల లోపు ఉండాలి.',
      hi: 'SC, ST, OBC या अल्पसंख्यक समुदायों से संबंधित महिलाएं। आयु 45 से 60 वर्ष के बीच। पारिवारिक वार्षिक आय ₹1.2 लाख से कम।'
    },
    requiredDocuments: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Age Proof (Birth Certificate/SSC)', 'Bank Account Details'],
    applicationProcess: 'Submit online at local secretariat or register with the Ward Women Welfare Secretary.',
    applicationProcessLocal: {
      te: 'స్థానిక సచివాలయం లో గాని లేదా వార్డు మహిళా సంరక్షణ సెక్రటరీ వద్ద ఆన్‌లైన్‌లో నమోదు చేసుకోండి.',
      hi: 'स्थानीय सचिवालय में ऑनलाइन जमा करें या वार्ड महिला कल्याण सचिव के पास पंजीकरण कराएं।'
    },
    deadline: '2026-07-31',
    minAge: 45,
    maxAge: 60,
    maxIncome: 120000,
    allowedGender: ['female'],
    allowedCategory: ['SC', 'ST', 'OBC']
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_village_water_grid',
    title: 'Guntur Rural Drinking Water & Pipeline Network',
    titleLocal: {
      te: 'గుంటూరు గ్రామీణ తాగునీటి మరియు పైప్‌లైన్ నెట్‌వర్క్',
      hi: 'गुंटूर ग्रामीण पेयजल और पाइपलाइन नेटवर्क'
    },
    category: 'Water',
    budget: 12.5, // Crores
    contractor: 'AARVEE Infrastructure Ltd.',
    location: 'Tenali Mandal, Guntur District',
    locationLocal: {
      te: 'తెనాలి మండలం, గుంటూరు జిల్లా',
      hi: 'तेनाली मंडल, गुंटूर जिला'
    },
    completionPercent: 85,
    expectedCompletionDate: '2026-11-20',
    details: 'Laying of 45km main pipeline and setting up of 3 overhead reservoirs of 50,000L capacity each. This will supply purified drinking water to 24 local villages.',
    detailsLocal: {
      te: '45 కిలోమీటర్ల ప్రధాన పైప్‌లైన్ మరియు ఒక్కొక్కటి 50,000 లీటర్ల సామర్థ్యం గల 3 ఓవర్‌హెడ్ రిజర్వాయర్ల నిర్మాణం. దీని వల్ల 24 గ్రామాలకు తాగునీరు అందుతుంది.',
      hi: '45 किमी मुख्य पाइपलाइन बिछाना और 50,000 लीटर क्षमता वाले 3 ओवरहेड जलाशयों का निर्माण। इससे 24 गांवों को शुद्ध पेयजल की आपूर्ति होगी।'
    },
    lat: 35,
    lng: 48,
    flagged: false,
    estimatedCostRange: { min: 11.2, max: 13.1 }
  },
  {
    id: 'proj_highway_bypass',
    title: 'Kurnool-Nandyal Highway Bypass Extension',
    titleLocal: {
      te: 'కర్నూలు-నంద్యాల హైవే బైపాస్ విస్తరణ పనులు',
      hi: 'कुरनूल-नंदयाल हाईवे बाईपास विस्तार'
    },
    category: 'Road',
    budget: 85.0, // Crores
    contractor: 'Venkata Sai Construction & Co.',
    location: 'Kurnool Outer Bypass Zone',
    locationLocal: {
      te: 'కర్నూలు ఔటర్ బైపాస్ జోన్',
      hi: 'कुरनूल बाहरी बाईपास क्षेत्र'
    },
    completionPercent: 55,
    expectedCompletionDate: '2027-03-15',
    details: 'Widening of a 12km stretch into a 4-lane bypass road. Budget includes earthmoving, asphalt layers, drainage conduits, and solar street illumination.',
    detailsLocal: {
      te: '12 కిలోమీటర్ల రహదారిని 4-లేన్ల బైపాస్ రోడ్డుగా విస్తరించడం. బడ్జెట్‌లో తవ్వకాలు, తారు రోడ్డు, డ్రైనేజీ మరియు సోలార్ వీధి దీపాలు చేర్చబడ్డాయి.',
      hi: '12 किमी लंबे मार्ग को 4-लेन बाईपास सड़क में चौड़ा करना। बजट में मिट्टी की खुदाई, डामर परतें, जल निकासी और सौर स्ट्रीट लाइट शामिल हैं।'
    },
    lat: 68,
    lng: 25,
    flagged: true,
    flagReason: 'The reported budget of ₹85.0 Crore is exceptionally high for a standard 12km 4-lane bypass in this terrain. Independent estimation suggests maximum cost of ₹48.5 Crore.',
    flagReasonLocal: {
      te: 'ఈ ప్రాంతంలో 12 కిలోమీటర్ల 4-లేన్ రోడ్డుకు ₹85.0 కోట్ల బడ్జెట్ చాలా ఎక్కువ. స్వతంత్ర అంచనా ప్రకారం గరిష్ట వ్యయం ₹48.5 కోట్లు మాత్రమే ఉండాలి.',
      hi: 'इस क्षेत्र में 12 किमी 4-लेन बाईपास के लिए ₹85.0 करोड़ का बजट बहुत अधिक है। स्वतंत्र मूल्यांकन के अनुसार अधिकतम लागत ₹48.5 करोड़ होनी चाहिए।'
    },
    estimatedCostRange: { min: 42.0, max: 48.5 }
  },
  {
    id: 'proj_primary_health_center',
    title: 'Anantapur Village Primary Health Center & Maternity Ward',
    titleLocal: {
      te: 'అనంతపురం గ్రామ ప్రాథమిక ఆరోగ్య కేంద్రం మరియు ప్రసూతి వార్డు',
      hi: 'अनंतपुर ग्राम प्राथमिक स्वास्थ्य केंद्र और प्रसूति वार्ड'
    },
    category: 'Hospital',
    budget: 3.2, // Crores
    contractor: 'Apex Buildwell Corp',
    location: 'Dharmavaram Rural, Anantapur',
    locationLocal: {
      te: 'ధర్మవరం గ్రామీణ ప్రాంతం, అనంతపురం',
      hi: 'धर्मवरम ग्रामीण, अनंतपुर'
    },
    completionPercent: 95,
    expectedCompletionDate: '2026-08-01',
    details: 'A two-story state-of-the-art village hospital building containing a 15-bed general ward, dedicated maternity unit, fully equipped pharmacy, and doctor quarters.',
    detailsLocal: {
      te: '15 పడకల జనరల్ వార్డు, ప్రసూతి విభాగం, ఫార్మసీ మరియు వైద్యుల నివాస గృహాలతో కూడిన రెండంతస్తుల ఆసుపత్రి భవన నిర్మాణం.',
      hi: '15 बिस्तरों वाला सामान्य वार्ड, समर्पित प्रसूति इकाई, सुसज्जित फार्मेसी और डॉक्टर आवासों वाला एक दो मंजिला ग्रामीण अस्पताल।'
    },
    lat: 82,
    lng: 32,
    flagged: false,
    estimatedCostRange: { min: 2.8, max: 3.4 }
  },
  {
    id: 'proj_district_school',
    title: 'Nellore Model School & Technology Laboratory Block',
    titleLocal: {
      te: 'నెల్లూరు మోడల్ స్కూల్ మరియు టెక్నాలజీ ల్యాబ్ బ్లాక్ నిర్మాణం',
      hi: 'नेल्लोर मॉडल स्कूल और प्रौद्योगिकी प्रयोगशाला ब्लॉक'
    },
    category: 'School',
    budget: 6.8, // Crores
    contractor: 'Sri Balaji Builders & Infras',
    location: 'Kavali Mandal, Nellore District',
    locationLocal: {
      te: 'కావలి మండలం, నెల్లూరు జిల్లా',
      hi: 'कावली मंडल, नेल्लोर जिला'
    },
    completionPercent: 40,
    expectedCompletionDate: '2027-01-10',
    details: 'Construction of a primary/secondary school wing with 18 digital classrooms, computer lab, chemistry laboratory, assembly ground, and clean toilet blocks.',
    detailsLocal: {
      te: '18 డిజిటల్ తరగతి గదులు, కంప్యూటర్ ల్యాబ్, కెమిస్ట్రీ ల్యాబ్, అసెంబ్లీ గ్రౌండ్ మరియు మరుగుదొడ్లతో కూడిన పాఠశాల భవన నిర్మాణం.',
      hi: '18 डिजिटल क्लासरूम, कंप्यूटर लैब, रसायन विज्ञान प्रयोगशाला, असेंबली ग्राउंड और शौचालयों वाले स्कूल विंग का निर्माण।'
    },
    lat: 52,
    lng: 64,
    flagged: false,
    estimatedCostRange: { min: 6.0, max: 7.2 }
  },
  {
    id: 'proj_godavari_bridge',
    title: 'East Godavari Rural Connecting Bridge',
    titleLocal: {
      te: 'తూర్పు గోదావరి గ్రామీణ కనెక్టింగ్ వంతెన',
      hi: 'पूर्वी गोदावरी ग्रामीण संपर्क पुल'
    },
    category: 'Bridge',
    budget: 18.2, // Crores
    contractor: 'East Coast Bridges Ltd.',
    location: 'Rajahmundry Rural Sector',
    locationLocal: {
      te: 'రాజమండ్రి గ్రామీణ విభాగం',
      hi: 'राजमुंदरी ग्रामीण क्षेत्र'
    },
    completionPercent: 25,
    expectedCompletionDate: '2027-09-30',
    details: 'Pre-stressed concrete bridge across the Godavari canal, length 240 meters with dual walkways, connecting 8 remote island villages to the mainland market road.',
    detailsLocal: {
      te: 'గోదావరి కాలువపై 240 మీటర్ల పొడవు గల కాంక్రీట్ వంతెన నిర్మాణం, ఇది 8 లంక గ్రామాలను ప్రధాన మార్కెట్ రోడ్డుతో కలుపుతుంది.',
      hi: 'गोदावरी नहर पर 240 मीटर लंबा कंक्रीट पुल, जो 8 दूरदराज के द्वीपीय गांवों को मुख्य बाजार सड़क से जोड़ेगा।'
    },
    lat: 22,
    lng: 78,
    flagged: false,
    estimatedCostRange: { min: 16.5, max: 19.5 }
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'scheme',
    title: 'New Welfare Schemes Eligible For You',
    titleLocal: {
      te: 'మీకు సరిపోయే కొత్త ప్రభుత్వ పథకాలు లభ్యం',
      hi: 'आपके लिए नई कल्याणकारी योजनाएं उपलब्ध हैं'
    },
    message: 'Based on your profile, you are eligible for the Rythu Bharosa Farmer Financial Support. Register before August 31, 2026 to claim your support.',
    messageLocal: {
      te: 'మీ వివరాల ప్రకారం, మీరు రైతు భరోసా పథకానికి అర్హులు. మీ సహాయాన్ని పొందడానికి ఆగస్టు 31, 2026 లోపు నమోదు చేసుకోండి.',
      hi: 'आपके प्रोफाइल के आधार पर, आप रायथु भरोसा किसान सहायता के लिए पात्र हैं। सहायता प्राप्त करने के लिए 31 अगस्त, 2026 से पहले पंजीकरण करें।'
    },
    date: '2026-07-04',
    read: false
  },
  {
    id: 'notif_2',
    type: 'project',
    title: 'Infrastructure Project Flagged Near You',
    titleLocal: {
      te: 'మీ సమీపంలో ప్రభుత్వ ప్రాజెక్ట్ బడ్జెట్ తేడాగా గుర్తించబడింది',
      hi: 'आपके निकट बुनियादी ढांचा परियोजना में अंतर पाया गया'
    },
    message: 'The Kurnool-Nandyal Highway Bypass Project has been flagged with a 40% budget excess compared to independent estimates. Tap to view the audited details.',
    messageLocal: {
      te: 'కర్నూలు-నంద్యాల హైవే బైపాస్ ప్రాజెక్ట్ బడ్జెట్ స్వతంత్ర అంచనాల కంటే 40% ఎక్కువగా ఉన్నట్లు గుర్తించబడింది. వివరాలు చూడటానికి క్లిక్ చేయండి.',
      hi: 'कुरनूल-नंदयाल हाईवे बाईपास परियोजना में स्वतंत्र अनुमानों की तुलना में 40% अधिक बजट का अंतर पाया गया है। विवरण देखने के लिए टैप करें।'
    },
    date: '2026-07-03',
    read: false
  },
  {
    id: 'notif_3',
    type: 'general',
    title: 'Aadhaar Card Document Verified',
    titleLocal: {
      te: 'ఆధార్ కార్డ్ పత్రం విజయవంతంగా ధృవీకరించబడింది',
      hi: 'आधार कार्ड दस्तावेज सफलतापूर्वक सत्यापित हुआ'
    },
    message: 'Your scanned Aadhaar Card was processed. All profile fields have been updated correctly and securely.',
    messageLocal: {
      te: 'మీ ఆధార్ కార్డ్ విజయవంతంగా ప్రాసెస్ చేయబడింది. మీ ప్రొఫైల్ వివరాలు సురక్షితంగా నవీకరించబడ్డాయి.',
      hi: 'आपके आधार कार्ड को सफलतापूर्वक प्रोसेस किया गया। सभी प्रोफाइल विवरण सुरक्षित रूप से अपडेट कर दिए गए हैं।'
    },
    date: '2026-07-04',
    read: true
  }
];
