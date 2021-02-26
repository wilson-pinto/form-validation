
var inValidMessege = "",
    formIsValid = true,
    fieldIsValid = true,
    isFormValidation = true;

const EMAIL_EXP = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i,
    STRING_EXP = /[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
    INT_EXP = /^[-+]?\d+$/;

$('.validate-me').on('keyup', function () {
    $(this).removeClass("is-invalid is-valid");
});

$('.validate-me').on('change', function () {
    $(this).removeClass("is-invalid is-valid");
});

function validateField({ field, onValid, onInValid }) {

    field.change(function () {
        validateItem(field);
        fieldIsValid ? onValid() : onInValid();
    });
}

function validateForm({ form, onValid, onInValid, onBlur = true, preventDefault = true }) {

    form.submit(function (e) {

        isFormValidation = formIsValid = true;

        form.find('.validate-me').each(function () {
            validateItem($(this));
        });

        formIsValid ? onValid() : onInValid();

        if (preventDefault) {
            e.preventDefault();
        }
    });

    if (onBlur) {
        isFormValidation = false;
        form.find('.validate-me').blur(function () {
            validateItem($(this));
        });
    }
}

function validateItem(field) {
    fieldIsValid = true;
    var rule = field.attr('data-rule');
    var messege = field.attr('data-msg');

    if (rule !== undefined) {
        var isValid = 1;
        var iError = false;
        var rules = rule.split('|');
        var ruleIndex = 0;
        if (messege !== undefined) {
            var messeges = messege.split('|');
            inValidMessege = messege[ruleIndex];
        }
        while (ruleIndex < rules.length) {
            var currentRule = rules[ruleIndex];
            inValidMessege = "";
            if (messege !== undefined) {
                inValidMessege = messeges[ruleIndex];
            }
            var pos = currentRule.indexOf(':', 0);
            if (pos >= 0) {
                var exp = currentRule.substr(pos + 1, currentRule.length);
                rule = currentRule.substr(0, pos);
                isValid = validate(field, rule, exp);

            } else {
                rule = currentRule.substr(pos + 1, currentRule.length);
                isValid = validate(field, rule, 0);
            }

            if (isValid == 0) {
                iError = true;
                fieldIsValid = formIsValid = false;
                break;
            }

            if (isValid == 1) {
                iError = false;
            }

            ruleIndex++;
        }

        if (isValid == 0) {
            field.addClass('is-invalid');
            field.removeClass('is-valid');
            field.siblings('.invalid-feedback').text(inValidMessege);

            if (isFormValidation) { field.focus(); }

        } if (isValid == 1) {
            field.addClass('is-valid');
            field.removeClass('is-invalid');
            field.siblings('.valid-feedback').text("Looks Good!");
        }
    }
}


function validate(field, rule, exp) {
    switch (rule) {
        case 'required':
            if (field.val() === '') {
                inValidMessege = inValidMessege == "" ? "Please fill in this field" : inValidMessege;
                return 0;
            }
            break;

        case 'min':
            if (field.val() === "") {
                return 2;
            }
            if (field.val().length < parseInt(exp)) {
                inValidMessege = inValidMessege == "" ? "Min length is " + exp : inValidMessege;
                return 0;
            }
            break;

        case 'max':
            if (field.val() === "") {
                return 2;
            }
            if (field.val().length > parseInt(exp)) {
                inValidMessege = inValidMessege == "" ? "Max length is " + exp : inValidMessege;
                return 0;
            }
            break;

        case 'email':
            if (field.val() === "") {
                return 2;
            }
            if (!EMAIL_EXP.test(field.val())) {
                inValidMessege = inValidMessege == "" ? "Invalid email" : inValidMessege;
                return 0;
            }
            break;

        case 'integer':
            if (field.val() === "") {
                return 2;
            }
            if (!INT_EXP.test(field.val())) {
                inValidMessege = inValidMessege == "" ? "Invalid Input" : inValidMessege;
                return 0;
            }
            break;

        case 'select':
            if (field.val() === '-1') {
                inValidMessege = inValidMessege == "" ? "Select Something" : inValidMessege;
                return 0;
            }
            break;

        case 'mimes':
            if (field.val() === "") {
                return 2;
            }
            var formats = exp.split(','),
                formatsIndex = 0,
                imageExt = field[0].files[0].type;

            while (formatsIndex < formats.length) {
                if (imageExt === "image/" + formats[formatsIndex]) {
                    return 1;
                }
                formatsIndex++;
            }
            inValidMessege = inValidMessege == "" ? "file format not supported" : inValidMessege;
            return 0;

        case 'maxsize':
            if (field.val() === "") {
                return 2;
            }
            var FileSize = field[0].files[0].size / 1024;
            if (FileSize > parseInt(exp)) {
                inValidMessege = inValidMessege == "" ? "Max file size is " + exp + "KB" : inValidMessege;
                return 0;
            }
            break;

    }

    return 1;

}
