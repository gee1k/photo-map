import React from 'react';
import { Upload, Button, Icon } from 'antd';
import './PhotoUpload.css';
import EXIF from 'exif-js';

const convertGps = (arr) => {
  let [n, m, s] = arr;
  return ((s/60) + m) / 60 + n;
}

const getExif = (file) => {
  return new Promise(function (resolve, reject) {
    EXIF.getData(file, function() {
      // var exifData = EXIF.getAllTags(this, "Model");
      let lat = EXIF.getTag(this, "GPSLatitude");
      let lng = EXIF.getTag(this, "GPSLongitude");
      let dateTime = EXIF.getTag(this, "DateTimeOriginal");

      if (!lat || !lng) {
        return null;
      }
      let dateStr = '';
      if (dateTime) {
        let timeArr = dateTime.replace(' ', ':').split(':').map(item => +item);
        let year = timeArr[0], month = timeArr[1] - 1, day = timeArr[2], hrs = timeArr[3], min = timeArr[4], sec = timeArr[5];
        dateStr = new Date(year, month, day, hrs, min, sec).toLocaleString('zh', { hour12: false });
      }
      
      let info = {
        coord: [convertGps(lng), convertGps(lat)],
        time: dateStr
      };
      resolve(info);
    });
  });
}

const covert2Base64 = (file) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();  
    reader.readAsDataURL(file);  
    reader.onload = function(event) {  
      resolve(this.result);
    }  
  });
  
}

class PhotoUpload extends React.Component {
  state = {
    fileList: []
  }

  handleUpload = () => {
    const { fileList } = this.state;
    
    const fileInfos = fileList.map(async (file) => {
      const exifData = await getExif(file);
      const base64 = await covert2Base64(file);
      return {
        file,
        exifData,
        base64
      };
    });

    Promise.all(fileInfos).then(res => {
      if (this.props.okCallback)
        this.props.okCallback(res);
    });
  }

  render() {
    const props = {
      action: './',
      multiple: true,
      accept: 'image/*',
      showUploadList: false,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 选择图片
          </Button>
        </Upload>
        <Button
          className="photo-upload-btn"
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
        >
          选择完成
        </Button>
      </div>
    );
  }
}

export default PhotoUpload;