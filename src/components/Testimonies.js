import * as React from 'react';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
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

const steps = ['Testimony', 'Add posters' ];

const Testimonies = ()=> {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [data, setData] = useState([]);
    const [testimony, setTestimony] = useState('');
    const [testimonySuccess, setTestimonySuccess] = useState('')
    const [testimonyId, setTestimonyId] = useState('')
    const [title, setTitle] = useState('');
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
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

    const handleFileChange = (event) => {
        const files = event.target.files;
        setImg(files)
        const fileNames = Array.from(files).map((file) => file.name);
        setImgName(fileNames);
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

    const getTestimonies = async ()=> {
        const results = await supabase
        .from('testimonies')
        .select(`*`)
        .order('id', { ascending: false})
        setData(results.data)
        console.log(results.data)
    }
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getTestimonies = async ()=> {
            const results = await supabase
            .from('testimonies')
            .select(`*`)
            .order('id', { ascending: false})
            isMounted && setData(results.data)
            console.log(results.data)
        }

        getTestimonies()

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
        const files = Array.from(img).map((file)=> supabase
          .storage
          .from('images')
          .upload(`${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
        }))

        try {
            const responses = await Promise.all(files);
            console.log(responses)
        }
        catch (error) {
            // Handle error
            console.log(error)
        }

        try {
            getImagesPublicUrls(imgName)
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleSubmitEvent = async (e) => {
      e.preventDefault();

      try {
        const { data: insertedData, error } = await supabase
        .from('testimonies')
        .insert([
            { 
                title: title,
                testimony: testimony, 
            },
        ])
        if(error) {
            swal("Failed!", "Testimony could not be added", "error", {
                button: "Ok!",
                timer: 3000,
            });
        }
        else {
            setTestimonySuccess("Successful")

            let { data: testimonies, error } = await supabase
            .from('testimonies')
            .select('*')
            .order('id', { ascending: false})
            .limit(1)

            if(error) throw error

            setTestimonyId(testimonies[0].id)
        }
        console.log(insertedData)
        // return insertedData
      } catch (error) {
        console.error(error)
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
                .from('testimonies')
                .delete()
                .eq('id', event)
              
                if(error){
                    swal("Delete event failed!", {
                        icon: "error",
                    });
                }
                getTestimonies()
                
                swal("Event has been deleted!", {
                    icon: "success",
                });

            }
        });
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const getImagesPublicUrls = async (paths) => {
        const promises = paths.map((path) =>
          supabase.storage.from('images').getPublicUrl(path)
        );
      
        try {
            const results = await Promise.all(promises);
            
            for (const values of results) {
                const { data, error } = await supabase
                  .from('testimonies_gallery')
                  .insert([
                    {
                        testimony: testimonyId,
                        posterUrl: values.data.publicUrl
                    }
                  ]);
            
                if (error) {
                  // Handle error
                  console.error(error);
                }
                else {
                    swal("Success!", "Testimony has been added", "success", {
                        button: "Done",
                        timer: 3000,
                    });
                    getTestimonies()
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    return(
        <>
            {/* <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: '12px 0' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Testimony"
                    inputProps={{ 'aria-label': 'search testimony' }}
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
            >Add testimony</Button> */}

            <div class="d-flex bd-highlight mb-3">
                <div class="me-auto p-2 bd-highlight">
                <Button 
                    variant="contained" 
                    sx={{ mb: '12px' }}
                    data-bs-toggle="modal" 
                    data-bs-target="#addEventModal"
                >Add testimony
                </Button>
                </div>
                <div class="p-2 bd-highlight">
                    <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center'}}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Testimonies"
                            inputProps={{ 'aria-label': 'search testimonies' }}
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
                    <>
                        {filteredData?.map((data, i)=> 
                            <Grid item md={3} key={i} xs={12}>
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">{data?.title}</h5>
                                        <Button
                                            component='a'
                                            href={`#/admin/testimony/${data?.id}`} 
                                        >View more</Button>
                                        <Button 
                                            color="error"
                                            onClick={()=> handleDelete(data?.id)}
                                        >Delete</Button>
                                    </div>
                                </div>
                            </Grid>
                        )}
                    </>
                ) : (
                    <h4 className='m-4'>
                        No testimonies Found
                    </h4>
                )}
            </Grid>


            {/* <!-- Modal --> */}
            <div className="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Add Testimony</h5>
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
                                    <>
                                        <div class="form-floating mt-4 mx-3">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                id="floatingInput" 
                                                placeholder="testimony title" 
                                                onChange={(e)=> setTitle(e.target.value)}
                                            />
                                            <label for="floatingInput">Title</label>
                                        </div>
                                        <div class="form-floating mt-4 mx-3">
                                            <textarea 
                                                class="form-control" 
                                                placeholder="Leave a comment here" 
                                                id="floatingTextarea2" 
                                                style={{height: '100px'}}
                                                onChange={(e)=> setTestimony(e.target.value)}
                                            ></textarea>
                                            <label htmlFor="floatingTextarea2">Testimony</label>
                                        </div>
                                        {testimonySuccess ? (
                                            <></>
                                        ) : (
                                            <div class="mt-3 d-md-flex justify-content-md-end">
                                                <button 
                                                    class="btn btn-primary me-md-2" 
                                                    type="button" 
                                                    onClick={handleSubmitEvent}
                                                >Add testimony</button>
                                            </div>
                                        )}
                                    </>
                                : activeStep === 1 ? 
                                    <div class="mt-4 mx-3">
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
                                                    {/* <Alert severity="info">Upload posters first and click next</Alert> */}
                                                    <h6 className='mt-3'>Upload posters</h6>
                                                    
                                                    <input 
                                                        class="form-control" 
                                                        type="file" 
                                                        id="formFile" 
                                                        onChange={handleFileChange}
                                                        multiple
                                                    />
{/*                                                     
                                                    <div class="mt-3 d-md-flex justify-content-md-end">
                                                        <button 
                                                            class="btn btn-primary me-md-2" 
                                                            type="button" 
                                                            onClick={handleFlyerUpload}
                                                            // onClick={()=> console.log(img)}
                                                        >Upload</button>
                                                    </div> */}
                                                </>
                                            )
                                        }
                                    </div>
                                : ''
                                }
                                { testimonySuccess ? (
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
                                        <Button onClick={handleFlyerUpload} data-bs-dismiss="modal">Finish</Button>
                                        : <Button onClick={handleNext}>Next</Button>}
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </Box>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonies