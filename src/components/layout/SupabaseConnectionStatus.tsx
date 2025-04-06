
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const SupabaseConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to make a simple query to check connectivity
        const { error } = await supabase.from('buildings').select('count', { count: 'exact', head: true });
        setIsConnected(error === null);
      } catch (error) {
        setIsConnected(false);
      }
    }

    checkConnection();

    // Set up interval to periodically check connection
    const intervalId = setInterval(checkConnection, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Don't show anything while checking connection for the first time
  if (isConnected === null) return null;
  
  // Only show alert when not connected
  if (isConnected) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>
        Cannot connect to Supabase. Please check your internet connection or Supabase service status.
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseConnectionStatus;
