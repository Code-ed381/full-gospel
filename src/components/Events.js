import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
// import { Link } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON)


const Events = ()=> {
    const [data, setData] = useState([])
    const [eventName, setEventName] = useState('')
    const [host, setHost] = useState('')
    const [speaker, setSpeaker] = useState('')
    const [speakerBio, setSpeakerBio] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date())
    const [chapter, setChapter] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [phone, setPhone] = useState(0)
    const [facebook, setFacebook] = useState('')
    const [youtube, setYoutube] = useState('')
    const [socials, setSocials] = useState('')


    let isMounted = false
    
    useEffect(() => {
        const controller = new AbortController();

        if(!isMounted) {
            isMounted = true
            const getCategories = async ()=> {
                const results = await supabase
                .from('events')
                .select(`*,
                 categories(name)     
                `)
                setData(results.data)
                console.log(results.data)
            }
            getCategories()
        }


        return ()=> {
            controller.abort();
        }
    }, [])

    const handleUpdate = async (row)=> {
        const result = await supabase
        .from('events')
        .select(`*,
        categories(name)     
       `)
        .eq('id', row)
        setData(result.data)
        console.log(result)
    }
    
    const handleDelete = (row)=> {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then( async (result) => {
            if (result.isConfirmed) {
                const result = await supabase
                .from('events')
                .delete()
                .eq('id', row)
        
                console.log(result)

                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
          })
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        
        const result = await supabase
        .from('events')
        .insert([
            {
                name: eventName,
                host: host,
                speaker: speaker,
                speaker_bio: speakerBio,
                description: description,
                date: date,
                chapter: chapter,
                category_id: categoryId,
                phone_number: phone,
                facebook: facebook,
                youtube: youtube,
                other_socials: socials
            }
        ])
        console.log(result)
    }



    return(
        <div className="page-wrapper">
            {/* <!-- ============================================================== -->
            <!-- Container fluid  -->
            <!-- ============================================================== --> */}
            <div className="container-fluid">
                {/* <!-- ============================================================== -->
                <!-- Bread crumb and right sidebar toggle -->
                <!-- ============================================================== --> */}
                <div className="row page-titles">
                    <div className="col-md-5 align-self-center">
                        <h4 className="text-themecolor">Events</h4>
                    </div>
                    <div className="col-md-7 align-self-center text-end">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                                <li className="breadcrumb-item active">Events</li>
                            </ol>
                            <button type="button" className="btn btn-info d-none d-lg-block m-l-15 text-white"  data-bs-toggle="modal" data-bs-target="#exampleModal"><i
                                    className="fa fa-plus-circle"></i> Create New Event</button>
                        </div>
                    </div>

                    <div className="modal bs-example-modal-lg" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel1">Add New Event</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail111" className="form-label">Event Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputEmail111" 
                                                placeholder="Enter the name of the event"
                                                onChange={(e) => { 
                                                    setEventName(e.target.value)
                                                }}
                                                value={eventName}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Host</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the host of this event"
                                                onChange={(e) => { 
                                                    setHost(e.target.value)
                                                }}
                                                value={host}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Chapter</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the chapter for this event"
                                                onChange={(e) => { 
                                                    setChapter(e.target.value)
                                                }}
                                                value={chapter}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Speaker</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the name of speaker"
                                                onChange={(e) => { 
                                                    setSpeaker(e.target.value)
                                                }}
                                                value={speaker}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputPassword12" className="form-label">Speaker's bio</label>
                                            <textarea 
                                                className="form-control" 
                                                id="exampleTextarea" 
                                                rows="3" 
                                                placeholder="Write a short bio of the speaker"
                                                onChange={(e) => { 
                                                    setSpeakerBio(e.target.value)
                                                }}
                                                value={speakerBio}
                                            ></textarea>
                                        </div>                                       
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select 
                                                className="form-control form-select" 
                                                data-placeholder="Choose a Category" 
                                                tabIndex="1"
                                                onChange={(e) => { 
                                                    setCategoryId(e.target.value)
                                                }}
                                                value={categoryId}
                                            >
                                                <option class="text-muted">--Select the type of event--</option>
                                                <option value="1">Seminar</option>
                                                <option value="2">Outreach</option>
                                                <option value="3">Virtual</option>
                                            </select>
                                        </div>  
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="m-t-20 form-label">Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control mydatepicker" 
                                                        placeholder="2017-06-04" 
                                                        id="mdate"
                                                        onChange={(e) => { 
                                                            setDate(e.target.value)
                                                        }}
                                                        value={date}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="m-t-20 form-label">Time</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        id="timepicker" 
                                                        placeholder="Check time"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword11" className="form-label">Phone</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Enter phone number for RSVP"
                                                onChange={(e) => { 
                                                    setPhone(e.target.value)
                                                }}
                                                value={phone}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputPassword11" className="form-label">Social Media</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Facebook"
                                                onChange={(e) => { 
                                                    setFacebook(e.target.value)
                                                }}
                                                value={facebook}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Youtube"
                                                onChange={(e) => { 
                                                    setYoutube(e.target.value)
                                                }}
                                                value={youtube}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Twitter"
                                                onChange={(e) => { 
                                                    setSocials(e.target.value)
                                                }}
                                                value={socials}
                                            />
                                            <input type="text" className="form-control" id="exampleInputPassword11" placeholder="Instagram"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Description</label>
                                            <textarea 
                                                className="form-control" 
                                                id="exampleTextarea" 
                                                rows="5" 
                                                placeholder="Write a short description about the event"
                                                onChange={(e) => { 
                                                    setDescription(e.target.value)
                                                }}
                                                value={description}
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-success me-2 text-white">Submit</button>
                                        <button type="submit" className="btn btn-dark"  data-bs-dismiss="modal">Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- ============================================================== -->
                <!-- End Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Start Page Content -->
                <!-- ============================================================== --> */}
                {/* <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title"></h4>
                                <h6 className="card-subtitle">Export data to Copy, CSV, Excel, PDF & Print</h6>
                                <div className="table-responsive m-t-40">
                                    <table id="example23"
                                        className="display nowrap table table-hover table-striped border"
                                        cellspacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Host</th>
                                                <th>Speaker</th>
                                                <th>Speaker Bio</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Chapter</th>
                                                <th>Event type</th>
                                                <th>Phone</th>
                                                <th>Facebook</th>
                                                <th>Youtube</th>
                                                <th>Other socials</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>Host</th>
                                                <th>Speaker</th>
                                                <th>Speaker Bio</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Chapter</th>
                                                <th>Event type</th>
                                                <th>Phone</th>
                                                <th>Facebook</th>
                                                <th>Youtube</th>
                                                <th>Other socials</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            {data.map((data)=>
                                                <tr key={data.id} className='group'>
                                                    <td>{data.name}</td>
                                                    <td>{data.host}</td>
                                                    <td>{data.speaker}</td>
                                                    <td>{data.speaker_bio}</td>
                                                    <td style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '1px'}}>{data.description}</td>
                                                    <td>{data.date}</td>
                                                    <td>{data.chapter}</td>
                                                    <td>{data.categories.name}</td>
                                                    <td>{data.phone_number}</td>
                                                    <td>{data.facebook}</td>
                                                    <td>{data.youtube}</td>
                                                    <td>{data.other_socials}</td>
                                                </tr>
                                                
                                            )}
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div class="row">
                    {/* <!-- column --> */}
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                {/* <h4 class="card-title">Basic Table</h4>
                                <h6 class="card-subtitle">Add class <code>.table</code></h6> */}
                                <div class="table-responsive">
                                    <table class="table table-responsive table-bordered">
                                        <thead>
                                            <tr className="table-active">
                                                <th>Name</th>
                                                <th>Host</th>
                                                <th>Speaker</th>
                                                <th>Speaker Bio</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Chapter</th>
                                                <th>Event type</th>
                                                <th>Phone</th>
                                                <th>Facebook</th>
                                                <th>Youtube</th>
                                                <th>Other socials</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((data)=>
                                                <tr key={data.id} className='group'>
                                                    <td>{data.name}</td>
                                                    <td>{data.host}</td>
                                                    <td>{data.speaker}</td>
                                                    <td>{data.speaker_bio}</td>
                                                    <td style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '5px'}}>{data.description}</td>
                                                    <td>{data.date}</td>
                                                    <td>{data.chapter}</td>
                                                    <td>{data.categories.name}</td>
                                                    <td>{data.phone_number}</td>
                                                    <td>{data.facebook}</td>
                                                    <td>{data.youtube}</td>
                                                    <td>{data.other_socials}</td>
                                                    <td>
                                                        <div class="button-group">
                                                            <button 
                                                                type="button" 
                                                                class="btn waves-effect waves-light btn-xs btn-info"  
                                                                data-bs-toggle="modal" 
                                                                data-bs-target="#editModal"
                                                                onClick={()=>{handleUpdate(data.id)}}
                                                            ><i className="fas fa-edit"></i></button>
                                                            <button 
                                                                type="button" 
                                                                class="btn waves-effect waves-light btn-xs btn-danger" 
                                                                onClick={()=> handleDelete(data.id)}
                                                            ><i className="fas fa-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {data.map((data)=>
                    <div className="modal bs-example-modal-lg" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel1">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel1">Edit Event</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail111" className="form-label">Event Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputEmail111" 
                                                placeholder="Enter the name of the event"
                                                onChange={(e) => { 
                                                    setEventName(e.target.value)
                                                }}
                                                value={data.name}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Host</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the host of this event"
                                                onChange={(e) => { 
                                                    setHost(e.target.value)
                                                }}
                                                value={data.host}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Chapter</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the chapter for this event"
                                                onChange={(e) => { 
                                                    setChapter(e.target.value)
                                                }}
                                                value={chapter}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Speaker</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword12" 
                                                placeholder="Enter the name of speaker"
                                                onChange={(e) => { 
                                                    setSpeaker(e.target.value)
                                                }}
                                                value={data.speaker}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputPassword12" className="form-label">Speaker's bio</label>
                                            <textarea 
                                                className="form-control" 
                                                id="exampleTextarea" 
                                                rows="3" 
                                                placeholder="Write a short bio of the speaker"
                                                onChange={(e) => { 
                                                    setSpeakerBio(e.target.value)
                                                }}
                                                value={data.speaker_bio}
                                            ></textarea>
                                        </div>                                       
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select 
                                                className="form-control form-select" 
                                                data-placeholder="Choose a Category" 
                                                tabIndex="1"
                                                onChange={(e) => { 
                                                    setCategoryId(e.target.value)
                                                }}
                                                value={categoryId}
                                            >
                                                <option class="text-muted">--Select the type of event--</option>
                                                <option value="1">Seminar</option>
                                                <option value="2">Outreach</option>
                                                <option value="3">Virtual</option>
                                            </select>
                                        </div>  
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="m-t-20 form-label">Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control mydatepicker" 
                                                        placeholder="2017-06-04" 
                                                        id="mdate"
                                                        onChange={(e) => { 
                                                            setDate(e.target.value)
                                                        }}
                                                        value={date}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="m-t-20 form-label">Time</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        id="timepicker" 
                                                        placeholder="Check time"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword11" className="form-label">Phone</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Enter phone number for RSVP"
                                                onChange={(e) => { 
                                                    setPhone(e.target.value)
                                                }}
                                                value={phone}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleInputPassword11" className="form-label">Social Media</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Facebook"
                                                onChange={(e) => { 
                                                    setFacebook(e.target.value)
                                                }}
                                                value={facebook}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Youtube"
                                                onChange={(e) => { 
                                                    setYoutube(e.target.value)
                                                }}
                                                value={youtube}
                                            />
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="exampleInputPassword11" 
                                                placeholder="Twitter"
                                                onChange={(e) => { 
                                                    setSocials(e.target.value)
                                                }}
                                                value={socials}
                                            />
                                            <input type="text" className="form-control" id="exampleInputPassword11" placeholder="Instagram"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword12" className="form-label">Description</label>
                                            <textarea 
                                                className="form-control" 
                                                id="exampleTextarea" 
                                                rows="5" 
                                                placeholder="Write a short description about the event"
                                                onChange={(e) => { 
                                                    setDescription(e.target.value)
                                                }}
                                                value={data.description}
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-success me-2 text-white">Submit</button>
                                        <button type="submit" className="btn btn-dark"  data-bs-dismiss="modal">Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* <!-- ============================================================== -->
                <!-- End PAge Content -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Right sidebar -->
                <!-- ============================================================== --> */}
                {/* <!-- .right-sidebar --> */}
                <div className="right-sidebar">
                    <div className="slimscrollright">
                        <div className="rpanel-title"> Service Panel <span><i className="ti-close right-side-toggle"></i></span>
                        </div>
                        <div className="r-panel-body">
                            <ul id="themecolors" className="m-t-20">
                                <li><b>With Light sidebar</b></li>
                                <li><a href="javascript:void(0)" data-skin="skin-default"
                                        className="default-theme working">1</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-green" className="green-theme">2</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-red" className="red-theme">3</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-blue" className="blue-theme">4</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-purple" className="purple-theme">5</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-megna" className="megna-theme">6</a></li>
                                <li className="d-block m-t-30"><b>With Dark sidebar</b></li>
                                <li><a href="javascript:void(0)" data-skin="skin-default-dark"
                                        className="default-dark-theme ">7</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-green-dark"
                                        className="green-dark-theme">8</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-red-dark" className="red-dark-theme">9</a>
                                </li>
                                <li><a href="javascript:void(0)" data-skin="skin-blue-dark"
                                        className="blue-dark-theme">10</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-purple-dark"
                                        className="purple-dark-theme">11</a></li>
                                <li><a href="javascript:void(0)" data-skin="skin-megna-dark"
                                        className="megna-dark-theme ">12</a></li>
                            </ul>
                            <ul className="m-t-20 chatonline">
                                <li><b>Chat option</b></li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/1.jpg" alt="user-img"
                                            className="img-circle"/> <span>Varun Dhavan <small
                                                className="text-success">online</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/2.jpg" alt="user-img"
                                            className="img-circle"/> <span>Genelia Deshmukh <small
                                                className="text-warning">Away</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/3.jpg" alt="user-img"
                                            className="img-circle"/> <span>Ritesh Deshmukh <small
                                                className="text-danger">Busy</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/4.jpg" alt="user-img"
                                            className="img-circle"/> <span>Arijit Sinh <small
                                                className="text-muted">Offline</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/5.jpg" alt="user-img"
                                            className="img-circle"/> <span>Govinda Star <small
                                                className="text-success">online</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/6.jpg" alt="user-img"
                                            className="img-circle"/> <span>John Abraham<small
                                                className="text-success">online</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/7.jpg" alt="user-img"
                                            className="img-circle"/> <span>Hritik Roshan<small
                                                className="text-success">online</small></span></a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)"><img src="../assets/images/users/8.jpg" alt="user-img"
                                            className="img-circle"/> <span>Pwandeep rajan <small
                                                className="text-success">online</small></span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <!-- ============================================================== -->
                <!-- End Right sidebar -->
                <!-- ============================================================== --> */}
            </div>
            {/* <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== --> */}
        </div>
    )
}

export default Events