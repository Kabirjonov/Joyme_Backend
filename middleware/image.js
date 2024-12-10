const multer = require('multer');
const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '..'); 
const publicDir = path.join(rootDir, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
function createNeedFolder(folderPath){
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath,{recursive:true})
        console.log(`Papke yaratildi ${folderPath}`)
    }
}

createNeedFolder(publicDir);   // public papkasini yaratish
createNeedFolder(uploadsDir);

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new Error('File must be Only image type'),false)
    }
}
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:5*1024*1024}
})
module.exports = upload