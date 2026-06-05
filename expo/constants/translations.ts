export const translations = {
  en: {
    dashboard: {
      greeting: "Namaste",
      activeCrops: "You have {count} active crop{plural} growing",
      welcome: "Welcome to AISmartKisan",
      stats: {
        active: "Active",
        harvestingSoon: "Harvesting Soon",
        activities: "Activities",
        harvested: "Harvested",
      },
      sections: {
        activeCrops: "Active Crops",
        upcomingHarvests: "Upcoming Harvests",
        recentActivities: "Recent Activities",
        seeAll: "See All",
      },
      empty: {
        title: "Welcome to Kishan!",
        subtitle: "Start managing your crops from sowing to harvest. Tap the + button to add your first crop.",
        button: "Add First Crop",
      }
    },
    tabs: {
      dashboard: "Dashboard",
      crops: "My Crops",
      activities: "Activities",
      disease: "Disease Scan",
      profile: "Profile",
      suggestions: "Crop Advisor",
    },
    profile: {
      settings: "Settings",
      language: "Language",
      support: "Support",
      contactExpert: "Contact Expert",
      logout: "Logout",
      logoutConfirm: "Are you sure you want to logout?",
      cancel: "Cancel",
    },
    language: {
      title: "Choose Language",
      subtitle: "Select your preferred language",
      continue: "Continue",
    },
    diseaseDiagnosis: {
      title: "Disease Diagnosis",
      scanTitle: "Scan Your Crop",
      scanSubtitle: "Take a photo or upload from gallery to identify diseases and get treatment suggestions",
      takePhoto: "Take Photo",
      gallery: "Gallery",
      tipsTitle: "Tips for Better Results",
      tips: [
        "Take a close-up photo of the affected area",
        "Ensure good lighting - natural daylight is best",
        "Include both healthy and diseased parts if possible",
        "Avoid blurry or shaky images"
      ],
      linkToCrop: "Link to your crop (optional)",
      none: "None",
      analyzeButton: "Analyze for Diseases",
      analyzing: "Analyzing your crop...",
      analyzingSub: "Our AI is examining the photo for diseases and pests",
      confidence: "Confidence",
      affectedPart: "Affected Part",
      symptomsTitle: "Symptoms Identified",
      treatmentsTitle: "Treatment Methods",
      organic: "Organic",
      chemical: "Chemical",
      timing: "When to apply:",
      preventionTitle: "Prevention Tips",
      scanAgain: "Scan Another Crop",
      permissionTitle: "Permission Required",
      cameraPermission: "Camera permission is needed to take photos.",
      galleryPermission: "Gallery permission is needed to select photos.",
      selectImageError: "Please select an image first.",
      analyzeError: "Failed to analyze the image. Please try again with a clearer photo."
    },
    suggestions: {
      title: "Crop Advisor",
      subtitle: "Get smart crop recommendations based on your soil, water quality, location, and season.",
      season: "Season",
      seasonHint: "Auto-detected from current month. You can override.",
      location: "Your Location",
      locationPlaceholder: "Select your state...",
      soilProfile: "Soil & Water Profile",
      soilHint: "Optional – leave blank if you do not have a lab report.",
      soilType: "Soil Type",
      ph: "Soil pH",
      waterEc: "Water EC (dS/m)",
      nitrogen: "Nitrogen (kg/ha)",
      analyzeButton: "Get Crop Suggestions",
      analyzing: "Analyzing...",
      resultsTitle: "{count} crops checked for {season}",
      recommendedCrops: "Recommended Crops",
      otherCrops: "Other {season} Crops (Low Match)",
      noMatches: "No strong matches found. Try adjusting your soil type or season.",
      matchLabels: {
        excellent: "Excellent Match",
        good: "Good Match",
        fair: "Fair Match",
        low: "Low Match"
      },
      card: {
        daysToHarvest: "~{days} days to harvest",
        whySuits: "Why it suits you",
        considerations: "Considerations",
        varieties: "Recommended Varieties"
      },
      chat: {
        title: "Farmer Chat Assistant",
        subtitle: "Ask farming queries in your language and get suggestions.",
        placeholder: "Type your farming question...",
        voiceErrorAndroid: "Voice input is currently available on Android only.",
        voiceErrorUnavailable: "Speech recognition is not available on this device.",
        voiceErrorPermission: "Please grant microphone permission to use voice input."
      },
      seasons: {
        kharif: "Kharif",
        rabi: "Rabi",
        zaid: "Zaid"
      },
      soilTypes: {
        clay: "Clay",
        sandy: "Sandy",
        loamy: "Loamy",
        silt: "Silt",
        red: "Red Soil",
        black: "Black (Regur)",
        alluvial: "Alluvial",
        laterite: "Laterite"
      }
    }
  },
  hi: {
    dashboard: {
      greeting: "नमस्ते",
      activeCrops: "आपकी {count} फसलें अभी बढ़ रही हैं",
      welcome: "AISmartKisan में आपका स्वागत है",
      stats: {
        active: "सक्रिय",
        harvestingSoon: "जल्द कटाई",
        activities: "गतिविधियां",
        harvested: "कटाई हुई",
      },
      sections: {
        activeCrops: "सक्रिय फसलें",
        upcomingHarvests: "आगामी कटाई",
        recentActivities: "हाल की गतिविधियां",
        seeAll: "सभी देखें",
      },
      empty: {
        title: "किसान में आपका स्वागत है!",
        subtitle: "बुआई से कटाई तक अपनी फसलों का प्रबंधन शुरू करें। अपनी पहली फसल जोड़ने के लिए + बटन दबाएं।",
        button: "पहली फसल जोड़ें",
      }
    },
    tabs: {
      dashboard: "डैशबोर्ड",
      crops: "मेरी फसलें",
      activities: "गतिविधियां",
      disease: "रोग जांच",
      profile: "प्रोफ़ाइल",
      suggestions: "फसल सलाहकार",
    },
    profile: {
      settings: "सेटिंग्स",
      language: "भाषा",
      support: "सहायता",
      contactExpert: "विशेषज्ञ से संपर्क करें",
      logout: "लॉगआउट",
      logoutConfirm: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
      cancel: "รद्द करें",
    },
    language: {
      title: "भाषा चुनें",
      subtitle: "अपनी पसंदीदा भाषा चुनें",
      continue: "जारी रखें",
    },
    diseaseDiagnosis: {
      title: "रोग निदान",
      scanTitle: "अपनी फसल को स्कैन करें",
      scanSubtitle: "बीमारियों की पहचान करने और उपचार के सुझाव प्राप्त करने के लिए एक फोटो लें या गैलरी से अपलोड करें",
      takePhoto: "फोटो लें",
      gallery: "गैलरी",
      tipsTitle: "बेहतर परिणामों के लिए सुझाव",
      tips: [
        "प्रभावित क्षेत्र की क्लोज-अप फोटो लें",
        "अच्छी रोशनी सुनिश्चित करें - प्राकृतिक दिन का उजाला सबसे अच्छा है",
        "यदि संभव हो तो स्वस्थ और रोगग्रस्त दोनों भागों को शामिल करें",
        "धुंधली या हिलती हुई छवियों से बचें"
      ],
      linkToCrop: "अपनी फसल से जोड़ें (वैकल्पिक)",
      none: "कोई नहीं",
      analyzeButton: "बीमारियों के लिए विश्लेषण करें",
      analyzing: "आपकी फसल का विश्लेषण किया जा रहा है...",
      analyzingSub: "हमारा AI बीमारियों और कीटों के लिए फोटो की जांच कर रहा है",
      confidence: "विश्वास स्तर",
      affectedPart: "प्रभावित हिस्सा",
      symptomsTitle: "पहचाने गए लक्षण",
      treatmentsTitle: "उपचार के तरीके",
      organic: "जैविक",
      chemical: "रासायनिक",
      timing: "कब लागू करें:",
      preventionTitle: "रोकथाम के सुझाव",
      scanAgain: "एक और फसल स्कैन करें",
      permissionTitle: "अनुमति आवश्यक",
      cameraPermission: "फोटो लेने के लिए कैमरा अनुमति की आवश्यकता है।",
      galleryPermission: "फोटो चुनने के लिए गैलरी अनुमति की आवश्यकता है।",
      selectImageError: "कृपया पहले एक छवि चुनें।",
      analyzeError: "छवि का विश्लेषण करने में विफल। कृपया स्पष्ट फोटो के साथ पुनः प्रयास करें।"
    },
    suggestions: {
      title: "फसल सलाहकार",
      subtitle: "अपनी मिट्टी, पानी की गुणवत्ता, स्थान और मौसम के आधार पर स्मार्ट फसल सुझाव प्राप्त करें।",
      season: "मौसम",
      seasonHint: "वर्तमान महीने से स्वतः पता लगाया गया। आप इसे बदल सकते हैं।",
      location: "आपका स्थान",
      locationPlaceholder: "अपना राज्य चुनें...",
      soilProfile: "मिट्टी और पानी की जानकारी",
      soilHint: "वैकल्पिक - यदि आपके पास लैब रिपोर्ट नहीं है तो खाली छोड़ दें।",
      soilType: "मिट्टी का प्रकार",
      ph: "मिट्टी का पीएच (pH)",
      waterEc: "पानी ईसी (dS/m)",
      nitrogen: "नाइट्रोजन (kg/ha)",
      analyzeButton: "फसल सुझाव प्राप्त करें",
      analyzing: "विश्लेषण किया जा रहा है...",
      resultsTitle: "{season} के लिए {count} फसलों की जाँच की गई",
      recommendedCrops: "अनुशंसित फसलें",
      otherCrops: "अन्य {season} फसलें (कम मेल)",
      noMatches: "कोई मजबूत मेल नहीं मिला। अपनी मिट्टी के प्रकार या मौसम को समायोजित करने का प्रयास करें।",
      matchLabels: {
        excellent: "उत्कृष्ट मेल",
        good: "अच्छा मेल",
        fair: "ठीक-ठाक मेल",
        low: "कम मेल"
      },
      card: {
        daysToHarvest: "कटाई के लिए ~{days} दिन",
        whySuits: "यह आपके लिए क्यों उपयुक्त है",
        considerations: "ध्यान देने योग्य बातें",
        varieties: "अनुशंसित किस्में"
      },
      chat: {
        title: "किसान चैट सहायक",
        subtitle: "अपनी भाषा में खेती से जुड़े सवाल पूछें और सुझाव पाएं।",
        placeholder: "अपना खेती का सवाल लिखें...",
        voiceErrorAndroid: "वॉइस इनपुट वर्तमान में केवल Android पर उपलब्ध है।",
        voiceErrorUnavailable: "इस डिवाइस पर स्पीच रिकग्निशन उपलब्ध नहीं है।",
        voiceErrorPermission: "वॉइस इनपुट का उपयोग करने के लिए कृपया माइक्रोफ़ोन अनुमति दें।"
      },
      seasons: {
        kharif: "खरीफ",
        rabi: "रबी",
        zaid: "जायद"
      },
      soilTypes: {
        clay: "चिकनी मिट्टी",
        sandy: "रेतीली मिट्टी",
        loamy: "दोमट मिट्टी",
        silt: "गाद",
        red: "लाल मिट्टी",
        black: "काली मिट्टी",
        alluvial: "जलोढ़ मिट्टी",
        laterite: "लैटराइट मिट्टी"
      }
    }
  },
  gu: {
    dashboard: {
      greeting: "નમસ્તે",
      activeCrops: "તમારી પાસે {count} સક્રિય પાક ઉગી રહ્યા છે",
      welcome: "AISmartKisan માં તમારું સ્વાગત છે",
      stats: {
        active: "સક્રિય",
        harvestingSoon: "ટૂંક સમયમાં કાપણી",
        activities: "પ્રવૃત્તિઓ",
        harvested: "કાપણી કરેલ",
      },
      sections: {
        activeCrops: "સક્રિય પાક",
        upcomingHarvests: "આગામી કાપણી",
        recentActivities: "તાજેતરની પ્રવૃત્તિઓ",
        seeAll: "બધા જુઓ",
      },
      empty: {
        title: "કિસાનમાં સ્વાગત છે!",
        subtitle: "વાવણીથી કાપણી સુધી તમારા પાકનું સંચાલન શરૂ કરો. તમારો પહેલો પાક ઉમેરવા માટે + બટન દબાવો.",
        button: "પહેલો પાક ઉમેરો",
      }
    },
    tabs: {
      dashboard: "ડેશબોર્ડ",
      crops: "મારા પાક",
      activities: "પ્રવૃત્તિઓ",
      disease: "રોગ સ્કેન",
      profile: "પ્રોફાઇલ",
      suggestions: "પાક સલાહકાર",
    },
    profile: {
      settings: "સેટિંગ્સ",
      language: "ભાષા",
      support: "સપોર્ટ",
      contactExpert: "નિષ્ણાતનો સંપર્ક કરો",
      logout: "લોગઆઉટ",
      logoutConfirm: "શું તમે ખરેખર લોગઆઉટ કરવા માંગો છો?",
      cancel: "રદ કરો",
    },
    language: {
      title: "ભાષા પસંદ કરો",
      subtitle: "તમારી પસંદગીની ભાષા પસંદ કરો",
      continue: "ચાલુ રાખો",
    },
    diseaseDiagnosis: {
      title: "રોગ નિદાન",
      scanTitle: "તમારો પાક સ્કેન કરો",
      scanSubtitle: "રોગો ઓળખવા અને સારવારના સૂચનો મેળવવા માટે ફોટો લો અથવા ગેલેરીમાંથી અપલોડ કરો",
      takePhoto: "ફોટો લો",
      gallery: "ગેલેરી",
      tipsTitle: "વધુ સારા પરિણામો માટે ટિપ્સ",
      tips: [
        "અસરગ્રસ્ત વિસ્તારનો ક્લોઝ-અપ ફોટો લો",
        "સારી લાઇટિંગ સુનિશ્ચિત કરો - કુદરતી દિવસનો પ્રકાશ શ્રેષ્ઠ છે",
        "શક્ય હોય તો તંદુરસ્ત અને રોગગ્રસ્ત બંને ભાગોનો સમાવેશ કરો",
        "ઝાંખી અથવા હલતી છબીઓ ટાળો"
      ],
      linkToCrop: "તમારા પાક સાથે લિંક કરો (વૈકલ્પિક)",
      none: "કોઈ નહીં",
      analyzeButton: "રોગો માટે વિશ્લેષણ કરો",
      analyzing: "તમારા પાકનું વિશ્લેષણ થઈ રહ્યું છે...",
      analyzingSub: "અમારો AI રોગો અને જીવાતો માટે ફોટોની તપાસ કરી રહ્યો છે",
      confidence: "વિશ્વાસ સ્તર",
      affectedPart: "અસરગ્રસ્ત ભાગ",
      symptomsTitle: "ઓળખાયેલ લક્ષણો",
      treatmentsTitle: "સારવારની પદ્ધતિઓ",
      organic: "જૈવિક",
      chemical: "રાસાયણિક",
      timing: "ક્યારે લાગુ કરવું:",
      preventionTitle: "નિવારણ ટિપ્સ",
      scanAgain: "બીજો પાક સ્કેન કરો",
      permissionTitle: "પરવાનગી જરૂરી",
      cameraPermission: "ફોટા લેવા માટે કેમેરાની પરવાનગી જરૂરી છે.",
      galleryPermission: "ફોટા પસંદ કરવા માટે ગેલેરીની પરવાનગી જરૂરી છે.",
      selectImageError: "કૃપા કરીને પહેલા એક છબી પસંદ કરો.",
      analyzeError: "છબીનું વિશ્લેષણ કરવામાં નિષ્ફળ. કૃપા કરીને સ્પષ્ટ ફોટા સાથે ફરી પ્રયાસ કરો."
    },
    suggestions: {
      title: "પાક સલાહકાર",
      subtitle: "તમારી જમીન, પાણીની ગુણવત્તા, સ્થાન અને સીઝનના આધારે સ્માર્ટ પાક સૂચનો મેળવો.",
      season: "સીઝન",
      seasonHint: "વર્તમાન મહિનાથી આપમેળે શોધાયેલ. તમે તેને બદલી શકો છો.",
      location: "તમારું સ્થાન",
      locationPlaceholder: "તમારું રાજ્ય પસંદ કરો...",
      soilProfile: "જમીન અને પાણીની પ્રોફાઇલ",
      soilHint: "વૈકલ્પિક – જો તમારી પાસે લેબ રિપોર્ટ ન હોય તો ખાલી છોડો.",
      soilType: "જમીનનો પ્રકાર",
      ph: "જમીન pH",
      waterEc: "પાણી EC (dS/m)",
      nitrogen: "નાઇટ્રોજન (kg/ha)",
      analyzeButton: "પાક સૂચનો મેળવો",
      analyzing: "વિશ્લેષણ થઈ રહ્યું છે...",
      resultsTitle: "{season} માટે {count} પાક તપાસવામાં આવ્યા",
      recommendedCrops: "ભલામણ કરેલ પાક",
      otherCrops: "અન્ય {season} પાક (ઓછું મેચ)",
      noMatches: "કોઈ મજબૂત મેચ મળી નથી. તમારી જમીનનો પ્રકાર અથવા સીઝન બદલવાનો પ્રયાસ કરો.",
      matchLabels: {
        excellent: "ઉત્તમ મેચ",
        good: "સારી મેચ",
        fair: "સાધારણ મેચ",
        low: "ઓછી મેચ"
      },
      card: {
        daysToHarvest: "કાપણી માટે ~{days} દિવસ",
        whySuits: "તે તમને કેમ અનુકૂળ છે",
        considerations: "ધ્યાનમાં લેવાની બાબતો",
        varieties: "ભલામણ કરેલ જાતો"
      },
      chat: {
        title: "ખેડૂત ચેટ સહાયક",
        subtitle: "તમારી ભાષામાં ખેતીના પ્રશ્નો પૂછો અને સૂચનો મેળવો.",
        placeholder: "તમારો ખેતીનો પ્રશ્ન લખો...",
        voiceErrorAndroid: "વૉઇસ ઇનપુટ હાલમાં ફક્ત Android પર ઉપલબ્ધ છે.",
        voiceErrorUnavailable: "આ ઉપકરણ પર સ્પીચ રેકગ્નિશન ઉપલબ્ધ નથી.",
        voiceErrorPermission: "વૉઇસ ઇનપુટ વાપરવા માટે કૃપા કરીને માઇક્રોફોન પરવાનગી આપો."
      },
      seasons: {
        kharif: "ખરીફ",
        rabi: "રવી",
        zaid: "ઝાયદ"
      },
      soilTypes: {
        clay: "ચીકણી જમીન",
        sandy: "રેતાળ જમીન",
        loamy: "ગોરાડુ જમીન",
        silt: "કાંપવાળી જમીન",
        red: "લાલ જમીન",
        black: "કાળી જમીન",
        alluvial: "કાંપની જમીન",
        laterite: "લેટરાઈટ જમીન"
      }
    }
  },
  mr: {
    dashboard: {
      greeting: "नमस्ते",
      activeCrops: "तुमची {count} पिके सध्या वाढत आहेत",
      welcome: "AISmartKisan मध्ये तुमचे स्वागत आहे",
      stats: {
        active: "सक्रिय",
        harvestingSoon: "लवकरच कापणी",
        activities: "उपक्रम",
        harvested: "कापणी झालेली",
      },
      sections: {
        activeCrops: "सक्रिय पिके",
        upcomingHarvests: "येणारी कापणी",
        recentActivities: "अलीकडील उपक्रम",
        seeAll: "सर्व पहा",
      },
      empty: {
        title: "किसान मध्ये स्वागत आहे!",
        subtitle: "पेरणीपासून कापणीपर्यंत तुमच्या पिकांचे व्यवस्थापन सुरू करा. तुमचे पहिले पीक जोडण्यासाठी + बटण दाबा.",
        button: "પહેલે પીક જોડા",
      }
    },
    tabs: {
      dashboard: "डॅशबोर्ड",
      crops: "माझी पिके",
      activities: "उपक्रम",
      disease: "रोग स्कॅन",
      profile: "प्रोफाइल",
      suggestions: "पीक सल्लागार",
    },
    profile: {
      settings: "सेटिंग्ज",
      language: "भाषा",
      support: "सपोर्ट",
      contactExpert: "तज्ज्ञांशी संपर्क साधा",
      logout: "लॉगआउट",
      logoutConfirm: "तुम्हाला नक्की लॉगआउट करायचे आहे का?",
      cancel: "रद्द करा",
    },
    language: {
      title: "भाषा निवडा",
      subtitle: "तुमची पसंतीची भाषा निवडा",
      continue: "पुढे जा",
    },
    diseaseDiagnosis: {
      title: "रोग निदान",
      scanTitle: "तुमचे पीक स्कॅन करा",
      scanSubtitle: "रोग ओळखण्यासाठी आणि उपचारांचे सुचविलेले उपाय मिळवण्यासाठी फोटो घ्या किंवा गॅलरीतून अपलोड करा",
      takePhoto: "फोटो घ्या",
      gallery: "गॅलरी",
      tipsTitle: "उत्तम निकालांसाठी टिप्स",
      tips: [
        "प्रभावित भागाचा क्लोज-अप फोटो घ्या",
        "चांगला प्रकाश असल्याची खात्री करा - नैसर्गिक सूर्यप्रकाश सर्वोत्तम आहे",
        "शक्य असल्यास निरोगी आणि रोगट दोन्ही भाग समाविष्ट करा",
        "अस्पष्ट किंवा हलणारे फोटो टाळा"
      ],
      linkToCrop: "तुमच्या पिकाशी जोडा (पर्यायी)",
      none: "काहीही नाही",
      analyzeButton: "रोगांचे विश्लेषण करा",
      analyzing: "तुमच्या पिकाचे विश्लेषण होत आहे...",
      analyzingSub: "आमचा AI रोग आणि कीड ओळखण्यासाठी फोटो तपासत आहे",
      confidence: "विश्वास पातळी",
      affectedPart: "प्रभावित भाग",
      symptomsTitle: "ओळखलेली लक्षणे",
      treatmentsTitle: "उपचार पद्धती",
      organic: "सेंद्रिय",
      chemical: "रासायनिक",
      timing: "केव्हा वापरायचे:",
      preventionTitle: "प्रतिबंधात्मक टिप्स",
      scanAgain: "दुसरे पीक स्कॅन करा",
      permissionTitle: "परवानगी आवश्यक",
      cameraPermission: "फोटो घेण्यासाठी कॅमेरा परवानगी आवश्यक आहे.",
      galleryPermission: "फोटो निवडण्यासाठी गॅलरी परवानगी आवश्यक आहे.",
      selectImageError: "कृपया आधी एक फोटो निवडा.",
      analyzeError: "फोटोचे विश्लेषण करण्यात अयशस्वी. कृपया स्पष्ट फोटोसह पुन्हा प्रयत्न करा."
    },
    suggestions: {
      title: "पीक सल्लागार",
      subtitle: "तुमची जमीन, पाण्याची गुणवत्ता, ठिकाण आणि हंगामानुसार स्मार्ट पीक सूचना मिळवा.",
      season: "हंगाम",
      seasonHint: "चालू महिन्यावरून आपोआप ओळखले. तुम्ही हे बदलू शकता.",
      location: "तुमचे ठिकाण",
      locationPlaceholder: "तुमचे राज्य निवडा...",
      soilProfile: "जमीन आणि पाणी प्रोफाइल",
      soilHint: "पर्यायी – तुमच्याकडे लॅબ रिपोर्ट नसल्यास रिकामे सोडा.",
      soilType: "जमिनीचा प्रकार",
      ph: "जमीन pH",
      waterEc: "पाणी EC (dS/m)",
      nitrogen: "नायट्रोजन (kg/ha)",
      analyzeButton: "पीक सूचना मिळवा",
      analyzing: "विश्लेषण होत आहे...",
      resultsTitle: "{season} साठी {count} पिके तपासली",
      recommendedCrops: "शिफारस केलेली पिके",
      otherCrops: "इतर {season} पिके (कमी मॅच)",
      noMatches: "कोणतीही ठोस मॅच मिळाली नाही. तुमची जमीन प्रकार किंवा हंगाम बदलण्याचा प्रयत्न करा.",
      matchLabels: {
        excellent: "उत्कृष्ट मॅच",
        good: "चांगली मॅच",
        fair: "साधारण मॅच",
        low: "कमी मॅच"
      },
      card: {
        daysToHarvest: "कापणीसाठी ~{days} दिवस",
        whySuits: "हे तुम्हाला का उपयुक्त आहे",
        considerations: "लक्षात घेण्यासारख्या गोष्टी",
        varieties: "शिफारस केलेल्या जाती"
      },
      chat: {
        title: "शेतकरी चॅટ मदतनीस",
        subtitle: "तुमच्या भाषेत शेतीविषयक प्रश्न विचारा आणि सल्ला मिळवा.",
        placeholder: "तुमचा शेतीविषयक प्रश्न लिहा...",
        voiceErrorAndroid: "व्हॉइस इनपुट सध्या फक्त Android वर उपलब्ध आहे.",
        voiceErrorUnavailable: "या डिव्हाइसवर स्पीच रेकग्निशन उपलब्ध नाही.",
        voiceErrorPermission: "व्हॉइस इनपुट वापरण्यासाठी कृपया मायक्रोफोन परवानगी द्या."
      },
      seasons: {
        kharif: "खरीप",
        rabi: "रब्बी",
        zaid: "उन्हाळी (झायદ)"
      },
      soilTypes: {
        clay: "चिकण माती",
        sandy: "रेताड माती",
        loamy: "दुमट माती",
        silt: "गाळाची माती",
        red: "लाल माती",
        black: "काळी माती",
        alluvial: "गाळाची माती (Alluvial)",
        laterite: "जाંભी माती (Laterite)"
      }
    }
  }
};

export type Language = 'en' | 'hi' | 'gu' | 'mr';
export type TranslationKey = typeof translations.en;
