import * as Location from "expo-location";

export const previewRouteModel = {
  async getLocationPermision() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw Error("Permission to access location was denied");
    }
  },
};
