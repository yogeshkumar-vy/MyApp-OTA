import { HotUpdater, insights } from "@hot-updater/react-native";
import { Alert } from "react-native";

// const baseURL = "http://10.0.2.2:3000/hot-updater";

// const clientApiKey = "nYxKEH-1YJUaGgTABniKP8I07fTWu9oDwvd8uiwCfF4";

const baseURL = "https://vxewayomuwabgfwfovby.supabase.co/functions/v1/hot-updater-v1";

const clientApiKey = "JzVIfv-kOSDgzPuiQ2TJ_cJQmXR5L3-SgHZ4hg3-62M";

export function reportUpdateError(error: unknown) {
  console.error("Hot Updater:", error);
  Alert.alert("Update failed", "Please try again.");
}
  
export const hotUpdater = HotUpdater.init({
  baseURL,

  requestHeaders: {
    "x-api-key": clientApiKey,
  },
  

  plugins: [
    insights( {debug: true}),
  ],

  onError: (error) => {
    console.error("Hot Updater error:", error);
    reportUpdateError(error);
  },
});