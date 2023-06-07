import * as React from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventIcon from '@mui/icons-material/Event';
import ChurchIcon from '@mui/icons-material/Church';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RecommendIcon from '@mui/icons-material/Recommend';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CollectionsIcon from '@mui/icons-material/Collections';
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';
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
  const [chapters, setChapters] = useState([])
  const [sponsors, setSponsors] = useState([])
  const [podcast, setPodcast] = useState([])
  const [news, setNews] = useState([])
  const [gallery, setGallery] = useState([])
  const [testimonies, setTestimonies] = useState([])

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
            let { data: events, error } = await supabase
            .from('events')
            .select('*')
            
            setEvents(events)
          }
          const getChapters = async ()=> {
              const results = await supabase
              .from('chapters')
              .select(`*`)
              setChapters(results.data)
              console.log(results.data)
          }
          const getSponsors = async ()=> {
              const results = await supabase
              .from('sponsors')
              .select(`*`)
              setSponsors(results.data)
              console.log(results.data)
          }
          const getNews = async ()=> {
              const results = await supabase
              .from('news')
              .select(`*`)
              setNews(results.data)
              console.log(results.data)
          }
          const getPodcast = async ()=> {
              const results = await supabase
              .from('podcast')
              .select(`*`)
              setPodcast(results.data)
              console.log(results.data)
          }
          const getTestimonies = async ()=> {
              const results = await supabase
              .from('testimonies')
              .select(`*`)
              setTestimonies(results.data)
              console.log(results.data)
          }
          const getGallery = async ()=> {
              const results = await supabase
              .from('gallery')
              .select(`*`)
              setGallery(results.data)
              console.log(results.data)
          }
          getEvents();
          getUsers();
          getGallery();
          getTestimonies();
          getPodcast();
          getNews();
          getSponsors();
          getChapters();
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
                  <div className="card-body text-center">
                      <PeopleAltIcon fontSize='large'/>
                      <div className="mt-2 lead">Users</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{users ? users?.length : <>0</>}</h2>
                  </div>
              </div>  
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                      <EventIcon fontSize='large'/>
                      <div className="mt-2 lead">Events</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{events ? (events?.length): <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-dark text-white">
                  <div className="card-body text-center">
                      <ChurchIcon fontSize='large'/>
                      <div className="mt-2 lead">Chapters</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{chapters ? chapters?.length : <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card bg-danger text-white">
                  <div className="card-body text-center">
                      <MonetizationOnIcon fontSize='large'/>
                      <div className="mt-2 lead">Sponsors</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{sponsors ? sponsors?.length : <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card text-dark bg-light">
                  <div className="card-body text-center">
                      <PodcastsRoundedIcon fontSize='large'/>
                      <div className="mt-2 lead">Podcasts</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{podcast ? podcast?.length : <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card text-dark bg-warning">
                  <div className="card-body text-center">
                      <RecommendIcon fontSize='large'/>
                      <div className="mt-2 lead">Testimonies</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{testimonies ? testimonies?.length : <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card text-white bg-secondary">
                  <div className="card-body text-center">
                      <NewspaperIcon fontSize='large'/>
                      <div className="mt-2 lead">News</div>
                      <h2 className="card-title" style={{fontSize:'1.8em'}}>{news ? news?.length : <>0</>}</h2>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-sm-12 mb-3">
              <div className="card text-dark bg-info">
                  <div className="card-body text-center">
                      <CollectionsIcon fontSize='large'/>
                      <div className="mt-2 lead">Gallery</div>
                      <h1 className="card-title" style={{fontSize:'1.8em'}}>{gallery ? gallery?.length : <>0</>}</h1>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default DashboardContent
