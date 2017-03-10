(function() {

var imageUploader = {

    addHover: function() {

        this.dropZone.classList.add("dragOver");

    },

    removeHover: function() {

        this.dropZone.classList.remove("dragOver");

    },

    cancelDefault: function(e) {

        e.preventDefault();
        return false;

    },

    handleDrop: function(e) {

        e.preventDefault();
        e.stopPropagation();

        var files = e.dataTransfer.files;

        [].forEach.call(files, function(file) {

            if(file.type.match("image.*")) {
                this.generateThumbnail(file);
                this.addToUploadList(file);
            }

        }.bind(this));

        this.removeHover();

    },

    generateThumbnail: function(file) {

        var reader = new FileReader(),
            img = new Image();

        reader.onload = function() {
            img.src = reader.result;
        }

        reader.readAsDataURL(file);

        this.imagesContainer.appendChild(img);
    },

    addToUploadList: function(file) {

        this.formData.append("images[]", file);
        this.filesAdded++;

    },

    sendFiles: function() {

        if(this.filesAdded == 0) return;

        this.sendButton.onclick = null;
        this.sendButton.setAttribute("disabled", "disabled");

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "localhost:3000", true); // todo

        xhr.onload = function(e) {

            if(e.target.status != 200) {
                this.setStatus(true, "Wystąpił błąd!");
            }

            var responseObject = JSON.parse(e.target.responseText);

            this.setStatus(responseObject.error, responseObject.message);

        }.bind(this);

        xhr.onprogress = this.updateProgress.bind(this);

        xhr.send(this.formData);

    },

    updateProgress: function(e) {

        if(e.lengthComputable) {
            var percentLoaded = (e.loaded / e.total) * 100;
        }

        this.progressBar.style.width = percentLoaded + "%";
        this.progressBar.querySelector("span").innerHTML = percentLoaded + "%";

    },

    setStatus: function(isError, message) {

        this.status.style.display = "block";
        this.status.innerHTML = message;

        if(isError) {
            this.status.classList.add("alert-danger");
        } else {
            this.status.classList.add("alert-success");
        }

    },

    init: function() {

        if(!"draggable" in document.createElement("span") || !window.FileReader) {
            return;
        }

        this.dropZone = document.querySelector("#dropZone");
        this.imagesContainer = document.querySelector("#imagesContainer");
        this.sendButton = document.querySelector("#send");
        this.status = document.querySelector("#status");
        this.progressBar = document.querySelector("#progress");

        this.dropZone.ondragenter = this.addHover.bind(this);
        this.dropZone.ondragleave = this.removeHover.bind(this);
        this.dropZone.ondragover = this.cancelDefault;
        this.dropZone.ondrop = this.handleDrop.bind(this);

        this.filesAdded = 0;
        this.formData = new FormData();

        this.sendButton.onclick = this.sendFiles.bind(this);

    }

}

imageUploader.init();

})();