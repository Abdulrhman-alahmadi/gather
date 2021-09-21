let imgInput = document.querySelector('.imgUrl');

let checkbox = document.querySelector('#insertCurrentUrl');

checkbox.addEventListener('click', changeUrl);

function changeUrl() {
    if (imgInput.value == imgInput.placeholder) {
        imgInput.value = null
    } else {
        imgInput.value = imgInput.placeholder;
    }

}

