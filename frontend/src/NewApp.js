import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const NewApp = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const [disimg, setDisimg] = useState("");
  const [allimage, setAllimage] = useState([]);


  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

    useEffect(()=>{
        getImage()
    })
  const download = () => {
    // Check if there is a captured image to download
    if (!image) return;

    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = image;
    link.download = 'captured_image.jpeg';
    link.click();
  };

  const convertToBase64=(event)=>{
    console.log(event);
    let reader= new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=()=>{
        console.log("data")
        console.log(reader.result);//base64 encoded string
        setDisimg(reader.result);
    };
    reader.onerror=error=>{
        console.log("Error :", error);

    };
  }

  const uploads=()=>{
    fetch("http://localhost:4000/upload-image",{
        method:"POST",
        crossDomain:true,
        headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
            base64:disimg
        })
    }).then((res)=>res.json()).then((data)=>console.log(data))
  }

  const getImage=()=>{
    fetch("http://localhost:4000/send-image",{
        method:"GET",
        
    }).then((res)=>res.json()).then((data)=>{
    console.log(data)
    setAllimage(data.data)})
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="d-flex align-items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          {image && <img className="mx-3" src={image} alt="Captured" />}
        </div>
      </div>
      <div className="d-flex justify-content-center my-5" >
        <input accept="image/*" type='file' onChange={convertToBase64}/>
        <button className="btn btn-primary me-3" style={{borderRadius:"8px"}} onClick={capture}>
          Capture
        </button>
        <button className="btn btn-success" style={{borderRadius:"8px"}}  onClick={download}>
          Download
        </button>
        <button className="btn btn-success mx-3" onClick={uploads} style={{borderRadius:"8px"}}>
          Upload
        </button><br/>
      </div>
      <div className="d-flex justify-content-center my-3">
        {disimg==="" || disimg===null ? "" : <img className="mx-3" src={disimg} alt="Captured" /> }
      </div>
      <div className="d-flex justify-content-center my-5">
      {allimage.map(data=>{
            return(<img
                key={data._id} // <-- add key prop here
                width={100}
                height={100}
                className="mx-3"
                src={data.image}
                alt="Captured"
              />)
        })}
      </div>
    </>
  );
};

export default NewApp;