import React, { Component } from "react";
import "./dropzone.css";
import Camera from '@material-ui/icons/Camera';

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = { hightlight: false, filesUrl: [], files: [] };
        this.fileInputRef = React.createRef();

        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    openFileDialog() {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }


    onFilesAdded = async (evt) => {
        if (!evt) {
            this.setState({ files: [{ img: "http://imagenesBonitas.com" }] })
            return
        }
        if (this.props.disabled) return;
        const files = evt.target.files;
        if (this.props.onFilesAdded) {
            for (var i = 0; i < this.state.files.length; i++) {
                files.push(this.state.files.item(i));
            }
            this.fileListToArray(files);
        }
    }
    getBase64Image = (imgUrl, callback) => {
        var img = new Image();
        img.onload = function () {

            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            callback(dataURL);

        };
        img.setAttribute('crossOrigin', 'anonymous'); //
        img.src = imgUrl;

    }
    onDragOver(evt) {
        evt.preventDefault();

        if (this.props.disabled) return;

        this.setState({ hightlight: true });
    }
    onDragLeave() {
        this.setState({ hightlight: false });
    }

    onDrop(event) {
        event.preventDefault();

        if (this.props.disabled) return;

        const files = event.dataTransfer.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ hightlight: false });
    }

    fileListToArray(list) {
        const array = [];
        let arraySrc = []
        let base64Array = [];

        for (var i = 0; i < list.length; i++) {
            array.push(list.item(i));
            this.getBase64Image(URL.createObjectURL(list.item(i)), function (base64image) {
                base64Array.push(base64image);
            });
            arraySrc.push(URL.createObjectURL(list.item(i)))
        }
        this.props.onFilesAdded(base64Array);
        this.setState({ filesUrl: arraySrc })
        return array;
    }

    render() {
        return (
            <div
                className={`Dropzone ${this.state.hightlight ? "Highlight" : ""}`}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                style={{ cursor: this.props.disabled ? "default" : "pointer" }}
            >
                <input
                    ref={this.fileInputRef}
                    className="FileInput"
                    type="file"
                    value={this.state.files}
                    multiple
                    onChange={this.onFilesAdded}
                />

                {this.state.filesUrl.length > 0 ? this.state.filesUrl.map((item, key) => {
                    return (<div key={key} className="dropzone-img" style={{ backgroundImage: `url(${item})` }} >
                    </div>
                    )
                })
                    :
                    <>
                        <Camera />
                        <span>Arrastra las imagenes o da click</span></>
                }

            </div>
        );
    }
}

export default Dropzone;