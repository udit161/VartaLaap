import './signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '../../../components/SpaceBackground';

// Define the missing logo component using the public SVG you have
const VartalaapLogo = () => (
  <img src="/Vartalaap-svg.svg" alt="Logo" style={{ height: '72px', zIndex: 10 }} />
);

const CardBackground = ({ view }) => {
  // The CSS has 'registers' and 'login' classes for animations
  const bgclass = view === "login" ? "login" : "registers";

  return (
    <>
      <div className={`card-bg card-bg-1 ${bgclass}`}></div>
      <div className={`card-bg card-bg-2 ${bgclass}`}></div>
    </>
  );
};

const LogoGroup = ({ view }) => {
  const bgclass = view === "login" ? "login" : "registers";
  return (
    <div className={`logo ${bgclass}`}>
      <VartalaapLogo />
    </div>
  );
};

const LoginForm = ({ view }) => {
  const navigate = useNavigate();
  const formClass = view === "login" ? "login" : "registers";
  return (
    <div className={`form-container ${formClass}`} style={{ pointerEvents: view === 'login' ? 'auto' : 'none' }}>
      <div className="flex flex-col items-center justify-center z-10 w-full pointer-events-none text-center">
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '24px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome to
        </h3>
        <h1 style={{ fontFamily: '"Bogam", sans-serif', color: '#ff1f1f', fontSize: '68px', fontWeight: '900', lineHeight: '1', margin: '0', textShadow: '0 0 40px rgba(255,31,31,0.6), 0 8px 16px rgba(0,0,0,0.8)' }}>
          Vartalaap
        </h1>
        <h2 style={{ fontSize: '22px', color: '#ffffff', fontWeight: '300', marginTop: '12px', letterSpacing: '2px', opacity: '0.9' }}>
          A <span style={{ color: '#FFEA00', fontWeight: 'bold', textShadow: '0 0 15px rgba(255,234,0,0.6)' }}>Student</span> community website.
        </h2>
      </div>

      {/* Bottom Action & Toggle Buttons directly anchored to the form container */}
      <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 60 }}>
        <button onClick={() => navigate('/login')} style={{ backgroundColor: '#ff1f1f', borderRadius: '40px', width: '160px', padding: '12px 0', fontWeight: 'bold', fontSize: '18px', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,31,31,0.5)' }}>
          Login
        </button>
        <button onClick={(e) => { e.preventDefault(); navigate('/signin'); }} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '20px', width: '160px', padding: '12px 0', fontWeight: 'bold', fontSize: '18px', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: '0.3s' }}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

const RegisterForm = ({ view }) => {
  const navigate = useNavigate();
  // For the register form to appear when "register" is selected, 
  // you might need it reversed or just depend on the css transition
  const formClass = view === "register" ? "login" : "registers";
  return (
    <div className={`form-container ${formClass}`} style={{ pointerEvents: view === 'register' ? 'auto' : 'none' }}>
      <div className="flex flex-col items-center justify-center z-10 w-full pointer-events-none text-center">
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '24px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome to
        </h3>
        <h1 style={{ fontFamily: '"Bogam", sans-serif', color: '#ff1f1f', fontSize: '68px', fontWeight: '900', lineHeight: '1', margin: '0', textShadow: '0 0 40px rgba(255,31,31,0.6), 0 8px 16px rgba(0,0,0,0.8)' }}>
          Vartalaap
        </h1>
        <h2 style={{ fontSize: '22px', color: '#ffffff', fontWeight: '300', marginTop: '12px', letterSpacing: '2px', opacity: '0.9' }}>
          A <span style={{ color: '#FFEA00', fontWeight: 'bold', textShadow: '0 0 15px rgba(255,234,0,0.6)' }}>student</span> community website
        </h2>
      </div>

      {/* Bottom Action & Toggle Buttons directly anchored to the form container */}
      <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 60 }}>
        <button onClick={() => navigate('/login')} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '20px', width: '160px', padding: '12px 0', fontWeight: 'bold', fontSize: '18px', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: '0.3s' }}>
          Login
        </button>
        <button onClick={(e) => { e.preventDefault(); navigate('/signin'); }} style={{ backgroundColor: '#ff1f1f', borderRadius: '40px', width: '160px', padding: '12px 0', fontWeight: 'bold', fontSize: '18px', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,31,31,0.5)' }}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export const SignUpPage = () => {
  const [view] = useState("login");
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10
    }}>
      <SpaceBackground />

      {/* Exact same floating logo header as main website, but 30% larger */}
      <header className="site-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <img
          src="/Vartalaap-svg.svg"
          alt="VartaLaap logo"
          className="site-logo"
          style={{ width: '106px', height: '106px' }}
        />
      </header>

      <div className="card" style={{ zIndex: 20, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <CardBackground view={view} />
        {/* We can keep or remove the internal logo. Let's keep it as part of the card animation, 
            or if the user meant replacing the internal logo with the round one: */}
        <LogoGroup view={view} />
        <LoginForm view={view} />
        <RegisterForm view={view} />
      </div>
    </div>
  );
};

export default SignUpPage;