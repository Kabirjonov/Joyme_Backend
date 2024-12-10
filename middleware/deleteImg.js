const fs = require('fs')
const path = require('path')
const delImg = (fileName) =>{
    const filePath = path.join(__dirname,'..','public','uploads',fileName)
    fs.unlink(filePath,(err)=>{
        if(err)console.log(`cannot deleted ${fileName} from ${filePath}`)
        else console.log(`${fileName} is seccessfully deleted from ${filePath}`)
    })
}

module.exports = delImg