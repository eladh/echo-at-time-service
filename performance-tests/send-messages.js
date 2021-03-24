import http from "k6/http";

const echoAtTimeUrl = "http://localhost:5000/echoAtTime";

const SHORT_SCHEDULING = 5;
const MEDIUM_SCHEDULING = 20;
const LONG_SCHEDULING = 50;

export const options = {
  vus: 10,
  iterations: 1000000,
};

export default function () {
  generateRequest(
    echoAtTimeUrl,
    Date.now() + (Math.random() * 5 + SHORT_SCHEDULING) * 1000
  );
  generateRequest(
    echoAtTimeUrl,
    Date.now() + (Math.random() * 5 + MEDIUM_SCHEDULING) * 1000
  );
}

function generateRequest(testUrl, timeInFuture) {
  const payload = JSON.stringify({
    content: `some random message ${Math.random()}`,
    timestamp: timeInFuture,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post(testUrl, payload, params);
}
