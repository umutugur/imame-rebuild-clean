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
              scheme: "imame",
              // host: "oauthredirect", // eğer gerekmiyorsa yorumda bırak
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      // ⬇️ AdMob App ID'nizi girin!
      config: {
        googleMobileAdsAppId: "ca-app-pub-4306778139267554~1925991963"
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.umutugur.imame"
      // Gerekirse ios için de AdMob App ID ekleyebilirsin
    },
    plugins: [
      "react-native-google-mobile-ads",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 24,
          },
          ios: {
            deploymentTarget: "13.0",
          },
        },
      ]
    ]
  }
};
