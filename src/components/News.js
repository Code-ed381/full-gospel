import * as React from 'react';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
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
import CardActionArea from '@mui/material/CardActionArea';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const steps = ['Add poster', 'Event description', 'Date and time'];

const News = ()=> {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [headline, setHeadline] = useState('');
    const [article, setArticle] = useState('')
    const [img, setImg] = useState();
    const [imgName, setImgName] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [imgURL, setImgURL] = useState('');
    const [successMsg, setSuccessMsg] = useState('')

    const navigate = useNavigate();
    const { auth } = useAuth()

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

    const getNews = async ()=> {
        let { data: news, error } = await supabase
        .from('news')
        .select('*')      
        .order('id', { ascending: false})
        setData(news)
    }
    
    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getNews = async ()=> {
            let { data: news, error } = await supabase
            .from('news')
            .select('*') 
            .order('id', { ascending: false})
            isMounted && setData(news)
            console.log(news)
        }
        getNews()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])

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
        .from('news')
        .insert([
          { headline: headline, article: article, posterUrl: image },
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
            getNews()
        }
    }

    const handleDelete = async (event)=> {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this news!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {                            
                const { data, error } = await supabase
                .from('news')
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

                    getNews()
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
                    >Add news</Button>
                </div>
                <div class="p-2 bd-highlight">
                    <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center'}}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search News"
                            inputProps={{ 'aria-label': 'search news' }}
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
                    placeholder="Search news"
                    inputProps={{ 'aria-label': 'search news' }}
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
            >Add news</Button> */}

            <Grid container spacing={2}>
                {filteredData ? (
                    <>
                        {filteredData?.map((data, i)=> 
                            <Grid item md={3} key={i} xs={12}>
                            {/* <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    height="140"
                                    image={data?.posterUrl}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        <strong>{data?.headline}</strong>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small"
                                        component='a'
                                        href={`#/admin/news/${data?.id}`} 
                                    >View</Button>
                                    <Button 
                                        size="small" 
                                        color="error"
                                        onClick={() => handleDelete(data?.id)}
                                    >Delete</Button>
                                </CardActions>
                            </Card> */}
                            <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea component='a' href={`#/admin/news/${data?.id}`} >
                                        <CardMedia
                                        component="img"
                                        height="140"
                                        image={data?.posterUrl}
                                        alt="image"
                                        />
                                        <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {data?.headline}
                                        </Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            {data?.description}
                                        </Typography> */}
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                    <Button 
                                            size="small" 
                                            color="error"
                                            variant='contained' 
                                            onClick={()=> handleDelete(data?.id)}
                                            endIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                        </Grid>
                        )}
                    </>
                ) : (
                    <h4 className='m-4'>
                        No news Found
                    </h4>
                )}
            </Grid>


            {/* <!-- Modal --> */}
            <div className="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addEventModalLabel">Upload news</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                        <div className="modal-body">
                            <Box sx={{ width: '100%' }}>
                                <label>Add news poster</label>
                                <input 
                                    class="form-control mb-3" 
                                    type="file" 
                                    id="formFile" 
                                    onChange={(e)=> {setImg(e.target.files[0]); setImgName(e.target.files[0].name)}}
                                />
                                <div class="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="floatingInput" 
                                        placeholder="headline" 
                                        onChange={(e)=> setHeadline(e.target.value)}
                                    />
                                    <label for="floatingInput">Headline</label>
                                </div>
                                <div class="form-floating">
                                    <textarea 
                                        class="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea2" 
                                        style={{height: '100px'}}
                                        onChange={(e)=> setArticle(e.target.value)}
                                    ></textarea>
                                    <label for="floatingTextarea2">Article</label>
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

export default News