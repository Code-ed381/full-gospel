import * as React from 'react';
import swal from 'sweetalert';
import Card from '@mui/material/Card';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const Testimony = ()=> {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [gallery, setGallery] = useState([]);


    const navigate = useNavigate();
    const { auth } = useAuth()

    console.log(auth)
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getPodcast = async ()=> {
            const results = await supabase
            .from('podcast')
            .select(`* `)
            .eq('id', id)
            .order('id', { ascending: false})
            isMounted && setData(results.data[0])
            console.log(results.data)
        }
        getPodcast()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])


    const handleDelete = async (podcast)=> {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this event!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {                            
                const { data, error } = await supabase
                .from('podcast')
                .delete()
                .eq('id', podcast)
              
                if(error){
                    swal("Delete event failed!", {
                        icon: "error",
                    });
                }
                else {
                    swal("Event has been deleted!", {
                        icon: "success",
                    });

                    navigate(-1)
                }
            }
        });
    }


    return(
        <>
            <div className="row">
                <div className="col-md-6 col-xs-12">
                    <img className="w-100" src={data?.posterURL} alt="podcast image"/>
                </div>
                <div className="col-md-6 col-xs-12">
                    <Card className='p-4'>
                        <h1 class="display-6 mb-4"><strong>{data?.title}</strong></h1>
                        <h5 class="text-muted">Date: {data?.date}</h5>
                        <h5 class="text-muted">Time: {data?.time}</h5>
                        <h5 class="text-muted">Podcast: {data?.podcastURL}</h5>
                        <Button 
                            variant="outlined" 
                            onClick={()=> window.location.replace(data?.podcastURL)}
                        >
                            Go to podcast
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={()=> handleDelete(data?.id)}
                            className='mx-2 my-3'
                        >
                            Delete
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Testimony