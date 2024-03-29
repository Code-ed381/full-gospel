import * as React from 'react';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TelegramIcon from '@mui/icons-material/Telegram';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import useAuth from '../hooks/useAuth';
import {CardActionArea} from '@mui/material';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const Events = ()=> {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [name, setName] = useState('');
    const [host, setHost] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [chapter, setChapter] = useState('');
    const [comment, setComment] = useState('');
    const [bio, setBio] = useState(''); 
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date())
    const [date_to, setDate_to] = useState(new Date())
    const [time, setTime] = useState('')
    const [time_to, setTime_to] = useState('')
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [phone, setPhone] = useState('');
    const [profile, setProfile] = useState('');
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 3;
    };
    
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
    
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };
    
    const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };
    
    const handleReset = () => {
        setActiveStep(0);
    };

    const { auth } = useAuth()

    const getEvents = async ()=> {
        const results = await supabase
        .from('events')
        .select(`*,
            categories(name)   
        `)
        .order('id', { ascending: false})
        setData(results.data)
    }
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getEvents = async ()=> {
            const results = await supabase
            .from('events')
            .select(`*,
                categories(name)    
            `)
            .order('id', { ascending: false})
            isMounted && setData(results.data)
        }
        const getProfile = async ()=> {
            const results = await supabase
            .from('profile')
            .select('*')
            .eq('user_id', auth?.id)
            isMounted && setProfile(results?.data[0])
        }

        getEvents()
        getProfile()

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

    const handleFlyerUpload = async ()=> {
        const { error } = await supabase
          .storage
          .from('images')
          .upload(imgName, img, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) {
            setErrMsg('Error!! Flyer Failed to upload')
        }
        else {
            const { data } = supabase
            .storage
            .from('images')
            .getPublicUrl(imgName)
    
            setImgURL(data.publicUrl)
            setSuccessMsg('Flyer uploaded successfully')
        }
    }

    const handleSubmitEvent = async (e) => {
      e.preventDefault();

      try {
        const { data, error } = await supabase
        .from('events')
        .insert([ 
            { 
                categories_id: category,
                name: name, 
                description: comment,
                phone_number: phone,
                date: date,
                date_to: date_to,
                time: time,
                time_to: time_to,
                venue: chapter,
                speaker: speaker,
                host: host,
                speaker_bio: bio,
                poster_url: imgURL

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
            getEvents()
        }
      } catch (error) {
        swal("Failed!", "Event could not be added", "error", {
            button: "Ok!",
            timer: 3000,
        });
      } 
    };

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

                    getEvents()
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
                    >Add event</Button>
                </div>
                <div class="p-2 bd-highlight">
                    <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center'}}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Events"
                            inputProps={{ 'aria-label': 'search events' }}
                            onChange={(e)=> setSearch(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </Paper>
                </div>
            </div>


            <Grid container spacing={2}>
                {filteredData ? (
                    <> {filteredData?.map((data, i)=> 
                        <Grid item md={3} key={i} xs={12}>
                            <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea component="a" href={`#/admin/event/${data?.id}`}>
                                <CardMedia
                                component="img"
                                height="140"
                                image={data.poster_url}
                                alt="image"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {data.name} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {data?.description}
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    color="error" 
                                    onClick={()=> handleDelete(data?.id)}
                                    startIcon={<DeleteIcon />}
                                >
                                Delete
                                </Button>
                            </CardActions>
                            </Card>
                        </Grid>
                    )} </>
                ) : (
                    <h4>
                        No Events Found
                    </h4>
                )}
            </Grid>


            {/* <!-- Modal --> */}
            <div className="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Add Event</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                {activeStep === 0 ? 
                                    <div class="m-4">
                                        {errMsg ? 
                                        <>
                                            <Alert severity="error">
                                                <AlertTitle>Error</AlertTitle>
                                                {errMsg}
                                            </Alert>
                                        </>
                                        : successMsg ? 
                                        <>
                                            <Alert severity="success">
                                                <AlertTitle>Success</AlertTitle>
                                                {successMsg}<strong> — Proceed to the next step</strong>
                                            </Alert>
                                        </> :
                                            (
                                                <>
                                                    <Alert severity="info">Upload poster first and click next</Alert>
                                                    <h6 className='mt-3'>Upload poster</h6>
                                                    <input 
                                                        class="form-control" 
                                                        type="file" 
                                                        id="formFile" 
                                                        onChange={(e)=> {setImg(e.target.files[0]); setImgName(e.target.files[0].name)}}
                                                    />
                                                    <div class="mt-3 d-md-flex justify-content-md-end">
                                                        <button class="btn btn-primary me-md-2" type="button" onClick={handleFlyerUpload}>Upload</button>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                : activeStep === 1 ? 
                                    <div className='m-3'>
                                        <div className='row mt-5'>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        placeholder="name@example.com" 
                                                        onChange={(e)=> setName(e.target.value)}
                                                    />
                                                    <label for="floatingInput">Event name</label>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setChapter(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">Venue</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setHost(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">Host</label>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setSpeaker(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">Speaker</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <textarea 
                                                        className="form-control" 
                                                        placeholder="Leave a comment here" 
                                                        id="floatingTextarea"
                                                        onChange={(e)=> setComment(e.target.value)}
                                                    ></textarea>
                                                    <label for="floatingTextarea">Event Description</label>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating">
                                                    <textarea 
                                                        className="form-control" 
                                                        placeholder="Leave a comment here" 
                                                        id="floatingTextarea"
                                                        onChange={(e)=> setBio(e.target.value)}
                                                    ></textarea>
                                                    <label for="floatingTextarea">Speaker's Bio</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6 col-sm-12'>
                                                <select 
                                                    className="form-select form-select-md mb-3" 
                                                    aria-label=".form-select-md example"
                                                    onChange={(e)=> setCategory(e.target.value)}
                                                >
                                                    <option selected>Choose Event Type</option>
                                                    <option value="3">Virtual</option>
                                                    <option value="1">Seminar</option>
                                                    <option value="2">Outreach</option>
                                                    <option value="4">Activities</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setPhone(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">Phone number</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : activeStep === 2 ?
                                    <>
                                        <div className='row m-4'>
                                            <h4>Date</h4>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setDate(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">From</label>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setDate_to(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">To</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row m-4'>
                                            <h4>Time</h4>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setTime(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">From</label>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        onChange={(e)=> setTime_to(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">To</label>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                : ''
                                }
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    {isStepOptional(activeStep) && (
                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                            Skip
                                        </Button>
                                    )}

                                    
                                    {activeStep === steps.length - 1 ? 
                                    <Button data-bs-dismiss="modal" onClick={handleSubmitEvent}>Finish</Button>
                                    : <Button onClick={handleNext}>Next</Button>}
                                </Box>
                            </>
                        )}
                    </Box>
                        {/* <div className='row'>
                            <div className='col-md-4 col-sm-12'>
                                <div class="input-group mb-3">                                
                                    <label class="input-group-text" for="inputGroupSelect01">Type of Event</label>
                                    <select 
                                        class="form-select" 
                                        id="inputGroupSelect01"
                                        aria-label=".form-select-lg example"
                                        onChange={(e)=> setCategory(e.target.value)}
                                    >
                                        <option selected>Choose...</option>
                                        <option value="3">Virtual</option>
                                        <option value="1">Seminar</option>
                                        <option value="2">Outreach</option>
                                        <option value="4">Activities</option>
                                    </select>
                                </div>
                            </div>

                            <div className='col-md-8 col-sm-12'>
                                <div class="mb-3"> */}
                                    {/* <label for="formFile" class="form-label">Upload flyer</label> */}
                                    {/* <input 
                                        class="form-control" 
                                        type="file" 
                                        id="formFile" 
                                        onChange={(e)=> {setImgUrl(e.target.files[0]); setImgName(e.target.files[0].name)}}
                                    />
                                </div>
                            </div>
                        </div> */}
                        {/* <div className='row'>
                            <div className='col-md-4 col-sm-12'>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="floatingInput" 
                                        onChange={(e)=> setFacebook(e.target.value)}
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Facebook</label>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="floatingInput" 
                                        onChange={(e)=> setYouTube(e.target.value)}
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Youtube</label>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange={(e)=> setSocials(e.target.value)}
                                        id="floatingInput" 
                                        placeholder="name@example.com" 
                                    />
                                    <label for="floatingInput">Other Socials</label>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    {/* <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={handleSubmitEvent}
                        >Add event</button>
                    </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Events