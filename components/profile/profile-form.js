import classes from './profile-form.module.css';
import { useRef } from 'react';
import { toast } from 'react-toastify';

function ProfileForm() {
  const newPswdRef = useRef();
  const oldPswdRef = useRef();

  const submitHandler = async (evt) => {
    evt.preventDefault();

    const formData = {
      newPswd: newPswdRef.current.value,
      oldPswd: oldPswdRef.current.value,
    };

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPswdRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPswdRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
