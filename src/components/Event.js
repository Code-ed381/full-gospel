import { useParams, useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect,useState } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import swal from 'sweetalert';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)

const Event = ()=> {
    const { event_name } = useParams();
    const [data, setData] = useState([]);
    const [participants, setParticipants] = useState([]);
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
    const [phone, setPhone] = useState('');
    const navigate = useNavigate()

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

            setName(events[0].name)
            setChapter(events[0].chapter)
            setComment(events[0].description)
            setHost(events[0].host)
            setPhone(events[0].phone_number)
            setSpeaker(events[0].speaker)
            setBio(events[0].speaker_bio)
            setCategory(events[0].category)
            setDate(events[0].date)
            setTime(events[0].time)
            setDate_to(events[0].date_to)
            setTime_to(events[0].time_to)
            console.log(events[0].name)
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


    const getEvents = async ()=> {
        let { data: events, error } = await supabase
        .from('events')
        .select("*")

        // Filters
        .eq('id', event_name)
        setData(events[0])

        setName(events[0].name)
        setChapter(events[0].chapter)
        setComment(events[0].description)
        setHost(events[0].host)
        setPhone(events[0].phone_number)
        setSpeaker(events[0].speaker)
        setBio(events[0].speaker_bio)
        setCategory(events[0].category)
        setDate(events[0].date)
        setTime(events[0].time)
        setDate_to(events[0].date_to)
        setTime_to(events[0].time_to)
        console.log(events[0].name)
    }

    function formattedDate(date) {
        const stringdate = String(date)
        const newdate = new Date(stringdate);
        const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedDate = formatter.format(newdate); // "March 8, 2023"

        return formattedDate
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
  
        try {
          const { data, error } = await supabase
          .from('events')
          .update([ 
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
                speaker_bio: bio
              },
          ])
          .eq('id', event_name)
          .select('*')
          console.log(data)
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
              getEvents()
          }
        } catch (error) {
          swal("Failed!", "Event could not be added", "error", {
              button: "Ok!",
              timer: 3000,
          });
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
                .from('events')
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

                    navigate(-1)
                }
            }
        });
    }


    
    return(
        <Container maxWidth="lg" style={{marginTop: '30px'}}>
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <img src={data?.poster_url} alt="Poster" className="img-fluid"/>
                </div>
                <div className="col-md-8 col-sm-12">
                    <Stack direction="row" spacing={1} sx={{margin: '10px'}}>
                        <Button size="small" variant="contained" endIcon={<EditIcon />} data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Edit
                        </Button>
                        <Button size="small" variant="contained" onClick={()=> handleDelete(data?.id)} color="error" endIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Stack>
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
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Edit event details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div className='row'>
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            placeholder="name@example.com"
                                            defaultValue={name} 
                                            onChange={(e)=> setName(e.target.value)}
                                        />
                                        <label for="floatingInput">Event name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            defaultValue={chapter}
                                            onChange={(e)=> setChapter(e.target.value)}
                                            placeholder="name@example.com" 
                                        />
                                        <label for="floatingInput">Venue</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            defaultValue={host}
                                            onChange={(e)=> setHost(e.target.value)}
                                            placeholder="name@example.com" 
                                        />
                                        <label for="floatingInput">Host</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            defaultValue={speaker}
                                            onChange={(e)=> setSpeaker(e.target.value)}
                                            placeholder="name@example.com" 
                                        />
                                        <label for="floatingInput">Speaker</label>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-floating mb-3">
                                        <textarea 
                                            className="form-control" 
                                            placeholder="Leave a comment here" 
                                            id="floatingTextarea"
                                            defaultValue={comment}
                                            onChange={(e)=> setComment(e.target.value)}
                                        ></textarea>
                                        <label for="floatingTextarea">Event Description</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            defaultValue={phone}
                                            onChange={(e)=> setPhone(e.target.value)}
                                            placeholder="name@example.com" 
                                        />
                                        <label for="floatingInput">Phone number</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea 
                                            className="form-control" 
                                            placeholder="Leave a comment here" 
                                            id="floatingTextarea"
                                            defaultValue={bio}
                                            onChange={(e)=> setBio(e.target.value)}
                                        ></textarea>
                                        <label for="floatingTextarea">Speaker's Bio</label>
                                    </div>
                                    <select 
                                        className="form-select form-select-md mb-3" 
                                        aria-label=".form-select-md example"
                                        value={chapter}
                                        onChange={(e)=> setCategory(e.target.value)}
                                    >
                                        <option selected>Choose Event Type</option>
                                        <option value="3">Virtual</option>
                                        <option value="1">Seminar</option>
                                        <option value="2">Outreach</option>
                                        <option value="4">Activities</option>
                                    </select>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                <div className='row'>
                                    <h4>Date</h4>
                                    <div className='col-md-6 col-sm-12'>
                                        <div className="form-floating mb-3">
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="floatingInput" 
                                                value={date}
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
                                                    value={date_to}
                                                    onChange={(e)=> setDate_to(e.target.value)}
                                                    placeholder="name@example.com" 
                                                />
                                                <label for="floatingInput">To</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                            <h4>Time</h4>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className="form-floating mb-3">
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        id="floatingInput" 
                                                        defaultValue={time}
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
                                                        defaultValue={time_to}
                                                        onChange={(e)=> setTime_to(e.target.value)}
                                                        placeholder="name@example.com" 
                                                    />
                                                    <label for="floatingInput">To</label>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                    
                                </div>
                            </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={handleSubmitEvent} class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Event