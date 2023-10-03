
//FUNGSI Mengambil data gallery
function getFilesData() {
    //buat object ajax dan url data
    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:5000/api/files"; //ganti nama file sesuai nama file json kalian

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //parse response dengan JSON
            let responses = JSON.parse(this.response);
            console.log(responses)
            //looping array data kemudian append kedalam element HTML
            responses["data"].forEach(function (res, index) {
                console.log(res.created_at)
                let createdAt = new Date(res.created_at)
                const formatedDate = createdAt.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false
                });
                //siapkan element untuk menapung data gallery
                let tbody = document.getElementById("tbody")
                let trEl = document.createElement("tr");
                let thEl = document.createElement("th")
                let tdEl_1 = document.createElement("td")
                let tdEl_2 = document.createElement("td")
                let tdEl_3 = document.createElement("td")
                let actionDelete = document.createElement("a")
                let actionDownload = document.createElement("a")
                actionDelete.setAttribute("data-bs-toggle", "modal");
                actionDelete.setAttribute("data-bs-target", "#modalDelete");
                actionDelete.setAttribute("data-id", res._id);
                actionDelete.setAttribute("id", 'delete')
                actionDelete.setAttribute("href", "#")
                actionDelete.setAttribute("class", "badge bg-danger")
                actionDelete.innerHTML = 'Delete'
                actionDownload.setAttribute("id", "download")
                actionDownload.setAttribute("class", "badge bg-success")
                actionDownload.innerHTML = "Download"
                actionDownload.setAttribute(
                     "href", res.file_path
                   );
                  actionDownload.setAttribute(
                     "download", res.file_path
                   );
                thEl.innerHTML = index + 1
                tdEl_1.innerHTML = res.file_name
                tdEl_2.innerHTML = formatedDate              
                //append element yang telah dibuat pada masing-masing parent
                tdEl_3.append(actionDelete, actionDownload)
                trEl.append(thEl, tdEl_1, tdEl_2, tdEl_3)
                tbody.append(trEl)
            });
        };
    }
    xhr.send();
}


//CEK STATUS LOGIN USER
window.onload = function () {
    // cek apakah user telah login
    if (localStorage.getItem("access_token") == null) {
        //redirect user
        window.location.href = "/login"; //
    }
    //panggil fungsi untuk mengambil data profile dan gallery
    getFilesData()
}



//FUNGSI Menguplod File
//seleksi form tambah
const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", function (event) {
    event.preventDefault()

    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:5000/api/files";
    //seleksi nilai dari input file dan caption
    let formData = new FormData();
    let file = document.getElementById("file-part");
    formData.append("file", file.files[0]);

    // //konfigurasi toast
    const toastLiveExample = document.getElementById("liveToastAdd");
    const toastBodyAdd = document.getElementById("toast-body-add")
    const toast = new bootstrap.Toast(toastLiveExample);

    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //close the modal after adding data
            const myModalAdd = bootstrap.Modal.getInstance("#modalAdd");
            myModalAdd.hide();
            //reset form
            addForm.reset();
            //refresh page
            location.reload();
        }
    };
    xhr.send(formData);
});


//fungsi DELETE
// seleksi elemen modal delete
const myModalDelete = document.getElementById("modalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
    //mendeteksi elemen yang diklik user
    let dataId = event.relatedTarget.attributes["data-id"];
    const deleteForm = document.getElementById("delete-form")
    //ketika tombol delte diklik jalankan fungsi hapus
    deleteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let xhr = new XMLHttpRequest()
        let url = "http://127.0.0.1:5000/api/files/" + dataId.value

        xhr.open("DELETE", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.response)

                const myModalDelete = bootstrap.Modal.getInstance("#modalDelete");
                myModalDelete.hide();

                const alertLoc = document.getElementById("alert-loc")
                const alertEl = document.createElement("div")
                alertEl.setAttribute("class", "alert alert-success")
                alertEl.setAttribute("role", "alert")
                alertEl.innerHTML = response.message

                alertLoc.append(alertEl)

                location.reload()
            }
        };
        xhr.send();
    })
});
