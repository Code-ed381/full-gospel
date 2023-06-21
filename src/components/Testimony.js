import * as React from 'react';
import swal from 'sweetalert';
import Card from '@mui/material/Card';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const Testimony = ()=> {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [gallery, setGallery] = useState([]);
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getTestimony = async ()=> {
            const results = await supabase
            .from('testimonies')
            .select(`* `)
            .eq('id', id)
            .order('id', { ascending: false})
            isMounted && setData(results.data[0])
            console.log(results.data)
        }
        const getTestimoniesGallery = async ()=> {
            const results = await supabase
            .from('testimonies_gallery')
            .select(`*`)
            .eq('testimony_id', id)
            .order('id', { ascending: false})
            isMounted && setGallery(results.data)
            console.log(results.data)
        }

        getTestimony()
        getTestimoniesGallery()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])


    const handleDelete = async (event)=> {
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
                .from('events')
                .delete()
                .eq('id', event)

                if(error){
                    swal("Delete event failed!", {
                        icon: "error",
                    });
                }
                else {
                    swal("Event has been deleted!", {
                        icon: "success",
                    });
                }
            }
        });
    }


    return(
        <>
            <div className="row">
                <div className="col-md-6 col-xs-12">
                    <Card className='p-4'>
                        <h1 class="display-6"><strong>{data?.title}</strong></h1>
                        <p class="text-muted">{data?.testimony}</p>
                    </Card>
                </div>
                <div className="col-md-6 col-xs-12">
                    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src={gallery[0]?.posterUrl} className="m-2 w-100" alt='pic'/>
                            </div>
                            {gallery.map((image)=> 
                                <div class="carousel-item ">
                                    <img src={image?.posterUrl} className="m-2 w-100" alt='pic'/>
                                </div>
                            )}   
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimony