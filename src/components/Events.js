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
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LinearProgress from '@mui/material/LinearProgress';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const Events = ()=> {
    const [expanded, setExpanded] = React.useState(false);
    const [data, setData] = useState([]);
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
    const [phone, setPhone] = useState();
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


    const navigate = useNavigate();
    const { auth } = useAuth()

    console.log(auth)

    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getEvents = async ()=> {
            const results = await supabase
            .from('events')
            .select(`*,
                categories(name),
                profile(*)     
            `)
            isMounted && setData(results.data)
            console.log(results.data)
        }
        const getProfile = async ()=> {
            const results = await supabase
            .from('profile')
            .select('*')
            .eq('user_id', auth?.id)
            isMounted && setProfile(results?.data[0])
            console.log(results.data[0].id)
        }

        getEvents()
        getProfile()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])

    const handleFlyerUpload = async ()=> {
        const { error } = await supabase
          .storage
          .from('images')
          .upload(imgName, img, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) {
            console.log(error)
            setErrMsg('Error!! Flyer Failed to upload')
        }
        else {
            const { data } = supabase
            .storage
            .from('images')
            .getPublicUrl(imgName)
    
            setImgURL(data.publicUrl)
            console.log(data.publicUrl)
            setSuccessMsg('Flyer uploaded successfully')
        }
    }

    const handleSubmitEvent = async (e) => {
      e.preventDefault();

      console.log(img)
      console.log(imgName)

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
                chapter: chapter,
                speaker: speaker,
                host: host,
                speaker_bio: bio,
                poster_url: imgURL,
                profile_id: profile?.id

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
        }
        console.log(data || error)
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
                            <Grid item md={4} key={i} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Avatar alt="Travis Howard" src={data?.profile?.avatar_url} />
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
                                        <ol className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                <div className="fw-bold">Host</div>
                                                {data?.host}
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto text-truncate">
                                                <div className="fw-bold">Speaker</div>
                                                {data?.speaker}
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                <div className="fw-bold">Chapter</div>
                                                    {data?.chapter}
                                                </div>
                                            </li>
                                        </ol>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button size="small">View Details</Button>
                                        <Button size="small">Delete</Button>
                                        {data?.poster_url ? '' : <Button size="small">Add Poster</Button>}
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
                                                        type="number" 
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
                                    <Button onClick={handleSubmitEvent}>Finish</Button>
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