// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};
// Get the navbar
const navbar = document.getElementById("navbar");
// Get the offset position of the navbar
const sticky = navbar.offsetTop;
// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

//---------------------

let slidePosition = 0;
const slides = document.getElementsByClassName('card');
const totalSlides = slides.length;

document.
    getElementById('button-next')
    .addEventListener("click", function() {
        moveToNextSlide();
    });
document.
    getElementById('button-prev')
    .addEventListener("click", function() {
        moveToPrevSlide();
    });

    function updateSlidePosition() {
        for (let slide of slides) {
            slide.classList.remove('card--visible');
            slide.classList.add('card--hidden');
        }
        slides[slidePosition].classList.add('card--visible')
    }

    function moveToNextSlide() {
        if (slidePosition === totalSlides - 1) {
            slidePosition = 0;
        } else {
            slidePosition++;
        }
        updateSlidePosition();
    }

    function moveToPrevSlide() {
        if (slidePosition === 0) {
            slidePosition = totalSlides - 1;
        } else {
            slidePosition--;
        }
        updateSlidePosition();
    };


    // ------------------------------
    


    
    // ---------------------------------
   
class Carousel {
    /**
     * This callback type is called `requestCallback` and is displayed as a global symbol.
     *
     * @callback moveCallback
     * @param {number} index
     */
  
    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
     * @param {boolean} [options.loop=false] Doit-t-on boucler en fin de carousel
     * @param {boolean} [options.pagination=false]
     * @param {boolean} [options.navigation=true]
     */
    constructor (element, options = {}) {
      this.element = element
      this.options = Object.assign({}, {
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
        pagination: false,
        navigation: true
      }, options)
      let children = [].slice.call(element.children)
      this.isMobile = false
      this.currentItem = 0
      this.moveCallbacks = []
  
      // Modification du DOM
      this.root = this.createDivWithClass('carousel')
      this.container = this.createDivWithClass('carousel__container')
      this.root.setAttribute('tabindex', '0')
      this.root.appendChild(this.container)
      this.element.appendChild(this.root)
      this.items = children.map((child) => {
        let item = this.createDivWithClass('carousel__item')
        item.appendChild(child)
        this.container.appendChild(item)
        return item
      })
      this.setStyle()
      if (this.options.navigation) {
        this.createNavigation()
      }
      if (this.options.pagination) {
        this.createPagination()
      }
  
      // Evenements
      this.moveCallbacks.forEach(cb => cb(0))
      this.onWindowResize()
      window.addEventListener('resize', this.onWindowResize.bind(this))
      this.root.addEventListener('keyup', e => {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
          this.next()
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
          this.prev()
        }
      })
    }
  
    /**
     * Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle () {
      let ratio = this.items.length / this.slidesVisible
      this.container.style.width = (ratio * 100) + "%"
      this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }
  
    /**
     * Crée les flêches de navigation dans le DOM
     */
    createNavigation () {
      let nextButton = this.createDivWithClass('carousel__next')
      let prevButton = this.createDivWithClass('carousel__prev')
      this.root.appendChild(nextButton)
      this.root.appendChild(prevButton)
      nextButton.addEventListener('click', this.next.bind(this))
      prevButton.addEventListener('click', this.prev.bind(this))
      if (this.options.loop === true) {
        return
      }
      this.onMove(index => {
        if (index === 0) {
          prevButton.classList.add('carousel__prev--hidden')
        } else {
          prevButton.classList.remove('carousel__prev--hidden')
        }
        if (this.items[this.currentItem + this.slidesVisible] === undefined) {
          nextButton.classList.add('carousel__next--hidden')
        } else {
          nextButton.classList.remove('carousel__next--hidden')
        }
      })
    }
  
    /**
     * Crée la pagination dans le DOM
     */
    createPagination () {
      let pagination = this.createDivWithClass('carousel__pagination')
      let buttons = []
      this.root.appendChild(pagination)
      for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
        let button = this.createDivWithClass('carousel__pagination__button')
        button.addEventListener('click', () => this.gotoItem(i))
        pagination.appendChild(button)
        buttons.push(button)
      }
      this.onMove(index => {
        let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
        if (activeButton) {
          buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
          activeButton.classList.add('carousel__pagination__button--active')
        }
      })
    }
  
    /**
     *
     */
    next () {
      this.gotoItem(this.currentItem + this.slidesToScroll)
    }
  
    prev () {
      this.gotoItem(this.currentItem - this.slidesToScroll)
    }
  
    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index
     */
    gotoItem (index) {
      if (index < 0) {
        if (this.options.loop) {
          index = this.items.length - this.slidesVisible
        } else {
          return
        }
      } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
        if (this.options.loop) {
          index = 0
        } else {
          return
        }
      }
      let translateX = index * -100 / this.items.length
      this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
      this.currentItem = index
      this.moveCallbacks.forEach(cb => cb(index))
    }
  
    /**
     * Rajoute un écouteur qui écoute le déplacement du carousel
     * @param {moveCallback} cb
     */
    onMove (cb) {
      this.moveCallbacks.push(cb)
    }
  
    /**
     * Ecouteur pour le redimensionnement de la fenêtre
     */
    onWindowResize () {
      let mobile = window.innerWidth < 800
      if (mobile !== this.isMobile) {
        this.isMobile = mobile
        this.setStyle()
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
      }
    }
  
    /**
     * Helper pour créer une div avec une classe
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
      let div = document.createElement('div')
      div.setAttribute('class', className)
      return div
    }
  
    /**
     * @returns {number}
     */
    get slidesToScroll () {
      return this.isMobile ? 1 : this.options.slidesToScroll
    }
  
    /**
     * @returns {number}
     */
    get slidesVisible () {
      return this.isMobile ? 1 : this.options.slidesVisible
    }
  
  }
  
  let onReady = function () {
  
    new Carousel(document.querySelector('#carousel1'), {
        slidesVisible: 3,
        slidesToScroll: 3,
        loop: true
    })
  
  
  }
  
  if (document.readyState !== 'loading') {
    onReady()
  }
  document.addEventListener('DOMContentLoaded', onReady);

