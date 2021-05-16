class QuillWrapper {
    constructor(targetDivId, targetInputId, quillOptions, imageUploadURL) {
        if (imageUploadURL) {
            // https://www.npmjs.com/package/quill-image-uploader
            Quill.register("modules/imageUploader", ImageUploader);
            if (imageUploadURL) {
                var imageUploaderModule = {
                    upload: file => {
                        return new Promise((resolve, reject) => {
                            const formData = new FormData();
                            formData.append("image", file);

                            fetch(
                                imageUploadURL, {
                                method: "POST",
                                body: formData,
                                headers: {
                                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                                },
                            }
                            )
                                .then(response => response.json())
                                .then(result => {
                                    console.log(result);
                                    resolve(result.data.url);
                                })
                                .catch(error => {
                                    reject("Upload failed");
                                    alert("Uploading  failed");
                                    console.error("Error:", error);
                                });
                        });
                    }
                }

            }
            quillOptions.modules.imageUploader = imageUploaderModule
        }

        this.targetDiv = document.getElementById(targetDivId);
        if (!this.targetDiv) throw 'Target div(' + targetDivId + ') id was invalid';

        this.targetInput = document.getElementById(targetInputId);
        if (!this.targetInput) throw 'Target Input id was invalid';

        this.quill = new Quill('#' + targetDivId, quillOptions);
        this.quill.on('text-change', () => {
            var delta = JSON.stringify(this.quill.getContents());
            var html = this.targetDiv.getElementsByClassName('ql-editor')[0].innerHTML;
            var data = { delta: delta, html: html };
            this.targetInput.value = JSON.stringify(data);
        });
    }
}