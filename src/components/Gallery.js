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
import Typography from '@mui/material/Typography';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const Gallery = ()=> {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState('');
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const { auth } = useAuth()
    const navigate = useNavigate()

    console.log(auth)

    const getImages = async ()=> {
        const results = await supabase
        .from('gallery')
        .select(`*`)
        .order('id', { ascending: false})
        setData(results.data)
    }
    
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

    const handleFlyerUpload = async (e)=> {
        e.preventDefault()
        console.log(imgName)

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
            handleSubmitEvent(data?.publicUrl)
        }
    }

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
                .eq('id', event)

                if(error){
                    swal("Delete image failed!", {
                        icon: "error",
                    });
                }
                else {
                    swal("Image has been deleted!", {
                        icon: "success",
                    });

                    getImages()
                }
            }
        });
    }


    return(
        <>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: '12px 0' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Gallery"
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
            >Add new image</Button>

            <div className='row' spacing={1}>
                {data ? (
                    <>
                        {data?.map((item, i) => (
                            <div className="col-md-3 col-xs-12" key={i}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="200"
                                        image={item?.posterUrl}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
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
                                    onChange={(e)=> {setImg(e.target.files[0]); setImgName(e.target.files[0].name)}}
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