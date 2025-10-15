import fs from 'fs';
import path from 'path';

export default () => ({
  async privateUpload(files: any) {
    // Get the file
    const file = files.file;
    // console.log(file);

    const privatePath = path.join(strapi.dirs.static.public, '../uploads');
    if (!fs.existsSync(privatePath)) {
      fs.mkdirSync(privatePath, { recursive: true });
    }

    const destPath = path.join(privatePath, file.originalFilename);

    const data = file.filepath ? fs.readFileSync(file.filepath) : file.buffer;
    fs.writeFileSync(destPath, data);

    return { message: 'File uploaded privately', path: destPath };
  },
});
