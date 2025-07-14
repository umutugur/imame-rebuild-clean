export default {
  expo: {
    name: "İmame",
    slug: "imame",
    scheme: "imame",
     icon: "./assets/logo.png",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#FDF6E3"
    },
    main: "index.js",
    platforms: ["android", "ios"],
    updates: {
      enabled: false
    },
    extra: {
      eas: {
        projectId: "2de51fda-069e-4bcc-b5c4-a3add9da16d7"
      }
    },
    android: {
      package: "com.umutugur.imame",
      googleServicesFile: "./google-services.json",
      permissions: ["NOTIFICATIONS"],
       intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "imame", // Uygulamanızın özel şeması
              // host: "oauthredirect", // Google Sign-In için bazen gerekli olabilir, ama önce hostsiz deneyelim
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      // **********************
    },
    ios: { // iOS ayarlarını da ekleyelim (eğer varsa)
      supportsTablet: true,
      bundleIdentifier: "com.umutugur.imame" // iOS paket adınız, eğer iOS kullanıyorsanız
    }
  }
};
