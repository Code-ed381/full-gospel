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

const New = ()=> {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [news, setNews] = useState([]);


    const navigate = useNavigate();
    const { auth } = useAuth()

    console.log(auth)
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getNews = async ()=> {
            const results = await supabase
            .from('news')
            .select(`* `)
            .eq('id', id)
            .order('id', { ascending: false})
            isMounted && setData(results.data[0])
            console.log(results.data)
        }
        getNews()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])


    const handleDelete = async (article)=> {
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
                .from('news')
                .delete()
                .eq('id', article)
              
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
                    <Card className='p-4'>
                        <Button  
                            color="error"
                            onClick={()=> handleDelete(data?.id)}
                            className='mx-2 my-3'
                        >
                            Delete
                        </Button>
                        <h1 class="display-6 mb-4"><strong>{data?.headline}</strong></h1>
                        <p class="text-muted">{data?.article}</p>
                    </Card>
                </div>
                <div className="col-md-6 col-xs-12">
                    <img className="w-100" src={data?.posterUrl} alt="podcast image"/>
                </div>
            </div>
        </>
    )
}

export default New