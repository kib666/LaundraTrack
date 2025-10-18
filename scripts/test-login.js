// Quick test script to verify NextAuth is working
const testAuth = async () => {
  try {
    console.log('Testing NextAuth endpoint...');
    const response = await fetch('http://localhost:3002/api/auth/providers');
    const providers = await response.json();
    console.log('Available providers:', Object.keys(providers));
    
    // Test credentials endpoint
    console.log('\nTesting credentials provider...');
    if (providers.credentials) {
      console.log('✓ Credentials provider is configured');
      console.log('  ID:', providers.credentials.id);
      console.log('  Name:', providers.credentials.name);
    } else {
      console.log('✗ Credentials provider NOT found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAuth();