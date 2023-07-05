import * as React from 'react';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const Podcasts = ()=> {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [podcastURL, setPodcastURL] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState('')
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate();
    const { auth } = useAuth()

    console.log(auth)

    const getPodcast = async ()=> {
        const results = await supabase
        .from('podcast')
        .select(`*`)
        .order('id', { ascending: false})
        setData(results.data)
    }
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getPodcast = async ()=> {
            const results = await supabase
            .from('podcast')
            .select(`*`)
            .order('id', { ascending: false})
            isMounted && setData(results.data)
            console.log(results.data)
        }

        getPodcast()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])

    useEffect(() => {
        const filterData = () => {
          if (search === '') {
            setFilteredData(data); // If no input, use the main array
          } else {
            const filteredArray = data.filter((item) => {
              // Get an array of all values in the item object
              const values = Object.values(item);
      
              // Check if any value includes the search term
              const found = values.some((value) => {
                if (typeof value === 'string') {
                  return value.toLowerCase().includes(search.toLowerCase());
                }
                return false;
              });
      
              return found;
            });
      
            setFilteredData(filteredArray);
          }
        };
      
        filterData();
    }, [data, search]);

    const handleSubmit = async ()=> {
        const { error } = await supabase
          .storage
          .from('images')
          .upload(imgName, img, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) {
            console.log(error)
            swal("Failed!", "Event could not be added", "error", {
                button: "Ok!",
                timer: 3000,
            });
        }
        else {
            try {
                const { data } = supabase
                .storage
                .from('images')
                .getPublicUrl(imgName)
        
                setImgURL(data.publicUrl)
                submit(data?.publicUrl)
                console.log(data.publicUrl)
                setSuccessMsg('Flyer uploaded successfully')

            } catch (error) {
                console.log(error)
                swal("Failed!", "Event could not be added", "error", {
                    button: "Ok!",
                    timer: 3000,
                });
            }
        }
    }

    const submit = async (image)=> {
        const { data, error } = await supabase
        .from('podcast')
        .insert([
        {    
            title: title,
            podcastURL: podcastURL,
            posterURL: image,
            date: date,
            time: time
        },
        ])
      
        if(error) {
            swal("Failed!", "Event could not be added", "error", {
                button: "Ok!",
                timer: 3000,
            });
        }
        else {
            swal("Success!", "Event has been added", "success", {
                button: "Done",
                timer: 3000,
            });
            getPodcast()
        }
    }

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

                    getPodcast()
                }
            }
        });
    }

    return(
        <>
        
        <div class="d-flex bd-highlight mb-3">
                <div class="me-auto p-2 bd-highlight">
                <Button 
                    variant="contained" 
                    sx={{ mb: '12px' }}
                    data-bs-toggle="modal" 
                    data-bs-target="#addEventModal"
                >Add podcast</Button>
                </div>
                <div class="p-2 bd-highlight">
                    <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center'}}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Podcast"
                            inputProps={{ 'aria-label': 'search podcast' }}
                            onChange={(e)=> setSearch(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </Paper>
                </div>
            </div>
            {/* <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: '12px 0' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Podcast"
                    inputProps={{ 'aria-label': 'search podcast' }}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper> */}

            

            <Grid container spacing={2}>
                {data ? (
                    <>
                        {data?.map((data, i)=> 
                            <Grid item md={4} key={i} xs={12}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="140"
                                        image={data?.posterURL}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {data?.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Date: {data?.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Time: {data?.time}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Podcast: {data?.podcastURL}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size="small"
                                            component='a'
                                            href={`#/admin/podcast/${data?.id}`} 
                                        >View</Button>
                                        <Button 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDelete(data?.id)}
                                        >Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </>
                ) : (
                    <h4 className='m-4'>
                        No Podcasts Found
                    </h4>
                )}
            </Grid>


            {/* <!-- Modal --> */}
            <div className="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Upload podcast</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                        <div className="modal-body">
                            <Box sx={{ width: '100%' }}>
                                <label>Add podcast poster</label>
                                <input 
                                    class="form-control mb-3" 
                                    type="file" 
                                    id="formFile" 
                                    onChange={(e)=> {setImg(e.target.files[0]); setImgName(e.target.files[0].name)}}
                                />
                                <div class="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                        onChange={(e)=> setTitle(e.target.value)}
                                    />
                                    <label for="floatingInput">Title</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                        onChange={(e)=> setPodcastURL(e.target.value)}
                                    />
                                    <label for="floatingInput">Podcast URL</label>
                                </div>
                                <div className='row'>
                                    <div className='col-md-6 col-xs-12'>
                                        <label for="birthday">Date:</label>
                                        <input 
                                            type="date" 
                                            id="date" 
                                            name="date" 
                                            onChange={(e)=> setDate(e.target.value)}
                                        />
                                    </div>
                                    <div className='col-md-6 col-xs-12'>
                                        <label for="appt">Time:</label>
                                        <input 
                                            type="time" 
                                            id="appt" 
                                            name="appt" 
                                            onChange={(e)=> setTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="mt-3 d-md-flex justify-content-md-end">
                                    <button class="btn btn-primary me-md-2" data-bs-dismiss="modal" type="button" onClick={handleSubmit}>Upload</button>
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Podcasts