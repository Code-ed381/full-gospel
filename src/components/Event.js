import { useParams } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect,useState } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';


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

    // const timeTo12HrFormat = (time) => {
    //     // Split the time string into an array of hours, minutes, and seconds.
    //     const timeParts = time.split(":");
      
    //     // Initialize the AM/PM string.
    //     let ampm = "AM";
      
    //     // If the hour is greater than or equal to 12, set the AM/PM string to PM.
    //     if (timeParts[0] >= 12) {
    //       ampm = "PM";
    //     }
      
    //     // If the hour is greater than 12, subtract 12 from it.
    //     if (timeParts[0] > 12) {
    //       timeParts[0] -= 12;
    //     }
      
    //     // Format the time string and return it.
    //     return `${timeParts[0]}:${timeParts[1]}:${timeParts[2]} ${ampm}`;
    //   };

    
    return(
        <Container maxWidth="lg" style={{marginTop: '30px'}}>
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <img src={data?.poster_url} alt="Poster" className="img-fluid"/>
                </div>
                <div className="col-md-8 col-sm-12">
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
                                                {formattedDate(data?.date)} - {formattedDate(data?.date_to)}
                                            </>
                                        ) : (
                                            <>{formattedDate(data?.date)}</>
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
        </Container>
    )
}

export default Event