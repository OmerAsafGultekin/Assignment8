const statusEl = document.getElementById('status-code');
const responseEl = document.getElementById('response-body');
const buttons = document.querySelectorAll('.button-grid button');

// Send request and render formatted response
async function callEndpoint(method, url) {
  statusEl.textContent = 'Loading...';
  responseEl.textContent = '';

  try {
    const response = await fetch(url, { method });
    statusEl.textContent = `${response.status} ${response.statusText}`;

    const text = await response.text();
    try {
      const json = JSON.parse(text);
      responseEl.textContent = JSON.stringify(json, null, 2);
    } catch {
      responseEl.textContent = text;
    }
  } catch (error) {
    statusEl.textContent = 'Network Error';
    responseEl.textContent = error.message;
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { method, url } = button.dataset;
    callEndpoint(method, url);
  });
});