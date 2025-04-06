
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const CommitteeMembers = () => {
  const [committeeMembers, setCommitteeMembers] = useState<Tables<'committee_members'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('committee_members')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching committee members:', error);
          return;
        }

        setCommitteeMembers(data);
      } catch (error) {
        console.error('Error in fetchCommitteeMembers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitteeMembers();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Committee Members</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading committee members...</div>
        ) : committeeMembers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No committee members found</div>
        ) : (
          <div className="space-y-4">
            {committeeMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium leading-none mb-1">{member.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{member.lot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitteeMembers;
