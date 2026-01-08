import { useState } from "react";
import ForgeTrackerAPI from "../api/ForgeTrackerAPI";

export default function useUploadExercise() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  //funkcja do kapitalizacji pierwszej litery
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const uploadExercise = async ({ name, description, muscleGroup, image }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!image) {
        throw new Error("Image is required");
      }

      const capName = capitalize(name);
      const capDescr = capitalize(description);

      const localUri = image.uri;
      const filename = localUri.split("/").pop();

      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      const formData = new FormData();

      formData.append("Name", capName);
      formData.append("Description", capDescr);
      formData.append("MuscleGroup", muscleGroup);

      formData.append("Image", {
        uri: localUri,
        name: filename,
        type: mimeType,
      });

      const response = await ForgeTrackerAPI.post("/exercise", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadExercise,
    loading,
    error,
    success,
  };
}
