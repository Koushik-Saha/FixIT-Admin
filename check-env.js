// Quick script to check if environment variables are loaded
console.log('Checking environment variables...\n');

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL ? '✅ Set' : '❌ Not set');

console.log('\nValues:');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
