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
    updates: { enabled: false },
    extra: {
      eas: {
        projectId: "2de51fda-069e-4bcc-b5c4-a3add9da16d7"
      }
    },
    android: {
      package: "com.umutugur.imame",
      googleServicesFile: "./google-services.json",
      permissions: ["NOTIFICATIONS"],
      // ⬇️ ***AdMob App ID'n buraya!***
      config: {
        googleMobileAdsAppId: "ca-app-pub-4306778139267554~1925991963"
      },
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "imame",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.umutugur.imame",
      // ⬇️ iOS AdMob App ID, gerekirse ekle (AdMob > Uygulama Kimliği)
      config: {
        //googleMobileAdsAppId: "ca-app-pub-4306778139267554~IOS_APP_ID_HENÜZ_YOKSA_SİL"
        // Eğer iOS AdMob App ID yoksa bu satırı geçici silebilirsin
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 24,
          },
          ios: {
            deploymentTarget: "15.1", // Bunu 15.1 yap!
          },
        },
      ],
      "react-native-google-mobile-ads",
    ]
  }
};
