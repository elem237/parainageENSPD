// JavaScript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as rtdbRef, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvESz4IJllveIVhZ80X7tNGuueMr37y88",
    authDomain: "parainage-2023.firebaseapp.com",
    databaseURL: "https://parainage-2023-default-rtdb.firebaseio.com",
    projectId: "parainage-2023",
    storageBucket: "parainage-2023.appspot.com",
    messagingSenderId: "179554896992",
    appId: "1:179554896992:web:2f040ff39c80bd51380705"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

// Create the file metadata
const metadata = {
    contentType: 'image/jpeg'
};

// Assume you have references to the form elements
const userNameInput = document.getElementById('UserName');
const userMatInput = document.getElementById('UserMat');
const userLevelSelect = document.getElementById('UserLevel');
const userFiliereSelect = document.getElementById('UserFilier');
const UserMailSelect = document.getElementById('UserMail'); 
const loader = document.getElementById('loader'); // Assuming you have a loader element
let files = [];
const reader = new FileReader();

// Assume you have a reference to the file input element
const fileInput = document.getElementById('selectImg');

// Assume you have a reference to the form element
const uploadForm = document.getElementById('uploadForm');

// Event listener for the file input change event
fileInput.addEventListener('change', (e) => {
    // Get the selected file
    files = e.target.files;
    reader.readAsDataURL(files[0]);


    // You can optionally update the preview image here if needed
    reader.onload = function () {
        document.getElementById("myImg").src = reader.result;
        document.getElementById("previewImgBlock").classList.toggle("hidden");
    };
});

// Event listener for the form submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!files.length) {
        alert('Please select an image');
        return;
    }
    loader.classList.toggle("hidden");
    // Your existing Firebase code for uploading the file
    const storageRef = ref(storage, 'images/' + files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, files[0], metadata);

    // ... (remaining Firebase code for tracking progress, handling errors, and completion)
    uploadTask.on('state_changed',
        async (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        async (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        async () => {
            // Upload completed successfully, now we can get the download URL
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('File available at', downloadURL);

                // Use downloadURL along with other form data to submit to Realtime Database
                // Get reference to the Realtime Database
                const usersInDb = rtdbRef(database, "users");
               console.log(userFiliereSelect.value)
               console.log("valuer de la filiers")

               console.log(userLevelSelect.value)
               console.log("valuer du niv")


                // Add data to the Realtime Database
                push(usersInDb, {
                    userName: userNameInput.value,
                    userMat: userMatInput.value,
                    userLevel: userLevelSelect.value,
                    userFiliere: userFiliereSelect.value,
                    userEmail: UserMailSelect.value,
                    userImgURL: downloadURL,
                }).then(() => {
                    // Do something after successful submission
                    window.location.href = './succes.html';
                    console.log('Data submitted to Realtime Database successfully');
                }).catch((error) => {
                    console.error('Error submitting data to Realtime Database:', error);
                });

                // Reset the form after successful upload
                uploadForm.reset();
                document.getElementById("previewImgBlock").classList.toggle("hidden");
                loader.classList.toggle("hidden");
                
                document.getElementById('fileInput').textContent = 'Confirmer';
            } catch (error) {
                console.error('Error getting download URL:', error);
            }
        }
    );
});