//-----------------------------------

  // let gandalf = document.getElementById("audio1");
  //   let audio = new Audio('./sons/Gandalf.mov');
    
  //   gandalf.addEventListener("click", () => {
  //       audio.play();
  //   });


  const audios = {
    "audio1": "./sons/Gandalf.mov",
    "audio2": "./sons/Frodon.mov",
    "audio3": "./sons/Sam.mov",
    "audio4": "./sons/Aragorn.mov",
    "audio5": "./sons/Legolas.mov",
    "audio6": "./sons/Gimli.mov",
    "audio7": "./sons/Merry.mov",
    "audio8": "./sons/Pippin.mov",
    "audio9": "./sons/Boromir.mov",
 }
 for(let index in audios){
    const myElem = document.getElementById(index);
    myElem.addEventListener("click",()=>{
       let audio = new Audio(audios[index])
       audio.play();
    })
 }

  //----------------------------------------------------

  const divModalContents = {
    "comte":{
      "title" : "LA COMTÉ",
      "description": "La Comté est la patrie des Hobbits. Elle est située dans le nord-ouest de la Terre du Milieu. Durant le Troisième Âge, elle est l'une des rares zones fortement peuplées d'Eriador. Contrairement à la croyance populaire, la Comté n'est pas le berceau d'enfance de Frodon Sacquet.",
      "image" : "./img/mapconté.png"
    }
    ,
    "rivendell" : {
      "title": "RIVENDELL",
      "description": "Fondcombe, aussi connue sous le nom d'Imladris (ou Rivendell en anglais), est une vallée des Monts Brumeux où réside un groupe d'Elfes sous l'autorité d'Elrond. Située en Terre du Milieu, cette grande cité elfique est décrit comme  en référence à Valinor, qui était à l'ouest de la Grande Mer à Aman.",
      "image": "./img/maprivendell.png"
    },
    "moria":{
      "title" : "LES MINES DE LA MORIA",
      "description" : "Khazad-Dûm (khu. Demeure des Nains), et plus tard Moria, est la plus grande des cités du peuple Nain. Elle fut la plus prospère, et est la seule à produire du mithril en grande quantité.",
      "image" : "./img/mapmoria.png"
    }
    ,
    "helm" : {
      "title": "GOUFFRE DE HELM",
      "description": "En l'an 3019 T.A. , au début de la Guerre de l'anneau, suite aux batailles des Gués de Lisen, le roi Théoden de Rohan conduisit une armée de renfort mais fit retraite vers le Gouffre de Helm pour se réfugier de l'attaque imminente de l'armée de Saroumane. C'est là qu'eut lieu la Bataille de Fort-le-Cor, qui se termina par la victoire de Rohan grâce à l'arrivée de renforts menés par Erkenbrand et Gandalf, et aussi l’aide des Ents et des Huorns.",
      "image": "./img/maphelm.png"
    },
    "orthanc":{
      "title" : "ORTHANC",
      "description" : "L'Isengard est un territoire situé au sud de l'Eriador et contenant la tour d'Orthanc.Après avoir été perverti par Sauron saroumane fit fortifié orthanc et constitua une armée d'Orques d'Huruk-hai et de wargs de près de 10000 hommes",
      "image" : "./img/maporthanc.png"
    }
    ,
    "mordor" : {
      "title": "MORDOR",
      "description": "Le Mordor était une région entouré de hautes montagnes infranchissables (l'Ephel Dúath et l'Ered Lithui) de tous côtés sauf à l'Est qui donnait sur le Rhûn et le Khand.C'est la que Sauron à forgé l'Anneau unique et ou il sera également détruit.La communauté passa  par plusieurs endroits emblématique du Mordor comme le plateau de Gorgoroth ou frodon et sam passerent pour aller détruire l'anneau à la montagne du destin.",
      "image": "./img/mapmoria.png"
    }
    }
  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach(trigger =>{
    trigger.addEventListener("click", (e)=>{
      let targetId = e.currentTarget.id
      console.log(targetId)
      document.getElementById("modalTitle").innerHTML = divModalContents[targetId].title
      document.getElementById("modalDescription").innerHTML = divModalContents[targetId].description
      document.getElementById("modalImage").innerHTML = divModalContents[targetId].image
      modalContainer.classList.toggle("active");
    })
  })
  const modalTrigers = document.querySelectorAll(".modal-trigger2");
  modalTrigers.forEach(trigger =>
    trigger.addEventListener("click", toggleModal));
  function toggleModal(){
    modalContainer.classList.toggle("active")}
 
 //----------------------------------------------------
 
 let gollum = document.getElementById("smeagol");
    let audio = new Audio('./sons/audio10.mov');
   
    gollum.addEventListener("click", () => {
        audio.play();
      });
//-------------------------------------------------------
 
 
