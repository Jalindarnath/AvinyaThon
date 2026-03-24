import { SignIn } from "@clerk/clerk-react";

const Login = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back to Samarth Developers</h2>
                    <p>Please sign in to your account</p>
                </div>
                <SignIn routing="path" path="/login" signUpUrl="/signup" />
            </div>
        </div>
    );
};

export default Login;