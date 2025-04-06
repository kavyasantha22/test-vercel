
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import AddMeetingForm from "@/components/meetings/AddMeetingForm";

const MeetingCard = ({ meeting }: { meeting: Tables<'meetings'> }) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "AGM":
        return "bg-strata-100 text-strata-800";
      case "Committee":
        return "bg-green-100 text-green-800";
      case "Special":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center justify-center min-w-16 h-16 bg-primary/10 text-primary rounded-lg">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="font-medium">{meeting.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center w-fit ${getBadgeColor(meeting.type)}`}>
              {meeting.type}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 text-sm">
            <span><span className="text-muted-foreground">Date:</span> {meeting.date}</span>
            <span><span className="text-muted-foreground">Time:</span> {meeting.time}</span>
            <span><span className="text-muted-foreground">Location:</span> {meeting.location}</span>
          </div>
          <p className="text-sm text-muted-foreground">{meeting.description}</p>
        </div>
      </div>
    </div>
  );
};

const MeetingsPage = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Tables<'meetings'>[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Tables<'meetings'>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      // Fetch upcoming meetings
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('meetings')
        .select('*')
        .eq('is_upcoming', true)
        .order('date');

      if (upcomingError) {
        console.error('Error fetching upcoming meetings:', upcomingError);
      } else {
        setUpcomingMeetings(upcomingData || []);
      }

      // Fetch past meetings
      const { data: pastData, error: pastError } = await supabase
        .from('meetings')
        .select('*')
        .eq('is_upcoming', false)
        .order('date', { ascending: false });

      if (pastError) {
        console.error('Error fetching past meetings:', pastError);
      } else {
        setPastMeetings(pastData || []);
      }
    } catch (error) {
      console.error('Error in fetchMeetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and minutes for strata committee meetings
          </p>
        </div>
        <AddMeetingForm onMeetingAdded={fetchMeetings} />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strata Meetings</CardTitle>
              <CardDescription>
                All scheduled meetings for Azure Heights strata scheme
              </CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Meetings</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading upcoming meetings...</div>
              ) : upcomingMeetings.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No upcoming meetings scheduled</p>
              ) : (
                upcomingMeetings.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading past meetings...</div>
              ) : pastMeetings.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No past meetings found</p>
              ) : (
                pastMeetings.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsPage;
