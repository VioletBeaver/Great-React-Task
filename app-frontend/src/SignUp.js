import { useState } from 'react';
import axios from 'axios';


const fields = ['email', 'username', 'password'];
function SignUp() {
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
          .post('http://localhost:8000/api/users', values)
          .then(console.log)
          // .catch(console.log)
        }
      >
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
