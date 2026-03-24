import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="auth-container">
        <div className="auth-card">
            <div className="auth-header">
                <h2>Join Samarth Developers</h2>
                <p>Create your account to get started</p>
            </div>
            <SignUp routing="path" path="/signup" signInUrl="/login" />
        </div>
    </div>
  );
};

export default Signup;