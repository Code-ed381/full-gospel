import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)


function Users() {
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])


    let isMounted = false

    const getUsers = async ()=> {
        const results = await supabase
        .from('profile')
        .select(`*`)
        setData(results.data)
    }
    
    useEffect(() => {
        const controller = new AbortController();

        if(!isMounted) {
            isMounted = true
            const getUsers = async ()=> {
                const results = await supabase
                .from('profile')
                .select(`*`)
                .order('id', { ascending: false})
                setData(results.data)
            }
            getUsers()
        }


        return ()=> {
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

    const handleDelete = async (profile)=> {
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
                .from('profile')
                .delete()
                .eq('id', profile)

                if(error){
                    swal("Delete user failed!", {
                        icon: "error",
                    });
                }
                else {
                    swal("User has been deleted!", {
                        icon: "success",
                    });

                    getUsers()
                }
            }
        });
    }

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
                    onChange={(e)=> setSearch(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
            <Grid container spacing={2}>
                {filteredData ? 
                    <>
                        {filteredData?.map((data)=>
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
                                            <Button 
                                                size="small" 
                                                onClick={()=> handleDelete(data.id)}
                                            >Delete</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                        )}
                    </>
                : data ? (
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
                                            <Button 
                                                size="small" 
                                                onClick={()=> handleDelete(data.id)}
                                            >Delete</Button>
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