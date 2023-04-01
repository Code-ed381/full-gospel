import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';import Typography from '@mui/material/Typography';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)


function Sponsors() {
    const [data, setData] = useState([])

    let isMounted = false
    
    useEffect(() => {
        const controller = new AbortController();

        if(!isMounted) {
            isMounted = true
            const getSponsors = async ()=> {
                const results = await supabase
                .from('EventsSponsors')
                .select(`*,
                    sponsors(*),
                    events(name)
                `)
                setData(results.data)
                console.log(results.data)
            }
            getSponsors()
        }


        return ()=> {
            controller.abort();
        }
    }, [])

    return (
        <>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: '12px' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Sponsor"
                    inputProps={{ 'aria-label': 'search sponsor' }}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
            <Grid container spacing={2}>
                {data ? (
                <>
                    {data?.map((data)=>
                        <Grid item md={3} xs={12}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt="company logo"
                                        height="140"
                                        image={data?.sponsors?.logo}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                        {data?.sponsors?.name}
                                        </Typography>
                                        <ol className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                <div className="fw-bold">Event</div>
                                                {data?.events?.name}
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto text-truncate">
                                                <div className="fw-bold">Date</div>
                                                {data?.created_at}
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto ">
                                                <div className="fw-bold">Amount</div>
                                                {data?.sponsors?.amount}
                                                </div>
                                            </li>
                                        </ol>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button size="small">More Details</Button>
                                    </CardActions>
                                </Card>
                        </Grid>
                    )}
                </>
                ) : (
                    <h4>No Sponsors Found</h4>
                )}
            </Grid>
        </>
    );
  }
  
export default Sponsors;