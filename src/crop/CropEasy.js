import React, {useState} from 'react'
import { Button, DialogActions, DialogContent, Slider, Typography ,Box} from '@mui/material';
import Cropper from 'react-easy-crop';
import { MdCancel } from 'react-icons/md';
import { FaCrop } from 'react-icons/fa';
import getCroppedImg from './utils/CropImage.js';

const CropEasy=({photoURL,SetImage, SetImageFile, SetUpload, SetNext})=>{
    const [crop,setCrop] = useState({x:0, y:0})
    const [zoom,setZoom] = useState(1)
    const [rotation,setRotation] = useState(0)
    const[croppedAreaPixels, setCroppedAreaPixels] = useState(null)
   

const cropComplete = (croppedArea, croppedAreaPixels)=>{
setCroppedAreaPixels(croppedAreaPixels)
}

const cropImage = async () => {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      if(file!==null){
        console.log("got file")
        var binaryData = [];
        binaryData.push(url);
      this.SetImage(URL.createObjectURL(new Blob(binaryData, {type: "application/text"})));
      SetImageFile(file);
      SetUpload(false);
      SetNext(true);}
    }
    

return <>
    <div 
    style={{
        position:"relative",
        height:250,
        width:"auto",
        minWidth: {sn:500},
        backgroundColor:"#333",
        color:'white'
      }}
    >  
    <Cropper
    image={photoURL}
    width={100}
    crop={crop}
    zoom={zoom}
    rotation={rotation}
    onZoomChange={setZoom}
    aspect={1}
    onRotationChange={setRotation}
    onCropChange={setCrop}
    onCropComplete={cropComplete}
    showGrid={false}
    
    />
    
    </div>
    <DialogActions sx={{flexDirection:'column', mx:3,my:2}}>
        <Box sx={{width:"100%", mb:1}}>
        <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                <Slider
                valueLabelDisplay='auto'
                valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e,zoom)=>setZoom(zoom)}
                />
        </Box>
        <Box>
        <Typography>Rotation: {rotation}</Typography>
                <Slider
                valueLabelDisplay='auto'
                min={0}
                max={360}
                value={rotation}
                onChange={(e,rotation)=>setRotation(rotation)}/>
        </Box>
        </Box>
        <Box 
        sx={{
            display:"flex",
            gap:2,
            flexWrap:"wrap"
        }}
        >
            <button
            style={{width:'fit-content'}}
           
            onClick={cropImage}
           
            
            >
                Next
            </button>
        </Box>
    </DialogActions>
    </>
}

export default CropEasy;

const zoomPercent = (value)=>{
    return `${Math.round(value *100)}%`
}