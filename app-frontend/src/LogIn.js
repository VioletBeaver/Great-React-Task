import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { saveCredentials } from './auth';

const fields = ['email', 'password'];
function LogIn() {
  const { updateAuthData } = useAuth();
  const [values, setValues] = useState(fields.reduce((res, f) => ({ ...res, [f]: '' }), {}));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {fields.map(f => (
        <input
          key={f}
          data-field={f}
          value={values[f]}
          onChange={e => setValues(curr => ({ ...curr, [f]: e.target.value }))}
        />
      ))}
      <button
        type='submit'
        onClick={() => axios
          .post('http://localhost:8000/api/auth/logIn', values)
          .then(({ data }) => {
            updateAuthData(curr => ({ ...curr, isAuthorized: true }));
            axios.defaults.headers.Authorization = `Token ${data.token}`;
            saveCredentials(data.token);
          })
          .catch(console.log)
        }
      >
        Log In
      </button>
    </div>
  );
}

export default LogIn;
