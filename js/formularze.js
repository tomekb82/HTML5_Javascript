(function() {

var rangeInput = document.querySelector("#range"),
    rangeOutput = document.querySelector("#range-output"),
    colorInput = document.querySelector("#color"),
    colorOutput = document.querySelector("#color-output"),
    form = document.querySelector("#form1"),
header = document.querySelector("#header1");

rangeInput.oninput = function(e) {
    rangeOutput.value = e.target.value;
header.style.fontSize = e.target.value + "px";
console.log(header.style.fontSize);
}

colorInput.onchange = function(e) {
    colorOutput.style.backgroundColor = e.target.value;
    colorOutput.value = e.target.value;
    form.style.color = e.target.value;
}


function Validator(form) {
    this.form = form;
    this.fields = [];
    this.fields = this.form.querySelectorAll("[required]");

    this.errors = [];
    this.errorsList = this.form.querySelector(".alert ul");

    if(!this.fields.length) return;

    this.form.onclick = function(e) {
       if(e.target.value=="X"){
         this.clearErrors();
       }
    }.bind(this);
	
    this.form.onsubmit = function(e) {
        e.preventDefault();

        var formValid = this.validate();

        if(formValid) {
            this.form.submit();
        } else {
            return false;
        }

    }.bind(this);
}

Validator.prototype.validate = function() {
    this.clearErrors();

    for(var i = 0; i < this.fields.length; i++) {
        this.validateField(this.fields[i]);
    }

    if(!this.errors.length) {
        return true;
    } else {
        this.showErrors();
        return false;
    }
}

Validator.prototype.validateField = function(field) {
    var fieldValid = field.validity.valid;

    if(fieldValid) {
        this.markAsValid(field);
    } else {
        this.errors.push(field.dataset.errorMessage);
        this.markAsInvalid(field);
    }
}

Validator.prototype.markAsValid = function(field) {
    field.classList.remove("invalid");
    field.classList.add("valid");
}

Validator.prototype.markAsInvalid = function(field) {
    field.classList.remove("valid");
    field.classList.add("invalid");
}

Validator.prototype.clearValidationMark = function(field) {
    field.classList.remove("valid");
    field.classList.remove("invalid");
}

Validator.prototype.showErrors = function() {
    var errorsListElements = document.createDocumentFragment();

    for(var i = 0; i < this.errors.length; i++) {
        var liEl = document.createElement("li");

            liEl.textContent = this.errors[i];
            errorsListElements.appendChild(liEl);
    }

    this.errorsList.appendChild(errorsListElements);
    this.errorsList.parentNode.style.display = "block";
}

Validator.prototype.clearErrors = function() {
    this.errors.length = 0;
    this.errorsList.parentNode.style.display = "none";
    this.errorsList.innerHTML = "";

    for(var i = 0; i < this.fields.length; i++) {
        this.clearValidationMark(this.fields[i]);
    }
}

var validator1 = new Validator(document.querySelector("#form"));

})();
