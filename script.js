document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const chooseImge = document.getElementById("chooseImage");
  const setImage = document.getElementById("image");
  const filter = document.querySelectorAll(".Option");
  const Setname = document.querySelector(".set-name");
  const inputScale = document.querySelector(".input-scale");
  const scalevalue = document.querySelector(".scale-value");
  const rotateButton = document.querySelectorAll(".Option2");
  const reset = document.querySelector(".reset");
  const saveImage = document.querySelector(".save");

  //cropper
  let image = document.querySelector(".Original-image");
  const crop = document.querySelector(".crop");
  const result = document.querySelector(".cropped");
  const container = document.querySelector(".container");
  const save = document.querySelector(".crop-save");
  const ratio = document.getElementById("ratio");

  let originalImage = null;
  let Brightness = 100,
    Saturation = 100,
    Inversion = 0,
    GraySacle = 0;

  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  const loadImage = () => {
    const file = fileInput.files[0]; // store the selected image
    if (!file) {
      return; // if file not selected return
    }

    //new thing i learn
    setImage.src = URL.createObjectURL(file); //set Image to actual image holder
    //storing actual image to the variable'

    originalImage = setImage.src;
    setImage.addEventListener("load", () => {
      // when image set then disable class is remove
      document.querySelector(".main-container").classList.remove("disable");
    });
  };

  const updateScale = () => {
    scalevalue.innerText = `${inputScale.value}%`;
    const selectedFilter = document.querySelector(".Option.active");
    if (selectedFilter.id === "Brightness") {
      Brightness = inputScale.value;
    } else if (selectedFilter.id === "Saturation") {
      Saturation = inputScale.value;
    } else if (selectedFilter.id === "Inversion") {
      Inversion = inputScale.value;
    } else {
      GraySacle = inputScale.value;
    }
    applyFilter();
  };

  const applyFilter = () => {
    setImage.style.transform = `rotate(${rotate}deg) scale(${scaleX},${scaleY})`;

    setImage.style.filter = `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${GraySacle}%)`;
  };

  filter.forEach((option) => {
    option.addEventListener("click", () => {
      // when click on button active class is added and the button which already have active class is remove
      const selectedFilter = document.querySelector(".Option.active");

      selectedFilter.classList.remove("active");
      option.classList.add("active");
      Setname.innerText = option.innerText;

      if (option.id === "Brightness") {
        inputScale.value = Brightness;
        scalevalue.innerText = `${Brightness}%`;
      } else if (option.id === "Saturation") {
        inputScale.value = Saturation;
        scalevalue.innerText = `${Saturation}%`;
      } else if (option.id === "Inversion") {
        inputScale.value = Inversion;
        scalevalue.innerText = `${Inversion}%`;
      } else {
        inputScale.value = GraySacle;
        scalevalue.innerText = `${GraySacle}%`;
      }
    });
  });

  rotateButton.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id === "rotate-left") {
        rotate -= 45;
      } else if (button.id === "rotate-right") {
        rotate += 45;
      } else if (button.id === "flip-horizontal") {
        scaleX = scaleX === 1 ? -1 : 1;
      } else if (button.id == "flip-vertical") {
        scaleY = scaleY === 1 ? -1 : 1;
      }
      applyFilter();
    });
  });

  const resetImage = () => {
    Brightness = 100;
    Saturation = 100;
    Inversion = 0;
    GraySacle = 0;

    rotate = 0;
    scaleX = 1;
    scaleY = 1;

    filter[0].click(); // brightness selected by default

    if (originalImage != null) {
      setImage.src = originalImage;
    }
    applyFilter();
  };

  const saveImg = () => {
    const canvas = document.createElement("canvas"); //creating canvas element
    const ctx = canvas.getContext("2d"); //canvas.getcontext return a drawing context on the canvas
    canvas.width = setImage.naturalWidth; //setting actual image width to canvas element
    canvas.height = setImage.naturalHeight; //setting actual image height to canvas element

    //applying user selected filters to canvas filter
    ctx.filter = `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${GraySacle}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //translating canvas from center // here we shifted center fron (0,0) top left  to (canvas.width / 2, canvas.height / 2) means cetner
    if (rotate != 0) {
      //if rotate value isnt 0,rotate the canvas
      ctx.rotate((rotate * Math.PI) / 180);
    }

    ctx.scale(scaleX, scaleY); //flip canvas ,hrizontally /vertically
    ctx.drawImage(
      setImage,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    // why -ve =>In summary, the negative offsets ensure that the image is centered on the canvas after the coordinate system has been translated to the center. This makes rotation, scaling, and other transformations more intuitive and visually correct.

    const link = document.createElement("a"); //creating <a> tag
    link.download = "image.jpg"; // passing <a> tag download value to canvas data url
    link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
    link.click(); // clicking <a> tag so the image download
  };

  // input scale value transfer to the p tag means .scale-value class
  inputScale.addEventListener("change", updateScale);

  // when click on choose button then we build mechanism to the automatically click on choose file which is hidden
  chooseImge.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", loadImage); // when file input is taken either it is empty or some image then loadImage function call

  reset.addEventListener("click", resetImage); // reset button event listener
  saveImage.addEventListener("click", saveImg);

  //cropping functionality

  // Modal functionality
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".closeBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  openModalBtn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // };

  // Cropper functionality

  let cropper;

  const initCropper = (setRatio) => {
    image.src = setImage.src;

    cropper = new Cropper(image, {
      aspectRatio: setRatio,
      viewMode: 2,
    });
  };

  const destroyCropper = () => {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  };

  openModalBtn.addEventListener("click", () => {
    initCropper(NaN);
  });

  closeBtn.addEventListener("click", () => {
    destroyCropper();
  });

  closeModalBtn.addEventListener("click", () => {
    destroyCropper();
  });

  crop.addEventListener("click", () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: cropper.getData().width,
        height: cropper.getData().height,
      });
      const croppedImage = croppedCanvas.toDataURL("image/png");
      result.src = croppedImage;
      result.style.width = `${cropper.getData().width}px`;
      result.style.height = `${cropper.getData().height}px`;
      container.style.display = "flex";
    }
  });

  save.addEventListener("click", () => {
    console.log(result.src);
    if (result.src && result.src.startsWith("data:image/")) {
      setImage.src = result.src;
    }
    closeModalBtn.click();
  });

  ratio.addEventListener("change", (e) => {
    let setRatio = NaN;
    const ratioValue = e.target.value;
    console.log(ratioValue);
    console.log("inside ratio");
    if (ratioValue === "ratio1") {
      setRatio = NaN;
    } else if (ratioValue === "ratio2") {
      setRatio = 4 / 3;
    } else if (ratioValue === "ratio3") {
      setRatio = 1;
    } else if (ratioValue === "ratio4") {
      setRatio = 2 / 3;
    } else {
      setRatio = 16 / 9;
    }
    destroyCropper();
    initCropper(setRatio);
  });
});
