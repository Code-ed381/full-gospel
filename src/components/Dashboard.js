import * as React from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventIcon from '@mui/icons-material/Event';
import ChurchIcon from '@mui/icons-material/Church';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON, {
    db: {
        schema: 'public',
    },
    auth: {
        persistSession: true,
    }
})

function DashboardContent() {
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])

  let isMounted = false
    
  useEffect(() => {
      const controller = new AbortController();

      if(!isMounted) {
          isMounted = true
          const getUsers = async ()=> {
              const results = await supabase
              .from('profile')
              .select(`*`)
              setUsers(results.data)
              console.log(results.data)
          }
          const getEvents = async ()=> {
              const results = await supabase
              .from('events')
              .select(`*`)
              setEvents(results.data)
              console.log(results.data)
          }
          getEvents();
          getUsers();
      }


      return ()=> {
          controller.abort();
      }
  }, [])



  return (
    <>
      <div className="row">
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-success text-white">
                  <div className="card-body">
                      <PeopleAltIcon fontSize='large'/>
                      <div className="mt-2 lead">Users</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{users?.length}</h2>
                  </div>
              </div>  
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-primary text-white">
                  <div className="card-body">
                      <EventIcon fontSize='large'/>
                      <div className="mt-2 lead">Events</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{events?.length}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-dark text-white">
                  <div className="card-body">
                      <ChurchIcon fontSize='large'/>
                      <div className="mt-2 lead">Chapters</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}></h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-danger text-white">
                  <div className="card-body">
                      <MonetizationOnIcon fontSize='large'/>
                      <div className="mt-2 lead">Sponsors</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}></h2>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default DashboardContent
