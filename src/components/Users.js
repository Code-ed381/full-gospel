import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)


function Users() {
    const [data, setData] = useState([])

    let isMounted = false
    
    useEffect(() => {
        const controller = new AbortController();

        if(!isMounted) {
            isMounted = true
            const getUsers = async ()=> {
                const results = await supabase
                .from('profile')
                .select(`*`)
                setData(results.data)
                console.log(results.data)
            }
            getUsers()
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
                    placeholder="Search User"
                    inputProps={{ 'aria-label': 'search user' }}
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
                                <Paper>
                                    <div className="card text-center">
                                        <div className="card-header">
                                            <center>
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={data?.avatar_url}
                                                sx={{ width: 56, height: 56 }}
                                            />
                                            </center>
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item"><h5>{data?.full_name}</h5></li>
                                                <li className="list-group-item">{data?.email}</li>
                                                {data?.phone ? <li className="list-group-item">{data?.phone}</li> : <li className="list-group-item"><mark><var>No phone number</var></mark></li>}
                                                
                                                <li className="list-group-item">{data?.chapter}</li>
                                                <li className="list-group-item">{data?.nationality}</li>
                                            </ul>
                                        </div>
                                        <div className="card-footer text-muted">
                                            <Button size="small">Deactivate</Button>
                                            <Button size="small" href="#text-buttons">Delete</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                        )}
                    </>
                ) : (
                    <h4>No Users Found</h4>
                )}
            </Grid>
        </>
    );
  }
  
export default Users;