import fs from 'fs'

function checkPngTransparency(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath)
    if (buffer.readUInt32BE(0) !== 0x89504e47) {
      console.log("Not a valid PNG file.")
      return
    }
    const colorType = buffer.readUInt8(25)
    console.log("PNG Color Type at byte 25:", colorType)
    
    if (colorType === 4 || colorType === 6) {
      console.log("This PNG has an alpha channel (transparency).")
    } else if (colorType === 3) {
      console.log("This PNG has a palette (Indexed).")
    } else if (colorType === 2) {
      console.log("This PNG is RGB (No Alpha).")
    } else if (colorType === 0) {
      console.log("This PNG is Grayscale (No Alpha).")
    } else {
      console.log("Unknown color type:", colorType)
    }
  } catch (err) {
    console.error("Error reading file:", err)
  }
}

checkPngTransparency("c:\\Users\\ASUS\\Desktop\\Proyectos\\Personal Transformation-App\\client\\public\\assets\\habitacion\\habitacion.png")
