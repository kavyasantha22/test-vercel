
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState<Tables<'meetings'>[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('is_upcoming', true)
          .order('date')
          .limit(3);

        if (error) {
          console.error('Error fetching upcoming meetings:', error);
          return;
        }

        setMeetings(data);
      } catch (error) {
        console.error('Error in fetchUpcomingMeetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMeetings();

    // Set up a subscription for real-time updates to the meetings table
    const meetingsSubscription = supabase
      .channel('public:meetings')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'meetings' 
      }, () => {
        fetchUpcomingMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsSubscription);
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Upcoming Meetings</CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading upcoming meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground py-4">No upcoming meetings</p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/meetings')}
            >
              Schedule Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-start space-x-3">
                <div className="min-w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium leading-none mb-1">{meeting.title}</h3>
                  <p className="text-sm text-muted-foreground">{meeting.date}, {meeting.time}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-strata-100 px-2 py-0.5 text-xs font-medium text-strata-800">
                      {meeting.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/meetings')}
            >
              View All Meetings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
