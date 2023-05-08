import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default async function uploadImage(fileUri) {
    let format
    if( fileUri.includes(".png?")) format = "png"
    else if( fileUri.includes(".jpg?")) format = "jpg"
    else if( fileUri.includes(".jpeg?")) format = "jpeg"
    else if( fileUri.includes(".gif?")) format = "gif"
    else if( fileUri.includes(".bmp?")) format = "bmp"
    else if( fileUri.includes(".webp?")) format = "webp"
    else if( fileUri.includes(".svg?")) format = "svg"
    else if( fileUri.includes(".ico?")) format = "ico"
    else if( fileUri.includes(".tiff?")) format = "tiff"
    else if( fileUri.includes(".tif?")) format = "tif"
    else if( fileUri.includes(".psd?")) format = "psd"
    else if( fileUri.includes(".raw?")) format = "raw"
    else if( fileUri.includes(".heif?")) format = "heif"
    else if( fileUri.includes(".indd?")) format = "indd"
    else if( fileUri.includes(".jpeg2000?")) format = "jpeg2000"
    else if( fileUri.includes(".exif?")) format = "exif"
    else if( fileUri.includes(".ppm?")) format = "ppm"
    else if( fileUri.includes(".pgm?")) format = "pgm"
    else if( fileUri.includes(".pbm?")) format = "pbm"
    else if( fileUri.includes(".pnm?")) format = "pnm"
    else if( fileUri.includes(".webp?")) format = "webp"
    else if( fileUri.includes(".heic?")) format = "heic"
    else if( fileUri.includes(".bat?")) format = "bat"
    else if( fileUri.includes(".cmd?")) format = "cmd"
    else if( fileUri.includes(".apk?")) format = "apk"
    else if( fileUri.includes(".app?")) format = "app"
    else if( fileUri.includes(".exe?")) format = "exe"
    else if( fileUri.includes(".ipa?")) format = "ipa"
    else if( fileUri.includes(".jar?")) format = "jar"
    else if( fileUri.includes(".msi?")) format = "msi"
    else if( fileUri.includes(".vb?")) format = "vb"
    else if( fileUri.includes(".vbs?")) format = "vbs"
    else if( fileUri.includes(".wsf?")) format = "wsf"
    else if( fileUri.includes(".3g2?")) format = "3g2"
    else if( fileUri.includes(".3gp?")) format = "3gp"
    else if( fileUri.includes(".avi?")) format = "avi"
    else if( fileUri.includes(".flv?")) format = "flv"
    else if( fileUri.includes(".h264?")) format = "h264"
    else if( fileUri.includes(".m4v?")) format = "m4v"
    else if( fileUri.includes(".mkv?")) format = "mkv"
    else if( fileUri.includes(".mov?")) format = "mov"
    else if( fileUri.includes(".mp4?")) format = "mp4"
    else if( fileUri.includes(".mpg?")) format = "mpg"
    else if( fileUri.includes(".mpeg?")) format = "mpeg"
    else format = "jpeg"
    const metadata = {
      contentType: "image/" + format,
    }
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${fileUri.split("/").pop()}`);
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }