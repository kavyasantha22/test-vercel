import { useState, useEffect } from 'react';
import { Calendar, FileText, Home, Users } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import CommitteeMembers from '@/components/dashboard/CommitteeMembers';
import BuildingInfo from '@/components/dashboard/BuildingInfo';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const Dashboard = () => {
  const [funds, setFunds] = useState<Tables<'funds'>[]>([]);
  const [committeeCount, setCommitteeCount] = useState<number>(0);
  const [nextMeeting, setNextMeeting] = useState<Tables<'meetings'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch funds
        const { data: fundsData, error: fundsError } = await supabase
          .from('funds')
          .select('*');
        
        if (fundsError) {
          console.error('Error fetching funds:', fundsError);
        } else {
          setFunds(fundsData || []);
        }

        // Fetch committee members count
        const { count: membersCount, error: membersError } = await supabase
          .from('committee_members')
          .select('*', { count: 'exact', head: true });
        
        if (membersError) {
          console.error('Error fetching committee members count:', membersError);
        } else {
          setCommitteeCount(membersCount || 0);
        }

        // Fetch next meeting
        const { data: meetingsData, error: meetingsError } = await supabase
          .from('meetings')
          .select('*')
          .eq('is_upcoming', true)
          .order('date')
          .limit(1)
          .maybeSingle();
        
        if (meetingsError) {
          console.error('Error fetching next meeting:', meetingsError);
        } else {
          setNextMeeting(meetingsData);
        }
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Find administration fund and capital works fund
  const adminFund = funds.find(fund => fund.name === 'Administration Fund');
  const capitalFund = funds.find(fund => fund.name === 'Capital Works Fund');

  // Format the next meeting date
  const formatMeetingDate = (meeting: Tables<'meetings'> | null) => {
    if (!meeting) return 'No upcoming meetings';
    const dateParts = meeting.date.split(' ');
    if (dateParts.length >= 2) {
      return `${dateParts[0]} ${dateParts[1]}`;
    }
    return meeting.date;
  };

  return (
    <div className="space-y-6 min-h-screen bg-cover bg-center bg-fixed">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Azure Heights Strata Management
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Administration Fund" 
          value={adminFund ? `$${adminFund.amount.toLocaleString()}` : "$0"} 
          description={adminFund?.description || ""}
          isLoading={loading}
        />
        <StatCard 
          title="Capital Works Fund" 
          value={capitalFund ? `$${capitalFund.amount.toLocaleString()}` : "$0"} 
          description={capitalFund?.description || ""}
          isLoading={loading}
        />
        <StatCard 
          title="Committee Members" 
          value={loading ? "..." : `${committeeCount}/9`} 
          description={`${9 - committeeCount} positions available`}
          icon={Users}
          isLoading={loading}
        />
        <StatCard 
          title="Next Meeting" 
          value={loading ? "..." : formatMeetingDate(nextMeeting)} 
          description={nextMeeting ? `${nextMeeting.type} Meeting, ${nextMeeting.time}` : "No scheduled meetings"}
          icon={Calendar}
          isLoading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <UpcomingMeetings />
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <CommitteeMembers />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <BuildingInfo />
        </div>
      </div>
      
      <div 
        className="mt-auto h-64 bg-bottom bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/building-image.png')",
        }}
      >
      </div>
    </div>
  );
};

export default Dashboard;
