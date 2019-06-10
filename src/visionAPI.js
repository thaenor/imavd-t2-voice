import axios from "axios";
import { APIKEY } from "./GoogleAPIKEY";

export async function getLabelDetection(img) {
  return axios
    .post(`https://vision.googleapis.com/v1/images:annotate?key=${APIKEY}`, {
      requests: [
        {
          image: {
            content: img
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 100
            }
          ]
        }
      ]
    })
    .then(function(response) {
      console.log(response);
      return response.data.responses[0].labelAnnotations;
    })
    .catch(function(error) {
      console.log(error);
    });
}

export async function getDominantColors(img) {
  return axios
    .post(`https://vision.googleapis.com/v1/images:annotate?key=${APIKEY}`, {
      requests: [
        {
          image: {
            content: img
          },
          features: [
            {
              type: "IMAGE_PROPERTIES",
              maxResults: 100
            }
          ]
        }
      ]
    })
    .then(function(response) {
      console.log(response);
      return response
        .data.responses[0].imagePropertiesAnnotation.dominantColors.colors[0];
    })
    .catch(function(error) {
      console.log(error);
    });
}
