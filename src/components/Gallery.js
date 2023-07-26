import * as React from 'react';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const Gallery = ()=> {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [comment, setComment] = useState('');
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const { auth } = useAuth()


    const getImages = async ()=> {
        const results = await supabase
        .from('gallery')
        .select(`*`)
        .order('id', { ascending: false})
        setData(results.data)
    }

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
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getImages = async ()=> {
            const results = await supabase
            .from('gallery')
            .select(`*`)
            .order('id', { ascending: false})
            isMounted && setData(results.data)
            console.log(results.data)
        }

        getImages()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])

    const getImagesPublicUrls = async (paths) => {
        const promises = paths.map((path) =>
          supabase.storage.from('images').getPublicUrl(path)
        );
      
        try {
            const results = await Promise.all(promises);
            
            for (const values of results) {
                const { data, error } = await supabase
                  .from('gallery')
                  .insert([
                    {
                        description: comment,
                        posterUrl: values.data.publicUrl
                    }
                  ]);
            
                if (error) {
                  // Handle error
                  console.error(error);
                  swal("Failed!", "Image could not be added", "error", {
                    button: "Ok!",
                    timer: 3000,
                });
                }
                else {
                    swal("Success!", "Testimony has been added", "success", {
                        button: "Done",
                        timer: 3000,
                    });
                    getImages()
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        setImg(files)
        const fileNames = Array.from(files).map((file) => file.name);
        setImgName(fileNames);
    };

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

    // const handleFlyerUpload = async (e)=> {
    //     e.preventDefault()

    //     const { error } = await supabase
    //       .storage
    //       .from('images')
    //       .upload(imgName, img, {
    //         cacheControl: '3600',
    //         upsert: false
    //     })

    //     if(error) {
    //         console.log(error)
    //         setErrMsg('Error!! Flyer Failed to upload')
    //     }
    //     else {
    //         const { data } = supabase
    //         .storage
    //         .from('images')
    //         .getPublicUrl(imgName)
    
    //         setImgURL(data.publicUrl)
    //         console.log(data.publicUrl)
    //         handleSubmitEvent(data?.publicUrl)
    //     }
    // }

    const handleSubmitEvent = async (image) => {
      try {
        const { data, error } = await supabase
        .from('gallery')
        .insert([
            { 
                description: comment,
                posterUrl: image
            }
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
            getImages()
            setImgName('')
            setComment('')
        }
        console.log(data || error)
      } catch (error) {
        console.error(error)
      } 
    };

    const handleDelete = async (event)=> {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this image!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {                            
                const { data, error } = await supabase
                .from('gallery')
                .delete()
                .eq('posterUrl', event)

                if(error){
                    swal("Delete image failed!", {
                        icon: "error",
                    });
                }
                else {
                    swal("Image has been deleted!", {
                        icon: "success",
                    });

                    const publicId = event.split('/').pop();

                    const { data, error } = await supabase
                    .storage
                    .from('images')
                    .remove([publicId]);

                    if (error) {
                      console.error('Error deleting file:', error.message);
                    } else {
                      console.log('File deleted successfully.');
                      console.log(publicId);
                      console.log(data);
                    }

                    getImages()
                }
            }
        });
    }


    return(
        <>
            <div class="d-flex bd-highlight mb-2">
                <div class="me-auto p-2 bd-highlight">
                    <Button 
                        variant="contained" 
                        sx={{ mb: '12px' }}
                        data-bs-toggle="modal" 
                        data-bs-target="#addEventModal"
                    >Add new image</Button>
                </div>
                <div class="p-2 bd-highlight">
                    <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center'}}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Gallery"
                            inputProps={{ 'aria-label': 'search gallery' }}
                            onChange={(e)=> setSearch(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    </Paper>
                </div>
            </div>



            <div className='row' spacing={1}>
                {filteredData ? (
                    <>
                        {filteredData?.map((item, i) => (
                            <div className="col-md-3 col-xs-12" key={i}>
                                {/* <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        image={item?.posterUrl}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="body2" component="div">
                                            {item?.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size="small" 
                                            onClick={()=> window.location.href = item?.posterUrl}
                                        >
                                            View
                                        </Button>
                                        <Button 
                                            size="small" 
                                            color="error" 
                                            onClick={()=> handleDelete(item?.id)}
                                            endIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card> */}
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea onClick={()=> window.location.href = item?.posterUrl}>
                                        <CardMedia
                                        component="img"
                                        height="140"
                                        image={item?.posterUrl}
                                        alt="image"
                                        />
                                        <CardContent>
                                        {/* <Typography gutterBottom variant="h5" component="div">
                                            Lizard
                                        </Typography> */}
                                        <Typography variant="body2" color="text.secondary">
                                            {item?.description}
                                        </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                    <Button 
                                            size="small" 
                                            color="error"
                                            variant='contained' 
                                            onClick={()=> handleDelete(item?.posterUrl)}
                                            endIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        ))}
                    </>
                ) : (
                    <h4>
                        No Images Found
                    </h4>
                )}
            </div>


            {/* <!-- Modal --> */}
            <div className="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Upload image</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                        <div className="modal-body">
                            <Box sx={{ width: '100%' }}>
                                <input 
                                    class="form-control" 
                                    type="file" 
                                    id="formFile" 
                                    onChange={handleFileChange}
                                    multiple
                                />
                                <div class="form-floating mt-4">
                                    <textarea 
                                        class="form-control" 
                                        placeholder="Leave a comment here" id="floatingTextarea2" 
                                        style={{height: '100px'}}
                                        onChange={(e)=> setComment(e.target.value)}
                                    ></textarea>
                                    <label for="floatingTextarea2">Description</label>
                                </div>
                                <div class="mt-3 d-md-flex justify-content-md-end">
                                    <button class="btn btn-primary me-md-2" data-bs-dismiss="modal" type="button" onClick={handleFlyerUpload}>Upload</button>
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Gallery