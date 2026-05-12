export const BUS_NETWORKS = {
  network: "Mawasalat Masr",
  networkAr: "مواصلات مصر",
  cities: [
    {
      id: "shorouk",
      name: "Al Shorouk",
      nameAr: "مدينة الشروق",
      mapSize: { width: 1000, height: 800 },
      routes: [
        {
          id: "NS1",
          nameAr: "المشتل - بوابة الإسماعيلية (٢)",
          color: "#00A650",
          oneWay: false,
          stops: [
            { id: "ns1_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: true, type: "central_hub" },
            { id: "ns1_midan_shorouk", nameAr: "ميدان شرطة جاد مصر", x: 430, y: 310, terminal: false, type: "intermediate" },
            { id: "ns1_soug", nameAr: "سوق الشروق", x: 480, y: 220, terminal: false, type: "intermediate" },
            { id: "ns1_bawaba2", nameAr: "بوابة الإسماعيلية (٢)", x: 530, y: 140, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS2",
          nameAr: "كارفور الشروق - بوابة السويس (٣)",
          color: "#ED1C24",
          oneWay: false,
          stops: [
            { id: "ns2_carrefour", nameAr: "كارفور الشروق", x: 140, y: 230, terminal: true, type: "terminal" },
            { id: "ns2_midan_hurya", nameAr: "ميدان الحرية", x: 170, y: 270, terminal: false, type: "intermediate" },
            { id: "ns2_soug", nameAr: "سنترال الشروق", x: 260, y: 310, terminal: false, type: "intermediate" },
            { id: "ns2_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: false, type: "interchange" },
            { id: "ns2_hay8", nameAr: "الحي الثامن", x: 360, y: 390, terminal: false, type: "intermediate" },
            { id: "ns2_hay7", nameAr: "الحي السابع", x: 300, y: 460, terminal: false, type: "intermediate" },
            { id: "ns2_may_fair", nameAr: "ماي فير", x: 240, y: 510, terminal: false, type: "intermediate" },
            { id: "ns2_academia", nameAr: "أكاديمية الشروق", x: 200, y: 560, terminal: false, type: "intermediate" },
            { id: "ns2_british_univ", nameAr: "الجامعة البريطانية", x: 180, y: 610, terminal: false, type: "interchange" },
            { id: "ns2_bawaba_suez", nameAr: "بوابة السويس (٣)", x: 430, y: 720, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS4",
          nameAr: "المشتل - بوابة مدينتي",
          color: "#F7941D",
          oneWay: false,
          stops: [
            { id: "ns4_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: true, type: "central_hub" },
            { id: "ns4_hay8", nameAr: "الحي الثامن", x: 360, y: 390, terminal: false, type: "intermediate" },
            { id: "ns4_hay7", nameAr: "الحي السابع", x: 300, y: 460, terminal: false, type: "intermediate" },
            { id: "ns4_may_fair", nameAr: "ماي فير", x: 240, y: 510, terminal: false, type: "intermediate" },
            { id: "ns4_academia", nameAr: "أكاديمية الشروق", x: 200, y: 560, terminal: false, type: "intermediate" },
            { id: "ns4_british_univ", nameAr: "الجامعة البريطانية", x: 180, y: 610, terminal: false, type: "interchange" },
            { id: "ns4_bawaba_madinti", nameAr: "بوابة مدينتي", x: 160, y: 660, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS5",
          nameAr: "المشتل - العباسية",
          color: "#00AEEF",
          oneWay: false,
          stops: [
            { id: "ns5_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: true, type: "central_hub" },
            { id: "ns5_ring_road", nameAr: "الطريق الدائري", x: 320, y: 290, terminal: false, type: "intermediate" },
            { id: "ns5_qawmeya", nameAr: "القومية", x: 300, y: 260, terminal: false, type: "intermediate" },
            { id: "ns5_british_univ", nameAr: "الجامعة البريطانية", x: 180, y: 610, terminal: false, type: "interchange" },
            { id: "ns5_bawaba_madinti", nameAr: "بوابة مدينتي", x: 160, y: 660, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS7",
          nameAr: "المشتل - مترو سراي القبة",
          color: "#8B008B",
          oneWay: false,
          stops: [
            { id: "ns7_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: true, type: "central_hub" },
            { id: "ns7_panorama", nameAr: "بانوراما مول", x: 270, y: 420, terminal: false, type: "intermediate" },
            { id: "ns7_hay6", nameAr: "الحي السادس", x: 240, y: 480, terminal: false, type: "intermediate" },
            { id: "ns7_british_univ", nameAr: "الجامعة البريطانية", x: 180, y: 610, terminal: false, type: "interchange" },
            { id: "ns7_bawaba_madinti", nameAr: "بوابة مدينتي", x: 160, y: 660, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS9",
          nameAr: "المشتل - التجمع الخامس",
          color: "#FFD700",
          oneWay: false,
          stops: [
            { id: "ns9_moshtl", nameAr: "محطة المشتل", x: 320, y: 340, terminal: true, type: "central_hub" },
            { id: "ns9_nozha", nameAr: "ميدان النهضة", x: 350, y: 380, terminal: false, type: "intermediate" },
            { id: "ns9_hay2_east", nameAr: "الحي الثاني شرق", x: 390, y: 410, terminal: false, type: "intermediate" },
            { id: "ns9_soadat", nameAr: "توتال السادات", x: 410, y: 450, terminal: false, type: "intermediate" },
            { id: "ns9_hay3_east", nameAr: "الحي الثالث شرق", x: 430, y: 490, terminal: false, type: "intermediate" },
            { id: "ns9_royal_hosp", nameAr: "مستشفى رويال", x: 420, y: 540, terminal: false, type: "intermediate" },
            { id: "ns9_hay5", nameAr: "الحي الخامس", x: 400, y: 590, terminal: false, type: "intermediate" },
            { id: "ns9_bawaba_suez", nameAr: "بوابة السويس (٢)", x: 380, y: 660, terminal: true, type: "terminal" }
          ]
        }
      ],
      landmarks: [
        { nameAr: "محطة المشتل (المركزية)", type: "hub", x: 320, y: 340 },
        { nameAr: "كارفور الشروق", type: "mall", x: 140, y: 230 },
        { nameAr: "الجامعة البريطانية", type: "university", x: 180, y: 610 },
        { nameAr: "أكاديمية الشروق", type: "university", x: 200, y: 560 },
        { nameAr: "مستشفى الشروق العام", type: "hospital", x: 390, y: 370 },
        { nameAr: "بانوراما مول", type: "mall", x: 270, y: 420 }
      ]
    },
    {
      id: "new_cairo",
      name: "New Cairo",
      nameAr: "مدينة القاهرة الجديدة",
      mapSize: { width: 1100, height: 900 },
      routes: [
        {
          id: "NC1",
          nameAr: "القطامية - التجمع الأول",
          color: "#ED1C24",
          oneWay: false,
          stops: [
            { id: "nc1_qatameya", nameAr: "القطامية", x: 200, y: 820, terminal: true, type: "terminal" },
            { id: "nc1_masakin", nameAr: "مساكن المحمدية", x: 220, y: 780, terminal: false, type: "intermediate" },
            { id: "nc1_katamya_hosp", nameAr: "مستشفى القاهرة الجديدة", x: 250, y: 740, terminal: false, type: "intermediate" },
            { id: "nc1_lotuss_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: false, type: "interchange" },
            { id: "nc1_tajamoa1", nameAr: "محطة التجمع الأول", x: 480, y: 200, terminal: true, type: "central_hub" }
          ]
        },
        {
          id: "NC2",
          nameAr: "اللوتس - القطامية",
          color: "#0047AB",
          oneWay: false,
          stops: [
            { id: "nc2_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: true, type: "central_hub" },
            { id: "nc2_amer_univ", nameAr: "الجامعة الأمريكية", x: 790, y: 540, terminal: false, type: "intermediate" },
            { id: "nc2_point90", nameAr: "بوينت نايتني", x: 760, y: 570, terminal: false, type: "intermediate" },
            { id: "nc2_concorde", nameAr: "كونكورد بلازا", x: 720, y: 590, terminal: false, type: "intermediate" },
            { id: "nc2_dowtown", nameAr: "داون تاون", x: 500, y: 580, terminal: false, type: "intermediate" },
            { id: "nc2_gemal_sq", nameAr: "جمال عبد الناصر", x: 380, y: 590, terminal: false, type: "intermediate" },
            { id: "nc2_court", nameAr: "محكمة القاهرة الجديدة", x: 340, y: 630, terminal: false, type: "intermediate" },
            { id: "nc2_qatameya", nameAr: "القطامية", x: 200, y: 820, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NC3",
          nameAr: "اللوتس - التجمع الثالث",
          color: "#1A1A2E",
          oneWay: false,
          stops: [
            { id: "nc3_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: true, type: "central_hub" },
            { id: "nc3_tajamoa3_hub", nameAr: "محطة التجمع الثالث", x: 310, y: 760, terminal: true, type: "central_hub" },
            { id: "nc3_german_univ", nameAr: "الجامعة الألمانية", x: 340, y: 700, terminal: false, type: "intermediate" },
            { id: "nc3_trigenon", nameAr: "التريانون عمارات", x: 400, y: 660, terminal: false, type: "intermediate" },
            { id: "nc3_qatameya_mosque", nameAr: "مسجد فاطمة الشريني", x: 350, y: 640, terminal: false, type: "intermediate" },
            { id: "nc3_social_club", nameAr: "الإسكان الاجتماعي", x: 250, y: 800, terminal: false, type: "intermediate" }
          ]
        },
        {
          id: "NC4",
          nameAr: "التجمع الأول - المصانع",
          color: "#A020F0",
          oneWay: false,
          stops: [
            { id: "nc4_tajamoa1", nameAr: "محطة التجمع الأول", x: 480, y: 200, terminal: true, type: "central_hub" },
            { id: "nc4_alf_maskan", nameAr: "الألف مصنع", x: 600, y: 820, terminal: true, type: "terminal" },
            { id: "nc4_arden", nameAr: "أردن", x: 560, y: 700, terminal: false, type: "intermediate" },
            { id: "nc4_jasmin_hosp", nameAr: "مستشفى القاهرة الجديدة", x: 540, y: 640, terminal: false, type: "intermediate" },
            { id: "nc4_jasmin", nameAr: "الياسمين (٢)", x: 520, y: 580, terminal: false, type: "intermediate" }
          ]
        },
        {
          id: "NC8",
          nameAr: "بوينت نايتني - دار مصر الأندلس",
          color: "#008080",
          oneWay: false,
          stops: [
            { id: "nc8_point90", nameAr: "بوينت نايتني", x: 760, y: 570, terminal: true, type: "terminal" },
            { id: "nc8_amer_univ", nameAr: "الجامعة الأمريكية", x: 790, y: 540, terminal: false, type: "intermediate" },
            { id: "nc8_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: false, type: "interchange" },
            { id: "nc8_dar_masr", nameAr: "دار مصر الأندلس", x: 870, y: 620, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NS9",
          nameAr: "محطة الغاز - مدينة الشروق",
          color: "#FFD700",
          oneWay: false,
          stops: [
            { id: "ns9_nc_tajamoa1", nameAr: "محطة التجمع الأول", x: 480, y: 200, terminal: false, type: "interchange" },
            { id: "ns9_nc_gas", nameAr: "محطة الغاز", x: 500, y: 560, terminal: false, type: "intermediate" },
            { id: "ns9_nc_shorouk", nameAr: "مدينة الشروق", x: 560, y: 120, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "M5",
          nameAr: "محطة اللوتس - التحرير",
          color: "#00CED1",
          oneWay: false,
          stops: [
            { id: "m5_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: true, type: "central_hub" },
            { id: "m5_future_univ", nameAr: "جامعة المستقبل", x: 750, y: 460, terminal: false, type: "intermediate" },
            { id: "m5_tahrir", nameAr: "التحرير", x: 200, y: 580, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "M8",
          nameAr: "اللوتس - إلى الجيزة",
          color: "#2F4F4F",
          oneWay: false,
          stops: [
            { id: "m8_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: true, type: "central_hub" },
            { id: "m8_shorofat", nameAr: "الشروفات", x: 320, y: 600, terminal: false, type: "intermediate" },
            { id: "m8_silver_ctr", nameAr: "سيلفر سنتر مول", x: 290, y: 620, terminal: false, type: "intermediate" },
            { id: "m8_el_giza", nameAr: "إلى الجيزة", x: 170, y: 580, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "M9",
          nameAr: "اللوتس - إلى المعادي",
          color: "#DAA520",
          oneWay: false,
          stops: [
            { id: "m9_lotus_hub", nameAr: "محطة اللوتس", x: 820, y: 480, terminal: true, type: "central_hub" },
            { id: "m9_qatameya", nameAr: "القطامية", x: 200, y: 820, terminal: false, type: "intermediate" },
            { id: "m9_maadi", nameAr: "إلى المعادي", x: 160, y: 860, terminal: true, type: "terminal" }
          ]
        }
      ],
      landmarks: [
        { nameAr: "محطة اللوتس (المركزية)", type: "hub", x: 820, y: 480 },
        { nameAr: "محطة التجمع الأول", type: "hub", x: 480, y: 200 },
        { nameAr: "محطة التجمع الثالث", type: "hub", x: 310, y: 760 },
        { nameAr: "الجامعة الأمريكية", type: "university", x: 790, y: 540 },
        { nameAr: "الجامعة الألمانية", type: "university", x: 340, y: 700 },
        { nameAr: "بوينت نايتني", type: "mall", x: 760, y: 570 },
        { nameAr: "داون تاون", type: "mall", x: 500, y: 580 },
        { nameAr: "مستشفى القاهرة الجديدة", type: "hospital", x: 540, y: 640 }
      ]
    },
    {
      id: "obour",
      name: "Al Obour",
      nameAr: "مدينة العبور",
      mapSize: { width: 900, height: 1100 },
      routes: [
        {
          id: "AN1",
          nameAr: "جنة العبور - الحي الترفيهي",
          color: "#00A650",
          oneWay: false,
          stops: [
            { id: "an1_ganna", nameAr: "جنة العبور", x: 720, y: 440, terminal: true, type: "central_hub" },
            { id: "an1_idara_taleemia", nameAr: "الإدارة التعليمية", x: 640, y: 360, terminal: false, type: "intermediate" },
            { id: "an1_hay8", nameAr: "الحي ٨", x: 560, y: 300, terminal: false, type: "intermediate" },
            { id: "an1_school_ahliya", nameAr: "مدرسة الإسكان العالمي", x: 520, y: 260, terminal: false, type: "intermediate" },
            { id: "an1_obour_center", nameAr: "العبور", x: 480, y: 230, terminal: false, type: "intermediate" },
            { id: "an1_youth_center", nameAr: "مركز الشباب", x: 460, y: 310, terminal: false, type: "intermediate" },
            { id: "an1_hay2", nameAr: "الحي ٢", x: 430, y: 370, terminal: false, type: "intermediate" },
            { id: "an1_obour_hub", nameAr: "مركز العبور", x: 400, y: 440, terminal: false, type: "interchange" },
            { id: "an1_hay1", nameAr: "الحي ١", x: 380, y: 510, terminal: false, type: "intermediate" },
            { id: "an1_hay_tarfihi", nameAr: "الحي الترفيهي", x: 310, y: 440, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "AN2",
          nameAr: "جنة العبور - كارفور",
          color: "#ED1C24",
          oneWay: false,
          stops: [
            { id: "an2_ganna", nameAr: "جنة العبور", x: 720, y: 440, terminal: true, type: "central_hub" },
            { id: "an2_idara", nameAr: "الإدارة التعليمية", x: 640, y: 360, terminal: false, type: "intermediate" },
            { id: "an2_obour_hub", nameAr: "مركز العبور", x: 400, y: 440, terminal: false, type: "interchange" },
            { id: "an2_sharea_sadat", nameAr: "شارع السادات", x: 380, y: 580, terminal: false, type: "intermediate" },
            { id: "an2_moul_mecca", nameAr: "مول مسجد مكة", x: 360, y: 640, terminal: false, type: "intermediate" },
            { id: "an2_jawaz", nameAr: "جواز العبور الجديدة", x: 340, y: 700, terminal: false, type: "intermediate" },
            { id: "an2_telecom", nameAr: "تيليكوم مصر٢", x: 320, y: 780, terminal: false, type: "intermediate" },
            { id: "an2_soug", nameAr: "سوق العبور", x: 310, y: 900, terminal: false, type: "intermediate" },
            { id: "an2_carrefour", nameAr: "كارفور العبور", x: 300, y: 980, terminal: true, type: "central_hub" }
          ]
        },
        {
          id: "AN3",
          nameAr: "مركز شرطة العبور ٢ - سنتر الياسمين",
          color: "#00AEEF",
          oneWay: false,
          stops: [
            { id: "an3_police", nameAr: "مركز شرطة العبور ٢", x: 580, y: 220, terminal: true, type: "terminal" },
            { id: "an3_hay3", nameAr: "الحي ٣", x: 660, y: 300, terminal: false, type: "intermediate" },
            { id: "an3_ganna", nameAr: "جنة العبور", x: 720, y: 440, terminal: false, type: "interchange" },
            { id: "an3_obour_hub", nameAr: "مركز العبور", x: 400, y: 440, terminal: false, type: "interchange" },
            { id: "an3_ain_shams", nameAr: "مستشفى عين شمس التخصصي", x: 440, y: 480, terminal: false, type: "intermediate" },
            { id: "an3_hay1", nameAr: "الحي ١", x: 380, y: 510, terminal: false, type: "intermediate" },
            { id: "an3_sentrinal", nameAr: "سنتريل العبور", x: 360, y: 420, terminal: false, type: "intermediate" },
            { id: "an3_fahmy_univ", nameAr: "جامعة بنها الفردوس القديس", x: 310, y: 490, terminal: false, type: "intermediate" },
            { id: "an3_recreation", nameAr: "الحي الترفيهي", x: 310, y: 440, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "AN4",
          nameAr: "كارفور - حي الياقوت",
          color: "#8B008B",
          oneWay: true,
          stops: [
            { id: "an4_carrefour", nameAr: "كارفور العبور", x: 300, y: 980, terminal: true, type: "central_hub" },
            { id: "an4_obour_hub", nameAr: "مركز العبور", x: 400, y: 440, terminal: false, type: "interchange" },
            { id: "an4_ganna", nameAr: "جنة العبور", x: 720, y: 440, terminal: false, type: "interchange" },
            { id: "an4_hay_yaqout", nameAr: "حي الياقوت", x: 820, y: 180, terminal: true, type: "terminal" }
          ]
        }
      ],
      landmarks: [
        { nameAr: "جنة العبور (المركزية)", type: "hub", x: 720, y: 440 },
        { nameAr: "مركز العبور", type: "hub", x: 400, y: 440 },
        { nameAr: "كارفور العبور", type: "mall", x: 300, y: 980 },
        { nameAr: "مستشفى عين شمس التخصصي", type: "hospital", x: 440, y: 480 },
        { nameAr: "جامعة بنها", type: "university", x: 310, y: 490 },
        { nameAr: "تيليكوم مصر٢", type: "landmark", x: 320, y: 780 }
      ]
    },
    {
      id: "ramadan",
      name: "10th of Ramadan",
      nameAr: "مدينة العاشر من رمضان",
      mapSize: { width: 1000, height: 1300 },
      routes: [
        {
          id: "NA13",
          nameAr: "الأردنية - الحي ١٢",
          color: "#F7941D",
          oneWay: false,
          stops: [
            { id: "na13_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na13_hay11", nameAr: "الحي ١١", x: 660, y: 360, terminal: false, type: "intermediate" },
            { id: "na13_hay12", nameAr: "الحي ١٢", x: 780, y: 420, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NA15",
          nameAr: "الأردنية - الحي ٤",
          color: "#00A650",
          oneWay: false,
          stops: [
            { id: "na15_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na15_hay2", nameAr: "الحي ٢", x: 260, y: 560, terminal: false, type: "intermediate" },
            { id: "na15_nadi_shabab", nameAr: "نادي الشباب", x: 230, y: 500, terminal: false, type: "intermediate" },
            { id: "na15_hay4", nameAr: "الحي ٤", x: 780, y: 700, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NA16",
          nameAr: "الأردنية - قطاع ٤أ",
          color: "#A020F0",
          oneWay: true,
          stops: [
            { id: "na16_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na16_qitaa4a", nameAr: "قطاع ٤أ", x: 700, y: 940, terminal: true, type: "terminal" },
            { id: "na16_qitaa4b", nameAr: "قطاع ٤ب", x: 780, y: 980, terminal: false, type: "intermediate" },
            { id: "na16_qitaa5a", nameAr: "قطاع ٥أ", x: 820, y: 1020, terminal: false, type: "intermediate" }
          ]
        },
        {
          id: "NA17",
          nameAr: "الأردنية - الحي ٢",
          color: "#8B4513",
          oneWay: false,
          stops: [
            { id: "na17_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na17_manteqa_ordonia", nameAr: "منطقة الأردنية", x: 480, y: 600, terminal: false, type: "intermediate" },
            { id: "na17_shabka", nameAr: "شبكة توزيع الكهرباء", x: 600, y: 580, terminal: false, type: "intermediate" },
            { id: "na17_hay2", nameAr: "الحي ٢", x: 260, y: 560, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NA18",
          nameAr: "الأردنية - الحي ٢٠",
          color: "#00CED1",
          oneWay: false,
          stops: [
            { id: "na18_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na18_9th_hay", nameAr: "الحي التاسع", x: 390, y: 290, terminal: false, type: "intermediate" },
            { id: "na18_sultan", nameAr: "سلطان العويس", x: 150, y: 200, terminal: false, type: "intermediate" },
            { id: "na18_hay30", nameAr: "الحي ٣٠", x: 130, y: 150, terminal: false, type: "intermediate" },
            { id: "na18_hay20", nameAr: "الحي ٢٠", x: 160, y: 220, terminal: true, type: "terminal" }
          ]
        },
        {
          id: "NA19",
          nameAr: "الأردنية - الجامعة الأهلية",
          color: "#FF1493",
          oneWay: false,
          stops: [
            { id: "na19_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na19_univ_ahliya", nameAr: "الجامعة الأهلية", x: 560, y: 340, terminal: true, type: "terminal" },
            { id: "na19_mostawfa_jam", nameAr: "المستشفى الجامعي", x: 520, y: 400, terminal: false, type: "intermediate" },
            { id: "na19_waqf_iqlimy", nameAr: "الموقف الإقليمي الجديد", x: 500, y: 480, terminal: false, type: "intermediate" },
            { id: "na19_mrkz_madina", nameAr: "مركز طبي التاسع", x: 460, y: 320, terminal: false, type: "intermediate" },
            { id: "na19_hay12_b", nameAr: "الحي ١٢", x: 780, y: 420, terminal: false, type: "intermediate" }
          ]
        },
        {
          id: "NA20",
          nameAr: "الأردنية - سراي القبة",
          color: "#FFD700",
          oneWay: false,
          stops: [
            { id: "na20_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na20_saray", nameAr: "سراي القبة", x: 200, y: 900, terminal: true, type: "terminal" },
            { id: "na20_qitaa1", nameAr: "قطاع ١أ", x: 340, y: 820, terminal: false, type: "intermediate" },
            { id: "na20_qitaa2", nameAr: "قطاع ٢", x: 380, y: 860, terminal: false, type: "intermediate" }
          ]
        },
        {
          id: "NA21",
          nameAr: "الأردنية - العاصمة الإدارية",
          color: "#0047AB",
          oneWay: false,
          stops: [
            { id: "na21_ordonia", nameAr: "الأردنية", x: 500, y: 640, terminal: true, type: "central_hub" },
            { id: "na21_admin_cap", nameAr: "العاصمة الإدارية", x: 700, y: 900, terminal: true, type: "terminal" },
            { id: "na21_qitaa1a", nameAr: "قطاع ١أ", x: 340, y: 820, terminal: false, type: "intermediate" }
          ]
        }
      ],
      landmarks: [
        { nameAr: "الأردنية (المركزية)", type: "hub", x: 500, y: 640 },
        { nameAr: "الجامعة الأهلية", type: "university", x: 560, y: 340 },
        { nameAr: "المستشفى الجامعي", type: "hospital", x: 520, y: 400 },
        { nameAr: "الموقف الإقليمي الجديد", type: "hub", x: 500, y: 480 },
        { nameAr: "مركز طبي التاسع", type: "hospital", x: 460, y: 320 },
        { nameAr: "شبكة توزيع الكهرباء", type: "landmark", x: 600, y: 580 },
        { nameAr: "نادي الشباب", type: "club", x: 230, y: 500 },
        { nameAr: "مدرسة السلام العويس النيلية", type: "school", x: 280, y: 420 },
        { nameAr: "مأمورية الضرائب", type: "landmark", x: 560, y: 540 }
      ]
    }
  ]
};

export const CITY_TABS = [
  { id: 'shorouk', nameAr: 'الشروق', nameEn: 'Al Shorouk' },
  { id: 'new_cairo', nameAr: 'القاهرة الجديدة', nameEn: 'New Cairo' },
  { id: 'obour', nameAr: 'العبور', nameEn: 'Al Obour' },
  { id: 'ramadan', nameAr: 'العاشر من رمضان', nameEn: '10th Ramadan' }
];

export function getCityById(cityId) {
  return BUS_NETWORKS.cities.find(c => c.id === cityId);
}

export function getRouteByCity(cityId) {
  const city = getCityById(cityId);
  return city ? city.routes : [];
}

export function getAllRoutes() {
  return BUS_NETWORKS.cities.flatMap(city => city.routes);
}

export function getStopById(cityId, stopId) {
  const city = getCityById(cityId);
  if (!city) return null;
  for (const route of city.routes) {
    const stop = route.stops.find(s => s.id === stopId);
    if (stop) return stop;
  }
  return null;
}