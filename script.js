const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY ="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";
let isImageGenerating = false;
const updateImageCard = (imageDataArray) => {
    imageDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadbtn = imgCard.querySelector("download-btn");


        const aiGeneratedImg =`data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = ()  =>{
          imgCard.classList.remove("loading");
          downloadbtn.setAttribute("href",aiGeneratedImg);
          downloadbtn.setAttribute("download" ,`${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try{
       const response = await fetch("https://api.openai.com/v1/images/generations" ,{
            method: "POST" ,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`

            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format:"b64_json"
            })
        });

        if(!response.ok) throw new Error("SORRY I FAILED TO GENERATE IMAGE! DONT MIND TO USE ME AGAIN.")

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error){
        alert(error.message);
    } finally{
        isImageGenerating = false;
    }
}
const  handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
    `<div class="img-card loading">
      <img src="images/loader.svg" alt="image">
      <a class="download-btn" href="#">
        <img src="images/download.svg" alt="download icon">
      </a>
    </div>`
    ).join("");

   imageGallery.innerHTML =imgCardMarkup;
   generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);
