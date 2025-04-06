
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple array of jokes
const jokes = [
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!"
  },
  {
    setup: "Why did the building committee ban strata meetings on zoom?",
    punchline: "They wanted to avoid being 'remotely' controlled!"
  },
  {
    setup: "Why don't we tell secrets in a strata building?",
    punchline: "Because the walls have ears... and HOA fees!"
  },
  {
    setup: "How many software developers does it take to change a light bulb?",
    punchline: "None, that's a hardware problem."
  },
  {
    setup: "What do you call fake strata maintenance?",
    punchline: "A sham-dominium!"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get a random joke from the array
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  
  console.log("Random joke sent:", randomJoke);

  return new Response(
    JSON.stringify({
      joke: randomJoke,
      total_jokes: jokes.length
    }),
    { 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      } 
    }
  );
});
