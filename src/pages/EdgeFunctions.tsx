import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, MessageSquare, SmilePlus, ArrowBigRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

const EdgeFunctions = () => {
  // Health check state
  const [healthStatus, setHealthStatus] = useState<null | {
    status: string;
    timestamp: string;
    message: string;
  }>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Message echo state
  const [message, setMessage] = useState('');
  const [echoResponse, setEchoResponse] = useState<null | {
    echo: string;
    timestamp: string;
  }>(null);
  const [echoLoading, setEchoLoading] = useState(false);

  // Random joke state
  const [joke, setJoke] = useState<null | {
    setup: string;
    punchline: string;
  }>(null);
  const [jokeLoading, setJokeLoading] = useState(false);
  
  // Redirect state
  const [redirectUrl, setRedirectUrl] = useState('/meetings');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Health check function
  const checkHealth = async () => {
    try {
      setHealthLoading(true);
      const { data, error } = await supabase.functions.invoke('health-check');
      
      if (error) {
        throw error;
      }
      
      setHealthStatus(data);
      toast({
        title: "Health Check",
        description: "System status retrieved successfully!",
      });
    } catch (error) {
      console.error('Error checking health:', error);
      toast({
        title: "Error",
        description: "Failed to check system health. See console for details.",
        variant: "destructive",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  // Message echo function
  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to echo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setEchoLoading(true);
      const { data, error } = await supabase.functions.invoke('message-echo', {
        body: { message: message.trim() },
      });

      if (error) {
        throw error;
      }

      setEchoResponse(data);
      toast({
        title: "Message Echo",
        description: "Message echoed successfully!",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to echo message. See console for details.",
        variant: "destructive",
      });
    } finally {
      setEchoLoading(false);
    }
  };

  // Random joke function
  const getRandomJoke = async () => {
    try {
      setJokeLoading(true);
      const { data, error } = await supabase.functions.invoke('random-joke');

      if (error) {
        throw error;
      }

      setJoke(data.joke);
      toast({
        title: "Random Joke",
        description: `Found ${data.total_jokes} jokes in our collection!`,
      });
    } catch (error) {
      console.error('Error getting random joke:', error);
      toast({
        title: "Error",
        description: "Failed to get a random joke. See console for details.",
        variant: "destructive",
      });
    } finally {
      setJokeLoading(false);
    }
  };

  // HTTP 307 Redirect function
  const testRedirect = async () => {
    if (!redirectUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a redirect URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRedirecting(true);
      toast({
        title: "Redirecting",
        description: `Initiating HTTP 307 redirect to: ${redirectUrl}`,
      });

      // Remove the manual window.location redirect and let the fetch follow the 307
      await fetch(`/api/health-check?redirect=true&url=${encodeURIComponent(redirectUrl)}`, {
        method: 'GET',
        redirect: 'follow', // Let browser handle the redirect
      });

      // Remove this line as the redirect is handled by the fetch response
      // window.location.href = redirectUrl;
    } catch (error) {
      console.error('Redirect error:', error);
      toast({
        title: "Error",
        description: "Failed to redirect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edge Functions Showcase</h1>
      <p className="mb-10 text-muted-foreground">
        Interact with our Supabase Edge Functions to see how they work.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* HTTP 307 Redirect Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowBigRight className="h-5 w-5 text-blue-500" />
              HTTP 307 Redirect
            </CardTitle>
            <CardDescription>
              Test HTTP 307 temporary redirects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Redirect URL (e.g., /meetings)"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
              />
              <Alert className="mb-4">
                <AlertTitle>What is HTTP 307?</AlertTitle>
                <AlertDescription>
                  A 307 Temporary Redirect preserves the HTTP method during redirection,
                  ensuring POST requests remain POST after redirection.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={testRedirect}
              disabled={isRedirecting || !redirectUrl.trim()}
              className="w-full"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                'Test 307 Redirect'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Health Check Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Health Check
            </CardTitle>
            <CardDescription>
              Check if the system is operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthStatus && (
              <Alert className="mb-4">
                <AlertTitle>{healthStatus.status}</AlertTitle>
                <AlertDescription>
                  <p>{healthStatus.message}</p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={checkHealth} 
              disabled={healthLoading}
              className="w-full"
            >
              {healthLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check System Health'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Message Echo Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Message Echo
            </CardTitle>
            <CardDescription>
              Send a message and get it echoed back
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {echoResponse && (
                <Alert>
                  <AlertTitle>Echo Response</AlertTitle>
                  <AlertDescription>
                    <p>{echoResponse.echo}</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Response time: {new Date(echoResponse.timestamp).toLocaleString()}
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={sendMessage}
              disabled={echoLoading || !message.trim()}
              className="w-full"
            >
              {echoLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Random Joke Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SmilePlus className="h-5 w-5 text-yellow-500" />
              Random Joke
            </CardTitle>
            <CardDescription>
              Get a random joke from our collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {joke && (
              <Alert className="mb-4">
                <AlertTitle>{joke.setup}</AlertTitle>
                <AlertDescription className="mt-2 font-medium">
                  {joke.punchline}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={getRandomJoke}
              disabled={jokeLoading}
              className="w-full"
            >
              {jokeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting joke...
                </>
              ) : (
                'Get Random Joke'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EdgeFunctions;
