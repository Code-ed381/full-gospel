import * as React from 'react';
import swal from 'sweetalert';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const Events = ()=> {
    const [expanded, setExpanded] = React.useState(false);
    const [data, setData] = useState([])

    let isMounted = false
    
    useEffect(() => {
        const controller = new AbortController();

        if(!isMounted) {
            isMounted = true
            const getEvents = async ()=> {
                const results = await supabase
                .from('events')
                .select(`*,
                 categories(name),
                 profile(*)     
                `)
                setData(results.data)
                console.log(results.data)
            }
            getEvents()
        }


        return ()=> {
            controller.abort();
        }
    }, [])

    const handleSubmitEvent = (e) => {
      e.preventDefault();

      try {
        swal()
          .then(name => {
            if (!name) throw null;
           
            return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
          })
          .then(results => {
            return results.json();
          })
          .then(json => {
            const movie = json.results[0];
           
            if (!movie) {
              return swal("No movie was found!");
            }
           
            const name = movie.trackName;
            const imageURL = movie.artworkUrl100;
           
            swal({
              title: "Top result:",
              text: name,
              icon: imageURL,
            });
          })
          .catch(err => {
            if (err) {
              swal("Oh noes!", "The AJAX request failed!", "error");
            } else {
              swal.stopLoading();
              swal.close();
            }
        });
      } catch (error) {
        console.error(error)
      }
    };

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return(
        <>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: '12px 0' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Events"
                    inputProps={{ 'aria-label': 'search events' }}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>

            <Button 
                variant="contained" 
                sx={{ mb: '12px' }}
                data-bs-toggle="modal" 
                data-bs-target="#addEventModal"
            >Add event</Button>

            <Grid container spacing={2}>
                {data ? (
                    <>
                        {data?.map((data, i)=> 
                            <Grid item md={3} key={i} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Avatar alt="Travis Howard" src={data?.profile?.avatar_url} />
                                        }
                                        action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                        }
                                        title={data?.profile?.full_name}
                                        subheader={data?.profile?.chapter}
                                    />
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={data?.poster_url}
                                        alt="event image"
                                    />
                                    <CardContent>
                                        <Typography noWrap variant="subtitle1" color="text.secondary">
                                        {data?.description}
                                        </Typography>
                                        <ol class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">
                                                <div class="fw-bold">Host</div>
                                                {data?.host}
                                                </div>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto text-truncate">
                                                <div class="fw-bold">Speaker</div>
                                                {data?.speaker}
                                                </div>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">
                                                <div class="fw-bold">Chapter</div>
                                                    {data?.chapter}
                                                </div>
                                            </li>
                                        </ol>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button size="small">View Details</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </>
                ) : (
                    <h4>
                        No Events Found
                    </h4>
                )}
            </Grid>


            {/* <!-- Modal --> */}
            <div class="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addEventModalLabel">Add Event</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className='row'>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Event name</label>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Chapter</label>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Host</label>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Speaker</label>
                                </div>
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating">
                                    <textarea 
                                        class="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea"
                                    ></textarea>
                                    <label for="floatingTextarea">Event Description</label>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div class="form-floating">
                                    <textarea 
                                        class="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea"
                                    ></textarea>
                                    <label for="floatingTextarea">Speaker's Bio</label>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12'>
                                <select 
                                    class="form-select form-select-lg mb-3" 
                                    aria-label=".form-select-lg example"
                                >
                                    <option selected>Choose Event Type</option>
                                    <option value="1">Virtual</option>
                                    <option value="2">Seminar</option>
                                    <option value="3">Outreach</option>
                                    <option value="4">Activities</option>
                                </select>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Phone number</label>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="date" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Date</label>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Facebook</label>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Youtube</label>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Other Socials</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Add event</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Events