import { createRoot } from 'react-dom/client';
import App from './App';
import axios from 'axios';
import { getCredentials, getIsAuthorized } from './auth';


const container = document.getElementById('root');
const root = createRoot(container);
if (getIsAuthorized()) {
  axios.defaults.headers.Authorization = `Token ${getCredentials()}`;
}
root.render(<App />);
