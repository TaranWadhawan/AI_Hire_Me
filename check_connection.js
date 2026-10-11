
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zhomtqqywkfhaznvvqne.supabase.co';
const supabaseAnonKey = 'sb_publishable_TnBw8EwXy1HF6I9yRzYAYA_7g-A-JIV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSupabase() {
  console.log("Checking Supabase connection...");
  const { data, error } = await supabase.from('interviews').select('id').limit(1);
  
  if (error) {
    console.error("Supabase Error:", error.message);
    if (error.message.includes("relation \"public.interviews\" does not exist")) {
      console.log("TIP: You need to create the 'interviews' table in your Supabase dashboard.");
    }
  } else {
    console.log("Supabase Connection Successful! 'interviews' table found.");
  }
}

checkSupabase();
