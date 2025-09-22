// Simple test component to verify setup
const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1>Colten Frontend Test</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{
        background: 'white',
        color: 'black',
        padding: '1rem',
        borderRadius: '8px',
        margin: '2rem auto',
        maxWidth: '400px'
      }}>
        <h2>Login Form Test</h2>
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="Email"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="password" 
              placeholder="Password"
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <button 
            type="submit"
            style={{
              background: '#667eea',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleTest;
