import { useParams } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect,useState } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';


const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const Event = ()=> {
    const { event_name } = useParams();
    const [data, setData] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        var isMounted = true

        const getEvents = async ()=> {
            let { data: events, error } = await supabase
            .from('events')
            .select("*")

            // Filters
            .eq('id', event_name)
            isMounted && setData(events[0])
            console.log(events[0])
        }

        const getProfile = async () => {
            let { data: participation, error } = await supabase
            .from('participation')
            .select('*')
            .eq('event', event_name)
          
            isMounted && setParticipants(participation)
            console.log(participation)
        }

        getEvents()
        getProfile()

        return ()=> {
            isMounted = false
            controller.abort();
        }
    }, [])

    function formattedDate(date) {
        const stringdate = String(date)
        const newdate = new Date(stringdate);
        const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedDate = formatter.format(newdate); // "March 8, 2023"

        return formattedDate
    };

    
    return(
        <Container maxWidth="lg" style={{marginTop: '30px'}}>
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <img src={data?.poster_url} alt="Poster" className="img-fluid"/>
                </div>
                <div className="col-md-8 col-sm-12">
                    <Button variant="outlined" endIcon={<EditIcon />} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Edit
                    </Button>
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <ol class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Name</div>
                                        {data?.name}
                                    </div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Host</div>
                                        {data?.host}
                                    </div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Speaker</div>
                                        {data?.speaker}
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <ol class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Venue</div>
                                        {data?.chapter}
                                    </div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Date</div>
                                        {data?.date_to ? (
                                            <>
                                                {data?.date} - {data?.date_to}
                                            </>
                                        ) : (
                                            <>{data?.date}</>
                                        )}
                                    </div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">Time</div>
                                        {data?.time_to ? (
                                            <>
                                                {data?.time} - {data?.time_to}
                                            </>
                                        ) : (
                                            <>{data?.time}</>
                                        )}
                                    </div>
                                </li>
                            </ol>

                        </div>
                    </div>
                    <div className="row">
                        <Box className="mt-3" style={{backgroundColor: 'white'}}>
                            { participants !== null ? (
                                <div className="table-responsive-md">
                                <table class="table table-striped table-sm caption-top">
                                    <caption>List of participants</caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Avatar</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Chapter</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { participants?.map((participant, i)=> 
                                            <tr key={i}>
                                                <th scope="row">{i+1}</th>
                                                <td><Avatar alt="avatar" src={participant?.avatar_url}/></td>
                                                <td>{participant?.full_name}</td>
                                                <td>{participant?.chapter}</td>
                                                <td>{participant?.email}</td>
                                                <td>{participant?.phone}</td>
                                                <td>{participant?.address}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <h5 className="m-4">No participants</h5>
                            )}
                        </Box>
                    </div>
                </div>
            </div>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      ...
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </div>
</div>
</div>
        </Container>
    )
}

export default Event