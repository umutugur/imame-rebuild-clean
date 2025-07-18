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
              host: "oauthredirect"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ],
      config: {
        googleMobileAdsAppId: "ca-app-pub-4306778139267554~1925991963" // ✅ Android için uygulama kimliği
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.umutugur.imame",
      config: {
        googleMobileAdsAppId: "ca-app-pub-4306778139267554~1925991963" // ✅ iOS için uygulama kimliği
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 24
          }
        }
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-4306778139267554~1925991963" // 🔥 AdMob plugin için şart
        }
      ]
    ]
  }
};
